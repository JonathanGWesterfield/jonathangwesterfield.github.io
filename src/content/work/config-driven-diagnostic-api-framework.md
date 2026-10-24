---
title: Building a diagnostic API framework engineers could extend
summary: Turned ad hoc SSH and provisioning workflows into an asynchronous, config-driven API framework for accelerator hardware platforms.
role: Software Development Engineer II, Amazon — Annapurna Labs
timeframe: December 2022–July 2025
situation: "Hardware engineers needed a practical way to diagnose and control accelerator cards remotely. The available options were direct SSH access or provisioning requests: one was difficult to standardize, the other was slow, inflexible, and offered limited inputs and results."
responsibility: I designed and evolved the framework from its initial implementation through its API contract, endpoint model, test strategy, documentation, and developer workflow. I worked with hardware and software engineers to make the system useful for people who needed to add and operate endpoints without deciphering a growing collection of one-off scripts.
constraints:
  - Long-running hardware actions needed an API contract that could report progress and results reliably.
  - New server generations created a continuing need for diagnostic and control capabilities.
  - The framework had to be approachable for engineers with different levels of software experience.
approach: After early feedback exposed a slow and underdocumented first version, I reworked the contract around an asynchronous PUT and GET fork-and-poll model. I introduced config-based endpoint definitions, integration tests, command-line utilities, and endpoint documentation. The configuration became both implementation input and living documentation, which made endpoint behavior easier to review, extend, and test.
outcome: The framework grew to support more than 100 diagnostic, testing, and control endpoints across accelerator hardware platforms. It became a durable part of the team’s testing infrastructure and gave engineers a more consistent way to add and use hardware operations.
technologies:
  - Lua
  - POSIX processes
  - CoAP
  - Asynchronous APIs
  - Configuration-driven design
  - Integration testing
  - Command-line tooling
featured: true
order: 1
approvalStatus: approved
confidentialityReview: true
relevance: Demonstrates platform ownership from API design through developer experience, with an emphasis on using feedback and tests to make a shared system easier to trust and extend.
lastReviewed: 2026-10-23
---
