from ultralytics import YOLO

# Load pretrained YOLO classification model
model = YOLO("yolo11n-cls.pt")

# Train on Tomato disease dataset
results = model.train(
    data="datasets/crop_disease/tomato",
    epochs=5,
    imgsz=224,
    batch=16,
    project="runs",
    name="tomato_disease"
)

print("Tomato disease model training completed!")