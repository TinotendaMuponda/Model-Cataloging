# Model-Cataloging

A smart, lightweight TypeScript web app to catalog, search, and preview machine learning models with metadata, versioning, and deployment-ready exports.

Live demo: https://model-cataloging.vercel.app

## What this is (elevator pitch)
Model-Cataloging helps teams and makers keep track of machine learning models, their versions, and important metadata (architecture, dataset, metrics, tags). It makes models discoverable and easy to preview or export for deployment.

## Key features
- Catalog models with rich metadata (name, description, tags, metrics, versions)
- Fast search and filters for discovery
- Preview model summaries and example outputs
- Export model metadata and files for deployment

## Quick start
1. Clone the repo

   git clone https://github.com/TinotendaMuponda/Model-Cataloging.git
2. Install dependencies

   npm install
3. Run locally

   npm run dev

## Suggested short descriptions (pick one for the repo "Description" field)
- "Catalog, search and preview ML models — metadata, versioning, deployment-ready (TypeScript)"
- "Lightweight model catalog: discover, version, and export ML models"
- "Model registry + explorer for small teams — searchable model metadata & previews"

---

If you want, I can also:
- Set the repository "Description" field (I can't change repo metadata directly from this chat without API auth) — suggested command below.
- Add GitHub topics: `model-registry`, `machine-learning`, `typescript`, `nextjs`.

How to set the repository description on GitHub (CLI):

  gh repo edit TinotendaMuponda/Model-Cataloging --description "Catalog, search and preview ML models — metadata, versioning, deployment-ready (TypeScript)"

Or via the REST API (curl):

  curl -X PATCH -H "Authorization: token YOUR_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/repos/TinotendaMuponda/Model-Cataloging \
    -d '{"description":"Catalog, search and preview ML models — metadata, versioning, deployment-ready (TypeScript)", "homepage":"https://model-cataloging.vercel.app"}'
