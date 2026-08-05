---
role: Software Engineering Intern
company: MedMe (YC W21)
logo: /logos/medme.png
url: https://www.medmehealth.com/
image: /experiences/medme-1.jpg
gallery:
  - /experiences/medme-2.jpg
start: 2026-05
dates: "May 2026 — Present"
location: Toronto, ON
tagline: Pharmacy scheduling and billing software for clinic partners
bullets:
  - Built billing infrastructure on Stripe and Metronome with reliable transaction handling
  - Designed Knex models and migrations for email automation used in patient outreach with partners like Shoppers Drug Mart
  - Shipped React, TypeScript, and AWS features that parse FHIR JSON to reroute appointments
  - Built NestJS task handling on Postgres Taskmaster for background jobs and retries
tags:
  - nestjs
  - postgres
  - taskmaster
  - stripe
  - metronome
  - knex
  - react
  - typescript
  - aws
  - fhir
order: 0
---

## Problem

MedMe makes pharmacy scheduling and billing software for clinics. I joined as a software engineering intern on the team that ships what clinics use day to day: schedule patients, run outreach, take payments.

The work I picked up sat in the messy middle. Billing has to clear. Outreach email has to hit the right patients. Appointment data shows up as FHIR JSON and the shape is not always the same. Background work has to run reliably without blocking the request path.

## Technologies

- NestJS for services and task handling
- Postgres Taskmaster for queued jobs, retries, and status
- Stripe and Metronome for billing
- Knex for models and migrations
- React, TypeScript, and AWS on the product side
- FHIR JSON for appointment payloads

## What I worked on

### Billing

I helped build billing infrastructure on Stripe and Metronome so clinic transactions move through a clear path instead of one-off scripts that break when volume jumps.

### Outreach

I designed Knex models and migrations for the email automation behind patient outreach, including flows with partners like Shoppers Drug Mart. Goal was a schema that stays stable across environments.

### Appointment rerouting

I shipped React, TypeScript, and AWS features that parse incoming FHIR JSON and reroute appointments when the payload says they should move. Less manual triage for clinics when the source system changes the shape of the data.

### Task handling

I worked on NestJS task handling backed by Postgres Taskmaster so jobs (outreach sends, billing follow-ups, appointment side effects) enqueue cleanly, retry when something flakes, and leave a clear status trail instead of disappearing into a fire-and-forget queue.
