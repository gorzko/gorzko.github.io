# Repository Agent Instructions

These instructions apply specifically to the **gorzko.github.io** repository.

## Repository Structure

- **ptaki-przewodnik/** - Main bird guide application
  - `index.html` - Main page with bird cards
  - `data/ptaki.json` - Bird data in JSON format
  - `img/` - Bird images
  - `script.js` - JavaScript for dynamic loading
  - `styles.css` - CSS styles
  
- **ptaki-przewodnik.html** - Example/mockup file, **DO NOT MODIFY**
- **lozowka.html** - Example/mockup file, **DO NOT MODIFY**

## Content Sourcing Rules

### Image Sources
- ONLY use images from Wikimedia Commons
- NEVER use images from other sources without explicit user approval
- All images must be photographs (not illustrations, drawings, or digital art)

### Attribution Requirements
- MUST include: Author name, source (Wikimedia Commons), license type
- MUST document: URL to original file page
- PREFER these licenses: CC0, CC-BY-SA 4.0, CC-BY-SA 3.0, CC-BY 4.0
- AVOID these licenses: NC (Non-Commercial), custom licenses, unclear licensing

### Validation Requirements
- MUST verify every downloaded file:
  - Non-zero file size
  - Correct file format (JPG, PNG, SVG)
  - Not corrupted (opens correctly)
  - Meets all quality requirements

## Image Requirements

### Primary Documentation
For **complete** image quality standards, see:
- `ptaki-przewodnik/img/image-quality.md` - Full specifications
- Includes: Resolution, file size, quality criteria, verification checklists

### What Images Must Be
- Photographs only (no illustrations, drawings, paintings, or digital art)
- Adult specimens (unless juvenile specifically needed)
- Standard, natural pose (not flying, feeding, or unusual behaviors)
- Sharp and in focus (clear details at 100% zoom)
- Good lighting (even, natural, details visible)
- Clear composition (subject visible and prominent)
- Natural, accurate colors (not heavily filtered or color-graded)

### Minimum Requirements
- Desktop images: Minimum 1200x900 pixels, 100KB file size
- Mobile images: Minimum 800x600 pixels, 50KB file size
- Preferred: 1920px+ width, 500KB+ file size

### Formats
- JPG - Use for all photographs
- PNG - Only if transparency is needed
- SVG - Only for vector graphics

### Responsive Images
- REQUIRED: Provide exactly 3 sizes for each image:
  1. `Species_name.jpg` - Original/full resolution
  2. `800px_Species_name.jpg` - Mobile version (800px width)
  3. `1920px_Species_name.jpg` - Desktop version (1920px width)
- All sizes must meet their respective minimum requirements
- All sizes must pass quality verification

### Subject Requirements
- Adult specimens (not juveniles, hatchlings, or eggs)
- Standard, natural pose showing typical appearance
- Clear view of identifying features (coloration, markings, shape)
- Subject occupies reasonable portion of frame

### Selection Priority
When multiple images are available, prefer in this order:
1. Wikimedia Commons Featured Pictures
2. Wikimedia Commons Quality Images
3. Wikimedia Commons Valued Images
4. Other high-quality photographs from Wikimedia Commons

### Documentation Reference
For complete image quality standards, see:
- `ptaki-przewodnik/img/image-quality.md`

## Prohibited Actions

### NEVER DO
- Modify `ptaki-przewodnik.html` - This is an example/mockup file
- Modify `lozowka.html` - This is an example/mockup file
- Use non-Wikimedia Commons images
- Use illustrations instead of photographs
- Use images showing juveniles, hatchlings, eggs, or nests (unless specifically required)
- Remove or modify existing bird data in `ptaki.json` without verification
- Commit files without validation

### ALWAYS DO
- Verify all requirements before committing
- Document sources and licenses for every image
- Use proper attribution
- Validate file integrity
- Check git status before commits
- Update `image-quality.md` when replacing images
