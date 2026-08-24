---
date: '2026-08-24'
excerpt: 'Anthropic won on fair use, Ross Intelligence didn''t. The difference: whether your AI product competes with the market its training data came from.'
image: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZiyWll9kiPV6zs704tdHeyqiESJZbtR6AmWBCmcoOpw&s=10
published_at: '2026-08-24T07:57:25.339Z'
sources: []
tags:
- 'Copyright'
title: 'AI Copyright Fair Use 2026: What Founders Should Know'
---

A federal judge ruled last year that training an AI model on copyrighted books can be fair use. Anthropic still paid $1.5 billion. Not for training on the books, but for how it got some of them: pirated copies from shadow libraries, not purchases, in a case where authors alleged Anthropic illegally copied their books. Judge William Alsup separated the two questions cleanly. Training is one thing. Piracy is another. He compared an LLM ingesting trillions of words to a writer studying literature, learning from it rather than replicating it.
 
That distinction is now the backbone of AI copyright law in the US. But it's not the only one that matters if you're building a product on top of someone else's content. The second, less talked-about test decides whether your specific use survives a lawsuit even when the training itself was clean.
 
## What the Anthropic Ruling Actually Decided
 
Anthropic's win rested on the first fair use factor: purpose and character of the use. Training a model to generate new text is transformative, not reproductive. A companion ruling against Meta reached the same conclusion days later, with the court finding that training a language model on books served a new purpose rather than replicating or distributing the works.
 
Neither ruling gave AI companies a blanket pass. Both judges made clear that transformative purpose is one factor among several, and courts weigh it against the others case by case.
 
## The Fourth Factor Is Where Cases Actually Get Decided
 
Fair use has four factors, but the one that swings outcomes is the fourth: effect on the market for the original work. This is where Thomson Reuters beat Ross Intelligence. Ross trained an AI legal research tool on Westlaw's headnotes, and the court found Ross's tool competed directly with Westlaw's own research service, which put it on the losing side of the same factor that let Anthropic win.
 
The Copyright Office's own framing backs this up: the clearest form of market harm is when AI output substitutes directly for the original work and causes lost sales. Courts have also started weighing a subtler version of this: whether AI-generated content floods a market with enough volume to dilute demand for the human-made originals it learned from, even without copying anything word for word.
 
So the pattern across Bartz, Kadrey, and Ross is consistent. Transformative training gets you through the first factor. Whether your product competes with the market your data came from decides the fourth, and the fourth is usually what decides the case.
 
## What This Means If You're Building on Someone Else's Content
 
Most SaaS founders aren't training foundation models. But plenty are fine-tuning on scraped content, building retrieval systems over someone else's articles, or shipping AI features that generate content in the same category as what they trained on. The legal exposure isn't just "did I use copyrighted data." It's "does my output replace the thing I trained on, in the market that thing sells in."
 
An AI tool that summarizes legal research to help lawyers work faster sits in different territory than one that replaces the research product itself. An AI writing assistant that helps a blogger draft faster is different from one that generates blog content wholesale and undercuts the blogs it learned from. Same training data category, different market position, different legal exposure.
 
## The Line Isn't Settled Yet
 
None of this is fixed law. Judges are actively disagreeing with each other, and appeals are pending. One judge in the Meta case called a rival judge's market-harm analogy "inapt," and openly stated that unchecked market dilution could tip almost any AI training case against the defendant once evidence catches up. The law here is still being written case by case, not codified.
 
For founders, that uncertainty is itself the practical takeaway. Document where your training or fine-tuning data comes from, understand which market your product's output lands in relative to that data, and build with the assumption that "direct substitution" is the test regulators and courts keep coming back to. The incentive shaping this entire body of law is the same one shaping the rest of the AI industry right now: whoever controls the market gets to define what counts as harm to it.
