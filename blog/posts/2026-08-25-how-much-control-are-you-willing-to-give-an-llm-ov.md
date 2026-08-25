---
date: '2026-08-25'
excerpt: 'The pitch for AI agents is simple: Give the model access to your email, calendar, Slack, documents—basically your digital life. In exchange, it handles your work for you. Autonomy in exchange for convenience.'
image: https://techcrunch.com/wp-content/uploads/2026/08/Screenshot-2026-08-23-at-8.41.55-PM.png
published_at: '2026-08-25T13:06:55.099Z'
sources: []
tags:
- 'LLM'
title: 'How Much Control Are You Willing to Give an LLM Over Your Digital Life?'
---

The pitch for AI agents is simple: Give the model access to your email, calendar, Slack, documents—basically your digital life. In exchange, it handles your work for you. Autonomy in exchange for convenience.
 
Sounds good. But here's what you're actually choosing.
 
---
 
## The Trade-Off Companies Need (And Don't Fully Admit)
 
Andrew Ambrosino, the lead engineer for OpenAI's desktop app, told TechCrunch something candid: "If I'm asking it to write a document, is there a possibility that it's going to pull from a private DM on that subject and not know that it's not supposed to share some info? Yes. I'll do it for the job. I will take the personal hit here and there if I have to."
 
Translation: AI agents require data access. Broad data access. And that creates risk.
 
The model needs context to be useful. Context lives in your email, your messages, your calendar, your conversations. To autonomously book a meeting, it needs to see your calendar patterns, your preferences, past interactions with this person, your current workload, travel plans. All of that is sensitive.
 
OpenAI's engineers could build agents that require you to upload the specific information you want them to access. Explicit, bounded, minimal. But that's friction. Users would abandon it. So instead: broad access, with the hope the model is "aligned" enough not to leak private information.
 
Ambrosino's admission reveals the real incentive structure: OpenAI needs full access because that's what makes agents actually useful at scale. Whether users should grant it is a different question entirely.
 
---
 
## The Hidden Costs Nobody Discusses
 
Tim Fernholz, a TechCrunch reporter, spent four days experimenting with ChatGPT Work. He pulled preschool calendar entries into Google Calendar, asked it to build investment dashboards, created databases of space launches.
 
The cost: $65.
 
On a $20/month subscription.
 
"I used more than 80 million tokens in four days," Fernholz noted. That's a 3x subsidy of the advertised price, with no dashboard showing the user what they're actually burning through.
 
The question isn't whether the feature is valuable. It is. The question is: Do you understand what you're paying for?
 
Here's the incentive structure: OpenAI keeps subscription prices low and visible. Token costs stay high and invisible. Agents burn enormous amounts of tokens because they take longer, make more requests, handle more context. This makes agents extremely lucrative on a per-user basis—if users don't notice the cost.
 
But users will notice, eventually. And when they do, they'll either accept the cost or opt out.
 
---
 
## Permission Complexity Becomes Its Own Lock-In
 
Fernholz wanted to give ChatGPT Work permission to read his cloud drive but not modify it.
 
The system rejected his attempt multiple times. Error messages. Circular workflows. Eventually, a dialog box appeared: "Only complete access will work."
 
So he granted complete access.
 
This isn't accidental. When you make fine-grained permissions possible but painful to configure, users take the path of least resistance: full access. The complexity itself becomes a switching cost. By the time someone realizes they granted broader permission than they wanted, extracting themselves requires undoing all those integrations.
 
This is how lock-in works in the agent era. Not through contractual terms, but through permission complexity.
 
---
 
## The Adoption Gap Nobody Wants to Admit
 
OpenAI published data showing adoption patterns:
- 98% of OpenAI employees use Codex (the company's agent tool)
- 17% of organizational subscribers use it
- Less than 1% of individual subscribers use it
The gap is telling. Internal users—people who trust their company, understand the tool, can see the benefits firsthand—almost universally adopt agents. External users? They resist.
 
Why? Because external users have skin in the game. Ambrosino can take "personal hits" with private information leaks because he's optimizing for his job. You're optimizing for your life.
 
Even Fernholz, an early adopter actively testing the product, set boundaries. "I didn't trust OpenAI with access to my inbox, source interviews or story drafts, and wouldn't let it have access to my bank account, but I believe it would be more useful had I the faith."
 
He wanted to use it fully. He couldn't bring himself to trust it fully. And that's not a character flaw. That's rational.
 
---
 
## The Question Nobody's Asking
 
The marketing asks: "What would you do if an AI agent handled your routine work?"
 
The real question is: "What would you do if you granted that agent access to the information it actually needs?"
 
The first assumes trust. The second assumes honesty about costs.
 
Companies building agents are optimizing for adoption, which means minimizing friction and visibility. Rational users are optimizing for control, which means understanding what they're granting and what it costs.
 
Those incentives don't align. And that gap—between what agents technically need and what users are willing to grant—is the real bottleneck for agent adoption. Not the model capability. Not the interface. User trust.
 
For more on how corporate incentives shape what's built, visit [Bitroot](https://bitroot.org/).
