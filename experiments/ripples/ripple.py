import numpy as np
import os
import matplotlib.pyplot as plt

# Parameters
size = 256
center = size // 2

# Create meshgrid
x = np.linspace(-1, 1, size)
y = np.linspace(-1, 1, size)
X, Y = np.meshgrid(x, y)

# Calculate radial distance
R = np.sqrt((X**2) + (Y**2))

# Apply radial sin function
#heightmap = np.where((R > 2/3) & (R < 1), -np.cos(6 * np.pi * R), -1)
heightmap = np.where((R > 1/2) & (R < 1), np.sin((R*2*np.pi)) * np.sin(2*(R*2*np.pi)), 0)


# Plot the heightmap
plt.imshow(heightmap, cmap='gray')
plt.colorbar()
plt.title('256x256 Radial Sin Heightmap')
plt.show()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Save the heightmap
plt.imsave('radial_sin_heightmap.png', heightmap, cmap='gray')