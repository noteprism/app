# app
Capture every idea, shower thought, and task as a digital sticky note in Noteprism. Add your insights, categorize them, and see which to tackle first based on ease and impact. Then, transform these notes into prioritized to-do lists, LinkedIn posts, articles, product ideas—whatever you need to build from your thoughts.

[www.noteprism.com](https://www.noteprism.com) | [noteprism.com](https://noteprism.com) | [preview.noteprism.com](https://preview.noteprism.com)

# Noteprism
Add Sticky Notes, Create Anything.  
Capture every idea, shower thought, and task as a digital sticky note in Noteprism. Add your insights, categorize them, and see which to tackle first based on ease and impact. Then, transform these notes into prioritized to-do lists, LinkedIn posts, articles, product ideas—whatever you need to build from your thoughts.

## Dependencies

This project uses the following dependencies:

- [vite](https://vitejs.dev/) (devDependency)
- [wrangler](https://developers.cloudflare.com/workers/wrangler/) (devDependency)

## Cloudflare Deployment

Deployment to Cloudflare Pages is automated via a GitHub Action. This action uses two secrets, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, which you must generate and obtain from your Cloudflare profile (the token name is typically `GitHub Actions Deploy`).

- Both `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` should be added as GitHub repository secrets for deployment.
- For local development, store these values in a `.env.local` file (see below). This file is gitignored and should never be committed.

```env
# .env.local example
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

For local development, you can also add other environment variables (e.g., `VITE_API_URL`).

# api
Capture every idea, shower thought, and task as a digital sticky note in Noteprism. Add your insights, categorize them, and see which to tackle first based on ease and impact. Then, transform these notes into prioritized to-do lists, LinkedIn posts, articles, product ideas—whatever you need to build from your thoughts.

---

## Google Cloud Platform (GCP) Deployment

Noteprism uses Google Cloud Platform (GCP) to host its API and Preview services using Cloud Run. Below is an overview of the deployment setup:

### Cloud Run Services
- **API Service**: Deployed from the `main` branch. This is the production API for Noteprism.
- **Preview Service**: Deployed from the `preview` branch. This is used for staging/preview purposes before changes go live.

### Continuous Deployment
- Both services are set up with continuous deployment from GitHub:
  - **API**: Deploys automatically from the `main` branch.
  - **Preview**: Deploys automatically from the `preview` branch.
- Any changes pushed to these branches will trigger a new deployment to the respective Cloud Run service.

### Authentication & Security
- IAM is used to authenticate incoming requests to the API by default.
- IAM variables have been added to Cloudflare, allowing secure communication between Cloudflare and GCP services.
- You can configure unauthenticated access or require authentication as needed in the Cloud Run settings.

### Scaling & Billing
- Services are configured for auto scaling and request-based billing to optimize cost and performance.

### Ingress
- By default, services allow direct access from the internet, but you can restrict this to internal traffic if needed.

### Example Endpoint
- After deployment, your API endpoint will look like:
  `https://<service-name>-<hash>-<region>.run.app`

---

For more details or to modify deployment settings, visit the [Google Cloud Console](https://console.cloud.google.com/run) and select the appropriate service.


