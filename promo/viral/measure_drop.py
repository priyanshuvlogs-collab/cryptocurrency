#!/usr/bin/env python3
"""Prints the time (s) of the biggest energy jump in the first 6 s of a track: the dhol drop."""
import subprocess
import sys

import numpy as np

path = sys.argv[1]
sr = 11025
raw = subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-i", path, "-t", "6", "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
    capture_output=True,
    check=True,
).stdout
x = np.frombuffer(raw, dtype=np.float32)
hop = 256
n = len(x) // hop
rms = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-9)
db = 20 * np.log10(rms)
# compare the next 0.5 s to the previous 0.5 s
w = int(0.5 * sr / hop)
score = np.array([db[i : i + w].mean() - db[max(0, i - w) : i].mean() if i > w else 0 for i in range(n - w)])
i = int(score.argmax())
print(f"{i * hop / sr:.2f}")
