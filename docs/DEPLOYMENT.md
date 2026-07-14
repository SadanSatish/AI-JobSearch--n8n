# Deployment

## Render
This project uses Render Blueprints (`render.yaml`).
1. Connect your GitHub repository to Render.
2. Render will automatically detect `render.yaml`.
3. It will provision:
   - A Node.js Web Service for the Backend API.
   - A Static Site for the React Vite Frontend.
   - A Private Service for the n8n Docker container.
4. Go to the Render Dashboard and fill in your Environment Groups matching the variables declared in `.env.example`.
