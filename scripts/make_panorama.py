#!/usr/bin/env python3
"""
Convert a flat interior photo to an equirectangular panorama suitable for the Vistera VR viewer.

Usage:
    python3 scripts/make_panorama.py <input_image> [output_image]

Examples:
    python3 scripts/make_panorama.py livingroom.jpeg
    python3 scripts/make_panorama.py bedroom.jpg panorama_bedroom.jpg
    python3 scripts/make_panorama.py photo.png          # outputs photo_equirect.jpg

How it works:
    The VR viewer maps the image as an equirectangular projection onto a sphere:
      - Horizontal axis  = longitude  (0° → 360°)
      - Vertical axis    = latitude   (-90° → +90°)
    A flat photo is placed in the centre of the sphere (the ~70° FOV window a
    viewer would actually look at). The top/bottom caps and side wrap-arounds
    are filled with a blurred extension of the photo edges so there are no
    harsh black borders.

Output:
    A JPEG at 2:1 aspect ratio (e.g. 4096 × 2048), ready to upload to the
    Supabase "panoramas" bucket via the dashboard Edit Listing → VR Tours form.
"""

import sys
import math
import os
from pathlib import Path
from PIL import Image, ImageFilter

# ── Config ────────────────────────────────────────────────────────────────────

# How many vertical degrees of the sphere the photo occupies (60–80° feels natural)
VERTICAL_FOV_DEG = 70.0
# How many horizontal degrees the photo occupies (typically the full 360 for a single room)
HORIZONTAL_FOV_DEG = 360.0
# Output width (height = width / 2, enforced by equirectangular spec)
OUTPUT_WIDTH = 4096
# JPEG quality for output
JPEG_QUALITY = 92

# ── Helpers ───────────────────────────────────────────────────────────────────

def fill_poles(canvas: Image.Image, photo: Image.Image, out_w: int, out_h: int) -> Image.Image:
    """
    Fill the top/bottom polar caps and left/right edges using blurred strips
    sampled from the photo border, so the viewer sees something other than
    solid black when looking up/down/behind.
    """
    # Sample top-row and bottom-row of the photo, blur them heavily, tile across canvas
    top_strip   = photo.crop((0, 0, photo.width, 4)).resize((out_w, out_h // 4))
    bot_strip   = photo.crop((0, photo.height - 4, photo.width, photo.height)).resize((out_w, out_h // 4))

    # Very heavy blur so the fill colour is uniform and not distracting
    top_strip = top_strip.filter(ImageFilter.GaussianBlur(radius=60))
    bot_strip = bot_strip.filter(ImageFilter.GaussianBlur(radius=60))

    # Composite behind the main panorama (where it hasn't been painted yet)
    result = canvas.copy()
    # Darken to make it clear this is "ceiling / floor"
    dark = Image.new('RGB', (out_w, out_h), (20, 20, 20))
    result.paste(dark, (0, 0))
    result.paste(top_strip, (0, 0))
    result.paste(bot_strip, (0, out_h - out_h // 4))
    return result


def flat_to_equirect(src_path: str, dst_path: str) -> None:
    print(f"  Reading  : {src_path}")
    photo = Image.open(src_path).convert('RGB')
    src_w, src_h = photo.size
    print(f"  Source   : {src_w} × {src_h} px")

    out_w = OUTPUT_WIDTH
    out_h = OUTPUT_WIDTH // 2          # strict 2 : 1 ratio

    # ── Where in the equirect does the photo sit? ────────────────────────────
    v_fov  = math.radians(VERTICAL_FOV_DEG)
    h_fov  = math.radians(HORIZONTAL_FOV_DEG)

    # Latitude range the photo covers
    lat_max =  v_fov / 2            # top    edge of photo in sphere
    lat_min = -v_fov / 2            # bottom edge of photo in sphere

    # Convert lat/lon to equirect pixel coords
    def lat_to_py(lat: float) -> float:
        """lat in radians → output pixel y (0 = north pole, out_h = south pole)"""
        return (0.5 - lat / math.pi) * out_h

    py_top    = int(round(lat_to_py(lat_max)))
    py_bottom = int(round(lat_to_py(lat_min)))
    strip_h   = py_bottom - py_top          # pixel height the photo occupies

    # Horizontal: photo spans full 360°, so px_left=0, px_right=out_w
    px_left  = 0
    px_right = out_w
    strip_w  = px_right - px_left

    print(f"  Output   : {out_w} × {out_h} px (equirectangular 2:1)")
    print(f"  V-FOV    : {VERTICAL_FOV_DEG}°  →  rows {py_top} – {py_bottom}  ({strip_h} px)")

    # ── Build canvas ─────────────────────────────────────────────────────────
    canvas = fill_poles(Image.new('RGB', (out_w, out_h), (20, 20, 20)),
                        photo, out_w, out_h)

    # Resize photo to fit the equirect strip
    photo_resized = photo.resize((strip_w, strip_h), Image.LANCZOS)
    canvas.paste(photo_resized, (px_left, py_top))

    # ── Soft edge blend at top / bottom of the photo ─────────────────────────
    # Create a gradient mask so the transition is not a hard line
    from PIL import ImageDraw
    blend_px = max(30, strip_h // 12)   # blend zone height in pixels

    for i in range(blend_px):
        alpha = int(255 * (1 - i / blend_px))  # 255 at edge → 0 inside

        # Top edge: darken a horizontal slice
        top_y = py_top + i
        if 0 <= top_y < out_h:
            row = canvas.crop((0, top_y, out_w, top_y + 1))
            dark = Image.new('RGB', (out_w, 1), (20, 20, 20))
            mask = Image.new('L', (out_w, 1), alpha)
            blended = Image.composite(dark, row, mask)
            canvas.paste(blended, (0, top_y))

        # Bottom edge
        bot_y = py_bottom - 1 - i
        if 0 <= bot_y < out_h:
            row = canvas.crop((0, bot_y, out_w, bot_y + 1))
            dark = Image.new('RGB', (out_w, 1), (20, 20, 20))
            mask = Image.new('L', (out_w, 1), alpha)
            blended = Image.composite(dark, row, mask)
            canvas.paste(blended, (0, bot_y))

    # ── Save ─────────────────────────────────────────────────────────────────
    canvas.save(dst_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
    size_mb = os.path.getsize(dst_path) / 1_048_576
    print(f"  Saved    : {dst_path}  ({size_mb:.1f} MB)")
    print()
    print("  Next steps:")
    print("  1. Open Vistera dashboard → Edit Listing (Innsbruck)")
    print("  2. Scroll to 'VR Tours' → click 'Add panorama'")
    print(f"  3. Upload '{dst_path}'")
    print("  4. Enter room name (e.g. Wohnzimmer / Living Room)")
    print("  5. Click 'Add room'  →  VR-Tour button will appear on the listing")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    src = sys.argv[1]
    if not os.path.isfile(src):
        print(f"Error: file not found: {src}")
        sys.exit(1)

    if len(sys.argv) >= 3:
        dst = sys.argv[2]
    else:
        p = Path(src)
        dst = str(p.parent / f"{p.stem}_equirect.jpg")

    print()
    print("── Vistera panorama converter ──────────────────────────────────")
    flat_to_equirect(src, dst)
    print("────────────────────────────────────────────────────────────────")
