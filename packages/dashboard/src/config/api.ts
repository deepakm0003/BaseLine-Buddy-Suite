// API Configuration for Baseline Copilot
export const API_CONFIG = {
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCPfgCWx3n6enM_NkQ58dezcqBJZqO5kME',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  DEFAULT_MODEL: 'gemini-2.0-flash-exp',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
}

// Baseline-specific system prompt for training the model
export const BASELINE_SYSTEM_PROMPT = `
You are Baseline Copilot, an AI assistant specialized in web Baseline compatibility. You have deep knowledge of:

1. **Web Baseline Standards**: You know which features are Baseline Widely, Baseline Newly, or not yet Baseline
2. **Browser Support**: Chrome, Firefox, Safari, Edge support for web features
3. **Feature Dates**: When features became Baseline (Baseline Widely/Newly dates)
4. **Code Solutions**: Provide working code examples and fallbacks
5. **Best Practices**: Modern web development with Baseline compliance

Key Baseline Knowledge:
- CSS Grid: Baseline Widely (2017)
- CSS Flexbox: Baseline Widely (2015) 
- CSS Custom Properties: Baseline Widely (2017)
- CSS Nesting: Baseline Widely (March 2024)
- CSS Container Queries: Baseline Widely (February 2023)
- CSS Subgrid: Baseline Widely (September 2023)
- :has() selector: Baseline Widely (December 2022)
- View Transitions API: Baseline Newly (November 2023)
- structuredClone: Baseline Widely (2021)
- Fetch API: Baseline Widely (2015)
- Promises: Baseline Widely (2015)

Always provide:
- ✅ Clear Baseline status (Widely/Newly/Not Baseline)
- 🌐 Browser support details
- 💡 Code examples with fallbacks
- 📅 When features became Baseline
- ⚠️ Warnings for non-Baseline features
- 🔧 Alternative solutions for better compatibility

Be helpful, accurate, and always prioritize Baseline compliance for production-ready code.
`

export const BASELINE_FEATURES_DATABASE = {
  'css-nesting': {
    name: 'CSS Nesting',
    baseline: 'widely',
    date: '2024-03-14',
    support: { chrome: '112', firefox: '117', safari: '16.5' },
    description: 'CSS Nesting allows you to nest CSS rules inside other rules'
  },
  'css-grid': {
    name: 'CSS Grid',
    baseline: 'widely',
    date: '2017-03-14',
    support: { chrome: '57', firefox: '52', safari: '10.1' },
    description: 'CSS Grid Layout for two-dimensional layouts'
  },
  'css-subgrid': {
    name: 'CSS Subgrid',
    baseline: 'widely',
    date: '2023-09-15',
    support: { chrome: '117', firefox: '71', safari: '16' },
    description: 'CSS Grid Subgrid for nested grid layouts'
  },
  'container-queries': {
    name: 'Container Queries',
    baseline: 'widely',
    date: '2023-02-14',
    support: { chrome: '105', firefox: '110', safari: '16' },
    description: 'CSS Container Queries for component-based responsive design'
  },
  'has-selector': {
    name: ':has() selector',
    baseline: 'widely',
    date: '2022-12-13',
    support: { chrome: '105', firefox: '103', safari: '15.4' },
    description: 'CSS :has() pseudo-class for parent selection'
  },
  'view-transitions': {
    name: 'View Transitions API',
    baseline: 'newly',
    date: '2023-11-01',
    support: { chrome: '111', firefox: '89', safari: '18' },
    description: 'View Transitions API for smooth page transitions'
  },
  'structured-clone': {
    name: 'structuredClone',
    baseline: 'widely',
    date: '2021-01-01',
    support: { chrome: '98', firefox: '94', safari: '15.2' },
    description: 'structuredClone API for deep cloning objects'
  },
  'fetch-api': {
    name: 'Fetch API',
    baseline: 'widely',
    date: '2015-01-01',
    support: { chrome: '42', firefox: '39', safari: '10.1' },
    description: 'Fetch API for making HTTP requests'
  },
  'promises': {
    name: 'Promises',
    baseline: 'widely',
    date: '2015-01-01',
    support: { chrome: '32', firefox: '29', safari: '8' },
    description: 'JavaScript Promises for asynchronous operations'
  },
  'word-break-auto-phrase': {
    name: 'word-break: auto-phrase',
    baseline: false,
    support: { chrome: '119' },
    description: 'CSS word-break auto-phrase value (Chrome-only)'
  }
}
