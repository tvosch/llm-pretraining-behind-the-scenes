## Why does language matter?

The same meaning can take different numbers of tokens in different languages.
A tokenizer with poor coverage may break words into many small pieces, using
more of the model's limited context window.

Our vocabulary contains 262,144 tokens. Vocabulary size is not the same as
context length: one describes the available pieces, the other how many pieces
the model can process together.

[Max's Tokenization Tax report](https://www.ellamind.com/blog/tokenization-tax-report-2026)

<!-- Add a verified cross-language example or a tokenizer design decision. -->
