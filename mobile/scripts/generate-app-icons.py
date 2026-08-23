from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "sunnah.png"
ASSETS = ROOT / "assets"
RES = ROOT / "android" / "app" / "src" / "main" / "res"

GREEN = (2, 42, 32, 255)
GREEN_HEX = "#022A20"


def is_canvas(pixel):
    r, g, b, a = pixel
    return a < 12 or (r > 240 and g > 240 and b > 240)


def fill_outer_canvas(image):
    pixels = image.load()
    width, height = image.size
    seen = set()
    queue = deque(
        [
            (0, 0),
            (width - 1, 0),
            (0, height - 1),
            (width - 1, height - 1),
            (width // 2, 0),
            (width // 2, height - 1),
            (0, height // 2),
            (width - 1, height // 2),
        ]
    )

    while queue:
        x, y = queue.popleft()
        if (x, y) in seen or x < 0 or y < 0 or x >= width or y >= height:
            continue
        seen.add((x, y))
        if not is_canvas(pixels[x, y]):
            continue
        pixels[x, y] = GREEN
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return image


def save_png(image, path, size):
    resized = image.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(path, format="PNG", optimize=True)


def save_webp(image, path, size):
    resized = image.resize((size, size), Image.Resampling.LANCZOS).convert("RGB")
    resized.save(path, format="WEBP", quality=92, method=6)


def circle_icon(image, size):
    square = image.resize((size, size), Image.Resampling.LANCZOS).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    out = Image.new("RGBA", (size, size), GREEN)
    out.paste(square, (0, 0))
    out.putalpha(mask)
    background = Image.new("RGBA", (size, size), GREEN)
    return Image.alpha_composite(background, out).convert("RGB")


def monochrome(image, size):
    gray = (
        image.resize((size, size), Image.Resampling.LANCZOS)
        .convert("L")
        .point(lambda value: 255 if value > 70 else 0)
    )
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.putalpha(gray)
    return out


def main():
    source = fill_outer_canvas(Image.open(SOURCE).convert("RGBA"))
    master = source.resize((1024, 1024), Image.Resampling.LANCZOS)

    save_png(master, ASSETS / "icon.png", 1024)
    save_png(master, ASSETS / "android-icon-foreground.png", 1024)
    save_png(master, ASSETS / "splash-icon.png", 1024)
    save_png(master, ASSETS / "favicon.png", 192)

    background = Image.new("RGB", (1024, 1024), GREEN[:3])
    background.save(ASSETS / "android-icon-background.png", format="PNG", optimize=True)

    densities = {
        "mdpi": 1,
        "hdpi": 1.5,
        "xhdpi": 2,
        "xxhdpi": 3,
        "xxxhdpi": 4,
    }

    for name, scale in densities.items():
        folder = RES / f"mipmap-{name}"
        folder.mkdir(parents=True, exist_ok=True)
        save_webp(master, folder / "ic_launcher.webp", int(48 * scale))
        save_webp(circle_icon(master, int(48 * scale)), folder / "ic_launcher_round.webp", int(48 * scale))
        save_webp(master, folder / "ic_launcher_foreground.webp", int(108 * scale))
        save_webp(background, folder / "ic_launcher_background.webp", int(108 * scale))
        mono = monochrome(master, int(108 * scale))
        mono.save(folder / "ic_launcher_monochrome.webp", format="WEBP", quality=92, method=6)

        splash_dir = RES / f"drawable-{name}"
        splash_dir.mkdir(parents=True, exist_ok=True)
        save_png(master, splash_dir / "splashscreen_logo.png", int(288 * scale))


if __name__ == "__main__":
    main()
    print("generated", GREEN_HEX)
