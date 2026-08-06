---
name: "Landlord Negotiation Simulator"
category: "Hackathons"
href: "https://github.com/Elrich-Chen/QHacks_2025"
devpost: "https://devpost.com/software/lease-me-before-you-go-go"
year: "2025"
tags: ["react", "nextjs", "flask", "tailwindcss", "figma", "hackathon"]
tagline: Interactive AI-powered negotiation practice for first-time renters
image: /photos/elrich_photos/lease-me-before-you-go-go.png
hackathon: "QHacks"
highlights:
  - Designed complete user flow and UI in Figma
  - Integrated Flask backend with OpenAI API for realistic conversations
  - Built responsive Next.js frontend with TailwindCSS
role: Full-Stack Developer & Designer
duration: 36 hours (QHacks 2025)
order: 6
---

## The idea

The first lease negotiation many renters experience is also the first one they have ever had to prepare for. At QHacks 2025, we built a simulator where someone could practice that conversation before money, housing, and a real landlord were involved.

The product placed the user in an interactive negotiation and returned AI-generated landlord responses as the conversation developed.

## Designing the practice flow

I designed the end-to-end experience in Figma before building the interface. The flow needed to make the scenario understandable, keep the conversation moving, and avoid burying a first-time renter under controls.

The point was practice, not legal advice or a guaranteed script. The interface had to feel low-stakes enough for someone to try a response, see what came back, and keep going.

## Building it in 36 hours

### Frontend

I built the responsive interface with Next.js, React, and TailwindCSS. The conversation view had to stay readable as messages accumulated and still work on a smaller screen.

### Backend

A Flask backend connected the interface to OpenAI for the simulated landlord responses. Keeping that work behind an API boundary let the frontend focus on the conversation state and presentation.

## What shipped

By the end of QHacks, we had a working negotiation loop that connected the Figma flow, responsive frontend, Flask service, and AI responses.

The project taught me that conversational products need more than a text box. The framing, expectations, and transitions around each response determine whether the interaction feels like useful practice or random generated dialogue.

## Limits

This was a hackathon simulator, not a source of legal guidance. A longer build would need clearer jurisdictional boundaries, stronger safety language, and a more deliberate way to evaluate the quality of a negotiation.
