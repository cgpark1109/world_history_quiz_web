#!/usr/bin/env python3
"""Copy quiz content and branding from the Flutter app into this web version.

Usage:
    python tools/sync_from_app.py PATH_TO_FLUTTER_APP

The Flutter app (world_history_quiz) is the source of truth. This script:

* copies the 15 question files (assets/data/<era>_<type>.json) into data/,
  minified but otherwise unchanged (same schema, same records, same order);
* copies assets/data/notices.json into data/notices.json;
* writes data/manifest.json with the app version and per-file counts;
* copies the emblem and app icon, and (if Pillow is installed) renders the
  favicon PNGs and the Open Graph image.

It reads the app's lib/constants.dart and warns if the stage counts,
questions per session or clear threshold differ from the ones in app.js.

It never writes to the app folder. Re-running it with unchanged app files
produces no git diff.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from pathlib import Path

ERAS = ["ancient", "medieval", "early_modern", "modern1", "contemporary"]
TYPES = ["person", "year", "event"]
REQUIRED_KEYS = [
    "id", "era", "type", "stage",
    "question_en", "question_ko", "answer_en", "answer_ko",
    "wrong1_en", "wrong1_ko", "wrong2_en", "wrong2_ko",
    "wrong3_en", "wrong3_ko", "explanation_en", "explanation_ko",
]

WEB_ROOT = Path(__file__).resolve().parent.parent


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    sys.exit(1)


def read_json(path: Path):
    with path.open(encoding="utf-8-sig") as fh:
        return json.load(fh)


def write_if_changed(path: Path, data: bytes) -> bool:
    if path.exists() and path.read_bytes() == data:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return True


def app_version(app: Path) -> str:
    text = (app / "pubspec.yaml").read_text(encoding="utf-8")
    match = re.search(r"^version:\s*(\S+)", text, re.M)
    return match.group(1) if match else "unknown"


def app_constants(app: Path) -> dict:
    text = (app / "lib" / "constants.dart").read_text(encoding="utf-8")
    out: dict = {}
    m = re.search(r"kQuestionsPerSession\s*=\s*(\d+)", text)
    if m:
        out["questionsPerSession"] = int(m.group(1))
    m = re.search(r"kClearScoreThreshold\s*=\s*(\d+)", text)
    if m:
        out["clearScoreThreshold"] = int(m.group(1))
    m = re.search(r"kEraTotalStages\s*=\s*\{(.*?)\};", text, re.S)
    if m:
        out["eraTotalStages"] = {
            k: int(v) for k, v in re.findall(r"'(\w+)'\s*:\s*(\d+)", m.group(1))
        }
    return out


def web_constants() -> dict:
    text = (WEB_ROOT / "app.js").read_text(encoding="utf-8")
    out: dict = {}
    m = re.search(r"QUESTIONS_PER_SESSION\s*=\s*(\d+)", text)
    if m:
        out["questionsPerSession"] = int(m.group(1))
    m = re.search(r"CLEAR_SCORE_THRESHOLD\s*=\s*(\d+)", text)
    if m:
        out["clearScoreThreshold"] = int(m.group(1))
    m = re.search(r"ERA_TOTAL_STAGES\s*=\s*\{(.*?)\}", text, re.S)
    if m:
        out["eraTotalStages"] = {
            k: int(v) for k, v in re.findall(r"(\w+)\s*:\s*(\d+)", m.group(1))
        }
    return out


def sync_questions(app: Path) -> dict:
    src_dir = app / "assets" / "data"
    out_dir = WEB_ROOT / "data"
    files: dict = {}
    images: list[str] = []
    changed = 0
    for era in ERAS:
        for qtype in TYPES:
            key = f"{era}_{qtype}"
            src = src_dir / f"{key}.json"
            if not src.exists():
                fail(f"missing {src}")
            data = read_json(src)
            if not isinstance(data, list):
                fail(f"{src} is not a JSON list")
            stages: dict[str, int] = {}
            for i, q in enumerate(data):
                missing = [k for k in REQUIRED_KEYS if k not in q]
                if missing:
                    fail(f"{key}[{i}] is missing {missing}")
                stages[str(q["stage"])] = stages.get(str(q["stage"]), 0) + 1
                if q.get("image"):
                    images.append(f"{key} #{q['id']}: {q['image']}")
            payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
            if write_if_changed(out_dir / f"{key}.json", payload.encode("utf-8")):
                changed += 1
            files[key] = {
                "questions": len(data),
                "stages": dict(sorted(stages.items(), key=lambda kv: int(kv[0]))),
            }
    print(f"questions: {sum(f['questions'] for f in files.values())} in "
          f"{len(files)} files ({changed} changed)")
    if images:
        bundled = (app / "assets" / "images").exists()
        print(f"note: {len(images)} questions have an 'image' field; the app "
              f"{'bundles' if bundled else 'does not bundle'} images and does not "
              "display them, so the web version ignores the field too.")
    return files


def sync_notices(app: Path) -> None:
    src = app / "assets" / "data" / "notices.json"
    notices = read_json(src)
    payload = json.dumps(notices, ensure_ascii=False, indent=2) + "\n"
    changed = write_if_changed(WEB_ROOT / "data" / "notices.json", payload.encode("utf-8"))
    print(f"notices: {len(notices)} ({'changed' if changed else 'unchanged'})")


def sync_brand(app: Path) -> None:
    assets = WEB_ROOT / "assets"
    assets.mkdir(exist_ok=True)
    copies = {
        app / "assets" / "brand" / "emblem.svg": assets / "emblem.svg",
        app / "assets" / "icon" / "app_icon.svg": assets / "favicon.svg",
    }
    for src, dst in copies.items():
        if src.exists():
            write_if_changed(dst, src.read_bytes())
    try:
        from PIL import Image  # type: ignore
    except ImportError:
        print("note: Pillow not installed; favicon PNGs and og-image not updated")
        return
    icon_src = app / "assets" / "icon" / "app_icon.png"
    if icon_src.exists():
        icon = Image.open(icon_src).convert("RGB")
        for size, name in [(32, "favicon-32.png"), (180, "apple-touch-icon.png")]:
            dst = assets / name
            tmp = dst.with_suffix(".tmp")
            icon.resize((size, size), Image.LANCZOS).save(tmp, "PNG", optimize=True)
            _replace_if_changed(tmp, dst)
    feature = app / "store_assets" / "feature_graphic_1024x500.png"
    if feature.exists():
        dst = assets / "og-image.jpg"
        tmp = dst.with_suffix(".tmp")
        Image.open(feature).convert("RGB").save(tmp, "JPEG", quality=85,
                                                optimize=True, progressive=True)
        _replace_if_changed(tmp, dst)
    print("brand: emblem, favicons and og-image synced")


def _replace_if_changed(tmp: Path, dst: Path) -> None:
    if dst.exists() and dst.read_bytes() == tmp.read_bytes():
        tmp.unlink()
    else:
        shutil.move(str(tmp), str(dst))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("app", type=Path, help="path to the Flutter app repo")
    args = parser.parse_args()
    app: Path = args.app.resolve()
    if not (app / "pubspec.yaml").exists() or not (app / "assets" / "data").exists():
        fail(f"{app} does not look like the Flutter app (no pubspec.yaml / assets/data)")

    version = app_version(app)
    print(f"app: {app} (version {version})")
    files = sync_questions(app)
    sync_notices(app)
    sync_brand(app)

    constants = app_constants(app)
    manifest = {
        "appVersion": version,
        "totalQuestions": sum(f["questions"] for f in files.values()),
        "totalStages": sum(len(f["stages"]) for f in files.values()),
        "constants": constants,
        "files": files,
    }
    payload = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    write_if_changed(WEB_ROOT / "data" / "manifest.json", payload.encode("utf-8"))
    print(f"manifest: {manifest['totalQuestions']} questions, "
          f"{manifest['totalStages']} stages")

    web = web_constants()
    for key, value in constants.items():
        if web.get(key) != value:
            print(f"WARNING: app constant {key}={value} but app.js has "
                  f"{web.get(key)}; update app.js to match.")


if __name__ == "__main__":
    main()
