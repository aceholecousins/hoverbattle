import numpy as np
import matplotlib.pyplot as plt

def dampingFromDecayRate(decay_rate):
    """Convert decay rate to damping."""
    return -np.log(1 - decay_rate)

def decayRateFromDamping(damping):
    """Convert damping to decay rate."""
    return 1 - np.exp(-damping)

for d in [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.99, 0.999]:
    k = dampingFromDecayRate(d)
    print(f"damping for d={d}: {k}")

# Parameters
d = 0.1  # decay factor
k = -np.log(1-d)       # damping coefficient (1/s)
print(k)
dt = 1.0/125     # timestep (s)
t_end = 3.0   # total simulation time (s)

# Time array
steps = int(t_end / dt)
time = np.linspace(0, t_end, steps + 1)

# True exponential decay
v_true = np.exp(-k * time)

# Kade approximation
v_kade = np.zeros_like(time)
v_kade[0] = 1.0
for i in range(steps):
    v_kade[i+1] = v_kade[i] * (1 - k * dt)

# Plot
plt.figure(figsize=(8, 5))
plt.plot(time, v_true, label="True exponential decay")
plt.plot(time, v_kade, label="Kade approximation")
plt.title(f"Decay comparison (k={k}, dt={dt}s, t_end={t_end}s)")
plt.xlabel("Time (s)")
plt.ylabel("Velocity fraction")
plt.grid(True)
plt.legend()
plt.show()
