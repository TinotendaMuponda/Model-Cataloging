# LLM Catalog

A fast, public-facing catalog for comparing large language models across price, capability, context length, provider availability, and endpoint performance.

Live demo: https://model-cataloging.vercel.app

> **Key highlight:** this turns scattered model and provider data into a single decision view, so technical and non-technical stakeholders can compare options without digging through API documentation.

## What It Does

LLM Catalog uses live OpenRouter metadata to help teams quickly answer practical model-selection questions:

- Which models support the capabilities we need?
- Which providers host the same model?
- What are the current input and output prices?
- Which endpoints look fastest or most reliable?
- Which models are free, discounted, multimodal, or suited for research and production use?

## Why It Matters

Choosing an AI model is no longer just about model quality. Cost, uptime, context window, supported parameters, and provider redundancy all affect whether a model is usable in a real workflow. This app brings those signals together in a clean interface for faster, better-informed decisions.

## Features

- Live model catalog powered by OpenRouter
- Search, filters, and sorting for fast discovery
- Capability badges for tool use, vision, web search, and discounts
- Provider-level endpoint details, including pricing, uptime, latency, throughput, context limits, and max output
- Multi-provider filtering to compare redundancy and cost options
- Documentation page for reviewers, researchers, and implementation teams

## Tech Stack

- Angular 15
- TypeScript
- RxJS
- Clarity components
- Vercel-ready static deployment

## Run Locally

```bash
npm install
npm run start
```

For a production build:

```bash
npm run build
```

## Project Links

- Demo: https://model-cataloging.vercel.app
- Repository: https://github.com/TinotendaMuponda/Model-Cataloging
- Data: https://openrouter.ai

## License

MIT
