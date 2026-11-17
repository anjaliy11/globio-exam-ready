# Product brief: "Am I exam-ready?"

## Problem
Learners finish A1 German and book the Goethe or ÖSD exam without knowing if they are ready. Some fail, losing the exam fee and months of their plan abroad.

## Who it is for
Working professionals from India and other developing nations who have finished A1 and are deciding whether to book the exam.

## Job to be done
"Before I pay for the exam, tell me honestly if I am ready and what to fix."

## Goals
1. Give a clear ready / almost / not-yet answer in about 10 minutes.
2. Show readiness by skill and the 2 to 3 things to practise.
3. Be honest about uncertainty, so learners can trust it.
4. Create a path from result to Globio's exam preparation.

## Non-goals (v1)
Listening, speaking and writing assessment. Accounts and payments. Multiple levels or languages. Any claim to predict pass or fail.

## Key decisions and trade-offs
- **What "ready" means:** 80% weighted overall and no skill under 60%. The real pass mark is 60%. The margin covers a short, noisy check and the untested exam parts.
- **15 questions:** short enough to finish, so the sample is noisy. We show a range and weight harder items more.
- **No accounts:** lowest friction and no personal data. The cost is no history across devices.
- **Static frontend plus small API:** the page loads instantly and the app works if the API is down. The cost is one more thing to host.
- **Opt-in feedback and exam outcome:** privacy first. The cost is a smaller data set.

## Success metrics (hypotheses, not measured)
- **Funnel:** start to complete at 60% or better, using the anonymous step counts.
- **Calibration:** at least 85% of "Ready" learners pass the real exam, and at most 30% of "Not yet" do.
- **Growth:** result-page CTA click rate and share rate, tracked by UTM tags and share events.

## Risks
- Ready is wrongly shown to someone who then fails. The mitigation is the safety margin, the range, the disclaimer, and outcome tracking.
- Question errors in German. The mitigation is review by a German speaker before launch.
- The free host sleeps. The mitigation is a background wake-up ping and offline-safe scoring.

## Roadmap
1. **Next:** calibrate thresholds from real outcomes, with item analysis on every question.
2. **Then:** audio listening questions, and an AI writing check validated against trainer-labeled texts.
3. **Later:** A2 and B1 levels, adaptive questions, a managed database, and a question bank outside the code.