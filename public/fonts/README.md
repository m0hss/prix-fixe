# Social image fonts

Static, Latin-subset TTFs derived from Google Fonts' Cormorant Garamond
(weight 500) and Geist Mono (weight 400), distributed under the accompanying
SIL Open Font License notices. Font licenses are separate from the project's MIT license.

Sources:
- https://github.com/google/fonts/tree/main/ofl/cormorantgaramond
- https://github.com/google/fonts/tree/main/ofl/geistmono

Generated with fontTools: instantiate the `wght` axis, then subset U+0020–024F,
U+2000–206F, and U+20A0–20CF. For other scripts, replace these with appropriately
licensed fonts containing the required glyphs. The browser uses next/font/google;
these files are dedicated to ImageResponse.
