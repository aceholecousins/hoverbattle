
import numpy as np
import matplotlib.pyplot as plt

res = 64

kern = np.zeros((res, res))
for i in range(res):
	for j in range(res):
		x = i/(res-1)*2 - 1
		y = j/(res-1)*2 - 1
		r = np.sqrt(x*x + y*y)
		if r > 1:
			r = 1
		h = 1-r

		kern[i, j] = h


plt.imsave("cone.png", kern, cmap='gray')
