---
title: Reducing Trainium unsellable rates with provisioning test libraries
summary: Built cross-platform, cross-architecture Lua libraries to exercise fleet-hardware components during EC2 provisioning.
impact: Reduced Trainium unsellable rates by more than 75%.
role: Software Development Engineer II, Amazon — Annapurna Labs
timeframe: December 2022–July 2025
situation: EC2 provisioning needed reliable hardware validation across Trainium systems. The test path had to exercise components including PCIe, HBM, BMC, and Ethernet across more than one platform and hardware architecture.
responsibility: I developed the Lua libraries used to exercise and test those fleet-hardware components during provisioning.
constraints:
  - The libraries needed to work across platforms and hardware architectures.
  - The tests had to cover several component types in the EC2 provisioning path.
  - The work needed to improve fleet and manufacturing outcomes, not only report failures.
approach: I built cross-platform, cross-architecture Lua libraries that exercised PCIe, HBM, BMC, and Ethernet components while systems were being provisioned. The libraries made component validation part of the provisioning workflow instead of a separate, manual activity.
outcome: The provisioning test libraries reduced Trainium unsellable rates by more than 75%.
technologies:
  - Lua
  - EC2 provisioning
  - Fleet hardware testing
  - PCIe
  - HBM
  - BMC
  - Ethernet
featured: true
order: 2
approvalStatus: approved
confidentialityReview: true
relevance: Demonstrates infrastructure engineering that connects reusable test software to measurable fleet and manufacturing outcomes.
lastReviewed: 2026-11-03
---
