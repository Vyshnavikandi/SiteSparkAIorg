# SiteSpark AI — Prompt-to-Website Generator (MVP)

## Run locally
1. Extract `SiteSparkAI.zip`.
2. Open the `SiteSparkAI` folder in VS Code.
3. Open `index.html` in a browser, or use VS Code's Live Server extension.
4. Type a website idea or choose an example prompt.
5. Click **Generate my website**.
6. Try the theme/layout options, mobile preview, headline editor, and **Export HTML**.

## What works in this prototype
- Prompt-driven website concept generation for several common site types.
- Live website preview.
- Theme switching and layout variants.
- Desktop/mobile preview width.
- Headline editing.
- Standalone HTML export.
- Example prompts for reliable live demos.

## Important technical note
This MVP uses local prompt rules and templates; it does **not** call a real LLM API yet. Describe it as a prompt-driven website-generation prototype unless/until an AI API is integrated. A future version can use an LLM API through a small backend so the API key is not exposed in browser code.

## Suggested contest demo
1. Generate a Java developer portfolio.
2. Switch to Ocean Blue and mobile preview.
3. Edit the headline.
4. Export the HTML and open the downloaded file.
5. Explain the next step: replace the local prompt rules with an LLM-backed structured JSON website specification.
