import sys
import cv2
import mediapipe as mp

def count_pushups(video_path):
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()
    cap = cv2.VideoCapture(video_path)

    pushup_count = 0
    down = False

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)
        if results.pose_landmarks:
            left_shoulder = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
            left_elbow = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW]
            elbow_y = left_elbow.y
            shoulder_y = left_shoulder.y
            if elbow_y > shoulder_y and not down:
                down = True
            if elbow_y < shoulder_y and down:
                pushup_count += 1
                down = False
    cap.release()
    return pushup_count

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("0")
        sys.exit(1)

    video_url = sys.argv[1]
    try:
        count = count_pushups(video_url)
        print(count)
    except:
        print("0")
        sys.exit(1)
