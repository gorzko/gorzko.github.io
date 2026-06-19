# Polish Birds Dataset

This folder contains datasets and information about bird species recorded in Poland, based on the official Komisja Faunistyczna (Polish Fauna Commission) checklist.

## Sources

- **Komisja Faunistyczna**: Official Polish Fauna Commission - [https://komisjafaunistyczna.pl](https://komisjafaunistyczna.pl)
- **AviList**: Unified Global Bird Checklist v2025b - [https://www.avilist.org](https://www.avilist.org)
- **Wikipedia**: Ptaki Polski (Birds of Poland) - [https://pl.wikipedia.org/wiki/Ptaki_Polski](https://pl.wikipedia.org/wiki/Ptaki_Polski)

## Dataset Information

As of August 10, 2025, the Komisja Faunistyczna list contains **473 species** (according to Polish Wikipedia). The English checklist on the Komisja Faunistyczna website shows 306 entries, but this appears to be incomplete or outdated.

Komisja Faunistyczna adopted AviList taxonomy in August 2025 (previously used IOC World Bird List).

## Files

- `README.md` - This file
- `komisja-faunistyczna-checklist.json` - Complete species list from Komisja Faunistyczna
- `avilist-taxonomy.json` - Taxonomy hierarchy from AviList for Polish species
- `polish-birds-combined.json` - Combined dataset with taxonomy

## Status Codes

### AERC Categories
- **A**: Species with natural occurrence
- **B**: Historical species (not seen since 1950)
- **C**: Introduced species

### Status in Poland
- lęgowy (breeding)
- lęgowy sporadycznie (sporadically breeding)
- pojawia się regularnie (regularly appearing)
- zalatuje (irregular visitor)
- zalatuje wyjątkowo (exceptionally rare visitor)
- dawniej lęgowy lub zalatujący (formerly breeding or visiting, 1801-1950)