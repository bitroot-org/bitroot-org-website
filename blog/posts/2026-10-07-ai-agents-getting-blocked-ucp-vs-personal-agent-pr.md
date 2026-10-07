---
date: '2026-10-07'
excerpt: 'Amazon blocks Meta''s Muse, airlines refuse agent bookings, and websites use anti-bot measures that accidentally lock out legitimate AI assistants. Here''s why—and which protocol founders should integrate with.'
image: https://techcrunch.com/wp-content/uploads/2026/10/ai-agent-bots-GettyImages-2243729307.jpg?resize=1200,800
published_at: '2026-10-07T06:24:15.517Z'
sources:
- '- [TechCrunch: The next hurdle for AI agents: getting websites to let them in](https://techcrunch.com/2026/10/06/the-next-hurdle-for-ai-agents-getting-websites-to-let-them-in/)'
- '- [PYMNTS: Meta and Sierra Build Standard for How Personal Agents Interact with Businesses](https://www.pymnts.com/news/artificial-intelligence/2026/meta-and-sierra-build-standard-for-how-personal-agents-interact-with-businesses/)'
- '- [Universal Commerce Protocol (UCP): Complete 2026 Guide](https://almcorp.com/blog/universal-commerce-protocol-agentic-commerce-guide-2026/)'
- '- [AI Agents Face Website Blockades as Retailers and Airlines Restrict Access](https://www.kucoin.com/news/flash/ai-agents-face-website-blockades-as-retailers-and-airlines-halt-access)'
- '- [Meta Muse blocked by Amazon: the AI shopping agent fight'
- 'explained](https://dev.to/axrisi/meta-muse-blocked-by-amazon-the-ai-shopping-agent-fight-explained-3agp)'
- '- [Amazon'
- 'Meta'
- 'Microsoft'
- 'Salesforce and Stripe join UCP Tech Council](https://ppc.land/amazon-meta-microsoft-salesforce-and-stripe-join-ucp-tech-council/)'
- '- [Developer Guide to Agentic Commerce](https://www.descope.com/blog/post/developer-guide-agentic-commerce)'
- '- [Meta Muse AI Agent: Inside Permissions'
tags:
- 'AI agents'
- 'agentic commerce'
- 'e-commerce'
- 'protocol standards'
- 'founder growth'
title: 'AI Agents Getting Blocked: UCP vs Personal Agent Protocol for Founders'
---

Meta's Muse AI agent hit 5 million downloads by September 2026. Then Amazon blocked it from buying anything. Delta and United won't let it book flights. Yelp, eBay, Zillow—most major consumer websites either explicitly reject agents or accidentally lock them out with standard anti-bot security. For founders building AI agents, the question isn't whether this is happening. It's what to do about it. Two competing open standards are emerging to solve this: Google's Universal Commerce Protocol (UCP), already live with 6 founding members and 20+ retail partners, and a Personal Agent Protocol (PAP) from eight collaborating companies (Meta, Sierra, Shopify, Stripe, Walmart, Genesys, Instinct, Rocket), launching end of October. Most major retailers are supporting both, suggesting convergence rather than competition.
 
## What Changed + Why Websites Are Blocking Now
 
For the last 18 months, most websites treated agents like bots—because they acted like bots. They scraped HTML, parsed DOM structures, mimicked human clicks, and triggered the same anti-abuse systems that catch credential-stuffing attacks and inventory scrapers. From a website's perspective, there was no difference between a legitimate agent trying to book a flight and a malicious script trying to scalp tickets.
 
But the real reason sites are blocking agents now isn't technology—it's business strategy. Amazon explicitly blocks Muse because Amazon wants to own the agent experience. If Muse books an Amazon order, Amazon has no visibility into why the purchase was made, no opportunity to cross-sell, no control over the transaction flow. The transaction happens "behind" the agent, not on Amazon's platform. For Amazon, this means lost data, lost upsell moments, and lost relationship with the customer.
 
So websites face a choice: keep blocking agents (easy, existing security works), grant API access to everyone who asks (dangerous, loses data), or join an open standard where they define exactly what agents can do. That's where two competing protocols enter: Google's Universal Commerce Protocol (UCP) for shopping, and a broader Personal Agent Protocol (PAP) from eight companies collaborating on cross-domain access.
 
## Real Data + Standards Emerging
 
**Google's Universal Commerce Protocol (UCP):**
UCP launched January 11, 2026 at the National Retail Federation conference. It's the most mature of the two standards. Google co-developed it with Shopify as co-developers. Six founding members joined at launch: Google, Shopify, Etsy, Wayfair, Target, and Walmart. The initial announcement also secured endorsement from 20+ additional retail partners. In April 24, 2026, the UCP Tech Council expanded to include Amazon, Meta, Microsoft, Salesforce, and Stripe—a governance body that steers the protocol's evolution. The protocol covers the entire shopping journey: product discovery, price comparison, order placement, payment, tracking, and returns. Retailers implement UCP once and become accessible to ChatGPT, Gemini, Claude, and any future AI platform simultaneously—solving what's called the "N x N integration problem."
 
**Personal Agent Protocol (PAP):**
Announced in September 2026, PAP is being developed by eight collaborating companies: Sierra, Meta, Genesys, Instinct, Rocket, Shopify, Stripe, and Walmart. Rather than focusing narrowly on e-commerce like UCP, PAP is designed to handle both shopping and broader business scenarios—not just shopping, but banking, travel booking, customer service, any interaction between an agent and a business. Sierra co-founders Bret Taylor and Clay Bavor are leading development. The v0.1 specification is set to launch by end of October 2026. The protocol emphasizes "consumer control": the person whose agent is acting maintains permission over what the agent can access. Businesses define boundaries (what agents can't do), and agents get a consistent method to connect and request access.
 
UCP and PAP are not incompatible; both are expected to coexist. Interestingly, Shopify, Stripe, and Walmart are building both UCP and PAP support simultaneously, suggesting the protocols may eventually converge rather than compete. OpenAI and Stripe's competing Agentic Commerce Protocol (ACP) also continues operating. The landscape is fragmenting in the short term, but shared participants may drive consolidation over time.
 
## When Each Standard Wins for Founders
 
**UCP wins if:** Your agent focuses on shopping and comparison tasks (product search, price checks, order placement, returns). UCP has the largest coalition of retailers already live, meaning your agent can immediately execute on Amazon, Target, Walmart, Shopify stores, and hundreds of smaller merchants. UCP prioritizes the shopping journey specifically, making it easier to implement for commerce-focused agents. The governance includes Amazon, meaning you have clarity on how the largest e-commerce player will behave. Downside: UCP is currently retail-focused; other business domains (travel, banking, customer service) are secondary.
 
**PAP wins if:** Your agent handles multiple business domains beyond shopping—travel booking, appointment scheduling, customer service, financial transactions. PAP is designed to be domain-agnostic, letting agents interact with any business using the same protocol. The spec's emphasis on consumer permissions aligns better with privacy-conscious use cases. Downside: PAP launches end of October, so real-world adoption is unknown. You're betting on the coalition of eight companies (Meta, Sierra, Shopify, Stripe, Walmart, etc.) to drive merchant participation. Note: Shopify, Stripe, and Walmart participate in both UCP and PAP, so the protocols may converge rather than compete.
 
**Proprietary APIs win if:** You're integrating with a single large partner (e.g., building an agent for Stripe users or Shopify stores exclusively). A direct API partnership is faster to implement and gives you better data access than a standard protocol. You don't need to support multiple retailers or multiple business types. Downside: Your agent's reach is capped; you can't cross-sell across platforms.
 
**Web scraping (via proxy services) wins if:** Your agent's target websites haven't joined either protocol yet. Services like Zyte and ScrapingBee handle anti-bot detection, rotate IPs, and solve CAPTCHAs. This is a temporary bridge while standards adoption spreads. Downside: Websites increasingly block this explicitly; you're in a constant arms race with security teams.
 
## Cost Breakdown + Implementation Reality
 
**UCP Integration:**
Development time: 2-4 weeks for a single-merchant pilot, scaling to 3-6 weeks for multi-merchant support. You're implementing a standardized API spec, so much of the logic is reusable. Direct costs are low—UCP documentation is public, and integrations are supported through Google's Merchant Center. Infrastructure costs depend on volume: most UCP implementations run on managed services (AWS Lambda, Google Cloud Functions) at $500-2000/month for typical agent traffic.
 
**PAP Integration:**
Development time: Similar to UCP (2-4 weeks initially), but since PAP is fresher and tooling is minimal, expect 1-2 weeks debugging early specification issues. Once the v0.1 spec stabilizes and SDKs are available, time will drop. Direct costs are also minimal—Meta hasn't announced expensive developer programs. Infrastructure costs will be similar to UCP once adoption scales.
 
**Hybrid (both UCP + PAP):**
Most production agents will support both protocols within 6 months. The implementation time is not the sum—once you've built one protocol integration, the second is 40% of the first effort because you reuse the permission-checking logic, transaction handling, and error recovery. Total development cost: 4-8 weeks. Infrastructure: 2-3x single-protocol cost (you're running parallel integrations and need to handle protocol negotiation), adding $1000-5000/month depending on volume.
 
**Proprietary partnerships:**
Direct negotiation with retailers (Amazon, Target, etc.) can require legal review, custom SLAs, and dedicated support. Cost: $10,000-50,000 in setup, then revenue-sharing agreements or flat fees ($500-5000/month). Faster to implement for single partners (days to weeks), but inflexible for scaling.
 
For most early-stage founders, starting with UCP (most retailers, live now) and adding PAP support before Q1 2027 makes sense. This gives you access to the largest e-commerce audience immediately while keeping PAP-specific opportunities open as adoption accelerates.
 
## Honest Assessment: The Gotchas
 
UCP adoption by retailers is real but uneven. Target and Walmart actively promote agentic shopping; smaller retailers haven't implemented yet. If your agent needs to handle boutique or niche products, UCP alone won't reach them. You'll need fallback web scraping or outbound links.
 
PAP's governance is more transparent than UCP's (which is Google-led), but transparency doesn't guarantee adoption. Meta's influence is strong in AI, not in retail operations. If Shopify, Amazon, and Target decide PAP is unnecessary—they already have UCP—PAP becomes a secondary network. This is possible but not probable.
 
Merchant control cuts both ways. Retailers can set strict limits on what agents can do—some may require agents to add 10% markup, or route orders through affiliate links, or collect first-party data. This erodes the "neutral shopper" experience your agent promises.
 
Most importantly, standards only work if merchants actually implement them. A retailer can claim UCP support but only expose 10% of inventory to agents, or charge agents higher API rates, or block agents during peak traffic. The protocol prevents technical blockades, not business blockades.
 
## Decision Framework: Which Protocol to Build On
 
**Question 1: Is e-commerce the primary use case?**
If yes, start with UCP (live, largest coalition). If no (travel, banking, services, customer service), wait for PAP (Oct 31) or build on both in parallel.
 
**Question 2: Do you have existing retailer partnerships?**
If yes (already negotiated with Shopify, Walmart, Target, etc.), note that major retailers support BOTH UCP and PAP, so you'll likely need multi-protocol support. If no, start with UCP (6 founding members + 20+ endorsers active now).
 
**Question 3: How much implementation time do you have?**
If less than 4 weeks, start with UCP only (mature tooling, documented patterns). If 6+ weeks available, build UCP first (shipping now) and add PAP support after v0.1 stabilizes in November-December.
 
**Question 4: Are you targeting niche/boutique merchants or mainstream retailers?**
If mainstream (Amazon, Target, Costco), UCP handles most. If niche, plan for web scraping fallback or proprietary partnerships for each major player.
 
**Next step:** Use the [AI Agent Website Access implementation checklist](https://bitroot.org/guides/ai-agents-website-access-permissions-blocks-2026/) to evaluate your actual options before committing to a protocol. Walk through four questions: 
(1) Does your target retailer expose an official API? 
(2) Can you negotiate direct partnership access? 
(3) Which managed service fits your volume? 
(4) Does DIY make sense at your scale? 

The guide shows why managed solutions ($150-500/month, 80-90% success) beat DIY resistance ($400+/month + engineering overhead) for most founders—unless you're hitting 5M+ requests/month.
