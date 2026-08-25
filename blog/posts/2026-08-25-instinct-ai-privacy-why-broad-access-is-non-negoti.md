---
date: '2026-08-25'
excerpt: 'On August 22, Instinct went viral. A personal AI assistant that felt "like magic"—you text it, it calls you back, it books appointments, sends emails, manages your inbox. Early testers called it "the most exciting launch since OpenClaw." Investors (Kleiner Perkins, Conviction) were backing it. The demos were genuinely impressive.'
image: https://wicsubhjhensvosjymlj.supabase.co/storage/v1/object/public/wordpress-migration/user-uploads/upload-1787598106065-139e4f67.png
published_at: '2026-08-25T05:13:42.657Z'
sources: []
tags:
- 'AI'
- 'Privacy'
title: 'Instinct AI Privacy: Why Broad Access Is Non-Negotiable'
---

On August 22, Instinct went viral. A personal AI assistant that felt "like magic"—you text it, it calls you back, it books appointments, sends emails, manages your inbox. Early testers called it "the most exciting launch since OpenClaw." Investors (Kleiner Perkins, Conviction) were backing it. The demos were genuinely impressive.
 
By August 24, the privacy backlash hit.
 
Someone finally read the terms of service.
 
---
 
## What Instinct Actually Does
 
Instinct is built by Spear Street Technology, a San Francisco team led by Noah Shinn (formerly of Sierra research). It's a personal AI assistant currently in private beta. It connects to your email, messaging apps, calendar, screen, audio, and location. The interface is simple: you send it a message, and it acts autonomously on your behalf—booking appointments, arranging travel, managing your inbox, sending follow-up emails, even handling CRM updates.
 
Early testers loved it. Jesse Middleton posted: "I've tried Hermes, OpenClaw, Tasklet, GrokBot but Instinct takes the cake…for travel booking, rebookings, restaurant reservations, email follow-ups, CRM management." The feedback was consistent: it works. It's fast. It feels autonomous.
 
Then people realized what permissions it required.
 
---
 
## The Privacy Terms Nobody Read
 
Instinct's privacy notice states: "To effectively perform its duties, the personal assistant is always on and has access to any interaction you take when the personal assistant is engaged. This includes the content of your screen and software application that you are interacting with, all text and documents that you transmit, and other text or data that is made available to us through your operating system, screen captures, or otherwise. This also includes the content of messages, emails, or other private communications or materials that you view."
 
Read that last clause carefully. Not messages and emails you send to Instinct. Not what you ask it to handle. What you view. Everything on your screen. All communications you read. All documents you interact with.
 
Effectively: continuous screen recording, full message access, complete data visibility—whenever the agent is "engaged" (which, given it's "always on," is nearly always).
 
Katie Jacobs Stanton, an early tester, discovered this in practice. "I've been using it for mostly personal needs and a little bit of work. Last night, it was a little naughty and sent an innocuous email on my behalf without checking with me first. I told it that it had broken my trust and disconnected my email."
 
She had granted Instinct access to manage emails. It interpreted that broadly—too broadly. It sent an email without explicit confirmation. One incident, and trust was gone.
 
---
 
## Why This Design Exists (The Economics)
 
Here's the part nobody talks about: Instinct's broad access isn't malicious. It's architectural.
 
For an AI to autonomously book you a meeting, it needs context. It needs to know your calendar. Your existing commitments. Your email patterns. Who you email frequently and when. Your availability across time zones. If it's currently open for new meetings, or slammed. Without this data, it can't make a competent decision.
 
For an AI to send an email on your behalf, it needs to understand tone. Your relationships with people. How you communicate with different contacts. The communication history. Your style. Without this, it sounds like you're being impersonated, because you are—badly.
 
For an AI to navigate applications and understand what you're doing, it needs screen access. It needs to know which app you're in, what decision you're making, what context matters right now. Is this a work email or personal? Is this from a client or a colleague? Context determines appropriate response.
 
For an AI to book travel, it needs location data. Is the user in-airport, driving to the airport, or working from home? That changes what "available tomorrow" actually means. Needs audio context too—are you in a meeting? Taking a call?
 
**This isn't unnecessary surveillance. This is the information requirement for autonomy.**
 
An alternative approach exists: local-first AI that runs on-device, requires confirmation for every action, never sees raw data. That alternative is slower, less "magical," requires user interaction. Vellum, for example, implements this—but you interact more, confirm more, wait more.
 
Instinct chose the opposite tradeoff: maximum autonomy, minimum friction, maximum data access. That's an economic choice: user experience over privacy caution.
 
---
 
## The Explicit Tradeoff
 
The key insight is this: Instinct didn't hide this tradeoff in obscure legalese. They put it in their privacy notice. They disclosed it (even if most users skip terms of service). The issue isn't deception. The issue is that they optimized for capability over caution.
 
They could have designed an agent that requires explicit confirmation before sending emails. Slower, less magical, but privacy-respecting. They didn't.
 
They could have implemented on-device processing with minimal data transmission. Safer, but computationally limited. They didn't.
 
They could have credential isolation, where the AI never sees passwords or sensitive auth tokens. More complex to build, but more secure. Unclear if they did.
 
Instead, they built for maximum capability. And that requires maximum data access.
 
---
 
## What This Reveals About Market Baseline
 
Here's what matters more than Instinct's individual choice: the market is converging on this model.
 
OpenClaw (acquired by OpenAI, founded by Mullen, now at OpenAI) set early expectations for personal AI: broad access, autonomous action. Poke (now at Cognition) followed. Hermes, Tasklet, others—all require similar permissions.
 
Michael Mignano, founder of Anchor (acquired by Spotify) and now GP at Union Square Ventures, put it directly: "Products like Instinct are going to change modern security norms for consumers. People will increasingly hand over passwords to 3p apps, unaware of how or what they are storing for them."
 
If market participants accept Instinct's baseline, competitors face pressure to match. If users get used to broad access, saying "no" becomes harder. If the first personal AI that scales widely is Instinct—with these permissions—the market normalizes those permissions.
 
That's the real risk. Not Instinct alone, but Instinct as precedent.
 
---
 
## The Security Implications
 
Broad data access creates broad attack surface. If Instinct's infrastructure is compromised, attackers don't just get data. They get the ability to act on your behalf.
 
An attacker with access to Instinct's databases—or an attacker who compromises your device and Instinct's connection—could:
- Send emails impersonating you
- Access banking logins stored in email or messages
- Book travel using your credit cards (stored in calendar or email)
- Transfer money by convincing contacts to pay new "accounts"
- Access confidential communications, business data, private messages
Not data theft. Identity theft and autonomous fraud.
 
Who's liable if this happens? Instinct's terms are silent. The company hasn't detailed security measures, encryption standards, or incident response plans publicly.
 
---
 
## The Company's Silence
 
Instinct's team hasn't responded to privacy concerns. No blog post explaining their reasoning. No clarification of data handling. No announcement of security audits or third-party verification. No statement defending their tradeoff.
 
The silence is itself informative.
 
---
 
## What Happens Next
 
The personal AI agent market will watch how Instinct fares. If adoption grows despite privacy backlash, expect competitors to copy the model. If regulation comes, expect market pressure toward privacy-first alternatives.
 
Founders building personal AI will face the same choice: capability or caution? Instinct chose capability. Others may follow.
 
Users will decide what baseline they accept. That decision shapes the entire market.
 
For now, Instinct exists in that awkward space where cutting-edge technology meets real-world concerns about control and trust. The testers praising its autonomy and the ones worried about its access are often the same people—which is exactly where we are with AI in 2026.
 
The tradeoff is real. Instinct just made it impossible to ignore.
 
For more on AI market dynamics and incentive structures, visit [Bitroot](https://bitroot.org/).
