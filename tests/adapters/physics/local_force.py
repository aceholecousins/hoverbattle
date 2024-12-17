import numpy as np
import matplotlib.pyplot as plt

r = 3
F = 2

def solve_system(t_max, dt):
    # Time points
    t = np.arange(0, t_max + dt, dt)

    # Initialize arrays
    phi = np.zeros_like(t)
    omega = np.zeros_like(t)  # First derivative of phi
    x = np.zeros_like(t)
    vx = np.zeros_like(t)  # First derivative of x
    y = np.zeros_like(t)
    vy = np.zeros_like(t)  # First derivative of y

    # Euler method to iterate
    for i in range(1, len(t)):
        # Update angular variables
        omega[i] = omega[i - 1] + r*F*dt  # d^2phi/dt^2 = 1
        phi[i] = phi[i - 1] + dt * omega[i - 1]

        # Update linear variables
        ax = F*np.cos(phi[i - 1])  # d^2x/dt^2 = cos(phi)
        ay = F*np.sin(phi[i - 1])  # d^2y/dt^2 = sin(phi)

        vx[i] = vx[i - 1] + dt * ax
        vy[i] = vy[i - 1] + dt * ay

        x[i] = x[i - 1] + dt * vx[i - 1]
        y[i] = y[i - 1] + dt * vy[i - 1]

    return t, phi, x, y

# Parameters
t_max = 1  # Maximum time (s)
dt = 0.0001  # Time step (s)

# Solve the system
t, phi, x, y = solve_system(t_max, dt)

# Plot the results
plt.figure(figsize=(10, 6))

plt.subplot(3, 1, 1)
plt.plot(t, phi, label="phi (t)")
plt.title("Angular Position vs Time")
plt.xlabel("Time (s)")
plt.ylabel("phi (rad)")
plt.grid()

plt.subplot(3, 1, 2)
plt.plot(t, x, label="x (t)")
plt.plot(t, y, label="y (t)")
plt.title("Position vs Time")
plt.xlabel("Time (s)")
plt.ylabel("Position (m)")
plt.legend()
plt.grid()

plt.subplot(3, 1, 3)
plt.plot(x, y, label="Trajectory")
plt.title("Trajectory in the XY Plane")
plt.xlabel("x (m)")
plt.ylabel("y (m)")
plt.grid()

plt.tight_layout()
plt.show()
