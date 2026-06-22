# Polish Birds Dataset with AviList v2025b Taxonomy

Complete official list of bird species recorded in Poland as of January 1, 2026, enhanced with AviList v2025b taxonomy hierarchy.

## Overview

This dataset contains **475 bird species** from the official Komisja Faunistyczna list, each enhanced with comprehensive taxonomy information from AviList v2025b.

## Files

- `polish-birds-data/awifauna-pl.csv` - Raw CSV data from Komisja Faunistyczna (475 species)
- `polish-birds-data/polish-birds-with-taxonomy.json` - Complete dataset with taxonomy (475 species)
- `polish-birds-data/README.md` - This documentation

## Data Sources

- **Species List**: Komisja Faunistyczna (https://komisjafaunistyczna.pl/lista/)
- **Taxonomy**: AviList v2025b (adopted by Komisja Faunistyczna in August 2025)

## Dataset Structure

### JSON Format

Each species entry contains:
- `lp` - Sequential number (1-475)
- `scientific_name` - Latin binomial
- `polish_name` - Polish common name
- `category` - AERC category (A, B, C, D, E)
- `status` - Status code (L, P, Z, z, etc.)
- `taxonomy.order` - Taxonomic order
- `taxonomy.family` - Taxonomic family
- `taxonomy.genus` - Genus name
- `taxonomy.english_name` - English common name
- `taxonomy.source` - "AviList v2025b"

## AERC Category Codes

- **A**: Species with natural occurrence
- **B**: Historical species (not seen since 1950)
- **C**: Introduced species
- **D**: Category D (uncertain origin)
- **E**: Category E (unnatural occurrence)

## Data Quality

- **Species Coverage**: 100% (all 475 species)
- **Taxonomy Coverage**: 100% (all species have order, family, genus, English name)
- **Source Verification**: Official Komisja Faunistyczna list + AviList v2025b taxonomy
- **Last Updated**: 2026-06-22

## Usage Examples

### JavaScript
```javascript
const dataset = require('./polish-birds-data/polish-birds-with-taxonomy.json');
const firstSpecies = dataset.species[0];
console.log(firstSpecies.scientific_name); // "Oxyura leucocephala"
```

### Python
```python
import json
with open('polish-birds-data/polish-birds-with-taxonomy.json') as f:
    dataset = json.load(f)
print(dataset['total_species'])  # 475
```

## Taxonomy Coverage

All 29+ orders represented in the Polish avifauna are included, following AviList v2025b taxonomy.

## License

Derived from public domain sources:
- Komisja Faunistyczna official list
- AviList v2025b taxonomy

## Notes

- Uses AviList v2025b taxonomy (officially adopted by Komisja Faunistyczna in August 2025)
- English names follow AviList v2025b nomenclature
- Scientific and Polish names from official Komisja Faunistyczna list
- Category and status codes follow AERC standards
