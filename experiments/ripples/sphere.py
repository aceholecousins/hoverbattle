import numpy as np
from PIL import Image
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

width, height = 256, 256
normal_map = np.zeros((height, width, 3), dtype=np.uint8)

for y in range(height):
    for x in range(width):
        nx = (2 * (x / width)) - 1
        ny = 1 - (2 * (y / height))
        if nx**2 + ny**2 > 1:
            normal_map[y, x] = [128, 128, 128]
            continue
        nz = 0
        normal_map[y, x] = np.ceil([nx * 127.5 + 127.5, ny * 127.5 + 127.5, nz * 127.5 + 127.5])

Image.fromarray(normal_map).save('normal_disturbance_map_sphere.png')