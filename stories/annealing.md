## Why change the recipe?

Lowering the learning rate makes the updates smaller near the end of
pretraining. The aim is to refine predictions with less abrupt change to
the patterns already learned, while emphasizing high-quality text.

This is still next-token training. Learning to follow instructions comes later.
Longer-context training can accompany this phase, but is a separate change.

<!-- Add the confirmed recipe and your role when these can be shared. -->
