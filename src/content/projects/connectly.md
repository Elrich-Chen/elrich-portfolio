---
name: "Connectly (LinkedinMaxx)"
category: "Hackathons"
href: "https://github.com/dhruvcharan13/LinkedinMaxx"
year: "2025"
tags: ["python", "fastapi", "redis", "playwright", "react", "langchain", "hackathon"]
tagline: "AI content orchestration with human review"
image: /photos/elrich_photos/IMG_7923.jpeg
highlights:
  - Architected multi-agent AI system automating contextual knowledge workflows across LinkedIn
  - Implemented human-in-the-loop review logic with React dashboard for AI-generated text approval
  - Integrated Playwright automation to scrape feeds, parse 100+ profiles, and execute agent decisions
role: Backend Engineer & AI Integration Specialist
duration: "Hackathon build"
hackathon: "Go On Hacks"
order: 7
---

## The problem

AI-generated content becomes risky when generation and publishing are treated as the same step. Connectly was built around a more deliberate workflow: route the task, generate a draft, let a person review it, and only then continue.

We developed the project during Go On Hacks as a content-orchestration system for LinkedIn workflows.

## The backend

I worked on the backend and AI integration using Python, FastAPI, LangChain, and Redis.

The system routed tasks based on their meaning and kept the workflow state available across steps. Separating routing from generation made it easier to reason about what each part of the system was supposed to do.

## Human review

The React dashboard gave users three clear choices for generated text: approve it, reject it, or modify it.

That review layer was not a decorative confirmation screen. It was the control point between an automated suggestion and an external action.

## Browser automation

We integrated Playwright for browser-based LinkedIn interaction and built parsing workflows that handled more than 100 profiles.

Browser automation made the demo tangible, but it also exposed the project’s largest constraint. Any system acting on a third-party platform has to respect user intent, account safety, platform rules, and the difference between a prototype and responsible production automation.

## What I learned

Connectly changed how I think about agent workflows. The interesting part is not how many agents can run. It is whether responsibility is divided clearly, state survives each handoff, and a person can intervene before the system does something consequential.
