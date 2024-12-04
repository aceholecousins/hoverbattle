
import os
import re
import shutil
import json

target_dir = "threemath"

if os.path.exists(target_dir):
    shutil.rmtree(target_dir)
if os.path.exists("node_modules"):
    shutil.rmtree("node_modules")
if os.path.exists("package.json"):
    os.remove("package.json")
if os.path.exists("package-lock.json"):
    os.remove("package-lock.json")

# Get the latest version of @types/three
os.system("npm show @types/three version --json > version.json")
with open("version.json", "r") as f:
    latest_version = json.load(f).strip()
os.remove("version.json")

with open("package.json", "w") as f:
    f.write(f'{{"name":"threemath","version":"{latest_version}"}}')

# Install the same version of three and @types/three
os.system(f"npm install three@{latest_version} @types/three@{latest_version}")

os.makedirs(target_dir, exist_ok=True)

os.system(f"cp -r ./node_modules/three/src/math/* {target_dir}")
os.system(f"cp ./node_modules/three/src/constants.js {target_dir}")

os.system(f"rsync -a ./node_modules/@types/three/src/math/* {target_dir}")
os.system(f"cp ./node_modules/@types/three/src/constants.d.ts {target_dir}")

# fix imports for constants file
for root, _, files in os.walk(f"./{target_dir}"):
    for file in files:
        file_path = os.path.join(root, file)
        with open(file_path, "r") as f:
            content = f.read()
        updated_content = content.replace("../constants", "./constants").replace(".././", "../")
        with open(file_path, "w") as f:
            f.write(updated_content)

# search for imports outside math and mock them
imports = set()
pattern = re.compile(r"import \{ .* \} from ['\"]\.\.")
for file in os.listdir(target_dir):
    file_path = os.path.join(target_dir, file)
    if os.path.isfile(file_path):
        with open(file_path, "r") as f:
            new_content = ""
            for line in f:
                if pattern.search(line):
                    imps = line.split(" { ")[1].split(" }")[0].split(", ")
                    imports.update(imps)
                    new_line = line.split("from")[0] + f"from './mock';\n"
                else:
                    new_line = line
                new_content += new_line
        with open(file_path, "w") as f:
            f.write(new_content)

with open(f"{target_dir}/mock.d.ts", "w") as f:
    for imp in imports:
        f.write(f"export type {imp} = any;\n")

# create index.js file
files = []
for root, _, filenames in os.walk(target_dir):
    for filename in filenames:
        if filename.endswith('.js') and filename != 'index.js' and filename != 'mock.js':
            relative_path = os.path.relpath(os.path.join(root, filename), target_dir)
            files.append(relative_path)
exports = [f"export * from './{target_dir}/{os.path.splitext(file)[0]}';" for file in files]
with open('threemath.ts', 'w') as f:
    f.write("\n".join(exports) + "\n")
