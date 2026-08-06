---
name: "BlackJack Q-Learning Agent"
category: "AI/ML"
href: https://github.com/Elrich-Chen/BlackJack
year: "2025"
tags: [python, rl, machine-learning]
tagline: Q-Learning agent achieving 43% win rate through 2M+ simulated games
image: /photos/elrich_photos/IMG_8323.jpeg
highlights:
  - Trained reinforcement learning agent over 2M+ simulated games
  - Achieved 43% win rate using Q-Learning algorithm
  - Built scalable OOP architecture for multiple game scenarios
role: Machine Learning Engineer
duration: 2 months
order: 5
---

## Why Blackjack

I wanted a reinforcement-learning project where the feedback loop was easy to understand but still large enough to reward experimentation. Blackjack provided a compact game environment with repeated decisions, immediate outcomes, and enough uncertainty to make the policy matter.

## The agent

I built the agent in Python using Q-Learning. It learned through simulated games rather than a fixed set of hand-written decisions.

Training ran across more than two million simulated games. At that scale, the project became as much about building a reliable simulation loop as it was about updating the policy.

## Architecture

I organized the game and agent logic with object-oriented boundaries. The intent was to keep the environment, gameplay rules, and learning behavior separate enough that another game scenario could reuse the same broad structure.

That separation also made experiments easier to reason about. A change to the agent should not require rewriting the game, and a change to the game should not hide inside the learning loop.

## Result

The trained agent reached a 43% win rate in the project’s evaluation.

That number is a result, not a universal Blackjack benchmark. Its meaning depends on the exact rules, simulation setup, and evaluation method used by this implementation.

## What I learned

The biggest lesson was that reinforcement learning results are only as trustworthy as the environment around them. Simulation volume matters, but so do state design, evaluation discipline, and a clean boundary between training and gameplay.

A next iteration would document those choices more rigorously and compare the learned policy against explicit baselines.
