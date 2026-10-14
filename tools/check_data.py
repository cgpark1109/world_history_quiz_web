#!/usr/bin/env python3
"""Integrity check for the quiz data in data/.

Usage:
    python tools/check_data.py [PATH_TO_FLUTTER_APP]

Checks every data/<era>_<type>.json file:

* 15 files, 10 stages each (as in app.js / the app's constants);
* every question has a question, an answer and 3 wrong answers in English
  and Korean, and the 4 choices are distinct in both languages;
* every question has an explanation in both languages;
* ids are unique per file and era/type fields match the file name.

With the app path it also checks that every file is record-for-record
identical to the app's assets/data/<era>_<type>.json, and that
data/notices.json matches the app's notices.

Exits with status 1 if anything fails.
"""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

ERAS = ["ancient", "medieval", "early_modern", "modern1", "contemporary"]
TYPES = ["person", "year", "event"]
STAGES = 10
WEB_ROOT = Path(__file__).resolve().parent.parent


def load(path: Path):
    with path.open(encoding="utf-8-sig") as fh:
        return json.load(fh)


def choice(en, ko):
    """Same fallback as the app's _buildChoice: empty Korean uses English."""
    en = (en or "").strip()
    ko = (ko or "").strip() or en
    return en, ko


def main() -> int:
    app = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
    errors: list[str] = []
    total = 0
    stage_total = 0
    rows = []

    for era in ERAS:
        for qtype in TYPES:
            key = f"{era}_{qtype}"
            path = WEB_ROOT / "data" / f"{key}.json"
            if not path.exists():
                errors.append(f"{key}: missing file")
                continue
            data = load(path)
            stages = Counter(q.get("stage") for q in data)
            ids = Counter(q.get("id") for q in data)
            dup_ids = [i for i, n in ids.items() if n > 1]
            if dup_ids:
                errors.append(f"{key}: duplicate ids {dup_ids[:5]}")
            if sorted(stages) != list(range(1, STAGES + 1)):
                errors.append(f"{key}: stages {sorted(stages)}")
            for q in data:
                qid = f"{key}#{q.get('id')}"
                if q.get("era") != era or q.get("type") != qtype:
                    errors.append(f"{qid}: era/type {q.get('era')}/{q.get('type')}")
                for field in ("question_en", "question_ko", "answer_en", "answer_ko",
                              "explanation_en", "explanation_ko"):
                    if not str(q.get(field) or "").strip():
                        errors.append(f"{qid}: empty {field}")
                choices = [choice(q.get("answer_en"), q.get("answer_ko"))] + [
                    choice(q.get(f"wrong{i}_en"), q.get(f"wrong{i}_ko")) for i in (1, 2, 3)
                ]
                en = [c[0] for c in choices]
                ko = [c[1] for c in choices]
                if any(not c for c in en) or len(set(en)) != 4:
                    errors.append(f"{qid}: English choices not 4 distinct: {en}")
                if any(not c for c in ko) or len(set(ko)) != 4:
                    errors.append(f"{qid}: Korean choices not 4 distinct: {ko}")
            total += len(data)
            stage_total += len(stages)
            per_stage = sorted(set(stages.values()))
            rows.append((key, len(data), len(stages), per_stage))

            if app:
                app_path = app / "assets" / "data" / f"{key}.json"
                app_data = load(app_path)
                if app_data != data:
                    diff = sum(1 for a, b in zip(app_data, data) if a != b)
                    errors.append(f"{key}: differs from app ({len(app_data)} vs {len(data)} "
                                  f"records, {diff} changed)")
                app_expl = sum(1 for q in app_data if str(q.get("explanation_en") or "").strip())
                web_expl = sum(1 for q in data if str(q.get("explanation_en") or "").strip())
                if web_expl < app_expl:
                    errors.append(f"{key}: {app_expl - web_expl} explanations missing vs app")

    print(f"{'file':26} {'questions':>9} {'stages':>6}  per-stage")
    for key, n, s, per in rows:
        print(f"{key:26} {n:9} {s:6}  {per}")
    print(f"{'TOTAL':26} {total:9} {stage_total:6}")

    if app:
        app_notices = load(app / "assets" / "data" / "notices.json")
        web_notices = load(WEB_ROOT / "data" / "notices.json")
        if app_notices != web_notices:
            errors.append("data/notices.json differs from the app's notices.json")
        print(f"compared with app at {app}: notices {len(web_notices)}")

    if errors:
        print(f"\nFAILED: {len(errors)} problem(s)")
        for e in errors[:50]:
            print("  -", e)
        return 1
    print("\nOK: all checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
