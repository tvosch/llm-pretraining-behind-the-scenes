## Inside the 32B run

The GPUs work together on one training run. Some share the calculations for
the model itself; others process different batches of text. Communication
between them is part of the work, not just the calculations on each GPU.

The displayed timestamp tells you when the available measurements were recorded.
Training progress is not a percentage of how intelligent the model has become.

<!-- Add a hardware decision, a practical limitation, or an approved observation. -->
