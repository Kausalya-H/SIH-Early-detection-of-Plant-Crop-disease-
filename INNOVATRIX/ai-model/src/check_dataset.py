from pathlib import Path

DATASET_PATH = Path(
    r"C:\Users\shiva\OneDrive\Documents\ml\plantvillage dataset\color"
)

print("=" * 70)
print("DATASET CHECK")
print("=" * 70)

print("Dataset path:", DATASET_PATH)
print("Dataset exists:", DATASET_PATH.exists())

if not DATASET_PATH.exists():
    print("ERROR: Dataset folder does not exist.")
    raise SystemExit

print("\nReading folders...")

folders = sorted(
    [p.name for p in DATASET_PATH.iterdir() if p.is_dir()]
)

print("\nNumber of folders:", len(folders))

print("\nCLASS FOLDERS")
print("=" * 70)

for i, folder in enumerate(folders):
    print(f"{i}: {folder}")

print("=" * 70)
print("CHECK COMPLETED")