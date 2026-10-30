# Asset record

Generation mode: built-in Image Gen. Date: 2026-10-30.

## Source assets

- `assets/brand.svg`, `assets/brand-reverse.svg`, `assets/icon.png`: supplied TransGuru brand masters under `design/v8-mirror/assets/brand/`.
- `assets/icons/*.svg`: Phosphor Icons Core 2.1.1, regular weight, MIT. Only the color value was set to the site teal.

## Generated artwork

`docs/design-concept.png` is the full-page visual concept. The implementation retains its warm ivory, deep teal, broad whitespace, large Chinese headings, directional route selector, memory image, FAQ, and dark closing section. Product truth changes take precedence over decorative mock copy. The route panel uses real preparation information instead of a decorative device graphic; the closing section uses the supplied brand mark.

`assets/hero.webp` (1100 × 825) and `assets/hero-small.webp` (640 × 480) share this final prompt:

> Create a premium editorial product illustration for the right half of a clean TransGuru website hero. Wide 4:3 image, very light warm ivory #f8f9f5 background. One handsome realistic Android smartphone at a very slight 7 degree clockwise angle, nearly front facing, dark midnight teal thin bezel. Screen pale ivory with understated teal header TransGuru, simple teal circular check mark, text 'Ready for your next chapter', a small transfer progress bar and fictional simple conversation preview. Around it float three beautiful physical-looking paper conversation cards, not too many: upper left white message bubble 'Made it home?' with a small green tick; lower left pale mint message bubble 'Always a message away.'; upper right a small warm nostalgic landscape photograph of a sunny coastal beach at golden hour, white photo border. Near bottom right a small cream rounded card with teal audio waveform. Tiny warm butter-yellow accent behind photo. Soft natural sunlight, sophisticated studio lighting, believable delicate shadows, straight minimalist UI, lovely warm human feeling, deliberately generous empty space. No hands, no desk, no laptop, no external logos, no WhatsApp trademark, no extra headings around the image, no 3D plastic blobs, no vivid gradient. This is a raster hero artwork, not a screenshot of a whole website. All cards fully contained inside image, no clipped edges. High end Apple editorial meets Kinfolk, calm teal on warm ivory.

`assets/social.jpg` is a 1200 × 630 social crop of this generated artwork.

`assets/memories.webp` (720 × 900) uses this final prompt:

> A quiet premium editorial photograph for a WhatsApp chat transfer app website, nostalgic real life memories. Vertical 4:5 composition. Back view of a young adult Asian couple sitting close together on a Mediterranean sea overlook at golden hour, one with their arm around the other, warm linen shirt, wind in hair, beautiful calm deep teal ocean, soft terracotta sunshine, distant mountains and a cypress silhouette. Cropped waist up, intimate yet understated; natural candid travel photography, subtle fine film grain, sunlit ivory and warm amber highlights, realistic human proportions. No text, no UI, no frames, no phones, no logos, no illustration. Subject in lower half with calm sea and sky at top so image crops gracefully. Warm human photograph for 'memories that move with you'.

Both images are illustrative. They do not depict real customer conversations or app screenshots. WebP encoding uses quality 84 for the hero and 83 for the memory image. All referenced image files are stored in this repository.


## High-definition revision — 2026-10-30

The first image exports above are retained in `docs/artwork-v1/` for reference and are no longer published. The updated hero is an Image Gen edit of the original artwork. It removes the soft-focus treatment and small raster chat text, uses larger sans-serif labels, and defines the phone edges, paper cards, and coastal photograph more clearly. The website does not enlarge the new native 1448 × 1086 master.

Current assets:

- `assets/hero-v2-{640,960,1448}.{avif,webp}`: native-or-smaller responsive versions. AVIF quality 72, 4:4:4 chroma; WebP quality 93. Native AVIF is 79,616 bytes.
- `assets/memories-v2-{576,1122}.{avif,webp}`: higher-resolution exports from the original photo, loaded lazily. AVIF quality 70, 4:4:4 chroma; WebP quality 90.
- `assets/social-v2.jpg`: updated social preview, JPEG quality 93 with 4:4:4 chroma.

Final edit prompt (built-in Image Gen):

> Edit this TransGuru website hero into a genuinely high-definition premium product photograph. Output at 2880 x 2160 pixels, 4:3 landscape, highest native resolution and precision possible. Keep the recognizable composition: single nearly frontal Android phone centered slightly tilted, white message card upper left, mint message card lower left, seaside photograph upper right, audio card lower right. Keep generous framing and all objects fully inside. Preserve warm ivory and deep teal brand. Major changes: eliminate dreamy haze, bloom, film grain, paper noise, blurred foliage and foreground blur. Clean soft ivory studio backdrop, clear tonal separation, restrained realistic contact shadows. Make every object tack-sharp using focus-stacked studio product photography, precise metal bezel, crisp glass edge highlights, fine satin finish, beautifully defined paper edges, realistically detailed ocean ripples and golden coastline photograph. Refine the screen into a minimal modern sans-serif interface, NOT serif: brand 'TransGuru' at top, large elegant teal outlined check circle, headline 'Your chats. Your next chapter.', three clear and large rows 'Messages', 'Photos & videos', 'Voice notes', each with a simple recognizable teal icon and checkmark; bottom wide teal button 'Ready to go'. No tiny chat bubbles or small timestamps in the phone screen, no fictional progress percentage, no 78%, no unnecessary detail. Floating upper-left card text 'Made it home?' in crisp clean contemporary sans-serif; bottom-left mint card 'Always a message away.' in the same sans-serif. Audio waveform made of clean sharp vertical teal bars on satin white rounded card. Calm luxurious tech product visual, credible machined metal and precise type, natural depth, no plastic gloss, no excessive contrast or oversharpening halos. Preserve composition but improve the clarity and all materials. This is the final web image asset itself, no website screenshot, no external captions or surrounding frame.

The generator returned 1448 × 1086 pixels despite the requested dimensions. All delivered size claims use the measured native dimensions, and no artificial upscale was applied.


## Layered product scene, 2026-10-30

This redesign was grounded in the rendered FamiGuru homepage supplied by the owner, with its centered typography, floating product composition, and scroll rhythm. `docs/design-direction-v3.png` is the complete visual direction and `docs/design-hero-v3.png` is the readable hero detail. They are design references, not website screenshots.

The old single-image hero has been replaced by separate local raster assets with independent HTML/CSS layers. No FamiGuru product content or brand assets are published in this site.

- `assets/phone-source-{480,900}.webp`: generic iPhone chat concept with a coastal photo. It does not depict a TransGuru iPhone app.
- `assets/phone-destination-{480,900}.webp`: Android TransGuru completion concept. Both phone masters are native 1024 × 1536 RGBA images. WebP quality 91 preserves alpha; no enlargement is used.
- `assets/transfer-stage.webp`: 1600-pixel ivory/mint/sand paper stage, used as a decorative CSS background with a soft alpha mask at its edges.
- `assets/memory-card.webp`: a 320 × 380 derivative of the existing generated memory image.
- `assets/fonts/plus-jakarta-sans-latin-wght.woff2`: local Latin variable display/body font, weights 200–800, 27,348 bytes. License and official source are retained in `assets/fonts/`.

The phone assets and stage were made with built-in Image Gen. Final phone prompts:

> Create ONE ultra-sharp premium Android smartphone product cutout on a fully transparent background, portrait 2:3 composition, entire phone including corners and delicate natural contact shadow fully inside with only 6% margin. Straight front view, perfectly vertical, no perspective tilt or rotation (rotation will be applied in website). Beautiful thin midnight teal machined aluminum bezel, precise glass edges and small centered punch hole camera, realistic studio product photography with refined highlights. The screen is ivory #f8f9f5 and shows a clean polished TransGuru completion concept: top TransGuru in deep teal sans serif; large outlined circle with teal checkmark; large readable headline 'Ready for your next chapter.'; three simple generously spaced rows Messages, Photos & videos, Voice notes with small teal line icons and checkmarks; bottom dark teal pill 'Ready to go'. Use clean contemporary sans-serif typography, no small chat timestamps and no numeric metrics. No iOS status bar, no App Store logo, no WhatsApp trademark. Maximum native resolution, tack-sharp, focus-stacked, high fidelity type, satin material, no haze, no bloom, no blurry foreground, no plastic. Outside the phone is genuinely transparent, no paper backdrop, no decorative floating cards, no white rectangle, no extra text outside phone. This asset will be a freestanding composited hero phone in a premium website.

> Create ONE ultra-sharp premium iPhone product cutout on a fully transparent background, portrait 2:3 composition, entire phone including corners and delicate natural contact shadow fully inside with only 6% margin. Straight front view, perfectly vertical, no perspective tilt or rotation (rotation will be applied in website). Beautiful slim silver titanium frame, precise black glass edges and small dark dynamic island at top, realistic studio product photography with refined highlights. Screen warm white with generic minimal chat interface, header 'Chats' in dark teal clean contemporary sans serif; three large readable fictional conversation rows Family / Weekend plans / The little things, each with a small soft mint circular avatar and short muted message preview 'Home safe.' / 'See you soon.' / 'A memory to keep.' Below the list a large softly rounded travel photograph of golden sunset over a beautiful calm teal Mediterranean coast, photo fills lower third of screen. Small unobtrusive caption 'Memories worth keeping'. No TransGuru logo or app inside this iPhone (TransGuru is only installed on Android); no WhatsApp trademark, no unread counters, no tiny timestamps, no claims about product ratings. Maximum native resolution, tack-sharp focus-stacked realistic glass and satin metal, no bloom, no haze, no plastic, type must be crisply readable. Outside phone must be genuinely transparent with no backdrop, no rectangle and no extra elements or surrounding labels. This will be the source phone standing alongside a teal Android in a premium website hero.

Final stage prompt:

> A minimal premium website product-stage BACKGROUND ONLY, wide 16:9 landscape. Warm clean ivory #f7f8f3 base. In the bottom center, a large very pale muted mint-green circular disk extends partly beyond bottom edge; immediately behind its lower left edge a small warm sand-gold crescent provides restrained light. Three extremely fine warm-gray concentric elliptical arcs spread broadly outward around the disk like subtle travel/connection routes, printed on paper rather than glowing. Very subtle natural soft studio shadow where disk meets paper, refined elegant almost architectural, matte not shiny. Upper half essentially empty ivory. Calm translucent-looking paper layers, not 3D blobs. Entire composition deliberately low contrast because real phone product images will be composited on top later. Do not render any phones, text, icons, cards, people, logos, interface, browser or website. Sharp smooth edges, no noise, no film grain, no cloudy blur, no gradients with banding. Just the sophisticated ivory/mint/sand stage backdrop.

## International delivery optimization, 2026-10-30

Phone cutouts now offer AVIF at quality 75 with 4:4:4 chroma, encoded directly from the original lossless RGBA masters, with the existing high-quality WebP files as fallback. Export sizes remain 480 and 900 pixels wide; no enlargement is used. Mobile decorative backdrop rendering is reduced to keep the focus on the phones and protect the loading budget. Main local Arabic and Hindi fonts were reduced to 30,868 and 38,412 bytes with source-equivalent shaping for the current catalogs; tiny native-name fonts are 3,776 and 2,736 bytes. The matching 21,688-byte Plus Jakarta Sans Latin Extended file supplies Turkish characters missing from the Latin file. See the bundled licenses and font-source record for full provenance and rebuild requirements.
