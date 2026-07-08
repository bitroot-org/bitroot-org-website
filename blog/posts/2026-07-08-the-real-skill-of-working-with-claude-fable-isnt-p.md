---
date: '2026-07-08'
excerpt: 'Anthropic''s Claude Fable introduces a simple but powerful idea: better AI outputs don''t start with better prompts, they start by uncovering your unknowns. Here''s how the framework can improve decision-making for founders, marketers, and AI users.'
image: https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a4be4919e159adcdfa3ec1c_94358c3c.png
published_at: '2026-07-08T10:38:43.387Z'
sources: []
tags:
- 'Claude Fable'
- 'Anthropic'
- 'Claude AI'
- 'AI Prompting'
- 'Prompt Engineering'
- 'AI Reasoning'
- 'AI Productivity'
- 'Artificial Intelligence'
title: 'The real skill of working with Claude Fable isn''t prompting. It''s knowing what you don''t know.'
---

[Anthropic](https://www.anthropic.com/) studied approximately 400,000 Claude Code sessions and found something that reframes the entire conversation about AI productivity: users make roughly 70% of the planning decisions in a typical session, while Claude handles roughly 80% of the execution. The model isn't the bottleneck. You are.

That finding is the foundation of Anthropic's field guide to [Claude Fable](https://www.anthropic.com/claude/fable) — and it has implications that go well beyond coding.

---

## What the framework actually says

Thariq Shihipar, an engineer at Fable, built a simple model for thinking about what goes wrong in agentic sessions. He calls it the map and territory problem.

Your prompt is the map. The real project — with its edge cases, implicit constraints, old decisions, and unstated assumptions — is the territory. The gap between those two is where agentic work succeeds or fails.

Shihipar divides "[the unknown](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns)" into four categories:

**Known knowns** — what you've actually written in your prompt. What you've told the agent you want.

**Known unknowns** — what you haven't figured out yet, but you're aware that you haven't. The open questions you know exist.

**Unknown knowns** — what's so obvious you'd never write it down, but you'd recognise it immediately if you saw it. Implicit taste, unstated constraints, things that "go without saying."

**Unknown unknowns** — what you haven't considered at all. The risks, edge cases, and decisions you don't know you're missing.

The best agentic coders have relatively few unknowns. In many ways, reducing and planning for your unknowns is the skill of agentic coding.

---

## Why this matters more with a stronger model

With weaker models, failures were easy to attribute to the model. It forgot a requirement. It hallucinated a function. It missed an obvious constraint. The model was the excuse.

Claude Fable makes agentic coding feel different because it can carry more of the work. That is powerful, but it changes the bottleneck. The better the model gets, the more important it becomes to surface what the human has not specified: domain expectations, old code paths, taste, risk tolerance, rollout constraints, and the shape of "good."

This is the shift that Anthropic's research makes precise. When the model is doing 80% of execution, the 70% of planning decisions that stay with you become the primary source of both value and risk. The specification is now the work.

---

## The blind spot pass — before you start anything

Shihipar calls the first step a "blind spot pass." Give the AI your rough plan. Ask it to sort what it knows into knowns and unknowns. Make it interview you before it starts.

The prompt structure looks like this:

Before you start building, run a blind spot pass.

Treat my prompt as the map and the real project as the territory.

Identify:

1\. Known knowns: what I clearly specified

2\. Known unknowns: questions I flagged but haven't answered

3\. Unknown knowns: things I probably know but failed to write down

4\. Unknown unknowns: risks, constraints, edge cases, or decisions I haven't considered

Then ask me the 5–10 highest-leverage questions that would most change

the output — especially questions that affect structure, architecture,

audience, scope, workflow, or quality.

This works before a coding session. It also works before a marketing campaign, a content brief, a product spec, or any piece of work where your assumptions are doing more shaping than your instructions.

---

## The exploration phase — before you commit to a direction

Shihipar starts almost every coding session with an exploration or brainstorming phase. This helps him start with intent to define the project's scope. Claude often finds high-value approaches he would have missed, and sometimes misses the forest through the trees.

The practical move here: don't ask Claude to build the thing. Ask Claude to show you three ways the thing could be built, and what each one trades off. The cost of exploring is cheap. The cost of implementing the wrong approach and unwinding it is not.

It's extremely valuable to identify and verbalize unknown knowns early during prototyping, because finding them out during implementation can be relatively expensive. Small changes in a feature or spec can cause drastically different implementations, and it can be more difficult for the agent to revert previous changes.

This is especially true for visual or subjective work — design, writing tone, layout, brand voice. These are things that are hard to articulate in words but immediately obvious when you see them wrong. Ask for multiple approaches before you commit to one.

---

## Use source code, not screenshots

One of the more counterintuitive points in the field guide: when you want Claude to match an existing pattern or behavior, point it at the source code, not a screenshot or a description.

If you have a library that implements something in a certain way or a design component you really like, just point Fable at the folder and tell it what to look for, even if it's in a different language. This provides Claude much richer detail around the markup and structure, compared to a screenshot.

The underlying principle applies everywhere: the more concrete and specific the reference, the better the output. A vague description of what you want produces a vague approximation of it. A specific, real example of what you want produces something much closer to it.

---

## The implementation plan checkpoint

Before any significant execution starts, ask Claude to write an implementation plan — not to start implementing.

The plan focuses on the parts that might be most likely to change such as data models, type interfaces, or UX flows. This allows Claude to surface things you might actually need to alter.

The plan is cheap. Changing course midway through a long agentic session is not. This checkpoint is where unknown knowns tend to surface — you read the plan, something feels wrong, and you realise you had an assumption you never wrote down.

Once the plan is right, start fresh:

Once satisfied with the plan, make a new session and pass any artifacts to the prompt. This gives Claude a fresh context window but with all the information it compiled from your planning.

---

## Keep an implementation notes file

Even with a solid plan, things deviate. The agent encounters an edge case, picks an approach you didn't anticipate, or makes a decision that affects everything downstream — silently.

Shihipar asks Claude Code to keep a temporary implementation-notes.md file where it keeps track of decisions it makes so you can learn for the next attempt. The instruction: "Keep an implementation-notes.md file. If you hit an edge case that forces you to deviate from the plan, pick the conservative option, log it under 'Deviations,' and keep going."

The deviations log is the most useful output of a long session. It tells you where your map was wrong and gives you the raw material to write a better brief next time.

---

## How this applies outside of coding

The unknowns framework is not a coding framework. It's a thinking framework that Anthropic's engineering team happens to have articulated clearly because coding makes the consequences of unknown unknowns visible and expensive.

But the same dynamics exist in any complex work:

A founder briefing a content team doesn't write down what "on brand" means — it's an unknown known. The team produces something technically correct that feels completely wrong.

A marketer running a campaign doesn't specify what "conversion" means in context — a signup, a purchase, a qualified lead. The campaign optimises for the wrong thing.

A product manager writes a feature spec that describes what the feature does but not what problem it's solving or what "good enough" looks like. The team builds exactly what was asked for and ships something that doesn't work.

In every case, the failure is not execution. It's specification. The map was missing territory.

The blind spot pass works here too. Before you brief anyone — an agency, a contractor, a co-founder, or an AI — run the prompt above. Ask what's missing from your map. The questions that come back are the things you needed to write down and didn't.

---

## What this means for how you work with Claude Fable

As models become more capable of executing reliably on well-specified tasks, the specification becomes the primary source of value and the primary source of risk. Developing the habit of surfacing unknowns systematically — before the task starts, while it runs, and after it finishes — is not a workaround for a temporary limitation. It is the engineering discipline that the current generation of agentic AI tools actually requires.

The people getting the most out of Claude Fable are not the ones with the best prompts. They're the ones who know what they want in enough detail that the prompt almost writes itself.

So the next time a long Claude Code task goes wrong, do not only ask whether the model failed. Ask which unknown you failed to uncover before the work became expensive.

---

## Frequently asked questions

**What is Claude Fable?** Claude Fable is Anthropic's most capable widely released model, built for long-horizon agentic tasks. It supports a one-million-token context window and is designed to run autonomously across multi-step coding, research, and knowledge work.

**What is a blind spot pass in Claude Code?** A blind spot pass is a pre-implementation step where you ask Claude to review your prompt, identify what's specified and what isn't, and surface the highest-leverage questions before any work starts. It converts unknown unknowns into known unknowns — making them addressable before they become expensive.

**What are known unknowns and unknown unknowns in agentic coding?** Known unknowns are gaps you're aware of — open questions you know need answering. Unknown unknowns are gaps you haven't identified at all — assumptions, constraints, or edge cases you don't know you're missing. The unknowns framework gives you a structured way to surface both before a long agentic session starts.

**Does this framework work outside of coding?** Yes. The map and territory model applies to any complex work where your brief or specification shapes the output — content strategy, product specs, campaign briefs, design direction. The blind spot pass prompt works in all of these contexts.

**How does Claude Fable handle deviations from the plan during a session?** Shihipar's recommendation is to ask Claude to maintain an implementation-notes.md file that logs any deviations — edge cases that forced a different approach, decisions made without explicit instruction. This keeps you informed and gives you the material to write a better brief for the next session.

---

*This blog is part of Bitroot's ongoing coverage of AI tools, workflows, and strategies for founders and builders. All insights, guides, and resources are available free at Bitroot — no paywall, no fluff.*
