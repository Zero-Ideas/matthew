import os
import re

folder = "./Pages"

# get all filenames
files = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f))]

# sort naturally (so timestamps or numbers sort correctly)
def natural_key(text):
    return [int(tok) if tok.isdigit() else tok.lower()
            for tok in re.split(r'(\d+)', text)]

files.sort(key=natural_key)

# rename to 1, 2, 3, ...
for i, filename in enumerate(files, start=1):
    ext = os.path.splitext(filename)[1]
    new_name = f"{i}{ext}"
    
    src = os.path.join(folder, filename)
    dst = os.path.join(folder, new_name)

    os.rename(src, dst)
    print(f"{filename}  ->  {new_name}")

print("Renaming complete.")
