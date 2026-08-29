from pathlib import Path

DATASET_PATH = Path(
    r"C:\Users\shiva\OneDrive\Documents\ml\plantvillage dataset\color"
)

print("Dataset exists:", DATASET_PATH.exists())

folders = sorted(
    [p.name for p in DATASET_PATH.iterdir() if p.is_dir()]
)

print("Number of folders:", len(folders))

for i, folder in enumerate(folders):
    print(i, folder)