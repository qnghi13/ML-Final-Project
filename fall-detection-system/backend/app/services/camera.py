import cv2

class VideoCamera:
    def __init__(self, source=0):
        # source=0 là webcam laptop, hoặc đường dẫn RTSP
        self.video = cv2.VideoCapture(source)
        # Set độ phân giải cho nhẹ
        self.video.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.video.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    def __del__(self):
        if self.video.isOpened():
            self.video.release()

    def get_frame(self):
        if self.video.isOpened():
            success, frame = self.video.read()
            if success:
                return frame
        return None
