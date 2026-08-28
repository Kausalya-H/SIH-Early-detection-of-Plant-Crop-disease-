import json
import os
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

DATA_FILE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "admin_store.json"
)

_lock = threading.Lock()

DEFAULT_SETTINGS = {
    "humidityThreshold": 85.0,
    "clusterRadius": 5.0,
    "aiConfidence": 92.0
}

DEFAULT_SEED = {
    "users": [
        {
            "id": "usr-001",
            "name": "Dr. Anita Sengupta",
            "email": "anita.sengupta@krishirakshak.gov.in",
            "phone": "+91 98100 22345",
            "role": "ADMIN",
            "designation": "Principal Agricultural Data Scientist",
            "department": "Central AI & Surveillance Directorate",
            "state": "Delhi (HQ)",
            "status": "ACTIVE",
            "createdAt": "2025-11-10T10:00:00Z",
            "lastActive": "2026-08-27T17:45:00Z"
        },
        {
            "id": "usr-002",
            "name": "Dr. Ramesh K. Patil",
            "email": "ramesh.patil@agri.mh.gov.in",
            "phone": "+91 98231 44521",
            "role": "OFFICER",
            "designation": "District Agriculture Officer (DAO)",
            "department": "Department of Agriculture, Maharashtra",
            "state": "Maharashtra",
            "district": "Nashik",
            "status": "ACTIVE",
            "createdAt": "2026-01-15T09:00:00Z",
            "lastActive": "2026-08-27T16:20:00Z"
        },
        {
            "id": "usr-003",
            "name": "S. Gurpreet Singh",
            "email": "gurpreet.singh@agri.pb.gov.in",
            "phone": "+91 94172 88390",
            "role": "OFFICER",
            "designation": "Sub-Divisional Agricultural Officer (SDAO)",
            "department": "Department of Agriculture, Punjab",
            "state": "Punjab",
            "district": "Ludhiana",
            "status": "ACTIVE",
            "createdAt": "2026-02-01T11:30:00Z",
            "lastActive": "2026-08-27T14:10:00Z"
        },
        {
            "id": "usr-004",
            "name": "Vikram Joshi",
            "email": "vikram.joshi@krishirakshak.gov.in",
            "phone": "+91 99201 55670",
            "role": "ADMIN",
            "designation": "Systems Infrastructure Lead",
            "department": "NIC Digital Agri Division",
            "state": "Delhi (HQ)",
            "status": "ACTIVE",
            "createdAt": "2025-12-01T08:00:00Z",
            "lastActive": "2026-08-27T18:10:00Z"
        }
    ],
    "settings": DEFAULT_SETTINGS,
    "gateways": [
        {
            "id": "sms",
            "title": "C-DOT / BSNL Emergency SMS Gateway",
            "description": "Direct priority telecom routing",
            "status": "Connected",
            "lastPingAt": "2026-08-27T18:00:00Z"
        },
        {
            "id": "whatsapp",
            "title": "WhatsApp Business API (Kisan Seva)",
            "description": "Interactive diagnosis bot channel",
            "status": "Active",
            "lastPingAt": "2026-08-27T18:00:00Z"
        },
        {
            "id": "weather",
            "title": "IMD Agro-Meteorological Satellite Feed",
            "description": "Real-time weather radar ingest",
            "status": "Streaming",
            "lastPingAt": "2026-08-27T18:00:00Z"
        }
    ],
    "aiModels": [
        {
            "id": "mod-001",
            "modelName": "KrishiVision ViT-Base (PlantVillage+ICAR Fine-Tuned)",
            "version": "v2.4.1",
            "targetCropsCount": 18,
            "classesCount": 54,
            "accuracy": 98.4,
            "f1Score": 0.982,
            "latencyMs": 142,
            "status": "HEALTHY",
            "lastInferenceAt": "2026-08-27T18:25:10Z",
            "totalInferencesToday": 14820,
            "failedInferencesToday": 12
        },
        {
            "id": "mod-002",
            "modelName": "EarlySymptom Micro-ResNet (Edge Deployment)",
            "version": "v1.8.0",
            "targetCropsCount": 6,
            "classesCount": 16,
            "accuracy": 94.1,
            "f1Score": 0.938,
            "latencyMs": 38,
            "status": "HEALTHY",
            "lastInferenceAt": "2026-08-27T18:22:45Z",
            "totalInferencesToday": 8350,
            "failedInferencesToday": 9
        },
        {
            "id": "mod-003",
            "modelName": "Epidemic Spread GNN (Spatio-Temporal Outbreak Predictor)",
            "version": "v0.9.3-beta",
            "targetCropsCount": 12,
            "classesCount": 4,
            "accuracy": 91.6,
            "f1Score": 0.905,
            "latencyMs": 420,
            "status": "HEALTHY",
            "lastInferenceAt": "2026-08-27T18:00:00Z",
            "totalInferencesToday": 240,
            "failedInferencesToday": 1
        }
    ],
    "auditLogs": [
        {
            "id": "aud-001",
            "actorId": "usr-001",
            "actorName": "Dr. Anita Sengupta",
            "actorRole": "ADMIN",
            "action": "MODEL_WEIGHTS_UPDATED",
            "entityType": "AI_MODEL",
            "entityId": "model-crop-v2",
            "description": "Promoted CropVision ViT v2.4 to production pipeline after 98.4% benchmark verification.",
            "ipAddress": "10.24.110.15",
            "timestamp": "2026-08-27T16:00:00Z",
            "status": "SUCCESS"
        },
        {
            "id": "aud-002",
            "actorId": "usr-002",
            "actorName": "Dr. Ramesh K. Patil",
            "actorRole": "OFFICER",
            "action": "ALERT_BROADCASTED",
            "entityType": "BROADCAST_ALERT",
            "entityId": "alt-001",
            "description": "Dispatched Level-4 emergency spore advisory to 3,420 registered farmers in Niphad block.",
            "ipAddress": "10.55.20.88",
            "timestamp": "2026-08-27T08:30:00Z",
            "status": "SUCCESS"
        },
        {
            "id": "aud-003",
            "actorId": "usr-004",
            "actorName": "Vikram Joshi",
            "actorRole": "ADMIN",
            "action": "SYSTEM_CONFIG_UPDATED",
            "entityType": "CONFIG",
            "entityId": "settings",
            "description": "Updated SMS Gateway redundancy threshold and enabled multilingual speech fallback.",
            "ipAddress": "10.24.110.42",
            "timestamp": "2026-08-26T19:20:00Z",
            "status": "SUCCESS"
        },
        {
            "id": "aud-004",
            "actorId": "usr-003",
            "actorName": "S. Gurpreet Singh",
            "actorRole": "OFFICER",
            "action": "OUTBREAK_STATUS_CHANGED",
            "entityType": "OUTBREAK",
            "entityId": "ob-002",
            "description": "Elevated Yellow Rust cluster OB-2026-PB-033 to HIGH containment phase.",
            "ipAddress": "10.82.14.19",
            "timestamp": "2026-08-25T11:45:00Z",
            "status": "SUCCESS"
        }
    ]
}


class AdminStore:
    def __init__(self, data_file: str = DATA_FILE_PATH):
        self.data_file = data_file
        self._ensure_file()

    def _ensure_file(self):
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        if not os.path.exists(self.data_file):
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(DEFAULT_SEED, f, indent=2)

    def _read_data(self) -> Dict[str, Any]:
        self._ensure_file()
        try:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data
        except Exception:
            return DEFAULT_SEED.copy()

    def _write_data(self, data: Dict[str, Any]):
        self._ensure_file()
        temp_file = f"{self.data_file}.tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        os.replace(temp_file, self.data_file)

    def _generate_log_id(self, logs: List[Dict[str, Any]]) -> str:
        count = len(logs) + 1
        return f"aud-{count:03d}"

    def _record_audit_log(
        self,
        data: Dict[str, Any],
        action: str,
        entity_type: str,
        description: str,
        entity_id: Optional[str] = None,
        actor_id: str = "usr-001",
        actor_name: str = "Dr. Anita Sengupta",
        actor_role: str = "ADMIN",
        ip_address: str = "127.0.0.1",
        status: str = "SUCCESS"
    ):
        logs = data.get("auditLogs", [])
        log_entry = {
            "id": self._generate_log_id(logs),
            "actorId": actor_id,
            "actorName": actor_name,
            "actorRole": actor_role,
            "action": action,
            "entityType": entity_type,
            "description": description,
            "ipAddress": ip_address,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": status
        }
        if entity_id:
            log_entry["entityId"] = entity_id
        logs.insert(0, log_entry)
        data["auditLogs"] = logs

    # ----------------- USERS -----------------
    def get_users(self) -> List[Dict[str, Any]]:
        with _lock:
            data = self._read_data()
            return data.get("users", [])

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        with _lock:
            data = self._read_data()
            for user in data.get("users", []):
                if user["id"] == user_id:
                    return user
            return None

    def update_user_status(
        self,
        user_id: str,
        new_status: str,
        actor_id: str = "usr-001",
        actor_name: str = "Dr. Anita Sengupta",
        actor_role: str = "ADMIN",
        ip_address: str = "127.0.0.1"
    ) -> Optional[Dict[str, Any]]:
        with _lock:
            data = self._read_data()
            target_user = None
            for user in data.get("users", []):
                if user["id"] == user_id:
                    user["status"] = new_status
                    target_user = user
                    break

            if target_user is None:
                return None

            self._record_audit_log(
                data=data,
                action="USER_UPDATED",
                entity_type="USER",
                entity_id=user_id,
                description=f"Administrative status change for {target_user['name']} to {new_status}.",
                actor_id=actor_id,
                actor_name=actor_name,
                actor_role=actor_role,
                ip_address=ip_address,
                status="SUCCESS"
            )
            self._write_data(data)
            return target_user

    # ----------------- SETTINGS -----------------
    def get_settings(self) -> Dict[str, Any]:
        with _lock:
            data = self._read_data()
            return data.get("settings", DEFAULT_SETTINGS)

    def update_settings(
        self,
        humidity_threshold: Optional[float] = None,
        cluster_radius: Optional[float] = None,
        ai_confidence: Optional[float] = None,
        actor_id: str = "usr-001",
        actor_name: str = "Dr. Anita Sengupta",
        actor_role: str = "ADMIN",
        ip_address: str = "127.0.0.1"
    ) -> Dict[str, Any]:
        with _lock:
            data = self._read_data()
            settings = data.get("settings", DEFAULT_SETTINGS.copy())

            if humidity_threshold is not None:
                settings["humidityThreshold"] = float(humidity_threshold)
            if cluster_radius is not None:
                settings["clusterRadius"] = float(cluster_radius)
            if ai_confidence is not None:
                settings["aiConfidence"] = float(ai_confidence)

            data["settings"] = settings

            self._record_audit_log(
                data=data,
                action="SYSTEM_CONFIG_UPDATED",
                entity_type="CONFIG",
                entity_id="settings",
                description=f"Updated epidemic risk thresholds: Humidity > {settings.get('humidityThreshold')}%, Cluster Radius = {settings.get('clusterRadius')}km, AI Confidence = {settings.get('aiConfidence')}%.",
                actor_id=actor_id,
                actor_name=actor_name,
                actor_role=actor_role,
                ip_address=ip_address,
                status="SUCCESS"
            )
            self._write_data(data)
            return settings

    def reset_settings(
        self,
        actor_id: str = "usr-001",
        actor_name: str = "Dr. Anita Sengupta",
        actor_role: str = "ADMIN",
        ip_address: str = "127.0.0.1"
    ) -> Dict[str, Any]:
        with _lock:
            data = self._read_data()
            data["settings"] = DEFAULT_SETTINGS.copy()

            self._record_audit_log(
                data=data,
                action="SYSTEM_CONFIG_UPDATED",
                entity_type="CONFIG",
                entity_id="settings",
                description="Reset system governance and epidemic risk thresholds to factory defaults.",
                actor_id=actor_id,
                actor_name=actor_name,
                actor_role=actor_role,
                ip_address=ip_address,
                status="SUCCESS"
            )
            self._write_data(data)
            return data["settings"]

    # ----------------- GATEWAYS -----------------
    def get_gateways(self) -> List[Dict[str, Any]]:
        with _lock:
            data = self._read_data()
            return data.get("gateways", [])

    def ping_gateway(
        self,
        gateway_id: str,
        actor_id: str = "usr-001",
        actor_name: str = "Dr. Anita Sengupta",
        actor_role: str = "ADMIN",
        ip_address: str = "127.0.0.1"
    ) -> Optional[Dict[str, Any]]:
        with _lock:
            data = self._read_data()
            gateways = data.get("gateways", [])
            target = None
            for gw in gateways:
                if gw["id"] == gateway_id:
                    gw["lastPingAt"] = datetime.now(timezone.utc).isoformat()
                    target = gw
                    break

            if target is None:
                return None

            self._record_audit_log(
                data=data,
                action="SYSTEM_CONFIG_UPDATED",
                entity_type="GATEWAY",
                entity_id=gateway_id,
                description=f"Dispatched health telemetry ping to {target['title']}.",
                actor_id=actor_id,
                actor_name=actor_name,
                actor_role=actor_role,
                ip_address=ip_address,
                status="SUCCESS"
            )
            self._write_data(data)
            return target

    # ----------------- AI MODELS -----------------
    def get_ai_models(self) -> List[Dict[str, Any]]:
        with _lock:
            data = self._read_data()
            return data.get("aiModels", [])

    # ----------------- AUDIT LOGS -----------------
    def get_audit_logs(self) -> List[Dict[str, Any]]:
        with _lock:
            data = self._read_data()
            return data.get("auditLogs", [])

    def add_audit_log(
        self,
        action: str,
        entity_type: str,
        description: str,
        entity_id: Optional[str] = None,
        actor_id: str = "usr-001",
        actor_name: str = "Dr. Anita Sengupta",
        actor_role: str = "ADMIN",
        ip_address: str = "127.0.0.1",
        status: str = "SUCCESS"
    ) -> Dict[str, Any]:
        with _lock:
            data = self._read_data()
            self._record_audit_log(
                data=data,
                action=action,
                entity_type=entity_type,
                description=description,
                entity_id=entity_id,
                actor_id=actor_id,
                actor_name=actor_name,
                actor_role=actor_role,
                ip_address=ip_address,
                status=status
            )
            self._write_data(data)
            return data["auditLogs"][0]


# Singleton instance for repository access
admin_store = AdminStore()
