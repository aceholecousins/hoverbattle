
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

res = 128

z = np.zeros((res, res))
for i in range(res):
	for j in range(res):
		x = i/(res-1)*2 - 1
		y = j/(res-1)*2 - 1
		r = np.sqrt(x*x + y*y)
		if r > 1:
			r = 1
		h = np.cos(r*np.pi)

		z[i, j] = h

x = np.outer(np.array(range(res)), np.ones(res))
y = np.transpose(x.copy())

ax.plot_surface(x, y, z)
plt.show()

plt.imsave("cosblob.png", z, cmap='gray')
