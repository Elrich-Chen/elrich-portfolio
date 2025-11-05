import { z, defineCollection } from 'astro:content';

const bio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().default('About'),
    updated: z.string().optional(),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    role: z.string(),
    company: z.string(),
    url: z.string().url().optional(),
    logo: z.string().optional(), // path in /public/, e.g., /logos/company.png
    start: z.string(), // e.g., 2024-05
    end: z.string().optional(),
    location: z.string().optional(),
    bullets: z.array(z.string()).default([]),
    highlights: z.array(z.string()).optional(),
  }),
});

const project = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    category: z.string().optional(), // e.g., "Web Apps", "AI/ML", "Hackathons", "Open Source"
    image: z.string().optional(), // Project screenshot/hero image
    tagline: z.string().optional(), // Short 1-line description
    href: z.string().url().optional(),
    logo: z.string().optional(), // path in /public/
    year: z.string().optional(),
    tags: z.array(z.string()).default([]),
    highlights: z.array(z.string()).optional(), // Key features/bullet points
    duration: z.string().optional(), // e.g., "3 months", "Ongoing"
    role: z.string().optional(), // e.g., "Lead Developer", "Full Stack Engineer"
    featured: z.boolean().optional(), // Highlight important projects
  }),
});

const hobby = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
  }),
});

const highlights = defineCollection({
  type: 'data',
  schema: z.object({
    what_makes_me_different: z.array(
      z.union([
        z.string(),
        z.object({
          point: z.string(),
          details: z.array(z.string()).optional(),
        })
      ])
    ).optional(),
    building: z.array(
      z.union([
        z.string(),
        z.object({
          point: z.string(),
          details: z.array(z.string()).optional(),
        })
      ])
    ).optional(),
  }),
});

const photos = defineCollection({
  type: 'data',
  schema: z.object({
    image: z.string(), // path to image in /public/
    caption: z.string(),
    date: z.string(), // e.g., "Summer 2024" or "Dec 2024"
    location: z.string().optional(),
  }),
});

export const collections = { bio, experiences: experience, projects: project, hobbies: hobby, highlights, photos };


