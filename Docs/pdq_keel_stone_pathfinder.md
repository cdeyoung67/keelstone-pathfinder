# PDQ — Keel Stone Pathfinder (Personalized 21‑Day Practice Agent)

**Purpose:** Quickly validate the Pathfinder concept with minimal build effort, leveraging Azure‑native services.

---

## 1) Objective
Deliver a working prototype that:
- Captures user input (struggles, door, preferences)
- Generates a basic 21‑day plan with Azure OpenAI
- Delivers Day‑1 via email
- Stores minimal data in Cosmos DB for later analytics

Goal: Validate user engagement, gather first‑week metrics, and test tone/UX before scaling.

---

## 2) Scope (MVP)
- **Frontend:** Static intake form hosted on Azure Static Web Apps (using ShadCN/UI components with Tailwind CSS)
- **Backend:** Single Azure Function `/intake` that:
  - Saves data to Cosmos DB
  - Calls Azure OpenAI with a simplified prompt
  - Returns a JSON plan (no PDF for PDQ)
- **Email:** Use Azure Logic App + ESP to trigger a single Day‑1 email with plan link
- **Data:** Store user_id, struggles, door, anchor statement, and 21 daily titles (no step details yet)
- **Progress:** Track Day‑1 click only

Out of scope for PDQ:
- Full 21‑day drip sequence
- Detailed plan steps or references
- Door switching and progress tracker UI
- PDF/PNG exports

---

## 3) Success Criteria
- ≥50% of users complete intake
- ≥20% click through to view plan
- ≥10% reply or engage with email
- Collect at least 25 user inputs in first 2 weeks for analysis

---

## 4) Build Plan
**Day 1:**
- Create intake form (3 fields: struggles multi‑select, door toggle, time budget)
- Use ShadCN/UI components for consistent styling and accessibility
- Deploy to Azure Static Web Apps

**Day 2:**
- Build Azure Function for `/intake` to persist data + call Azure OpenAI
- Create Cosmos DB container (`users`, `plans`)

**Day 3:**
- Connect Azure Logic App to ESP for Day‑1 email
- Style simple plan view page (list of 21 daily titles) using ShadCN/UI components

**Day 4:**
- QA end‑to‑end flow (intake → plan generation → email delivery)
- Add Application Insights telemetry

**Day 5:**
- Soft launch with limited users (10–20 testers)
- Monitor engagement metrics

---

## 5) Prompt (PDQ Version)
**System Prompt:**
"You are a gentle guide creating a basic outline for a 21‑day practice plan. Each day should have a short title only (no steps needed). Keep language hopeful and simple."

**Variables:** struggles[], door, time_budget

**Output Example:**
```json
{
  "anchor": "Today I practice calm, steady habits.",
  "daily": [
    {"day": 1, "title": "Pause Before Posting"},
    {"day": 2, "title": "Breathe and Re‑center"}
  ]
}
```

---

## 6) Key Risks
- **Underwhelming Output:** Mitigate by curating 21‑day title templates per struggle category.
- **Tone Drift:** Review sample outputs daily.
- **Low Engagement:** Keep intake friction low (<90s), highlight value clearly on landing page.

---

## 7) Next Steps after PDQ
- Add step‑level detail to daily items
- Implement PDF/PNG export
- Build 21‑day drip sequence + progress tracking
- Add door switch capability and milestone nudges