import cv2
import mediapipe as mp
import time
import urllib.request
from pathlib import Path
import winsound


# ============================================================
# GhostTest AI - Driver Monitoring + Alert Sound
# ============================================================

MODEL_URL = (
    "https://storage.googleapis.com/"
    "mediapipe-models/face_landmarker/"
    "face_landmarker/float16/latest/face_landmarker.task"
)

MODEL_DIR = Path.home() / ".ghosttest_models"
MODEL_PATH = MODEL_DIR / "face_landmarker.task"


# ============================================================
# Download MediaPipe model
# ============================================================

def download_model():

    if MODEL_PATH.exists():
        return

    print("First-time setup: downloading MediaPipe face model...")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    try:
        urllib.request.urlretrieve(
            MODEL_URL,
            MODEL_PATH
        )

        print("Face model downloaded successfully.")

    except Exception as error:
        print("ERROR: Could not download MediaPipe model.")
        print(error)
        raise SystemExit


download_model()


# ============================================================
# MediaPipe Face Landmarker
# ============================================================

BaseOptions = mp.tasks.BaseOptions
FaceLandmarker = mp.tasks.vision.FaceLandmarker
FaceLandmarkerOptions = mp.tasks.vision.FaceLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode


options = FaceLandmarkerOptions(
    base_options=BaseOptions(
        model_asset_path=str(MODEL_PATH)
    ),
    running_mode=VisionRunningMode.VIDEO,
    num_faces=1
)

landmarker = FaceLandmarker.create_from_options(options)


# ============================================================
# Eye landmarks
# ============================================================

LEFT_EYE = [362, 385, 387, 263, 373, 380]
RIGHT_EYE = [33, 160, 158, 133, 153, 144]


# ============================================================
# Eye Aspect Ratio
# ============================================================

def distance(point_a, point_b):

    return (
        (point_a.x - point_b.x) ** 2
        + (point_a.y - point_b.y) ** 2
    ) ** 0.5


def eye_aspect_ratio(landmarks, eye_points):

    p1 = landmarks[eye_points[0]]
    p2 = landmarks[eye_points[1]]
    p3 = landmarks[eye_points[2]]
    p4 = landmarks[eye_points[3]]
    p5 = landmarks[eye_points[4]]
    p6 = landmarks[eye_points[5]]

    vertical_1 = distance(p2, p6)
    vertical_2 = distance(p3, p5)
    horizontal = distance(p1, p4)

    if horizontal == 0:
        return 0

    return (vertical_1 + vertical_2) / (2 * horizontal)


# ============================================================
# Alert sound functions
# ============================================================

def drowsy_alert():
    """
    Short warning beep.
    """

    winsound.Beep(1000, 400)


def microsleep_alert():
    """
    Stronger emergency-style repeating alarm.
    """

    winsound.Beep(1500, 500)
    time.sleep(0.15)
    winsound.Beep(1500, 500)


# ============================================================
# Camera
# ============================================================

cap = cv2.VideoCapture(0)

if not cap.isOpened():

    print("ERROR: Could not open webcam.")
    raise SystemExit


# ============================================================
# Drowsiness configuration
# ============================================================

EAR_THRESHOLD = 0.21

DROWSY_TIME = 1.5
MICROSLEEP_TIME = 3.0

eyes_closed_start = None

frame_timestamp = 0

previous_state = "NO FACE"

last_drowsy_alert = 0
last_microsleep_alert = 0

DROWSY_ALERT_COOLDOWN = 3
MICROSLEEP_ALERT_COOLDOWN = 2


print()
print("==============================================")
print(" GhostTest AI - Driver Monitoring")
print("==============================================")
print("Camera started.")
print("Alert sound enabled.")
print("Press Q to quit.")
print()


# ============================================================
# Main loop
# ============================================================

try:

    while True:

        success, frame = cap.read()

        if not success:

            print("ERROR: Could not read webcam frame.")
            break


        frame_height, frame_width = frame.shape[:2]

        # Mirror camera
        frame = cv2.flip(frame, 1)

        # BGR -> RGB
        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        # MediaPipe image
        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb_frame
        )

        # Increasing timestamp
        frame_timestamp += 33

        # Detect face
        result = landmarker.detect_for_video(
            mp_image,
            frame_timestamp
        )

        driver_state = "NO FACE"

        ear_value = 0.0
        closure_time = 0.0


        # ====================================================
        # Face detected
        # ====================================================

        if result.face_landmarks:

            landmarks = result.face_landmarks[0]

            # Calculate eye ratios
            left_ear = eye_aspect_ratio(
                landmarks,
                LEFT_EYE
            )

            right_ear = eye_aspect_ratio(
                landmarks,
                RIGHT_EYE
            )

            ear_value = (
                left_ear + right_ear
            ) / 2.0


            # =================================================
            # Determine driver state
            # =================================================

            if ear_value < EAR_THRESHOLD:

                if eyes_closed_start is None:

                    eyes_closed_start = time.time()

                closure_time = (
                    time.time()
                    - eyes_closed_start
                )

                if closure_time >= MICROSLEEP_TIME:

                    driver_state = "MICROSLEEP"

                elif closure_time >= DROWSY_TIME:

                    driver_state = "DROWSY"

                else:

                    driver_state = "EYES CLOSING"

            else:

                eyes_closed_start = None
                driver_state = "ALERT"


            # =================================================
            # Face bounding box
            # =================================================

            x_values = [
                int(point.x * frame_width)
                for point in landmarks
            ]

            y_values = [
                int(point.y * frame_height)
                for point in landmarks
            ]

            x_min = max(0, min(x_values))
            x_max = min(frame_width, max(x_values))

            y_min = max(0, min(y_values))
            y_max = min(frame_height, max(y_values))

            cv2.rectangle(
                frame,
                (x_min, y_min),
                (x_max, y_max),
                (255, 255, 255),
                2
            )

        else:

            eyes_closed_start = None


        # ====================================================
        # ALERT SOUND
        # ====================================================

        current_time = time.time()


        # Drowsy warning
        if driver_state == "DROWSY":

            if current_time - last_drowsy_alert >= DROWSY_ALERT_COOLDOWN:

                drowsy_alert()
                last_drowsy_alert = current_time


        # Strong microsleep warning
        elif driver_state == "MICROSLEEP":

            if current_time - last_microsleep_alert >= MICROSLEEP_ALERT_COOLDOWN:

                microsleep_alert()
                last_microsleep_alert = current_time


        # Reset timers when driver becomes alert
        if driver_state == "ALERT":

            last_drowsy_alert = 0
            last_microsleep_alert = 0


        # ====================================================
        # Display color
        # ====================================================

        if driver_state == "ALERT":

            state_color = (0, 255, 0)

        elif driver_state == "EYES CLOSING":

            state_color = (0, 255, 255)

        elif driver_state == "DROWSY":

            state_color = (0, 165, 255)

        elif driver_state == "MICROSLEEP":

            state_color = (0, 0, 255)

        else:

            state_color = (180, 180, 180)


        # ====================================================
        # Display information
        # ====================================================

        cv2.putText(
            frame,
            f"Driver State: {driver_state}",
            (30, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            state_color,
            2
        )

        cv2.putText(
            frame,
            f"EAR: {ear_value:.3f}",
            (30, 90),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )

        cv2.putText(
            frame,
            f"Eye Closure: {closure_time:.1f}s",
            (30, 125),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )

        cv2.putText(
            frame,
            "ALERT SOUND: ON",
            (30, 160),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2
        )

        cv2.putText(
            frame,
            "GhostTest AI - Driver Monitoring",
            (30, frame_height - 30),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2
        )


        # ====================================================
        # Show webcam
        # ====================================================

        cv2.imshow(
            "GhostTest AI - Driver Monitoring",
            frame
        )


        # ====================================================
        # Quit
        # ====================================================

        if cv2.waitKey(1) & 0xFF == ord("q"):

            break


finally:

    cap.release()

    cv2.destroyAllWindows()

    landmarker.close()


print()
print("Driver Monitoring stopped.")