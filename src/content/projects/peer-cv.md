---
name: "PeerCV"
category: "Active Projects"
year: "2025"
href: "https://peer-cv.vercel.app"
tags: ["fastapi", "nextjs", "postgresql", "jwt", "sqlalchemy", "tailwindcss", "imagekit"]
tagline: Community-powered resume review with secure uploads and threaded feedback
image: /photos/elrich_photos/peer-cv.png
highlights:
  - Architected FastAPI + PostgreSQL schemas for nested comments, voting, and review threads
  - Implemented JWT-based auth to protect API routes and manage stateless identity flows
  - Integrated ImageKit for CDN-backed resume storage and faster uploads
  - Built a Next.js SSR frontend with TailwindCSS for performance and SEO
role: Full-Stack Developer
deployed: true
featured: true
order: 1
wide: true
---

## Why PeerCV

Resume advice is usually scattered across direct messages, shared documents, and one-off calls. PeerCV turns that feedback into a shared review flow where a resume, its discussion, and the useful replies can stay together.

The product is built around a simple loop: upload a resume, open a review thread, and let the community respond in context.

## The backend

I built the API with FastAPI and modeled the data in PostgreSQL through SQLAlchemy. The schema supports review threads, nested comments, and voting, so feedback can become a conversation instead of a flat list of reactions.

JWT-based authentication protects API routes and keeps identity handling stateless across the frontend and backend.

## Uploads and delivery

Resume files are stored through ImageKit. Using CDN-backed storage keeps file delivery separate from the application server and gives the upload flow a clearer responsibility boundary.

The frontend uses Next.js and TailwindCSS. Server-side rendering gives public-facing pages fast initial output and a structure that search engines can understand.

## What was difficult

The hard part was not rendering comments. It was preserving the relationship between a review, a reply, a vote, and the person allowed to perform each action.

Threaded feedback also creates product questions beyond the schema. Privacy, moderation, deletion, and useful ranking all matter when the content being reviewed is personal.

## Where it stands

PeerCV is deployed and remains an active project. The current build establishes the secure upload and discussion foundation. The next iterations are about making feedback quality and user control as strong as the underlying architecture.
