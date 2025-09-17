# PRD — Keel Stone Pathfinder (Personalized 14‑Day Practice Agent)

**Version:** 2.0  
**Owner:** Chris / The Keel Stone  
**Date:** 2025‑09‑17  
**Status:** Azure‑Only Architecture — Final Draft

---

## 1) Summary
The Keel Stone Pathfinder is an onboarding experience that converts new subscribers into engaged participants by creating a **personalized 14‑day practice plan** based on their struggles and preferences. It uses a short interactive intake, dynamically generates a plan through Azure OpenAI, and connects users to a daily drip sequence tailored to their chosen path.

**Two Doors, One Solution:**
- **Christian Door:** Includes KJV scripture references, prayer prompts, and grace‑first framing.
- **Secular Door:** Uses classical virtues, Stoic insights, and CBT‑style reframing.

Goal: Build habit formation, reduce overwhelm, and increase retention through personalization.

---

## 2) Problem & Goals
### Problem
PDF downloads do not build habits, and generic drip campaigns fail to address each user’s specific pain points. Users need a personalized path that feels designed for them and keeps them engaged.

### Goals
- **Activation:** ≥65% Day‑1 open rate, ≥50% intake completion.
- **Engagement:** ≥40% Day‑3 engagement, ≥25% Day‑7 engagement.
- **Personalization:** 100% users tagged by door + primary struggle, routed to correct drip.
- **Delight:** NPS ≥55 at Day‑7 micro‑survey.

### Non‑Goals
- Therapy or crisis support.
- Multi‑user community forums (future phase).
- Native mobile app.

---

## 3) ICP & Personas
**ICP:** Social‑media‑weary adults, 30‑55, seeking calm and clarity.

**Personas:**
- **Overloaded Analyst (Secular):** Wants focus and habit structure.
- **Quiet Believer (Christian):** Wants gentle scripture‑based guidance.
- **Burned‑Out Parent:** Needs 5–10 min practices, easy wins.

---

## 4) User Stories & Acceptance Criteria
**US‑1 Intake:** User completes 3–6 question flow in <90 seconds.
- **AC:** Multi‑select struggles, door toggle, time budget, preferred daypart, context field. Data persisted in Cosmos DB.

**US‑2 Plan Generation:** User receives personalized plan instantly.
- **AC:** 14 days of practices, anchor statement, weekly check‑in, optional stretch practice. Exportable as PDF/PNG.

**US‑3 Email Kickoff:** User receives Day‑1 email with plan link.
- **AC:** Logic App tags ESP contact and triggers first email within 5 minutes.

**US‑4 Progress Feedback:** User can mark days done/skipped.
- **AC:** Progress saved to Cosmos DB and visual tracker updated.

**US‑5 Door Switching:** User may switch Christian/Secular door.
- **AC:** Regenerates language only; plan structure stays same.

**US‑6 Privacy Control:** User can delete all data.
- **AC:** One‑click delete, confirmation email, full delete ≤7 days.

---

## 5) Experience Design (UX)
### Flow
1. Landing page CTA → Pathfinder modal
2. Intake (3–6 questions)
3. Loading state (≤2s)
4. Personalized plan view + export option
5. Day‑1 email trigger
6. Day‑3/7/14 milestone nudges

### Micro‑Interactions
- 14‑day progress dots
- Confetti on Day‑7 & Day‑14
- “Reply with one sentence” shortcut
- Compassionate streak resets (no shaming)

---

## 6) Functional Requirements
- **Frontend:** React app on Azure Static Web Apps
- **Backend:** Azure Functions for intake, plan generation, progress tracking, and exports
- **LLM:** Azure OpenAI for plan text generation, tuned with prompt + micro‑protocol library
- **Database:** Azure Cosmos DB (Core/SQL)
- **Email:** ESP integration via Azure Logic Apps
- **File Generation:** Azure Functions + Playwright for PDF/PNG output
- **Monitoring:** Azure Application Insights for logs, failures, latency

---

## 7) Content & Prompting
**Tone:** Gentle, invitational, actionable.  
**Christian Door:** Uses KJV scripture (grace‑first).  
**Secular Door:** Uses Stoic quotes, virtue framing, CBT language.

**System Prompt:**
“You are Keel Stone’s gentle guide. Generate 14 tiny daily practices (5–15 minutes) that help build wisdom, courage, justice, and temperance. Personalize based on user struggles, constraints, and door choice. Always be invitational and hopeful.”

**Output Schema:**
```json
{
  "anchor": "string",
  "daily": [
    {"day": 1, "title": "", "steps": [""], "reflection": "", "refs": [""]}
  ],
  "weekly_checkin": "string",
  "stretch": "string"
}
```

---

## 8) Architecture (Azure‑Only)
- **Frontend:** Azure Static Web Apps (React + Tailwind)
- **API Layer:** Azure Functions (HTTP triggers)
- **Database:** Cosmos DB (Core/SQL)
- **AI Layer:** Azure OpenAI Service (GPT‑4) with content filter
- **Storage:** Azure Blob Storage for plan exports
- **Automation:** Azure Logic Apps for ESP tagging + event orchestration
- **Monitoring:** Application Insights + Azure Monitor

**Sequence:** Client → Azure SWA → Function `/intake` → Cosmos DB → Function `/plan` (calls Azure OpenAI) → Cosmos DB → Blob export → Logic App triggers ESP.

---

## 9) Data Model
- **users**: `{ id, email, door, created_at }`
- **assessments**: `{ id, user_id, struggles[], time_budget, daypart, context }`
- **plans**: `{ id, user_id, daily_plan[], anchor, created_at, version }`
- **events**: `{ user_id, type, payload, timestamp }`

Partition key: `user_id`

---

## 10) API
- `POST /intake` → stores intake, returns `assessment_id`
- `POST /plan` → generates plan, stores JSON + HTML, returns view link
- `POST /progress` → saves day completion
- `POST /door` → switches door + regenerates language
- `GET /plan/:id` → returns rendered HTML/PDF/PNG
- `DELETE /user/:id` → initiates GDPR‑compliant deletion

---

## 11) Analytics & Success Metrics
- Intake start/completion rates
- Day‑1 open & click rates
- Day‑3/7/14 engagement rates
- Plan completion distribution by struggle & door
- NPS score at Day‑7

---

## 12) Email & Drip Mapping
- **Tags:** door, primary_struggle, time_budget
- **Sequences:** Day‑1 through Day‑14 reflections mapped to plan steps
- **Re‑engagement:** Auto‑trigger if inactive 3+ days
- **Post‑14:** Invite to weekly reflection cadence and optional community

---

## 13) Risks & Mitigations
- **Tone Drift:** QA plan outputs per door, lock style guide
- **LLM Output Variance:** Maintain micro‑protocol library to anchor generations
- **Data Privacy:** Enforce encryption at rest + delete requests
- **Expectation Gap:** Provide crisis disclaimers + scope note

---

## 14) Legal & Privacy
- Explicit consent checkbox on intake
- Plain‑language privacy notice
- GDPR/CCPA compliant delete API
- Access logs restricted to admins

---

## 15) Dependencies
- Azure Subscription (Functions, Cosmos DB, SWA, Blob, Logic Apps, App Insights)
- Azure OpenAI API access
- ESP with tagging and webhook support
- Playwright or equivalent for PDF rendering

---

## 16) Timeline (MVP)
- **Day 1–2:** Build intake UI + Functions + Cosmos schema
- **Day 3:** Prompt tuning + micro‑protocol library
- **Day 4:** ESP integration via Logic Apps
- **Day 5:** QA + monitoring setup
- **Weekend:** Soft launch with beta users

---

## 17) Sample Copy
**Anchor (Christian):** “Today I will practice steadiness in God’s presence — small, faithful, unhurried.”  
**Anchor (Secular):** “Today I practice steadiness — small, consistent, unhurried.”  
**Day‑1 Example:** 3 slow breaths → silence phone → 1‑line journal: “What pulled me today?”

