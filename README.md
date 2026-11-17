# Am I exam-ready?

A free German A1 readiness check for learners deciding when to book the Goethe or ÖSD exam.

**Live app:** [your Vercel URL]
**Video walkthrough:** [your video URL]

## The problem
Many learners finish A1 and book the exam without knowing if they are ready. Some fail and lose the exam fee and months of their plan abroad.

## What it does
- 15 questions in about 10 minutes: 5 vocabulary, 5 grammar, 5 reading.
- A readiness result (Ready, Almost ready, Not ready yet) with a score by skill.
- 2 to 3 specific things to practise before booking, based on the questions missed.
- A review of missed questions with explanations.
- A result card to share, and a path to talk to Globio about exam preparation.

## How "ready" is decided
- **Ready:** 80% or more overall and no skill under 60%.
- **Almost ready:** 60% or more overall, or a skill under 60%.
- **Not ready yet:** under 60% overall.
- Questions are weighted by difficulty (1 to 3), so a missed hard question counts more than a missed easy one.
- The real exam pass mark is 60%. The extra margin covers a short, noisy check and the untested exam parts.
- The result shows a 95% range, not a falsely precise number.

## What it does not do
- It does not test listening, writing or speaking. The real exam does.
- It is an estimate, not a prediction of pass or fail.
- Skills have 5 questions each, so treat a skill score as a signal.

## How we will know the score is right
Learners can optionally share an anonymous rating and their real exam outcome. The API reports the pass rate per verdict, which is how thresholds get calibrated. Details: [docs/NOTE.md](docs/NOTE.md). Product goals, trade-offs and roadmap: [docs/PRODUCT.md](docs/PRODUCT.md).

## Privacy
No accounts, names or emails. Answers stay on the device unless the learner chooses to send feedback. The app also counts anonymous steps (for example "finished the check") with a random ID, and skips this when Do Not Track is on.

## Tech
- Frontend: React, TypeScript, Vite (static).
- API: Node, Express. It validates every field and recomputes the score on the server.
- Scoring lives in `src/scoring.ts` as a pure function with all thresholds in one config.
- If the API is down, the check and result still work.
- 12 automated tests cover the question bank, scoring rules and API.

## Run locally
```
npm install
npm test
npm run server    # terminal 1, API on :3001
npm run dev       # terminal 2, app on :5173
```
Production build: `npm run build`, then `npm start`.

## Configuration
See `.env.example`.
- `VITE_API_URL`: API address, set on the frontend host.
- `ALLOWED_ORIGIN`: frontend origins allowed to call the API.
- `DATA_DIR`: where responses are stored.

## Roadmap
1. Calibrate thresholds with real exam outcomes and question-level analysis.
2. Add audio listening questions.
3. Add a writing check, only after validating it against trainer-labeled texts.
4. Add A2 and B1 levels and move the question bank out of the code.