
## Scroll-Driven Camera Disassembly Website

### Concept
A dark, cinematic single-page site for a fictional premium camera brand ("AUREX ONE") with scroll-hijacked animations. As the user scrolls, a procedurally-built 3D wireframe camera disassembles piece by piece, revealing specs for each component. Ends with an "Order Now" CTA.

### Tech Stack
- **React + TypeScript + Tailwind** (existing setup)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** for 3D rendering
- **GSAP ScrollTrigger** for scroll-driven animation timeline

### Design
- Dark background (#0a0a0a), monospace/sans-serif typography
- Orange accent color (#E87A2A) for labels and highlights (matching reference)
- Wireframe-style 3D camera model (procedural geometry — no external model needed)
- Corner frame decorations, film-strip-style progress indicator at bottom

### Scroll Sections (6-8 parts)
1. **Hero** — Full camera assembled, brand title "AUREX ONE" in large typography behind the model
2. **Lens System** — Lens separates from body, specs appear (focal length, aperture, coatings)
3. **Viewfinder/Pentaprism** — Top lifts off, shows optical viewfinder specs
4. **Shutter Mechanism** — Internal shutter detail, speed range specs
5. **Sensor/Film Gate** — Back opens, sensor/imaging specs
6. **Body & Ergonomics** — Body rotates, build quality and materials
7. **Mirror Assembly** — Mirror system detail, reflex mechanism
8. **Order Section** — Camera reassembles, pricing, "Order Now" CTA button

### Components
- `Index.tsx` — Main page with scroll container
- `CameraScene.tsx` — Three.js canvas with the 3D camera model
- `CameraModel.tsx` — Procedural camera geometry (boxes, cylinders for body, lens, prism, etc.)
- `ScrollSection.tsx` — Text overlay sections with specs
- `OrderSection.tsx` — Final CTA section with pricing
- `ProgressBar.tsx` — Film-strip style scroll progress indicator

### Interactions
- Scroll hijacking via GSAP ScrollTrigger pinning
- Camera parts animate (translate/rotate) away from body as user scrolls through each section
- Dotted annotation lines connecting parts to labels (like reference image)
- Smooth camera orbit/zoom transitions between sections
