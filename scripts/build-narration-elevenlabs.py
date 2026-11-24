"""Generate narration with an ElevenLabs voice for every step and every module intro.

Outputs:
  public/narration/<step-id>.mp3    - played by the site for each step
  private/heygen-audio/m<id>.mp3    - module intros, to upload in HeyGen ("Upload audio") so the
                                      avatar videos speak with the same voice
Setup (once): put the key and voice in hazmanot-training/.env.local (gitignored, never commit it):
  ELEVENLABS_API_KEY=...
  ELEVENLABS_VOICE_ID=...
Usage:
  python scripts/build-narration-elevenlabs.py                 # everything
  python scripts/build-narration-elevenlabs.py --only 2.3,m2   # just these
  python scripts/build-narration-elevenlabs.py --list-voices   # voices in your account
Model: eleven_v3 (supports Hebrew). Cost is about one credit per character (~4,200 for the course).
"""

import argparse
import json
import os
import pathlib
import subprocess
import sys
import urllib.request
import urllib.error

ROOT = pathlib.Path(__file__).resolve().parent.parent
STEP_OUT = ROOT / "public" / "narration"
INTRO_OUT = ROOT / "private" / "heygen-audio"
API = "https://api.elevenlabs.io/v1"


def load_env() -> None:
    f = ROOT / ".env.local"
    if f.exists():
        for line in f.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"'))


def load_items() -> list[dict]:
    code = (
        "import { modules } from './src/content/lessons';"
        "const out = [];"
        "for (const m of modules) {"
        "  if (m.intro) out.push({ id: 'm' + m.id, text: m.intro });"
        "  for (const s of m.steps) out.push({ id: s.id, text: s.script });"
        "}"
        "console.log(JSON.stringify(out));"
    )
    out = subprocess.run(["npx", "tsx", "-e", code], cwd=ROOT, capture_output=True, text=True,
                         encoding="utf-8", shell=True, check=True)
    return json.loads(out.stdout.strip().splitlines()[-1])


def call(path: str, key: str, body: dict | None = None) -> bytes:
    req = urllib.request.Request(API + path, headers={"xi-api-key": key, "Content-Type": "application/json"},
                                 data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs error {e.code}: {e.read().decode(errors='replace')[:400]}")


def main() -> None:
    load_env()
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default=os.environ.get("ELEVENLABS_VOICE_ID", ""))
    ap.add_argument("--model", default="eleven_v3")
    ap.add_argument("--only", default="")
    ap.add_argument("--list-voices", action="store_true")
    args = ap.parse_args()
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("Missing ELEVENLABS_API_KEY (put it in .env.local)")

    if args.list_voices:
        for v in json.loads(call("/voices", key))["voices"]:
            print(v["voice_id"], "|", v["name"], "|", v.get("labels", {}))
        return
    if not args.voice:
        sys.exit("Missing voice: set ELEVENLABS_VOICE_ID in .env.local or pass --voice")

    only = {s for s in args.only.split(",") if s}
    STEP_OUT.mkdir(parents=True, exist_ok=True)
    INTRO_OUT.mkdir(parents=True, exist_ok=True)
    for item in load_items():
        if only and item["id"] not in only:
            continue
        audio = call(f"/text-to-speech/{args.voice}?output_format=mp3_44100_128", key, {
            "text": item["text"],
            "model_id": args.model,
            "language_code": "he",
        })
        target = (INTRO_OUT if item["id"].startswith("m") else STEP_OUT) / f"{item['id']}.mp3"
        target.write_bytes(audio)
        print(f"{item['id']}: {len(audio) // 1024} KB")


if __name__ == "__main__":
    main()
