
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

res = 128

z = np.zeros((res, res))
for i in range(res):
	for j in range(res):
		x1 = i/(res-1)*2 - 1
		y1 = j/(res-1)*2 - 1
		r1 = np.sqrt(x1*x1 + y1*y1)
		if r1 > 1:
			r1 = 1
		h1 = np.cos(r1*np.pi)

		x2 = i/(res-1)*2 - 1.2
		y2 = j/(res-1)*2 - 1
		r2 = np.sqrt(x2*x2 + y2*y2)
		if r2 > 0.5:
			r2 = 0.5
		h2 = np.cos(r2*np.pi)

		z[i, j] = h1 - h2

x = np.outer(np.array(range(res)), np.ones(res))
y = np.transpose(x.copy())

ax.plot_surface(x, y, z)
plt.show()

plt.imsave("bowwave.png", z, cmap='gray')
