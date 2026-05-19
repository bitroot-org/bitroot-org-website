// Typed content for the /legal/* pages. Strings may contain inline
// <strong>, <em>, and <a href=...> — these are rendered via
// dangerouslySetInnerHTML in the block renderer. Content is curated
// (not user input), so no sanitization here.

export type LegalBlock =
  | { type: "p"; body: string; lead?: boolean }
  | { type: "h3"; body: string; id?: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[]; start?: number }
  | { type: "kv"; rows: { key: string; value: string }[] }
  | { type: "callout"; tone?: "note" | "warn"; body: string };

export type LegalSection = {
  number: string; // computed at render time but stored to allow custom numbers
  id: string;
  title: string;
  summary?: string; // plain-English one-liner
  blocks: LegalBlock[];
};

export type LegalSlug = "privacy" | "terms" | "refund";

export type LegalDoc = {
  slug: LegalSlug;
  title: string;
  shortTitle: string;
  kicker: string;
  tagline: string; // hero plain-English intro
  effective: string; // ISO date
  intro: LegalBlock[];
  sections: LegalSection[];
  contact: {
    email: string;
    postal: string;
  };
};

const sharedContact = {
  email: "contact.bitroot@gmail.com",
  postal:
    "149, Avior, Nirmal Galaxy, L B S Marg, Mulund West, 400080, Mumbai, MH, India",
};

// ─────────────────────────────────────────────────────────────────────
// PRIVACY POLICY
// ─────────────────────────────────────────────────────────────────────

const privacy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  shortTitle: "Privacy",
  kicker: "~/ legal / privacy",
  tagline:
    "What we collect, why we collect it, and how to ask us to stop. We try to keep the lawyer-speak below to what we actually need — and explain the rest in plain English at the top of each section.",
  effective: "2024-12-10",
  intro: [
    {
      type: "p",
      lead: true,
      body: "Welcome to Bitroot’s privacy policy.",
    },
    {
      type: "p",
      body: 'The platform, available at <a href="https://www.bitroot.org/">bitroot.org</a>, <a href="https://bitroot.club">bitroot.club</a>, and <a href="https://www.bitroot.in">bitroot.in</a> (each, a “Platform”), is owned and operated by <strong>Bitroot</strong>, a company registered under the laws of India with its registered office at 149, Avior, Nirmal Galaxy, L B S Marg, Mulund West 400080, Mumbai, MH (“Company”, “us”, “we”, “our”).',
    },
    {
      type: "p",
      body: "We respect your privacy and are committed to protecting your personal data. This policy describes how we look after your personal data when you visit our Platform (regardless of where you visit from) and tells you about your privacy rights and how the law protects you.",
    },
    {
      type: "p",
      body: "It is provided in a layered format — click through to the section you care about below. The Glossary at the end explains terms used throughout.",
    },
  ],
  sections: [
    {
      number: "01",
      id: "who-we-are",
      title: "Important information and who we are",
      summary:
        "Who runs Bitroot, how to reach our Legal Department, and when this policy changes.",
      blocks: [
        { type: "h3", body: "Purpose of this privacy policy" },
        {
          type: "p",
          body: "This policy aims to give you information on how we collect and process your personal data through your use of this Platform — including any data you provide when you sign up to our newsletter, create an account, purchase a product or service, or take part in a competition or promotion.",
        },
        {
          type: "p",
          body: "This Platform is not intended for children. We do not knowingly collect data relating to children under the age of 16. If you are under 16, do not use or provide any information on this Platform. If we become aware of an under-16 user, the account will be suspended without notice and the information deleted.",
        },
        {
          type: "p",
          body: "Read this policy together with any other privacy notice we provide on specific occasions so that you are fully aware of how and why we are using your data. This policy supplements, but does not override, those notices.",
        },
        { type: "h3", body: "Controller" },
        {
          type: "p",
          body: "Bitroot is made up of different legal entities. This privacy policy is issued on behalf of bitroot.org, so when we mention “Company”, “we”, “us” or “our”, we are referring to the relevant company in the Bitroot.org Group responsible for processing your data. We will tell you which entity is the controller when you purchase a product or service.",
        },
        {
          type: "p",
          body: "Our Legal Department oversees questions in relation to this policy. If you have any questions or wish to exercise your legal rights, please contact us at the details below.",
        },
        { type: "h3", body: "Contact details" },
        {
          type: "kv",
          rows: [
            { key: "Legal entity", value: "Bitroot" },
            { key: "Email", value: "privacy@bitroot.org" },
            {
              key: "Postal",
              value:
                "149, Avior, Nirmal Galaxy, L B S Marg, Mulund West, 400080, Mumbai, MH",
            },
          ],
        },
        { type: "h3", body: "Changes to this policy" },
        {
          type: "p",
          body: "We keep our privacy policy under regular review. Historic versions can be obtained by contacting us. The effective date at the top of this page reflects the latest revision.",
        },
        {
          type: "p",
          body: "It is important that the personal data we hold about you is accurate and current. Please keep us informed if your personal data changes during your relationship with us.",
        },
        { type: "h3", body: "Third-party links" },
        {
          type: "p",
          body: "This Platform may include links to third-party websites, plug-ins, and applications. Clicking those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our Platform, we encourage you to read the privacy policy of every website you visit.",
        },
      ],
    },
    {
      number: "02",
      id: "data-we-collect",
      title: "The data we collect about you",
      summary:
        "The categories of personal data we may collect, store, or transfer.",
      blocks: [
        {
          type: "p",
          body: "<em>Personal data</em>, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).",
        },
        {
          type: "p",
          body: "We may collect, use, store, and transfer different kinds of personal data about you, grouped as follows:",
        },
        {
          type: "ul",
          items: [
            "<strong>Identity Data</strong> — first name, maiden name, last name, username or similar identifier, marital status, title, date of birth, gender.",
            "<strong>Contact Data</strong> — billing address, delivery address, email address, telephone numbers.",
            "<strong>Financial Data</strong> — bank account and payment card details.",
            "<strong>Transaction Data</strong> — details about payments to and from you and other details of products and services you have purchased from us.",
            "<strong>Technical Data</strong> — IP address, login data, browser type and version, time zone, location, browser plug-in types and versions, operating system, and other technology on the devices you use to access this Platform.",
            "<strong>Profile Data</strong> — username and password, purchases, interests, preferences, feedback, and survey responses.",
            "<strong>Usage Data</strong> — information about how you use our Platform, products, and services.",
            "<strong>Marketing and Communications Data</strong> — your preferences in receiving marketing from us and our third parties, and your communication preferences.",
          ],
        },
        {
          type: "p",
          body: "We also collect, use, and share <strong>Aggregated Data</strong> such as statistical or demographic data for any purpose. Aggregated Data could be derived from your personal data but is not considered personal data in law, as it does not directly or indirectly reveal your identity. If we combine Aggregated Data with your personal data so that it can identify you, we treat the combined data as personal data.",
        },
        {
          type: "p",
          body: "We do not collect any <strong>Special Categories of Personal Data</strong> (race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions, trade union membership, health, genetic or biometric data). Nor do we collect information about criminal convictions or offences.",
        },
        { type: "h3", body: "If you fail to provide personal data" },
        {
          type: "p",
          body: "Where we need to collect personal data by law, or under the terms of a contract with you, and you fail to provide it when requested, we may not be able to perform the contract with you. In that case we may have to cancel a product or service, and will notify you if so.",
        },
      ],
    },
    {
      number: "03",
      id: "how-collected",
      title: "How your personal data is collected",
      summary: "Direct interactions, automated technologies, and third parties.",
      blocks: [
        {
          type: "p",
          body: "We use different methods to collect data from and about you, including:",
        },
        { type: "h3", body: "Direct interactions" },
        {
          type: "p",
          body: "You may give us your Identity, Contact, and Financial Data by filling in forms or corresponding with us by post, phone, email, or otherwise. This includes personal data you provide when you:",
        },
        {
          type: "ol",
          items: [
            "Apply for or request our products or services.",
            "Create an account on our Platform.",
            "Subscribe to our service or publications.",
            "Request marketing to be sent to you.",
            "Enter a competition, promotion, or survey.",
            "Give us feedback or contact us.",
          ],
        },
        { type: "h3", body: "Automated technologies or interactions" },
        {
          type: "p",
          body: 'As you interact with our Platform, we automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this personal data using cookies, server logs, and similar technologies. We may also receive Technical Data about you if you visit other websites employing our cookies. For more, see our <a href="https://www.bitroot.org/cookie-policy">cookie policy</a>.',
        },
        { type: "h3", body: "Third parties or publicly available sources" },
        {
          type: "p",
          body: "We will receive personal data about you from third parties and public sources as set out below:",
        },
        {
          type: "ol",
          items: [
            "Technical Data from analytics providers, advertising networks, and search information providers.",
            "Contact, Financial, and Transaction Data from providers of technical, payment, and delivery services.",
            "Identity and Contact Data from data brokers or aggregators.",
            "Identity and Contact Data from publicly available sources.",
          ],
        },
      ],
    },
    {
      number: "04",
      id: "how-we-use",
      title: "How we use your personal data",
      summary:
        "The legal bases we rely on — contract, legitimate interests, legal obligation, and consent.",
      blocks: [
        {
          type: "p",
          body: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:",
        },
        {
          type: "ul",
          items: [
            "Where we need to perform the <strong>contract</strong> we are about to enter into or have entered into with you.",
            "Where it is necessary for our <strong>legitimate interests</strong> (or those of a third party) and your interests and fundamental rights do not override those interests.",
            "Where we need to comply with a <strong>legal obligation</strong>.",
          ],
        },
        {
          type: "p",
          body: "Generally we do not rely on consent as a legal basis for processing your personal data, although we will get your consent before sending third-party direct marketing communications to you via email or text. You have the right to withdraw consent to marketing at any time by contacting us.",
        },
        {
          type: "p",
          body: "Where required by law, we will obtain your consent to use and process your personal data. Otherwise we rely on another authorised legal basis: (a) contract, (b) legitimate interests, and/or (c) legal obligation.",
        },
        { type: "h3", body: "Purposes for which we will use your personal data" },
        {
          type: "p",
          body: "We may process your personal data for more than one lawful ground depending on the specific purpose. Please contact us if you need details about the specific legal ground we are relying on where more than one applies.",
        },
        { type: "h3", body: "Promotional offers from us" },
        {
          type: "p",
          body: "We may use your Identity, Contact, Technical, Usage, and Profile Data to form a view on what we think you may want or need. This is how we decide which products, services, and offers may be relevant for you. You will receive marketing communications from us if you have requested information from us or purchased from us, and have not opted out.",
        },
        { type: "h3", body: "Third-party marketing" },
        {
          type: "p",
          body: "We will get your express opt-in consent before sharing your personal data with any third party for marketing purposes.",
        },
        { type: "h3", body: "Opting out" },
        {
          type: "p",
          body: 'You can ask us or third parties to stop sending you marketing messages at any time by following the opt-out links on any marketing message. You can also opt out by emailing <a href="mailto:privacy@bitroot.org">privacy@bitroot.org</a>. Opting out does not apply to data provided as a result of a product/service purchase, warranty, or other transaction.',
        },
        { type: "h3", body: "Cookies" },
        {
          type: "p",
          body: 'You can prevent the setting of cookies by adjusting the settings on your browser (see your browser’s Help section). If you disable cookies, some parts of this Platform may become inaccessible or not function properly. For more about the cookies we use, see <a href="https://www.bitroot.org/cookie-policy">our cookie policy</a>.',
        },
        { type: "h3", body: "Change of purpose" },
        {
          type: "p",
          body: "We will only use your personal data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose. If we need to use your personal data for an unrelated purpose, we will notify you and explain the legal basis which allows us to do so.",
        },
      ],
    },
    {
      number: "05",
      id: "disclosures",
      title: "Disclosures of your personal data",
      summary:
        "Who we may share your data with, and the rules we hold them to.",
      blocks: [
        {
          type: "p",
          body: "We may share your personal data with the parties set out below for the purposes described in this policy.",
        },
        {
          type: "ul",
          items: [
            "Internal Third Parties — other companies in the Bitroot.org Group acting as joint controllers or processors.",
            "External Third Parties — service providers, professional advisers, regulators, contest sponsors, advertising networks, and similar.",
            "Third parties to whom we may choose to sell, transfer, or merge parts of our business or assets. If a change happens, the new owners may use your personal data in the same way set out in this policy.",
          ],
        },
        {
          type: "p",
          body: "We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your data for specified purposes and in accordance with our instructions.",
        },
        {
          type: "p",
          body: "We may disclose your personal information to third parties where required by law or regulation, or to protect the Company and/or other customers (only to the extent legally permitted).",
        },
      ],
    },
    {
      number: "06",
      id: "international-transfers",
      title: "International transfers",
      summary:
        "We may transfer data outside the EEA or UK with appropriate safeguards.",
      blocks: [
        {
          type: "p",
          body: "We share your personal data within the Bitroot.org Group, which may involve transferring your data outside the European Economic Area (EEA) or the UK.",
        },
        {
          type: "p",
          body: "Many of our external third parties are based outside the EEA or UK, so their processing of your personal data will involve a transfer outside the EEA or UK.",
        },
        {
          type: "p",
          body: "Whenever we transfer your personal data out of the EEA or UK, we ensure a similar degree of protection by relying on at least one of the following safeguards:",
        },
        {
          type: "ul",
          items: [
            'Transferring to countries deemed to provide an adequate level of protection — see <a href="https://ec.europa.eu/info/law/law-topic/data-protection/data-transfers-outside-eu/adequacy-protection-personal-data-non-eu-countries_en"><em>European Commission: Adequacy of the protection of personal data in non-EU countries</em></a>.',
            'Using contracts approved by the European Commission, or by the UK, which give personal data the same protection as in Europe — see <a href="https://ec.europa.eu/info/strategy/justice-and-fundamental-rights/data-protection/data-transfers-outside-eu/model-contracts-transfer-personal-data-third-countries_en"><em>Model contracts for the transfer of personal data to third countries</em></a>.',
          ],
        },
        {
          type: "p",
          body: "Please contact us if you want further information on the specific mechanism we use when transferring your personal data out of the EEA or UK.",
        },
      ],
    },
    {
      number: "07",
      id: "data-security",
      title: "Data security",
      summary: "How we protect your data and the role of our payment processor.",
      blocks: [
        {
          type: "p",
          body: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way, altered, or disclosed. We limit access to your personal data to employees, agents, contractors, and other third parties who have a business need to know. They will only process your personal data on our instructions, and are subject to a duty of confidentiality.",
        },
        {
          type: "p",
          body: "We have procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where legally required.",
        },
        {
          type: "p",
          body: "All personal information you provide to us is stored on our secure servers. Any payment information or transaction is encrypted.",
        },
        {
          type: "callout",
          tone: "note",
          body: 'Payments for our services and subscriptions (including Platter) are processed by <strong>Razorpay</strong>, our third-party payment gateway, for both domestic (INR) and international (USD) transactions. Bitroot does not store your payment card details. All payment information is handled securely by Razorpay in accordance with their privacy and security policies. See <a href="https://razorpay.com/privacy/">Razorpay’s Privacy Policy</a>.',
        },
        {
          type: "p",
          body: "The security of your personal information depends on you and your habits. If we give you a password, you are responsible for keeping it confidential. Be careful about giving out information in public spaces — information you share publicly may be viewed by other users of this Platform.",
        },
      ],
    },
    {
      number: "08",
      id: "data-retention",
      title: "Data retention",
      summary: "How long we keep your data, and why.",
      blocks: [
        { type: "h3", body: "How long will we use my personal data?" },
        {
          type: "p",
          body: "We will only retain your personal data for as long as reasonably necessary to fulfil the purposes for which we collected it — including satisfying any legal, regulatory, tax, accounting, or reporting requirements. We may retain your personal data for a longer period in the event of a complaint, or where we reasonably believe there is a prospect of litigation.",
        },
        {
          type: "p",
          body: "To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the data, the potential risk of harm from unauthorised use or disclosure, the purposes for which we process the data, and whether we can achieve those purposes through other means.",
        },
        {
          type: "p",
          body: "For more information on retention periods, please contact us. In some circumstances you can ask us to delete your data — see <em>Your legal rights</em> below.",
        },
        {
          type: "p",
          body: "Anonymised data is not personal data. In some circumstances we will anonymise your personal data (so it can no longer be associated with you) for research or statistical purposes, in which case we may use this information indefinitely without further notice.",
        },
      ],
    },
    {
      number: "09",
      id: "your-rights",
      title: "Your legal rights",
      summary:
        "Access, correction, erasure, restriction, transfer, objection, and consent withdrawal.",
      blocks: [
        {
          type: "p",
          body: "Under certain circumstances you have rights under data protection laws in relation to your personal data:",
        },
        {
          type: "ul",
          items: [
            "<em>Request access</em> to your personal data — a copy of what we hold about you, and confirmation we are processing it lawfully.",
            "<em>Request correction</em> of personal data we hold about you — we may need to verify the accuracy of the new data.",
            "<em>Request erasure</em> of your personal data where there is no good reason for us to continue processing it.",
            "<em>Object to processing</em> where we are relying on a legitimate interest or for direct marketing purposes.",
            "<em>Request restriction</em> of processing — to suspend processing in certain scenarios.",
            "<em>Request the transfer</em> of your personal data to you or to a third party in a structured, machine-readable format.",
            "<em>Withdraw consent</em> at any time where we are relying on consent.",
          ],
        },
        {
          type: "p",
          body: "If you wish to exercise any of these rights, please contact us.",
        },
        { type: "h3", body: "No fee is usually required" },
        {
          type: "p",
          body: "You will not have to pay a fee to access your personal data or to exercise any of the other rights. However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive — or refuse to comply in those circumstances.",
        },
        { type: "h3", body: "What we may need from you" },
        {
          type: "p",
          body: "We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal data. This is a security measure to ensure that personal data is not disclosed to anyone who has no right to receive it.",
        },
        { type: "h3", body: "Time limit to respond" },
        {
          type: "p",
          body: "We try to respond to all legitimate requests within one month. Occasionally it could take longer if your request is particularly complex or you have made a number of requests — we will notify you and keep you updated.",
        },
      ],
    },
    {
      number: "10",
      id: "glossary",
      title: "Glossary",
      summary: "The legal terms used above, explained.",
      blocks: [
        { type: "h3", body: "Lawful basis" },
        {
          type: "p",
          body: "<strong>Legitimate Interest</strong> — the interest of our business in conducting and managing our business to give you the best service and the most secure experience. We consider and balance any potential impact on you (both positive and negative) and your rights before processing your personal data for our legitimate interests.",
        },
        {
          type: "p",
          body: "<strong>Performance of Contract</strong> — processing your data where it is necessary for the performance of a contract you are a party to, or to take steps at your request before entering into such a contract.",
        },
        {
          type: "p",
          body: "<strong>Comply with a legal obligation</strong> — processing your personal data where necessary for compliance with a legal obligation we are subject to.",
        },
        { type: "h3", body: "Third parties" },
        {
          type: "p",
          body: "<strong>Internal Third Parties</strong> — other companies in the Bitroot.org Group acting as joint controllers or processors and based in India and the United States, providing IT and system administration services and leadership reporting.",
        },
        {
          type: "p",
          body: "<strong>External Third Parties</strong> include:",
        },
        {
          type: "ul",
          items: [
            "Service providers acting as processors who provide IT and system administration, credit card processing, research and analytics, marketing, customer support, and data enrichment.",
            "Professional advisers (lawyers, bankers, auditors, insurers) who provide consultancy, banking, legal, insurance, and accounting services.",
            "Regulators and authorities acting as processors or joint controllers, where reporting of processing activities is required.",
            "Contest and promotion sponsors whose contests or promotions you register for.",
            "Event sponsors who host events you attend or download an asset from. Your information would then be subject to the sponsors’ privacy statements.",
            "Third-party networks (social media networks, advertising networks) that enable us to market on third-party platforms.",
            "Third parties involved in a corporate transaction (merger, reorganisation, sale of assets) — we will use reasonable endeavours to notify you of any transfer of personal data to an unaffiliated third party.",
          ],
        },
        {
          type: "p",
          body: "We may also share anonymous or de-identified usage data with our service providers, and on an aggregate basis in the normal course of operating our business — for example, to show trends about the general use of our services.",
        },
      ],
    },
  ],
  contact: { email: "privacy@bitroot.org", postal: sharedContact.postal },
};

// ─────────────────────────────────────────────────────────────────────
// TERMS OF SERVICE
// ─────────────────────────────────────────────────────────────────────

const terms: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  shortTitle: "Terms",
  kicker: "~/ legal / terms",
  tagline:
    "By using bitroot.org and our services, you agree to a few rules — about ownership of content, payments, liability, and how disputes are resolved. The plain version: be reasonable, and so will we.",
  effective: "2024-12-10",
  intro: [
    {
      type: "p",
      lead: true,
      body: "<strong>Bitroot Terms.</strong>",
    },
    {
      type: "p",
      body: 'Bitroot.org is developed and owned by <strong>Bitroot</strong>, a technology and cloud services company (the “Company”), with its registered office at 149, Avior, Nirmal Galaxy, L B S Marg, Mulund West 400080, Mumbai, MH. These Website terms &amp; conditions (“T&amp;C”) apply to your access and use of <a href="https://www.bitroot.org">www.bitroot.org</a> (the “Site”), including all content, data, images, pricing, reports, software, voice, text, and video made available through any portion of the Site (collectively, the “Content”). References to the Site and Content include your access and use of any Bitroot mobile applications and their associated content.',
    },
    {
      type: "p",
      body: "Bitroot permits you (“User”, “you”, “your”, or the “Client”) to access and use the Site and Content, subject to these T&amp;C. By accessing or using any portion of the Site, you acknowledge that you have read, understood, and agree to be bound by these T&amp;C. If you are entering into this agreement on behalf of a company or other legal entity (“User Entity”), you must have the legal authority to bind that entity. If you do not have such authority or do not agree with these T&amp;C, do not access or use the Site or Content.",
    },
    {
      type: "p",
      body: "You may use Bitroot to specify and assign projects to the Company. A Project Assignment will become binding when both parties have signed a separate agreement (the “Contract”) for the project. Once a Contract is signed, the Company is obligated to provide the services and deliver the materials specified in each Project Assignment. The Contract will govern all Project Assignments and services undertaken by the Company for the Client.",
    },
  ],
  sections: [
    {
      number: "01",
      id: "updates",
      title: "Updates to these terms",
      blocks: [
        {
          type: "p",
          body: "The Company reserves the right, at its sole discretion, to change or modify portions of these T&amp;C at any time. We will post changes on the Site and indicate the date these terms were last revised. It is your responsibility to check these terms periodically. Your continued use of the Site after changes become effective constitutes your acceptance of the revised T&amp;C.",
        },
      ],
    },
    {
      number: "02",
      id: "access-and-use",
      title: "Access and use",
      blocks: [
        { type: "h3", body: "Authorisation" },
        {
          type: "p",
          body: "Subject to your compliance with these T&amp;C, you may access and use the Site and its Content solely for the purpose of your use of Bitroot. You may only link to the Site or Content as expressly permitted by the Company in writing.",
        },
        { type: "h3", body: "Ownership and restrictions" },
        {
          type: "p",
          body: "All rights, title, and interest in and to the Site and all its Content remain with and belong exclusively to Bitroot. You will not:",
        },
        {
          type: "ol",
          items: [
            "Sublicense, resell, rent, lease, transfer, assign, time-share, or otherwise commercially exploit or make the Site and any Content available to any third party.",
            "Use the Site and Content in any unlawful manner — including in violation of any data, privacy, or import/export control laws — or in any manner that interferes with or disrupts the integrity or performance of the Site.",
            "Modify, adapt, or hack the Site and Content to gain unauthorized access to restricted portions of the Site or related systems or networks (i.e., circumvent any encryption or security measures, access source code, or access any other data, products, or services of the Company not readily made available to the general public).",
          ],
        },
        {
          type: "p",
          body: "Specifically, you may not:",
        },
        {
          type: "ul",
          items: [
            "Make any speculative, false, or fraudulent reservation.",
            "Violate the restrictions in any robot exclusion headers or bypass measures employed to prevent or limit access to the Site.",
            "Take any action that imposes, or may impose, an unreasonable or disproportionately large load on our infrastructure.",
            "Deep-link to any portion of the Site without our express written permission.",
            "“Frame”, “mirror”, or otherwise incorporate any part of the Site into any other site without prior written authorization.",
            "Use any page-scrape, deep-link, spider, robot, or other automatic program to access, copy, acquire, or monitor any portion of the Site.",
            "Reproduce or circumvent the presentation or navigational structure of the Site to obtain its Content through any means not made generally available.",
          ],
        },
        {
          type: "p",
          body: "You are not permitted to copy, modify, frame, repost, publicly perform or display, sell, reproduce, distribute, or create derivative works of the Site and Content — except that you may download, display, and print one copy of the publicly available materials on any single computer solely for your personal, non-commercial use, provided you do not modify the material and keep all copyright and trademark notices intact.",
        },
      ],
    },
    {
      number: "03",
      id: "your-data",
      title: "Your content and responsibilities",
      blocks: [
        { type: "h3", body: "Responsibility for your data" },
        {
          type: "p",
          body: "You are solely responsible for all data, information, and other content that you upload, post, or otherwise provide or store (each, a “post”) in connection with the Site — until a Contract is signed, in which case the Company will own responsibility as specified in that Contract.",
        },
        { type: "h3", body: "Rights in User Content" },
        {
          type: "p",
          body: "By posting your information and other content (“User Content”) on or through the Site, you grant the Company a worldwide, non-exclusive, perpetual, irrevocable, royalty-free, sublicensable, and fully paid license to use such User Content for the sole purposes of providing you with the Bitroot site, services, and platform.",
        },
        {
          type: "p",
          body: "The Company will not disseminate your User Content to any third party other than as required to provide you with the service, and will ensure that any such third party will adhere to the terms of this Agreement. The Company eschews any liability for User Content and you indemnify the Company in the event your User Content is held to infringe the rights of any third party. The Company has the right, but not the obligation, to monitor User Content and may remove or disable any User Content at any time for any reason.",
        },
        { type: "h3", body: "Unsecured transmission of User Content" },
        {
          type: "p",
          body: "You understand that the operation of the Site, including User Content, may be unencrypted and involve transmission to the Company’s third-party vendors and hosting partners. You bear sole responsibility for adequate security, protection, and backup of User Content. The Company has no liability for unauthorized access or use of User Content, or for any corruption, deletion, destruction, or loss of User Content.",
        },
        { type: "h3", body: "Your representations and warranties" },
        {
          type: "p",
          body: "You represent and warrant that your activity on the Site and the Company’s possession and use of User Content as contemplated in these T&amp;C do not and will not violate, infringe, or misappropriate any third party’s copyright, trademark, right of privacy or publicity, or other personal or proprietary right; nor does User Content contain any matter that is defamatory, obscene, unlawful, threatening, abusive, tortious, offensive, or harassing.",
        },
      ],
    },
    {
      number: "04",
      id: "ip-and-confidentiality",
      title: "Intellectual property &amp; confidentiality",
      blocks: [
        { type: "h3", body: "Reservation of rights" },
        {
          type: "p",
          body: "Bitroot, the Company, and its licensors each own and retain their respective rights in and to all logos, company names, marks, trademarks, copyrights, trade secrets, know-how, patents, and patent applications used or embodied in or otherwise related to the Site and Content. The Company grants no rights or licenses whatsoever to you under these T&amp;C.",
        },
        { type: "h3", body: "Trademarks" },
        {
          type: "p",
          body: "Bitroot trademarks, service marks, graphics, and logos used in connection with this website are trademarks or registered trademarks of Bitroot or its partners. Other trademarks, service marks, graphics, and logos used in connection with the website may be the trademarks of other third parties. Your use of the website grants you no right or license to reproduce or otherwise use any Bitroot or third-party trademarks.",
        },
        {
          type: "p",
          body: "All third-party trademarks™ or registered® trademarks (including logos and icons) referenced on this Site remain the property of their respective owners. Use of third-party trademarks does not indicate any affiliation, relationship, sponsorship, or endorsement between us and the owners of these trademarks.",
        },
        { type: "h3", body: "Confidentiality" },
        {
          type: "p",
          body: "“Confidential information” means any information disclosed by the User to Bitroot, or vice versa, whether in writing or otherwise while signing up for Bitroot. Information pertaining to pricing and rates offered by Bitroot to the user is deemed confidential information. Neither party shall disclose invoicing details and pricing information to any third party where such information is not in the public domain.",
        },
        { type: "h3", body: "Assignment by employees of Company" },
        {
          type: "p",
          body: "The Company represents and warrants that each of its employees who perform services has or will have a written agreement with the Company that provides the Company with all necessary rights to fulfil its obligations under these T&amp;C.",
        },
        { type: "h3", body: "Feedback" },
        {
          type: "p",
          body: "You may submit ideas, suggestions, or comments (“Feedback”) regarding the Site or the Company’s business, products, or services. By submitting any Feedback, you acknowledge and agree that (1) your Feedback is provided voluntarily and the Company may use and exploit it in any manner and for any purpose, (2) you will not seek and are not entitled to any compensation or attribution, and (3) your Feedback is not the confidential or proprietary information of you or any third party.",
        },
      ],
    },
    {
      number: "05",
      id: "payments-and-billing",
      title: "Payments and billing",
      summary:
        "Payments are processed by Razorpay. Pricing may change with notice; promotions are subject to a fair-use policy.",
      blocks: [
        {
          type: "callout",
          tone: "note",
          body: "All payments for Bitroot services and subscriptions (including Platter) are processed by <strong>Razorpay</strong>, a third-party payment gateway, for both domestic (INR) and international (USD) transactions. Bitroot does not store your payment card details.",
        },
        {
          type: "p",
          body: "By making a purchase, you agree to Razorpay’s terms of service and privacy policy. All subscription and service pricing is displayed in either INR or USD depending on your location. Bitroot reserves the right to modify pricing at any time, with changes taking effect at the next renewal period for existing subscribers.",
        },
        { type: "h3", body: "Promotional offers and discounts" },
        {
          type: "p",
          body: "All promotional offers run on Bitroot are subject to a fair-use policy. The Company has the final authority to extend or revoke promotional offers, discounts, and pricing to its Clients.",
        },
        { type: "h3", body: "Identity verification" },
        {
          type: "p",
          body: "You authorise Bitroot and the Company, directly or through third parties, to make any inquiries necessary to validate your identity and confirm your ownership of your email address or financial instruments. Failure to provide information about you and your business when requested is a violation of this Agreement.",
        },
      ],
    },
    {
      number: "06",
      id: "termination",
      title: "Termination of access",
      blocks: [
        {
          type: "p",
          body: "The Company may, in its sole discretion and without prior notice, terminate your access to the Site and/or block your future access if we determine that you have violated these T&amp;C or other associated agreements. You agree that any violation by you of these T&amp;C will cause irreparable harm to the Company, for which monetary damages would be inadequate, and you consent to the Company obtaining any injunctive or equitable relief that it deems necessary in such circumstances.",
        },
        {
          type: "p",
          body: "The Company may also, in its sole discretion and without prior notice, terminate your access to the Site for cause, which includes (but is not limited to):",
        },
        {
          type: "ol",
          items: [
            "Requests by law enforcement or other government agencies.",
            "Discontinuance or material modification of the Site or any service offered on or through the Site.",
            "Unexpected technical issues or problems.",
          ],
        },
      ],
    },
    {
      number: "07",
      id: "warranties-and-liability",
      title: "Warranties, disclaimers &amp; liability",
      summary:
        "The Site is provided “as is” and the Company’s liability under these T&amp;C is limited.",
      blocks: [
        { type: "h3", body: "No warranties" },
        {
          type: "p",
          body: "The Site and Content, and all server and network components, are provided on an “as is” and “as available” basis without any warranties of any kind. The Company expressly disclaims all other representations and warranties, including any implied warranties of merchantability, fitness for a particular purpose, or non-infringement, and any representations or warranties arising from course of dealing, course of performance, or usage of trade.",
        },
        {
          type: "p",
          body: "You acknowledge that the Company does not warrant that your access or use of the Site will be uninterrupted, timely, secure, error-free, or virus-free. The Company does not warrant the results that may be obtained from use of the Site, and no information, advice, or services obtained by you from the Company will create any warranty not expressly stated in these T&amp;C.",
        },
        {
          type: "p",
          body: "The Company reserves the right to do any of the following, at any time, without notice: (1) modify, suspend, or terminate operation of or access to the Site for any reason; (2) modify or change the Site for any reason; (3) interrupt the operation of the Site to perform routine or non-routine maintenance, error correction, or other changes.",
        },
        { type: "h3", body: "Limited liability" },
        {
          type: "p",
          body: "The Company does not charge fees for you to access and use the Site and Content pursuant to these T&amp;C. As consideration for your free access and use, you agree that the Company will not be liable to you for any incidental, consequential, indirect, special, punitive, or exemplary damages (including damages for loss of business, loss of profits, or the like) arising out of or relating to these T&amp;C, including without limitation your use or inability to use the Site, even if the Company has been advised of the possibility of such damages.",
        },
        {
          type: "p",
          body: "The aggregate liability of the Company with regard to these T&amp;C will be Nil. Some jurisdictions do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, so some of the above limitations may not apply to you. In those jurisdictions, the Company’s liability will be limited to the greatest extent permitted by law.",
        },
      ],
    },
    {
      number: "08",
      id: "dispute-resolution",
      title: "Dispute resolution",
      blocks: [
        {
          type: "p",
          body: "These T&amp;C are made under, and will be construed and enforced in accordance with, the laws applicable to be performed in Mumbai, Maharashtra, India, without giving effect to principles of conflicts of law. In any action between or among the parties, each party irrevocably and unconditionally consents and submits to the exclusive jurisdiction and venue of the courts in Mumbai, Maharashtra, India.",
        },
        {
          type: "p",
          body: 'Any notices to the Company in connection with these T&amp;C will be made by email transmitted to <a href="mailto:contact.bitroot@gmail.com">contact.bitroot@gmail.com</a>. A copy of such notice should also be sent via nationally recognized carrier to: Bitroot Powerhouse Pvt Ltd, 149, Avior, Nirmal Galaxy, L B S Marg, Mulund West 400080, Mumbai, MH, India, marked for the attention of the Company Secretary.',
        },
        {
          type: "p",
          body: "If any provision of these T&amp;C is determined to be illegal or unenforceable, that provision will be revised to give the maximum permissible effect to its original intent, or — if such revision is not permitted — eliminated, so that these T&amp;C otherwise remain in full force and effect.",
        },
      ],
    },
    {
      number: "09",
      id: "entire-agreement",
      title: "Entire agreement",
      blocks: [
        {
          type: "p",
          body: "These T&amp;C, together with the Company’s Privacy Policy, constitute the entire agreement between the parties with respect to the portions of the Site available without an account ID or password. Access to certain password-restricted portions of the Site is subject to additional agreements. These T&amp;C are executed in counterparts through digital acceptance.",
        },
      ],
    },
  ],
  contact: sharedContact,
};

// ─────────────────────────────────────────────────────────────────────
// REFUND POLICY
// ─────────────────────────────────────────────────────────────────────

const refund: LegalDoc = {
  slug: "refund",
  title: "Refund Policy",
  shortTitle: "Refund",
  kicker: "~/ legal / refund",
  tagline:
    "Custom project work is refundable case-by-case based on what’s been delivered. Platter subscriptions are non-refundable — but if a duplicate payment or technical error happens, we’ll sort it out.",
  effective: "2026-02-15",
  intro: [
    {
      type: "p",
      lead: true,
      body: 'This Refund Policy applies to all services and products offered by <strong>Bitroot Powerhouse Pvt Ltd</strong> (“Bitroot”, “Company”, “we”, “us”, “our”), a company registered under the laws of India, with its registered office at 149, Avior, Nirmal Galaxy, L B S Marg, Mulund West 400080, Mumbai, MH. This policy covers services provided through <a href="https://www.bitroot.org/">bitroot.org</a>, <a href="https://platter.bitroot.org">platter.bitroot.org</a>, and any related platforms.',
    },
  ],
  sections: [
    {
      number: "01",
      id: "consulting",
      title: "Bitroot consulting &amp; project services",
      summary:
        "Refund eligibility is determined case-by-case based on the signed Contract.",
      blocks: [
        {
          type: "p",
          body: "For custom technology consulting, development projects, and other professional services offered by Bitroot:",
        },
        {
          type: "ul",
          items: [
            "Refund eligibility is determined on a case-by-case basis and depends on the terms outlined in the signed project Contract between Bitroot and the Client.",
            "Refunds may be considered for work not yet commenced or deliverables not yet provided, subject to mutual agreement.",
            "Once a project milestone has been delivered and accepted by the Client, the corresponding payment for that milestone is non-refundable.",
            "If the Company fails to deliver agreed-upon services as specified in the Contract, the Client may be entitled to a partial or full refund at the Company’s discretion.",
            "Any disputes regarding project refunds will be resolved in accordance with the dispute resolution terms in the applicable Contract.",
          ],
        },
      ],
    },
    {
      number: "02",
      id: "platter",
      title: "Platter subscriptions",
      summary:
        "All Platter payments are final. No refunds, no mid-term cancellations, no prorated changes.",
      blocks: [
        {
          type: "p",
          body: 'Platter (available at <a href="https://platter.bitroot.org">platter.bitroot.org</a>) is a paid subscription service offered by Bitroot. The following refund terms apply to all Platter subscription plans, including the Annual Plan and Insider Plan:',
        },
        {
          type: "ul",
          items: [
            "<strong>No refunds.</strong> All Platter subscription payments are final and non-refundable. By purchasing a subscription, you acknowledge that you receive immediate access to subscription benefits upon payment.",
            "<strong>No mid-term cancellations.</strong> Subscriptions cannot be cancelled mid-term for a refund. Your subscription remains active until the end of the paid billing period.",
            "<strong>One-time payments.</strong> Platter subscriptions are billed as one-time payments for the selected plan duration. There are no recurring charges unless you choose to renew.",
            "<strong>Plan changes.</strong> Upgrading or downgrading between plans does not entitle you to a refund of the difference. Any change takes effect at the next renewal period.",
          ],
        },
      ],
    },
    {
      number: "03",
      id: "payment-processors",
      title: "Payment processors",
      blocks: [
        {
          type: "callout",
          tone: "note",
          body: "Bitroot uses <strong>Razorpay</strong> as its third-party payment gateway to process all payments — both domestic (India) and international transactions, for Platter subscriptions and applicable Bitroot services.",
        },
        {
          type: "p",
          body: "International payments are processed in USD via Razorpay’s international payment acceptance. Domestic payments within India are processed in INR.",
        },
        {
          type: "p",
          body: "Bitroot does not store your payment card details. All payment information is handled securely by Razorpay in accordance with their privacy and security policies.",
        },
      ],
    },
    {
      number: "04",
      id: "exceptions",
      title: "Exceptions",
      summary:
        "Duplicate payments and technical errors are reviewed at our discretion — within 7 days of the transaction.",
      blocks: [
        {
          type: "p",
          body: "In exceptional circumstances — such as duplicate payments or technical errors during the payment process — Bitroot may issue a refund at its sole discretion. To request a review:",
        },
        {
          type: "ul",
          items: [
            "Contact us within 7 days of the transaction.",
            "Provide your transaction ID, payment receipt, and a description of the issue.",
          ],
        },
      ],
    },
    {
      number: "05",
      id: "contact",
      title: "How to contact us",
      blocks: [
        {
          type: "p",
          body: "If you have questions about this Refund Policy or wish to raise a dispute regarding a payment, please contact us:",
        },
        {
          type: "kv",
          rows: [
            { key: "Email", value: "contact.bitroot@gmail.com" },
            {
              key: "Postal",
              value:
                "149, Avior, Nirmal Galaxy, L B S Marg, Mulund West 400080, Mumbai, MH",
            },
          ],
        },
        {
          type: "p",
          body: "We aim to respond to all refund-related inquiries within 5 business days.",
        },
      ],
    },
    {
      number: "06",
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          type: "p",
          body: "Bitroot reserves the right to update or modify this Refund Policy at any time. Changes will be posted on this page with an updated effective date. Your continued use of our services after any changes constitutes acceptance of the revised policy.",
        },
      ],
    },
  ],
  contact: sharedContact,
};

// ─────────────────────────────────────────────────────────────────────

export const legalDocs: Record<LegalSlug, LegalDoc> = { privacy, terms, refund };

export const legalOrder: LegalSlug[] = ["privacy", "terms", "refund"];

export function getDoc(slug: LegalSlug): LegalDoc {
  return legalDocs[slug];
}

// Rough words-per-minute reading estimate.
export function estimateReadMinutes(doc: LegalDoc): number {
  const flattenBlock = (b: LegalBlock): string => {
    switch (b.type) {
      case "p":
      case "h3":
      case "callout":
        return b.body;
      case "ul":
      case "ol":
        return b.items.join(" ");
      case "kv":
        return b.rows.map((r) => `${r.key} ${r.value}`).join(" ");
    }
  };
  const text = [
    ...doc.intro.map(flattenBlock),
    ...doc.sections.flatMap((s) => [
      s.title,
      s.summary ?? "",
      ...s.blocks.map(flattenBlock),
    ]),
  ].join(" ");
  const stripped = text.replace(/<[^>]+>/g, " ");
  const words = stripped.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
