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
        # this centers the sphere at the corners:
        # nx = nx % 2 - 1
        # ny = ny % 2 - 1
        if nx**2 + ny**2 > 1:
            normal_map[y, x] = [127.5, 127.5, 255]
            continue
        nz = np.sqrt(1 - nx**2 - ny**2)
        normal_map[y, x] = [nx * 127.5 + 127.5, ny * 127.5 + 127.5, nz * 127.5 + 127.5]

Image.fromarray(normal_map).save('normal_map_sphere.png')