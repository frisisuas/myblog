---
title: "Why I Redesigned the Finflow Onboarding Flow Twice"
subtitle: "A candid postmortem on what user research revealed, what we got wrong the first time, and why the second version worked."
date: "February 18, 2025"
readTime: "10 min read"
tags:
  - "UX Research"
  - "Case Study"
  - "Onboarding"
coverImage: "/images/finflow.png"
---

The first version of Finflow's onboarding took 11 steps and a 3-minute average completion time. We were proud of it. We had tooltips, a progress bar, confetti on completion. It was comprehensive. It was also, as our data eventually showed, quietly killing activation.

## What the numbers were telling us

Three weeks after launch, our activation rate — the percentage of signups who connected a bank account within 24 hours — sat at 23%. Industry benchmarks for fintech apps hover around 40%. We had a problem.

![Finflow original onboarding flow with drop-off funnel](/images/finflow.png "Fig. 3 — The original 11-step onboarding. Drop-off concentrated at two points: bank connection and permissions.")

Session recordings were where the real story lived. Users weren't leaving because the flow was broken — they were leaving because they were exhausted. We'd front-loaded all the trust asks before delivering any value. It was like asking someone to sign a contract before you'd even introduced yourself.

## The research sprint

We ran 8 moderated usability sessions over two weeks with participants who'd never seen the app. The pattern was immediate: users wanted to see what the app could do before they committed their bank credentials. They needed to feel safe before they'd feel ready.

> I don't mind connecting my bank. I just want to know what I'm connecting it to first.
> — Research participant, Session 4

## Version 2: Value before ask

The redesign followed a single organizing principle: show the destination before asking for the journey. We created a demo mode — a fully functional version of the app populated with anonymized sample data — that users could explore for 60 seconds before seeing a single form field.

![Finflow v2 onboarding with demo mode and progressive disclosure](/images/pulse.png "Fig. 4 — Version 2. The demo mode lets users experience the product before committing. Bank connection moved to step 3.")

We also collapsed 11 steps into 4 by eliminating every question we could answer without user input, and deferring notifications permission to 72 hours post-activation when engagement data showed users were most receptive.

```typescript:onboarding/flow-config.ts
// V2 onboarding — 4 steps, value-first ordering
export const ONBOARDING_STEPS = [
  {
    id: 'demo',
    component: DemoExplorer,
    // No form fields. User explores the app with sample data.
    // CTA: "This is your data — let's make it real"
    requiredFields: [],
    canSkip: false,
  },
  {
    id: 'intent',
    component: GoalSelection,
    // Single question: what do you want to accomplish?
    // Personalizes the empty state they'll see after connection
    requiredFields: ['primaryGoal'],
    canSkip: true,
  },
  {
    id: 'connect',
    component: BankConnection,
    // The heavy ask — but now it's step 3, not step 7
    // User already has context for WHY they're connecting
    requiredFields: ['bankAccount'],
    canSkip: false,
  },
  {
    id: 'celebrate',
    component: ActivationSuccess,
    // Show personalized first insight immediately
    // No permissions ask here — deferred to 72h lifecycle email
    requiredFields: [],
    canSkip: false,
  },
] satisfies OnboardingStep[];
```

## The outcome

After a two-week A/B test with 50/50 traffic, v2 showed a 68% activation rate against v1's 23%. More importantly, 7-day retention — users returning after their first session — went from 31% to 54%. Users who experienced the demo weren't just more likely to connect their bank. They were more likely to come back.

The lesson wasn't that our original onboarding was poorly designed. It was that it was designed around our goals — collect data, enable features — rather than the user's goal: understand if this product is worth trusting. Once we aligned those two things, the metrics followed almost automatically.
