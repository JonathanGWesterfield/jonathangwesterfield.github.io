---
title: "Librarian: a local-first retrieval platform"
summary: Building an open-source system that turns an EPUB library into a source-grounded, local question-answering experience.
role: Independent Software Engineer
timeframe: July 2025–Present
situation: Long-form personal libraries are difficult to search in a way that preserves the source material and keeps the workflow under the reader’s control. I wanted a practical retrieval system for EPUB collections that can run locally and show where an answer came from.
responsibility: "I designed and am building the end-to-end application: ingestion, metadata and chunk storage, local retrieval, source-grounded answer generation, API and command-line workflows, and the browser interface."
constraints:
  - Make local operation the default instead of relying on a hosted service.
  - Preserve useful source context so an answer can be traced back to the book and passage.
  - Keep automated tests deterministic without requiring a live model or external service.
approach: I built a Python monorepo around FastAPI, SQLite, and Docker Compose. The ingestion path parses EPUB content, hashes files for duplicate detection, and stores books and chunks in SQLite. Retrieval uses locally generated embeddings and cosine similarity; answer generation is prompted to cite retrieved source material and decline unsupported claims. I added API and CLI tests with deterministic local fakes, then built a React and TypeScript interface for browsing and querying a library.
outcome: The result is a public, inspectable project that demonstrates how I reason about interfaces, data flow, local developer experience, and evidence-backed behavior. It is still evolving, with the implementation and tradeoffs available in the repository.
technologies:
  - Python
  - FastAPI
  - SQLite
  - Docker Compose
  - Local embeddings
  - React
  - TypeScript
featured: true
order: 4
links:
  - label: View Librarian on GitHub
    url: https://github.com/JonathanGWesterfield/Librarian
approvalStatus: approved
confidentialityReview: true
relevance: Demonstrates ownership of a backend product from data model through API and user workflow, with careful attention to source traceability and reproducible local development.
lastReviewed: 2026-10-23
---
