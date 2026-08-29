from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = (
    PROJECT_ROOT
    / "datasets"
    / "raw"
    / "plantvillage"
)

print("Dataset path:", DATASET_PATH)
print("Dataset exists:", DATASET_PATH.exists())