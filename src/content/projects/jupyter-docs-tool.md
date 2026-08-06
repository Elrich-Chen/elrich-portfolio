---
name: Jupyter Notebook Documentation Tool
category: "Open Source"
href: https://github.com/Elrich-Chen/jupyterlab_docs_helper
linkedin: https://www.linkedin.com/posts/elrich-chen_document-your-code-or-lose-credibility-activity-7377847789801590784-gjdT
year: "2025"
tags: [typescript, jupyter, ai]
tagline: AI-assisted documentation directly in Jupyter notebooks - no context switching required
image: /photos/elrich_photos/IMG_7713.jpeg
highlights:
  - Built JupyterLab extension with TypeScript and React
  - Integrated OpenAI API for intelligent documentation generation
  - Reduced documentation time by 70% for data science teams
role: Creator & Maintainer
duration: 3 months
---

## The problem

Documentation often loses to momentum. A data scientist finishes an analysis, tells themself they will explain it later, and moves on before the context is still fresh.

The Jupyter Notebook Documentation Tool keeps that work inside JupyterLab. Instead of copying code into another application, a user can generate documentation without leaving the notebook environment.

## Building inside the existing workflow

I built the extension with TypeScript and React for JupyterLab. Working as an extension was the central product decision. The tool lives where the code and analysis already are, which removes a context switch rather than making that switch slightly faster.

The interface had to feel native to a notebook workflow. It needed to be available when useful without competing with the cells, outputs, and controls that the user was already managing.

## AI-assisted documentation

The extension integrates the OpenAI API to generate documentation assistance. The goal is to create a useful starting point while the author still has the intent of the code in mind.

Generated documentation still needs review. Names, assumptions, and domain context can be obvious to the person writing a notebook and invisible to a model.

## Result

Project measurements showed a 70% reduction in documentation time for the workflow being tested.

The more important result was proving the interaction model: documentation can happen beside the work instead of becoming a separate task after it.

## Maintaining it

I built the project as an open-source JupyterLab extension and maintained it over a three-month development period. Future work should make context selection, privacy expectations, and output review even more explicit.
