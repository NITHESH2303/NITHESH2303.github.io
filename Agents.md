This should be the current portfolio structure

***

# Portfolio Structure Blueprint

***

## 1. NAV
```
[ { AS } logo ]    [ About · Projects · Skills · Experience · Contact ]    [ Get in Touch ]
```
Fixed top bar. Logo in mono. Max 5 nav links. CTA button rightmost. Background appears on scroll.

***

## 2. HERO SECTION
```
LEFT (55%)                              RIGHT (45%)
──────────────────────────────          ─────────────────────────────
"Hi, I am"  ← greeting label           [ Profile Photo ]
                                          - Grayscale, hover → color
"Ajeendhana S"  ← display font           - Ambient glow behind
                                          - Open to Work badge (bottom-right)
Typing tagline:                             └ pulsing green dot
"Backend Engineer / AI/ML Engineer..."
                                        [ Floating stat chips ]
2-line summary:                           ┌──────────────┐
  Line 1 → Zoho + enterprise SaaS         │ ♟ Chess 1800 │
  Line 2 → RAG / CV / AI pipelines        ├──────────────┤
                                          │ 🎓 IIT Madras│
Skill pills (grouped rows):               ├──────────────┤
  Backend | AI·ML | Frontend              │ ⭐ Zoho SDE  │
                                          └──────────────┘
[ Ask AI ]  [ About Me ]  ← CTAs
                                        [ Terminal card — profile.md ]
↓ Scroll to explore (bounce dot)          - macOS dots bar
                                          - Lines animate in one-by-one
                                          - Blinking cursor
                                          - ▲ growth markers
```

***

## 3. ABOUT SECTION
```
[ "About Me" heading ]

LEFT (50%)                              RIGHT (50%)
────────────────                        ────────────────────────────
2 short paragraphs:                     2×3 trait/value cards:
- Who I am at Zoho                      ┌──────────┐  ┌──────────┐
- What I'm building in AI/ML            │🔧 Backend│  │🤖 AI/ML  │
- What drives me                        ├──────────┤  ├──────────┤
                                        │♟ Problem │  │📐 Clean  │
                                        │  Solver  │  │   Code   │
                                        ├──────────┤  ├──────────┤
                                        │🎓 IIT    │  │🤝 Team   │
                                        │  Madras  │  │  Player  │
                                        └──────────┘  └──────────┘
```

***

## 4. SKILLS SECTION
```
[ "Skills & Expertise" heading ]
[ subtitle ]

3-column grid of category cards:

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Backend         │  │  AI / ML         │  │  Frontend & DB   │
│  Python  Node.js │  │  TensorFlow      │  │  React  Tailwind │
│  FastAPI Django  │  │  PyTorch LangChn │  │  PostgreSQL      │
│  Express Java    │  │  OpenCV  YOLO    │  │  MongoDB  Redis  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│  Tools & DevOps  │  │  Algorithms      │
│  Git  Docker AWS │  │  DSA  DP  Graphs │
│  Linux  VS Code  │  │  Problem Solving │
└──────────────────┘  └──────────────────┘
```
Each card: teal category title + pill badges (no color on pills)

***

## 5. EXPERIENCE SECTION
```
[ "Professional Journey" heading ]

Vertical teal timeline line, circle nodes per entry:

●─────────────────────────────────────────────────────
  [ Zoho Logo ]  Software Development Engineer
                 Zoho Corporation
                 📅 Year – Present  📍 Karanampettai, TN
                 2-line description
                 [ Key Achievements ▾ ] ← accordion

●─────────────────────────────────────────────────────
  [ IIT Madras ] Research Project / Internship
                 IIT Madras
                 📅 Duration  📍 Chennai
                 RAG Chatbot / CV Pipeline work
                 [ Key Achievements ▾ ]
```
Most recent at top. Expandable accordion per entry.

***

## 6. FEATURED PROJECTS SECTION
```
[ "Featured Projects" heading ]
[ subtitle ]

Filter tabs:
[ All ]  [ Backend ]  [ AI & ML ]  [ Computer Vision ]  [ Open Source ]

3-column card grid:
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│ [ Screenshot img ]│  │ [ Screenshot img ]│  │ [ Screenshot img ]│
│ Project Title     │  │ Project Title     │  │ Project Title     │
│ 1-line impact     │  │ 1-line impact     │  │ 1-line impact     │
│ [Python][RAG][LLM]│  │ [CV][YOLO][Flask] │  │ [Node][API][Zoho] │
│ [GitHub] [Live →] │  │ [GitHub] [Live →] │  │ [GitHub] [Live →] │
└───────────────────┘  └───────────────────┘  └───────────────────┘

                    [ View All Projects → ]
```
Cards have screenshot thumbnails (not icons). Hover: lift + glow.

***

## 7. CODE SHOWCASE SECTION
```
[ "Code Showcase" heading ]

┌──────────────────────┐  ┌─────────────────────────────────────────┐
│  PROJECT LIST        │  │  CODE VIEWER                            │
│  (1/3 width)         │  │  (2/3 width)                            │
│                      │  │                                         │
│  ▌ RAG Chatbot ←active  │  [ Project title + tag pills ]          │
│    LangChain+OpenAI  │  │                                         │
│                      │  │  ┌──────────────────────────────────┐   │
│    CV Pipeline       │  │  │  1  import langchain...          │   │
│    YOLO + OpenCV     │  │  │  2  class RAGPipeline:           │   │
│                      │  │  │  3    def __init__(self):        │   │
│    Zoho API          │  │  │  ...                    [Copy 📋]│   │
│    Node + Express    │  │  └──────────────────────────────────┘   │
│                      │  │                                         │
│    Data Pipeline     │  │                                         │
│    Python + Pandas   │  │                                         │
└──────────────────────┘  └─────────────────────────────────────────┘
```
Clicking a project card swaps the code with a fade transition.

***

## 8. AI CHATBOT (Floating, always visible from section 2 onward)
```
[ 🤖 Ask AI ] ← Fixed bottom-right button

On click → modal:
┌────────────────────────────────────────┐
│  🤖  Chat with Ajen AI            ×   │
├────────────────────────────────────────┤
│                                        │
│              [ message area ]          │
│                   ┌──────────────────┐ │
│                   │ Tell me about    │ │  ← user bubble (right)
│                   │ Ajeendhana       │ │
│                   └──────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ 🤖 Sure! Ajeendhana is a...▌     │ │  ← bot streaming (left)
│  └───────────────────────────────────┘ │
├────────────────────────────────────────┤
│  [👤 About] [🚀 Projects] [⚡ Skills] [📬 Contact]   │
├────────────────────────────────────────┤
│  [ Ask anything about me...  ] [→]    │  0/1000
└────────────────────────────────────────┘
```
Backend: Groq API (free), llama3-8b. Predefined quick queries + free-text.

***

## 9. CONTACT SECTION
```
[ "Let's Connect" heading ]
[ subtitle ]

LEFT (40%)                         RIGHT (60%)
─────────────────────              ─────────────────────────────
✉  your@email.com                  [ Name field ]
📍 Karanampettai, TN               [ Email field ]
🐙 github.com/...                  [ Subject field ]
💼 linkedin.com/...                [ Message textarea ]

[ Social icon links row ]          [ Send Message → ]
```

***

## 10. FOOTER
```
┌──────────────────────────────────────────────────────┐
│  { AS }      About · Projects · Skills · Contact     │
│                                                      │
│  © 2026 Ajeendhana S         GitHub · LinkedIn · ✉  │
│                                        ● SYSTEM ONLINE│
└──────────────────────────────────────────────────────┘
```

***

## Full Page Flow
```
NAV → HERO → ABOUT → SKILLS → EXPERIENCE → FEATURED PROJECTS → CODE SHOWCASE → CONTACT → FOOTER
                                                                        ↑
                                                        [ 🤖 Ask AI ] floating always
```

***

## Reusable Component Map

| Component | Used in |
|---|---|
| `SectionHeading` | Every section (white word + teal accent word) |
| `SkillPill` | Skills, Project cards, Code Showcase |
| `ProjectCard` | Featured Projects |
| `StatChip` | Hero floating chips |
| `ChatModal` | Floating AI button |
| `TerminalCard` | Hero right column |
| `TimelineEntry` | Experience section |
| `CategoryCard` | Skills section |

***

This is the full skeleton. Confirm if you'd like to adjust the order of any section (e.g. move Code Showcase before Projects, or merge About + Skills), and then we can write the final unified implementation prompt to build this from scratch.