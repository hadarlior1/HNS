"""Export every script, tip, warning and quiz question to a Hebrew Word file for review.

    python scripts/export-transcript.py "<output.docx>"

Reads src/content/lessons.ts and quiz.ts through `npx tsx`. Keep the output outside the repo
if it carries review notes.
"""
import json
import subprocess
import sys
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.shared import Pt, RGBColor

root = Path(__file__).resolve().parent.parent
code = (
    "import { modules } from './src/content/lessons'; import { quiz } from './src/content/quiz';"
    "console.log(JSON.stringify({ modules, quiz }));"
)
data = json.loads(subprocess.run("npx tsx -e \"" + code + "\"", cwd=root, shell=True,
                                 capture_output=True, text=True, encoding="utf-8", check=True).stdout)

doc = Document()
st = doc.styles["Normal"]
st.font.name = "Arial"
st.font.size = Pt(11)
st.element.rPr.rFonts.set(qn("w:cs"), "Arial")


def rtl(p):
    pPr = p._p.get_or_add_pPr()
    bidi = OxmlElement("w:bidi")
    bidi.set(qn("w:val"), "1")
    pPr.append(bidi)
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    for r in p.runs:
        rPr = r._r.get_or_add_rPr()
        el = OxmlElement("w:rtl")
        el.set(qn("w:val"), "1")
        rPr.append(el)
        r.font.cs_size = r.font.size
    return p


def para(text, bold=False, color=None, size=None, style=None):
    p = doc.add_paragraph(style=style)
    r = p.add_run(text)
    r.bold = bold
    if color:
        r.font.color.rgb = RGBColor.from_string(color)
    if size:
        r.font.size = Pt(size)
    return rtl(p)


def heading(text, level):
    p = doc.add_heading(level=level)
    p.add_run(text)
    return rtl(p)


heading("תמלול ההדרכה: מערכת הזמנות – הצגת הזמנות", 0)
para("כל מה שרבקה אומרת בהדרכה, לפי הסדר. ליד כל שלב: הכותרת, הטקסט המוקרא, והטיפים והאזהרות שמופיעים על המסך. "
     "בסוף כל פרק: שאלות המבחן. סמנו תיקונים ישירות במסמך.", color="555555")

for m in data["modules"]:
    heading(f"פרק {m['id']}: {m['title']}", 1)
    if m.get("intro"):
        para("פתיחת הפרק:", bold=True)
        para(m["intro"])
    for s in m["steps"]:
        heading(f"שלב {s['id']} – {s['title']}", 2)
        para(s["script"])
        if s.get("tip"):
            para("💡 טיפ: " + s["tip"], color="1E7B34")
        if s.get("warning"):
            para("⚠️ שימו לב: " + s["warning"], color="B00020")
    qs = data["quiz"].get(m["id"], [])
    if qs:
        heading(f"מבחן – פרק {m['id']}", 2)
        for i, q in enumerate(qs, 1):
            para(f"{i}. {q['he']['q']}", bold=True)
            for j, o in enumerate(q["he"]["options"]):
                mark = "✔ " if j == q["answer"] else "○ "
                para(mark + o, color="1E7B34" if j == q["answer"] else None)
            para("הסבר: " + q["he"]["explain"], color="555555", size=10)

out = Path(sys.argv[1])
doc.save(out)
print(out)
