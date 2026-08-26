from ultralytics import YOLO

model = YOLO("backend/app/models/disease_model/tomato_disease.pt")

image_path = "/Users/kausalya/Downloads/Tom/tomato1.jpg"

results = model.predict(
    source=image_path,
    imgsz=224
)

result = results[0]

top1_index = result.probs.top1
confidence = result.probs.top1conf.item()
class_name = result.names[top1_index]

print("Predicted class:", class_name)
print("Confidence:", round(confidence, 4))