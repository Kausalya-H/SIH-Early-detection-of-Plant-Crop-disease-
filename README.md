# 🌱 AI-Powered Early Detection of Plant Crop Diseases

An AI-powered agricultural platform for **early detection of crop diseases and pests** using computer vision and intelligent data-driven analysis. The system enables farmers to upload crop images, identify potential diseases, and receive actionable information through an integrated frontend and backend platform.

---

## 📌 Project Overview

Agriculture plays a critical role in food security and the economy, but crop diseases and pest infestations can significantly reduce yield and farmer income.

Traditional disease identification often depends on manual inspection or agricultural experts, which may be time-consuming and difficult to access, especially in rural areas.

Our project addresses this challenge by developing an **AI-assisted crop disease detection platform** that can analyze crop images and provide early disease identification.

The platform combines:

- 🤖 Artificial Intelligence
- 🖼️ Computer Vision
- 🌾 Crop Disease Detection
- 🌦️ Weather Intelligence
- 🗺️ Geospatial Insights
- 🗣️ NLP and Multilingual Support
- 📊 Predictive Analytics
- 🔔 Early Warning and Advisory Systems
- 📴 Offline AI inference using TensorFlow

The current implementation focuses on **AI-based image analysis and tomato disease detection**, with the architecture designed to support additional crops and intelligent agricultural services.

---

## 🎯 Problem Statement

Crop diseases and pest attacks are major factors affecting agricultural productivity.

Farmers may face difficulties such as:

- Lack of immediate access to agricultural experts
- Difficulty identifying diseases from visual symptoms
- Delayed disease detection
- Inappropriate treatment decisions
- Lack of localized agricultural information
- Limited access to technology-based advisory services

### Our Objective

To develop an intelligent platform that can:

> **Detect crop diseases at an early stage from images and provide farmers with timely, understandable, and actionable information.**

---

## 💡 Proposed Solution

The proposed system provides a simple workflow for farmers.

```text
                    FARMER
                       │
                       ▼
              Upload Crop Image
                       │
                       ▼
              Frontend Application
                       │
                       ▼
                 Backend API
                       │
                       ▼
             AI Disease Detection
                       │
                       ▼
                Model Prediction
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Disease Name       Confidence Score
              │                 │
              └────────┬────────┘
                       ▼
              Result to Farmer
                       │
                       ▼
              Advisory / Action
```

The architecture is modular, allowing future integration of weather data, geospatial analysis, multilingual NLP services, notifications, and predictive analytics.

---

## ✨ Key Features

### 🔬 AI-Based Disease Detection

The system analyzes uploaded crop images using trained deep-learning models to identify possible crop diseases.

### 🍅 Tomato Disease Detection

The current implementation includes a tomato crop disease detection pipeline.

### 📴 Offline Disease Detection

The platform is designed to support **offline disease detection**, allowing disease prediction without requiring a continuous internet connection. For offline inference, a locally available trained model can process the uploaded crop image directly on the device.

The offline inference component uses **TensorFlow** to run the trained model locally, reducing dependency on network connectivity and improving accessibility for farmers in areas with limited or unreliable internet access.

### 📊 Confidence-Based Prediction

The disease detection service provides the predicted class along with the model's confidence score.

### 🖼️ Image Upload

Users can upload crop images through the frontend for analysis.

### ⚡ Backend API

A Python-based backend handles image processing, model inference, and communication between the frontend and AI model.

### 🖥️ User-Friendly Frontend

The frontend provides an interface through which users can interact with the disease detection system.

### 🗣️ NLP & Multilingual Support

The project includes an NLP component intended to support language-aware agricultural communication and future multilingual advisories.

### 🌦️ Weather Intelligence

Weather information can be incorporated to identify environmental conditions that may increase disease risk.

### 🗺️ Geospatial Insights

Location-based information can be used for regional disease monitoring and outbreak analysis.

### 🔔 Early Alerts

The platform is designed to support timely notifications and disease-risk alerts.

### 📈 Predictive Analytics

Future versions can use historical disease, weather, and geographical information for predictive crop-risk analysis.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      Farmer      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Frontend      │
                         │   Application    │
                         └────────┬─────────┘
                                  │
                              REST API
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Backend      │
                         │       API        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Disease Detection│
                         │     Service      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   YOLO Model     │
                         │    Inference     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Disease Result   │
                         │ + Confidence     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Frontend Result  │
                         └──────────────────┘
```

---

## 🧠 AI/ML Component

The disease detection module uses **YOLO-based deep-learning models** for image classification/detection.

The repository contains model files including:

```text
yolo11n-cls.pt
yolo11n.pt
```

The backend disease detection service loads the trained model and performs inference on an uploaded image.

### Prediction Pipeline

#### Online Mode

```text
Crop Image
    │
    ▼
Frontend
    │
    ▼
Backend API
    │
    ▼
YOLO Model
    │
    ▼
Disease Prediction
    │
    ▼
Result + Confidence
```

#### Offline Mode

```text
Crop Image
    │
    ▼
Local Application
    │
    ▼
TensorFlow Model
    │
    ▼
Local Inference
    │
    ▼
Disease Prediction
    │
    ▼
Result + Confidence
```

The offline workflow enables disease detection even when internet connectivity is unavailable or unreliable.

### Prediction Pipeline

```text
Crop Image
    │
    ▼
Image Input
    │
    ▼
Preprocessing
    │
    ▼
YOLO Model
    │
    ▼
Model Inference
    │
    ▼
Predicted Disease
    │
    ▼
Confidence Score
    │
    ▼
Backend Response
    │
    ▼
Frontend Display
```

The model architecture can be extended to support additional crops and disease classes as more training data becomes available.

---

## 🧩 NLP Component

The project includes an NLP component to support farmer-friendly communication.

The NLP module is intended to help with:

- Multilingual agricultural advisories
- Simplification of technical disease information
- Language-aware recommendations
- Future voice/text-based farmer assistance

This component can be integrated with disease detection results to provide information in languages accessible to target users.

---

## 🖥️ Frontend

The frontend provides the user-facing interface of the application.

### Main Responsibilities

- User interaction
- Crop image upload
- Communication with backend APIs
- Displaying disease predictions
- Displaying confidence information
- Presenting recommendations and advisories
- Providing a simple farmer-oriented experience

### Frontend Flow

```text
Open Application
       ↓
Select / Upload Crop Image
       ↓
Submit for Analysis
       ↓
Backend API Request
       ↓
Receive Prediction
       ↓
Display Disease Result
```

---

## ⚙️ Backend

The backend acts as the central processing layer between the frontend and AI model.

### Main Responsibilities

- API request handling
- Image input processing
- Disease model integration
- AI inference
- Prediction response generation
- Frontend–ML communication
- Future integration with external agricultural services

The disease detection implementation is located within the backend service layer:

```text
backend/
└── app/
    └── services/
        └── disease_model.py
```

---

## 🔗 Frontend–Backend Integration

The frontend and backend were developed as separate modules by different team members and later integrated into a single project repository.

```text
                 FRONTEND
                     │
                     │ Image Upload
                     ▼
              BACKEND REST API
                     │
                     │ Image Processing
                     ▼
             DISEASE MODEL SERVICE
                     │
                     │ Inference
                     ▼
                 YOLO MODEL
                     │
                     │ Prediction
                     ▼
              BACKEND RESPONSE
                     │
                     ▼
                 FRONTEND
                     │
                     ▼
            Disease + Confidence
```

This integration allows the individually developed modules to function together as one complete application.

---

## 📁 Project Structure

```text
SIH-Early-detection-of-Plant-Crop-disease-/
│
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   └── disease_model.py
│   │   └── ...
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── ...
│   └── package.json
│
├── training/
│   └── ...
│
├── test_tomato_model.py
│
├── yolo11n-cls.pt
├── yolo11n.pt
│
├── .gitignore
└── README.md
```

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML, CSS |
| Backend | Python, FastAPI |
| AI/ML | YOLO, TensorFlow, Deep Learning, Computer Vision |
| NLP | Natural Language Processing |
| Model | YOLO-based classification/detection + TensorFlow offline inference |
| API | REST API |
| Version Control | Git, GitHub |
| Development | Visual Studio Code |

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

- Python 3.x
- Node.js and npm
- Git
- A suitable Python virtual environment
- Required ML dependencies

### 1. Clone the Repository

```bash
git clone https://github.com/Kausalya-H/SIH-Early-detection-of-Plant-Crop-disease-.git
cd SIH-Early-detection-of-Plant-Crop-disease-
```

---

## 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI backend using the project's configured application entry point.

For example:

```bash
uvicorn app.main:app --reload
```

> The exact startup command should be adjusted if the project's FastAPI entry point has a different module or filename.

---

## ⚛️ Frontend Setup

Open a new terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

---

## 🧪 Testing

The repository contains a tomato model testing script:

```text
test_tomato_model.py
```

This can be used to test the tomato disease detection model and verify prediction behavior.

Testing should be performed on representative crop images to evaluate:

- Prediction correctness
- Confidence scores
- Model response
- API behavior
- Frontend result display

---

## 🎥 Project Demonstration

### Disease Detection Demo

The project demonstration is recorded in:

```text
Disease.mov
```

The demonstration showcases the disease detection workflow from image submission to prediction.

### Demonstration Flow

```text
Launch Application
       ↓
Upload Crop Image
       ↓
Send Image to Backend
       ↓
Process Image Using AI Model
       ↓
Generate Disease Prediction
       ↓
Display Result
```

### Adding the Video to GitHub

Place the recording in the repository, for example:

```text
demo/
└── Disease.mov
```

For the best GitHub presentation, upload the video through a GitHub Issue/Release or use a hosted demo video and add the resulting link here.

> **Demo Video:** Add the GitHub-hosted or external video link here after uploading `Disease.mov`.

---

## 👥 Team Contributions

The project was developed collaboratively, with different team members responsible for different modules.

| Team Member | Role | Contribution |
|---|---|---|
| **Kausalya** | Backend Developer | Backend development, API integration, disease detection backend, and ML-backend integration |
| **Rohith** | Backend Developer | Backend development and backend services |
| **Sujitha** | Frontend Developer | Frontend development and user interface |
| **Sri Pushpa** | Frontend Developer | Frontend development and frontend–backend integration |
| **Shiva** | NLP Developer | NLP module and language-related features |
| **Giridhar** | Presentation & Documentation | PPT preparation, project presentation, documentation, and project explanation |

---

## 🔄 Team Development Workflow

The project follows a collaborative Git-based development workflow.

```text
                 Team Members
                      │
        ┌─────────────┼─────────────┐
        │             │             │
     Backend       Frontend        NLP
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
                Integration
                      │
                      ▼
                 GitHub Main
                      │
                      ▼
              Complete Project
```

The team maintains the project in a **single GitHub repository**, while individual modules can be developed independently and integrated into the common `main` branch.

---

## 📌 GitHub Repository

The complete project source code is maintained in a single GitHub repository:

**SIH – Early Detection of Plant Crop Disease**

Repository:

https://github.com/Kausalya-H/SIH-Early-detection-of-Plant-Crop-disease-

The repository contains the integrated:

- Frontend
- Backend
- AI/ML components
- Training resources
- Model files
- Testing scripts
- Documentation

---

## 🚀 Future Enhancements

### 🌾 Multi-Crop Support

Extend disease detection to crops such as:

- Rice
- Wheat
- Cotton
- Maize
- Chilli
- Potato
- Other region-specific crops

### 🌦️ Weather-Based Risk Prediction

Integrate weather conditions such as:

- Temperature
- Humidity
- Rainfall
- Wind conditions

to estimate disease risk.

### 🗺️ Geospatial Disease Mapping

Use location data to visualize disease occurrence and identify potential regional outbreaks.

### 🗣️ Multilingual Farmer Advisory

Provide disease information and recommendations in multiple regional languages.

### 🔔 Real-Time Alerts

Notify farmers about:

- Disease outbreaks
- High-risk weather conditions
- Recommended preventive actions

### 📊 Agricultural Dashboard

Provide authorities and agricultural organizations with:

- Disease trends
- Regional statistics
- Crop health information
- Outbreak monitoring

### 🤖 Improved AI Models

Improve model accuracy through:

- Larger datasets
- More diverse field images
- Data augmentation
- Model optimization
- Continuous evaluation

### ☁️ Cloud Deployment

Deploy the platform on cloud infrastructure for:

- Scalability
- High availability
- Centralized model management
- Remote access

---

## 🔐 Security & Reliability

For production deployment, the following measures can be incorporated:

- Secure API communication
- Authentication and authorization
- Image input validation
- Secure file handling
- Protection against malicious uploads
- Database security
- API rate limiting
- Error logging and monitoring
- AI model performance monitoring

---

## 📈 Project Status

**Status: Active Development**

### Currently Implemented

- ✅ Frontend application
- ✅ Backend API
- ✅ AI-based disease detection
- ✅ Tomato disease detection
- ✅ YOLO model integration
- ✅ Image-based prediction
- ✅ Confidence-based prediction
- ✅ Frontend–backend integration
- ✅ GitHub-based collaboration
- ✅ NLP module development

### Planned / Extensible

- 🔄 Multi-crop disease detection
- 🔄 Weather-based disease prediction
- 🔄 Geospatial analytics
- 🔄 Multilingual advisory
- 🔄 Automated alerts
- 🔄 Agricultural authority dashboard
- 🔄 Cloud deployment
- 🔄 Advanced predictive analytics
- 🔄 Expanded offline model support for additional crops

---

## 🎓 Project Context

This project is developed as part of the **Smart India Hackathon (SIH)** initiative, with the objective of applying Artificial Intelligence and modern software technologies to address real-world agricultural challenges.

The project focuses on building a scalable foundation for an intelligent crop-health monitoring and decision-support platform.

---

## 📜 License

This project is developed for academic and hackathon purposes.

If the project is later released as open source, an appropriate license such as MIT or Apache 2.0 can be added based on the team's requirements.

---

## 🌱 Conclusion

The **AI-Powered Early Detection of Plant Crop Diseases** platform brings together **Artificial Intelligence, Computer Vision, Backend APIs, Frontend Technologies, and NLP** to address the real-world challenge of early crop disease identification.

The current tomato disease detection implementation establishes the foundation for a larger agricultural intelligence platform.

With future integration of **weather intelligence, geospatial analytics, multilingual NLP, predictive analytics, and real-time alerts**, the system can evolve into a comprehensive digital agricultural decision-support solution for farmers and agricultural authorities.
