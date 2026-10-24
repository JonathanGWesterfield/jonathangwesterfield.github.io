---
title: Making fleet tests observable with CloudWatch
summary: Replaced crash-prone local test logs with centralized CloudWatch telemetry for fleet-wide accelerator hardware investigations.
role: Software Development Engineer II, Amazon — Annapurna Labs
timeframe: December 2022–July 2025
situation: Hardware vetting tests could hang, time out, or crash a server without leaving useful evidence behind. Logs lived in local storage, so a restart could erase the record; retrieving what remained required manual SSH work and a specialized tool that did not scale to fleet investigations.
responsibility: I made the test infrastructure observable beyond the individual server. I worked across the logging and fleet-testing paths to preserve the context engineers needed when investigating failures at both the card and system level.
constraints:
  - A server failure could remove the most useful evidence for understanding that failure.
  - The solution needed to serve hardware, thermal, and fleet-health engineers working across many systems.
  - It had to extend existing logging and collection paths without disrupting the testing workflow.
approach: I integrated test output with CloudWatch, starting from an existing card-level pattern and extending the approach to system-level logging. I added the contextual information needed to make logs useful remotely, routed output through the existing collection path, and adapted the logger so it could identify the environment it was running in.
outcome: Engineers could investigate fleet failures through centralized logs instead of relying on fragile local state and manual SSH access. The change unblocked debugging workflows across more than eight engineering teams and reduced cross-organizational investigation time to resolution by more than 90%.
technologies:
  - AWS CloudWatch
  - Observability
  - Go
  - Linux logging
  - Fleet testing
  - Failure investigation
featured: true
order: 3
approvalStatus: approved
confidentialityReview: true
relevance: "Demonstrates practical observability work: preserving evidence, connecting systems through existing operational paths, and making complex failures easier for other engineers to diagnose."
lastReviewed: 2026-10-23
---
