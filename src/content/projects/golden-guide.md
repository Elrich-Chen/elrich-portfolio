---
name: "Golden Guide"
category: "Hackathons"
href: "https://devpost.com/software/golden-guide-ugoa6h"
devpost: "https://devpost.com/software/golden-guide-ugoa6h"
year: "2026"
tags: ["gemini", "fastapi", "nextjs", "elevenlabs", "twilio", "sendgrid", "hackathon"]
tagline: "Agentic AI for Kingston seniors at QHacks 2026"
image: /photos/elrich_photos/golden-guide.jpeg
imageFit: contain
featured: true
award: "Best Use of Gemini"
hackathon: "QHacks"
highlights:
  - Won Best Use of Gemini at QHacks 2026
  - Agentic loop with 11 tools that searches services, checks eligibility, and drafts real emails/calls
  - Real Kingston Transit GTFS data, bilingual EN/FR, and accessibility-first UI
role: Full-Stack Developer
duration: 36 hours (QHacks 2026)
order: 2
---

## The challenge

QHacks 2026 used “Golden Age” as its theme. We focused on a practical problem inside that brief: municipal services exist for seniors, but finding the right program, checking eligibility, and figuring out how to get there can become a project of its own.

Golden Guide was our attempt to make that process feel less like searching through tabs and more like asking one patient guide for help.

## More than a chatbot

I did not want the demo to stop after returning a paragraph. Golden Guide uses an agentic loop with 11 tools so it can move from a question toward an action. It can search for services, check eligibility information, look up transit, draft an email, and offer a phone call after asking for confirmation.

That confirmation step mattered. A useful assistant should not turn a vague request into an external action without making the next step clear first.

## Building around real local information

### Transit

We used real Kingston Transit GTFS data for route and trip information. The goal was to connect a service recommendation to the practical question that often comes next: how do I actually get there?

### Accessibility

The interface supports English and French and was designed around direct language, clear actions, and a lower-friction path through the result. We treated accessibility as part of the product flow rather than a final styling pass.

### The stack

The build combined Gemini with a FastAPI backend and a Next.js interface. ElevenLabs, Twilio, and SendGrid were part of the broader toolset for voice and communication workflows.

## The result

We built Golden Guide in 36 hours and won **Best Use of Gemini** at QHacks 2026.

The award was exciting, but the more useful lesson was architectural. Agentic systems feel convincing when each tool has a narrow job, the user can understand what is happening, and consequential actions pause for confirmation.
