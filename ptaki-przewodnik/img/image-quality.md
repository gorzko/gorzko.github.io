# Image Quality Requirements

This document specifies the quality standards and requirements for all images in the `img/` directory.

## File Types

- **Permitted Formats**: Only JPG (preferred for photos), PNG (if transparency needed), and SVG (vector only) image files are permitted in this directory. No other file types are allowed.

## Resolution & Sizes

### Minimum Requirements
- **Standard images**: Minimum **1200x900 pixels** (increased from 800x600 to support desktop displays)
- **Mobile/thumbnail images**: Minimum 800x600 pixels
- **Hero/featured images**: Minimum 1920x1080 pixels preferred

### Retina/High-DPI Support
- For retina displays, consider providing images at **2x resolution** (e.g., 2400x1800 for standard, 3840x2160 for hero)
- This ensures crisp display on high-DPI screens without pixelation

### Responsive Images
- **Recommended**: Provide at least **2 sizes** for each image to support responsive design:
  - Mobile: 800px width
  - Desktop: 1920px width
- **Organization**: Store different sizes in subdirectories (e.g., `img/800px/`, `img/1920px/`) or use naming convention with size suffix

## File Size Requirements

- **Minimum**: **100KB** (increased from 50KB to ensure reasonable quality)
- **Preferred**: **500KB+** for standard images
- **Maximum**: No hard limit, but files >10MB should be optimized for web delivery
- **Note**: File size is a proxy for quality but not the only factor; always verify visual quality

## Quality Criteria

### Photograph Requirement
- **MUST be photographs**: Only accept actual photographs. **Reject illustrations, drawings, paintings, or digital art**
- **Verification**: Check that the image shows realistic photography, not stylized or artistic rendering
- **Example**: If an image looks like a drawing or has a painted quality, it must be replaced

### Representativeness
- **Species appearance**: Image must clearly show the **typical appearance** of the species
- **Age**: Prefer **adult specimens** unless juvenile is specifically needed
- **Standard pose**: Subject should be in a **natural, resting pose** that shows normal appearance
  - Avoid unusual behaviors (e.g., beak wide open, mid-flight unless that's the focus)
  - Avoid extreme angles or perspectives that distort the subject
- **Identifying features**: **Clear view** of key identifying characteristics (coloration, markings, shape)
- **Typical view**: Image should show the species as a naturalist would typically observe it in the field

### Sharpness & Focus
- **Must be in focus**: Image must be **sharp and clear**, not blurry
- **Focus on subject**: Primary subject must be in focus; background blur (bokeh) is acceptable if subject is sharp
- **No motion blur**: Avoid images where subject or camera movement causes blurring
- **Verification**: Zoom to 100% and check that details (feathers, eyes, etc.) are crisp

### Lighting
- **Good exposure**: Not too dark or overexposed
- **Natural lighting**: Prefer natural daylight conditions
- **Even lighting**: Subject should be evenly lit without harsh shadows obscuring details
- **Avoid**: Silhouettes, backlit subjects where details are lost, overly dark images

### Composition
- **Subject visibility**: Subject should be **clearly visible** and occupy a reasonable portion of the frame
- **Framing**: Subject should not be too small or too distant in the image
- **Orientation**: Standard orientation (not rotated 90/180 degrees unless artistic intent)
- **Background**: Background should not distract from the subject

### Color
- **Full color**: Images must be in full color, not grayscale (unless artistic intent)
- **Color accuracy**: Colors should appear natural and accurate to the species
- **Avoid**: Heavily color-graded or filtered images that misrepresent natural colors

## Format & Technical Standards

- **Formats**: JPG (preferred for photographs), PNG (only if transparency is needed), SVG (vector graphics only)
- **Color space**: sRGB for web compatibility
- **Metadata**: Preserve EXIF data where possible, including:
  - Attribution information
  - Date captured
  - Camera settings
  - Copyright/license information

## Selection Criteria Checklist

When selecting or reviewing images, verify each criterion:

### Before Download
- [ ] Image is a **photograph** (not illustration/drawing)
- [ ] Subject is an **adult specimen** (unless juvenile specifically needed)
- [ ] Subject is in **standard, natural pose**
- [ ] Image shows **typical appearance** of the species
- [ ] Resolution meets **minimum requirements** (1200x900+ for standard)
- [ ] File size is **at least 100KB**

### After Download
- [ ] Image is **sharp and in focus** (check at 100% zoom)
- [ ] **Lighting** is good (not too dark/bright, details visible)
- [ ] **Composition** shows subject clearly
- [ ] **Colors** are natural and accurate
- [ ] File is **not corrupted** (opens correctly, no artifacts)

## Image Replacement Guidelines

### When to Replace an Image
Replace images that fail any of the following:

1. **Not a photograph**: Illustration, drawing, painting, digital art
2. **Low resolution**: Below 1200x900px for standard use
3. **Too small**: File size <100KB (suggests low quality or heavy compression)
4. **Not representative**: Shows juvenile, unusual pose, or doesn't show typical appearance
5. **Poor quality**: Blurry, out of focus, pixelated
6. **Bad lighting**: Too dark, overexposed, silhouetted
7. **Poor composition**: Subject too small, obscured, or not clearly visible

### When to Keep an Image
Keep images that meet ALL criteria:
- Is a high-quality photograph
- Meets resolution requirements
- Shows adult specimen in standard pose
- Is sharp and in focus
- Has good lighting and composition
- Clearly shows typical species appearance

## Verification Checklist

Before committing images to this directory, verify:
- [ ] File format is JPG, PNG, or SVG
- [ ] File size is non-zero and meets minimum requirements
- [ ] File has correct format signature
- [ ] Resolution meets or exceeds minimum dimensions
- [ ] File size meets or exceeds minimum size
- [ ] Image is a **photograph** (not illustration)
- [ ] Image is **sharp and in focus**
- [ ] **Lighting** is good and details are visible
- [ ] **Composition** shows subject clearly
- [ ] Subject is **adult** (unless juvenile needed)
- [ ] Subject is in **standard pose** showing typical appearance
- [ ] **Colors** are natural and accurate
- [ ] File name follows naming conventions
- [ ] Attribution information is included
- [ ] Source URL is documented

## Known Issues & Corrections

### Current Images Requiring Attention

**Drawings/Illustrations (Replace Immediately)**:
- Pica_pica.jpg - Replace with actual photograph of magpie
- Parus_major.jpg - Replace with actual photograph of great tit  
- Turdus_merula.jpg - Replace with actual photograph of blackbird

**Low Quality (Replace)**:
- Phasianus_colchicus.jpg - Pheasant: Find higher quality photograph
- Alauda_arvensis.jpg - Skylark: Find higher quality photograph
- Apus_apus.jpg - Common swift: Find higher quality photograph
- Corvus_monedula.jpg - Jackdaw: Find higher quality photograph

**Too Small (Replace with higher resolution)**:
- Sturnus_vulgaris.jpg - European starling
- Acrocephalus_palustris.jpg - Marsh warbler
- Sylvia_curruca.jpg - Lesser whitethroat
- Phylloscopus_collybita.jpg - Common chiffchaff

**Not Representative (Replace)**:
- Cuculus_canorus.jpg - Common cuckoo: Find adult in standard pose (current shows hatchling with beak open)

**Blurry (Replace)**:
- Pyrrhula_pyrrhula.jpg - Bullfinch: Find sharper image

**Not on List (Remove)**:
- Apus_melba.jpg - Alpine swift: Remove (not in original species list)

**Acceptable (Keep)**:
- Sylvia_atricapilla.jpg - Blackcap
- Passer_domesticus.jpg - House sparrow
- Garrulus_glandarius.jpg - Eurasian jay
- Erithacus_rubecula.jpg - European robin
- Fringilla_coelebs.jpg - Common chaffinch
- Cyanistes_caeruleus.jpg - Eurasian blue tit
- Emberiza_citrinella.jpg - Yellowhammer
- Columba_palumbus.jpg - Common wood pigeon