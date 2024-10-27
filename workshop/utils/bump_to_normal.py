import numpy as np
from PIL import Image
from scipy.ndimage import sobel
import sys

if len(sys.argv) != 3:
    print("Usage: python bump_to_normal.py <input_bump_map> <output_normal_map>")
    sys.exit(1)

input_bump_map = sys.argv[1]
output_normal_map = sys.argv[2]

def bump_to_normal(bump_map_path, normal_map_path, strength=1.0):
    bump_map = Image.open(bump_map_path).convert('L')
    bump_array = np.asarray(bump_map, dtype=np.float32)

    sobel_x = -sobel(bump_array, axis=1, mode="wrap")
    sobel_y = sobel(bump_array, axis=0, mode="wrap")
    
    height, width = bump_array.shape
    normal_map = np.zeros((height, width, 3), dtype=np.float32)

    normal_map[..., 0] = sobel_x * strength
    normal_map[..., 1] = sobel_y * strength
    normal_map[..., 2] = 1.0

    norm = np.linalg.norm(normal_map, axis=2)
    normal_map[..., 0] /= norm
    normal_map[..., 1] /= norm
    normal_map[..., 2] /= norm

    normal_map = (normal_map * 0.5 + 0.5) * 255.0
    normal_map = normal_map.astype(np.uint8)

    Image.fromarray(normal_map).save(normal_map_path)

bump_to_normal(input_bump_map, output_normal_map, strength=0.02)
