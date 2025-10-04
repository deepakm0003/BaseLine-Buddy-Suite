# Baseline Copilot API Setup

## Getting Your Gemini API Key

To enable AI-powered responses in Baseline Copilot, you need to get a free API key from Google AI Studio.

### Step 1: Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### Step 2: Configure the API Key

#### Option 1: Environment Variable (Recommended for Production)
Create a `.env` file in the `packages/dashboard` directory:

```bash
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

#### Option 2: In-App Configuration (Demo/Development)
1. Open Baseline Copilot
2. Click the "Settings" button in the header
3. Paste your API key in the input field
4. Click "Save"

### Step 3: Restart the Application

If using environment variables, restart the development server:

```bash
npm run dev
```

## Features

With the API key configured, Baseline Copilot will:

- ✅ Provide intelligent, context-aware responses
- ✅ Understand complex Baseline questions
- ✅ Generate accurate code examples
- ✅ Give detailed browser support information
- ✅ Suggest best practices and alternatives

## Fallback Mode

Without an API key, Baseline Copilot will use intelligent fallback responses based on a comprehensive Baseline knowledge database, but with limited conversational capabilities.

## Security Note

- API keys are stored locally in your browser (for in-app configuration)
- Never commit API keys to version control
- Use environment variables for production deployments
