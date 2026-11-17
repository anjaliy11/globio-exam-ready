# How would we know the readiness score is right?

**Definition.** "Right" means: learners scored Ready pass the real exam, learners scored Not yet fail. A score is a claim about the future, so we test it against outcomes.

**What we measure.**
1. **Outcome calibration (main test).** The result page asks learners to share an anonymous rating and, later, their real exam result. `/api/stats` returns pass rate per verdict. Targets: Ready at least 85% pass, Not yet at most 30% pass. At 30 outcomes per band the error is about ±15 points, so we need 100+ before moving thresholds.
2. **Item quality.** Per question: share correct and which wrong option gets picked. Items under 20% or over 95% correct add no signal. Items where strong learners pick the same wrong option are probably badly written.
3. **Self-rating gap.** We store the 1-5 confidence from before the test. Large gaps (confident, low score) show where learners misjudge themselves.
4. **Teacher check.** Two German trainers rate 20 past learners as ready or not, independently. Compare with the score.

**Known weakness.** The check covers vocabulary, grammar and reading. Listening, writing and speaking are untested, so v1 likely over-rates some learners. The result page says so. V2 adds audio items.

**Five learners to interview before v2**
1. Walk me through how you decided to book the exam. What made you feel ready?
2. Which exam part worries you most, and why?
3. After seeing your result, what did you do next? Did the 3 tips match what you would have practised?
4. Did any question feel unfair or unclear? Which one?
5. If we said "almost ready", would you postpone? What would you need to see to trust that, given your visa and job timeline?
