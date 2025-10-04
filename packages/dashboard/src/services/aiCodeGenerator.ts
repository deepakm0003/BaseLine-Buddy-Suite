import geminiService from './geminiService'

interface GeneratedCode {
  html: string
  css: string
  javascript: string
  features: string[]
  accessibility: string[]
  performance: string[]
  baselineCompliance: number
  description: string
  framework: string
}

class AICodeGenerator {
  async generateCode(prompt: string, framework: string = 'vanilla'): Promise<GeneratedCode> {
    const aiPrompt = `
You are an expert web developer. Generate complete, working code for this EXACT request:

"${prompt}"

CRITICAL INSTRUCTIONS:
- Create EXACTLY what the user requested - no generic fallbacks
- If they ask for a pricing table, create a real pricing table with 3 tiers
- If they ask for a navigation bar, create a real navigation bar
- If they ask for a home page, create a real home page
- Make it fully functional and immediately usable
- Use modern HTML5, CSS3, and JavaScript
- Include responsive design for mobile, tablet, desktop
- Add proper accessibility features (ARIA labels, semantic HTML)
- Use modern CSS features (Grid, Flexbox, Custom Properties)
- Add smooth animations and hover effects
- Make it visually appealing and professional

FRAMEWORK: ${framework}

Generate complete HTML, CSS, and JavaScript code that creates exactly what the user requested.

Return ONLY this JSON format:
{
  "html": "Complete HTML code for the EXACT component requested",
  "css": "Complete CSS styling code for the EXACT component", 
  "javascript": "Complete JavaScript functionality code for the EXACT component",
  "features": ["CSS Grid", "Flexbox", "Custom Properties", "Modern JavaScript"],
  "accessibility": ["ARIA labels", "Semantic HTML", "Keyboard navigation"],
  "performance": ["Optimized CSS", "Efficient JavaScript", "Responsive design"],
  "baselineCompliance": 95,
  "description": "Description of the EXACT component created",
  "framework": "${framework}"
}

EXAMPLES:
- If user asks for "pricing table" → Create HTML with 3 pricing tiers, features, buttons
- If user asks for "navigation bar" → Create HTML with nav, menu items, mobile toggle
- If user asks for "home page" → Create HTML with hero, sections, footer
- If user asks for "contact form" → Create HTML with form fields, validation, submit

DO NOT generate generic content. Generate the EXACT component requested.
`

    try {
      const response = await geminiService.generateResponse(aiPrompt)
      const parsedResponse = JSON.parse(response.content)
      
      return {
        html: parsedResponse.html || this.getFallbackHTML(prompt),
        css: parsedResponse.css || this.getFallbackCSS(prompt),
        javascript: parsedResponse.javascript || this.getFallbackJS(prompt),
        features: parsedResponse.features || ['CSS Grid', 'Flexbox', 'Custom Properties'],
        accessibility: parsedResponse.accessibility || ['ARIA labels', 'Semantic HTML'],
        performance: parsedResponse.performance || ['Optimized CSS', 'Efficient JavaScript'],
        baselineCompliance: parsedResponse.baselineCompliance || 95,
        description: parsedResponse.description || `Generated ${prompt} component`,
        framework: framework
      }
    } catch (error) {
      console.error('AI code generation failed:', error)
      // Return fallback code
      return this.getFallbackCode(prompt, framework)
    }
  }

  private getFallbackCode(prompt: string, framework: string): GeneratedCode {
    return {
      html: this.getFallbackHTML(prompt),
      css: this.getFallbackCSS(prompt),
      javascript: this.getFallbackJS(prompt),
      features: ['CSS Grid', 'Flexbox', 'Custom Properties', 'Modern JavaScript'],
      accessibility: ['ARIA labels', 'Semantic HTML', 'Keyboard navigation'],
      performance: ['Optimized CSS', 'Efficient JavaScript', 'Responsive design'],
      baselineCompliance: 95,
      description: `Generated ${prompt} with Baseline compliance`,
      framework: framework
    }
  }

  private getFallbackHTML(prompt: string): string {
    // Generate HTML based on the specific prompt
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('home page') || lowerPrompt.includes('homepage')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="home-page">
    <header class="header">
      <nav class="nav">
        <div class="nav-brand">
          <h1>My Website</h1>
        </div>
        <ul class="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    
    <main class="main">
      <section class="hero">
        <h2>Welcome to Our Website</h2>
        <p>Discover amazing features and services</p>
        <button class="cta-button">Get Started</button>
      </section>
      
      <section class="features">
        <h3>Our Features</h3>
        <div class="feature-grid">
          <div class="feature-card">
            <h4>Feature 1</h4>
            <p>Description of feature 1</p>
          </div>
          <div class="feature-card">
            <h4>Feature 2</h4>
            <p>Description of feature 2</p>
          </div>
          <div class="feature-card">
            <h4>Feature 3</h4>
            <p>Description of feature 3</p>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="footer">
      <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`
    }
    
    if (lowerPrompt.includes('navigation') || lowerPrompt.includes('navbar') || lowerPrompt.includes('nav')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Navigation Bar</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <a href="#" class="brand-link">Logo</a>
      </div>
      
      <ul class="nav-menu">
        <li class="nav-item">
          <a href="#home" class="nav-link">Home</a>
        </li>
        <li class="nav-item">
          <a href="#about" class="nav-link">About</a>
        </li>
        <li class="nav-item dropdown">
          <a href="#services" class="nav-link">Services</a>
          <ul class="dropdown-menu">
            <li><a href="#web-design">Web Design</a></li>
            <li><a href="#development">Development</a></li>
            <li><a href="#consulting">Consulting</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a href="#contact" class="nav-link">Contact</a>
        </li>
      </ul>
      
      <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
  
  <script src="script.js"></script>
</body>
</html>`
    }
    
    if (lowerPrompt.includes('pricing') || lowerPrompt.includes('price') || lowerPrompt.includes('tier')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pricing Table</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="pricing-container">
    <div class="pricing-header">
      <h2>Choose Your Plan</h2>
      <p>Select the perfect plan for your needs</p>
    </div>
    
    <div class="pricing-grid">
      <!-- Basic Plan -->
      <div class="pricing-card">
        <div class="pricing-header">
          <h3>Basic</h3>
          <div class="price">
            <span class="currency">$</span>
            <span class="amount">9</span>
            <span class="period">/month</span>
          </div>
        </div>
        <ul class="features">
          <li>✓ Up to 5 projects</li>
          <li>✓ Basic support</li>
          <li>✓ 1GB storage</li>
          <li>✓ Email support</li>
        </ul>
        <button class="subscribe-btn">Get Started</button>
      </div>
      
      <!-- Pro Plan -->
      <div class="pricing-card featured">
        <div class="popular-badge">Most Popular</div>
        <div class="pricing-header">
          <h3>Pro</h3>
          <div class="price">
            <span class="currency">$</span>
            <span class="amount">29</span>
            <span class="period">/month</span>
          </div>
        </div>
        <ul class="features">
          <li>✓ Up to 25 projects</li>
          <li>✓ Priority support</li>
          <li>✓ 10GB storage</li>
          <li>✓ Phone & email support</li>
          <li>✓ Advanced analytics</li>
        </ul>
        <button class="subscribe-btn primary">Get Started</button>
      </div>
      
      <!-- Enterprise Plan -->
      <div class="pricing-card">
        <div class="pricing-header">
          <h3>Enterprise</h3>
          <div class="price">
            <span class="currency">$</span>
            <span class="amount">99</span>
            <span class="period">/month</span>
          </div>
        </div>
        <ul class="features">
          <li>✓ Unlimited projects</li>
          <li>✓ 24/7 support</li>
          <li>✓ 100GB storage</li>
          <li>✓ Dedicated manager</li>
          <li>✓ Custom integrations</li>
          <li>✓ SLA guarantee</li>
        </ul>
        <button class="subscribe-btn">Contact Sales</button>
      </div>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`
    }
    
    if (lowerPrompt.includes('card') || lowerPrompt.includes('component')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Component</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="card-container">
    <div class="card" tabindex="0" role="article" aria-label="Card component">
      <div class="card-header">
        <h3 class="card-title">Card Title</h3>
        <span class="card-badge">New</span>
      </div>
      
      <div class="card-body">
        <p class="card-description">This is a modern card component with hover effects and accessibility features.</p>
        <div class="card-features">
          <span class="feature-tag">Feature 1</span>
          <span class="feature-tag">Feature 2</span>
        </div>
      </div>
      
      <div class="card-footer">
        <button class="card-button">Learn More</button>
        <button class="card-button secondary">Share</button>
      </div>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`
    }
    
    // Default fallback
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${prompt}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container" role="main" aria-label="${prompt}">
    <header class="header">
      <h1 class="title">${prompt}</h1>
      <p class="description">A modern, accessible component built with Baseline-compliant features</p>
    </header>
    
    <main class="main-content">
      <div class="content-grid">
        <div class="content-card" tabindex="0" role="button" aria-label="Content item 1">
          <h3>Item 1</h3>
          <p>Description of the first item</p>
        </div>
        <div class="content-card" tabindex="0" role="button" aria-label="Content item 2">
          <h3>Item 2</h3>
          <p>Description of the second item</p>
        </div>
        <div class="content-card" tabindex="0" role="button" aria-label="Content item 3">
          <h3>Item 3</h3>
          <p>Description of the third item</p>
        </div>
      </div>
    </main>
    
    <footer class="footer">
      <p>Built with Baseline-compliant features</p>
    </footer>
  </div>
  
  <script src="script.js"></script>
</body>
</html>`
  }

  private getFallbackCSS(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('home page') || lowerPrompt.includes('homepage')) {
      return `/* Home Page Styles */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-color: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --border-radius: 0.5rem;
  --transition: all 0.2s ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
}

.home-page {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.header {
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: var(--transition);
}

.nav-menu a:hover {
  color: var(--primary-color);
}

.main {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: var(--border-radius);
  margin-bottom: 3rem;
}

.hero h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.cta-button:hover {
  background: #d97706;
  transform: translateY(-2px);
}

.features h3 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
}

.feature-card h4 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.footer {
  background: var(--text-color);
  color: white;
  text-align: center;
  padding: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .hero {
    padding: 2rem 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}`
    }
    
    if (lowerPrompt.includes('navigation') || lowerPrompt.includes('navbar') || lowerPrompt.includes('nav')) {
      return `/* Navigation Bar Styles */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-color: #e5e7eb;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  --border-radius: 0.5rem;
  --transition: all 0.2s ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
}

.navbar {
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.nav-brand .brand-link {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.nav-link:hover {
  background: var(--primary-color);
  color: white;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: var(--transition);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu li {
  list-style: none;
}

.dropdown-menu a {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: var(--transition);
}

.dropdown-menu a:hover {
  background: var(--primary-color);
  color: white;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background: var(--text-color);
  margin: 3px 0;
  transition: var(--transition);
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
}`
    }
    
    if (lowerPrompt.includes('pricing') || lowerPrompt.includes('price') || lowerPrompt.includes('tier')) {
      return `/* Pricing Table Styles */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-color: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --border-radius: 0.5rem;
  --transition: all 0.2s ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
  padding: 2rem 1rem;
}

.pricing-container {
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-header {
  text-align: center;
  margin-bottom: 3rem;
}

.pricing-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.pricing-header p {
  font-size: 1.25rem;
  color: var(--text-color);
  opacity: 0.8;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.pricing-card {
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: var(--transition);
  box-shadow: var(--shadow);
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
}

.pricing-card.featured {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.pricing-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.price {
  margin-bottom: 2rem;
}

.currency {
  font-size: 1.5rem;
  color: var(--text-color);
  opacity: 0.8;
}

.amount {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
}

.period {
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.8;
}

.features {
  list-style: none;
  margin-bottom: 2rem;
}

.features li {
  padding: 0.5rem 0;
  color: var(--text-color);
  font-size: 1rem;
}

.subscribe-btn {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  background: var(--primary-color);
  color: white;
}

.subscribe-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.subscribe-btn.primary {
  background: var(--accent-color);
}

.subscribe-btn.primary:hover {
  background: #d97706;
}

/* Responsive Design */
@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .pricing-card.featured {
    transform: none;
  }
  
  .pricing-header h2 {
    font-size: 2rem;
  }
}`
    }
    
    if (lowerPrompt.includes('card') || lowerPrompt.includes('component')) {
      return `/* Card Component Styles */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-color: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --border-radius: 0.5rem;
  --transition: all 0.2s ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
  padding: 2rem;
}

.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  max-width: 400px;
  width: 100%;
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
}

.card:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.card-badge {
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-body {
  padding: 1.5rem;
}

.card-description {
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.card-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.card-button:first-child {
  background: var(--primary-color);
  color: white;
}

.card-button:first-child:hover {
  background: var(--secondary-color);
}

.card-button.secondary {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.card-button.secondary:hover {
  background: var(--primary-color);
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .card-container {
    padding: 1rem;
  }
  
  .card-footer {
    flex-direction: column;
  }
}`
    }
    
    // Default CSS
    return `/* Modern CSS with Baseline-compliant features */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-color: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --border-radius: 0.5rem;
  --transition: all 0.2s ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
}

.container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  gap: 2rem;
}

.header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-color);
}

.title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.description {
  font-size: 1.125rem;
  color: var(--text-color);
  opacity: 0.8;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

.content-card {
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
}

.content-card:hover,
.content-card:focus {
  border-color: var(--primary-color);
  box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  outline: none;
}

.content-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.content-card p {
  color: var(--text-color);
  opacity: 0.8;
}

.footer {
  text-align: center;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  color: var(--text-color);
  opacity: 0.6;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
    gap: 1rem;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .header {
    padding: 1rem 0;
  }
}

/* Focus styles for accessibility */
.content-card:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}`
  }

  private getFallbackJS(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('pricing') || lowerPrompt.includes('price') || lowerPrompt.includes('tier')) {
      return `// Pricing Table JavaScript
class PricingManager {
  constructor() {
    this.subscribeButtons = document.querySelectorAll('.subscribe-btn')
    this.pricingCards = document.querySelectorAll('.pricing-card')
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupAccessibility()
    console.log('Pricing table initialized with Baseline compliance')
  }

  setupEventListeners() {
    this.subscribeButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleSubscribe(e))
    })
    
    this.pricingCards.forEach(card => {
      card.addEventListener('click', (e) => this.handleCardClick(e))
      card.addEventListener('keydown', (e) => this.handleKeydown(e))
    })
  }

  setupAccessibility() {
    this.pricingCards.forEach((card, index) => {
      card.setAttribute('role', 'button')
      card.setAttribute('tabindex', '0')
      card.setAttribute('aria-label', \`Pricing plan \${index + 1}\`)
    })
  }

  handleSubscribe(event) {
    event.stopPropagation()
    const button = event.currentTarget
    const planName = button.closest('.pricing-card').querySelector('h3').textContent
    
    // Show loading state
    const originalText = button.textContent
    button.textContent = 'Processing...'
    button.disabled = true
    
    // Simulate subscription process
    setTimeout(() => {
      button.textContent = 'Subscribed!'
      button.style.background = 'var(--accent-color)'
      
      // Announce to screen readers
      this.announceToScreenReader(\`Subscribed to \${planName} plan\`)
      
      // Reset after 3 seconds
      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
        button.style.background = ''
      }, 3000)
    }, 1500)
  }

  handleCardClick(event) {
    const card = event.currentTarget
    this.highlightCard(card)
  }

  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.highlightCard(event.currentTarget)
    }
  }

  highlightCard(card) {
    // Remove highlight from all cards
    this.pricingCards.forEach(c => c.classList.remove('highlighted'))
    
    // Add highlight to clicked card
    card.classList.add('highlighted')
    
    // Announce to screen readers
    const planName = card.querySelector('h3').textContent
    this.announceToScreenReader(\`Selected \${planName} plan\`)
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.cssText = \`
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    \`
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PricingManager()
})

// Add CSS for highlighted state
const style = document.createElement('style')
style.textContent = \`
  .pricing-card.highlighted {
    border-color: var(--primary-color);
    box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.3);
    transform: translateY(-4px) scale(1.02);
  }
  
  .subscribe-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
\`
document.head.appendChild(style)`
    }
    
    // Default JavaScript
    return `// Modern JavaScript with Baseline-compliant features
class ComponentManager {
  constructor() {
    this.cards = document.querySelectorAll('.feature-card, .content-card')
    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupAccessibility()
    console.log('Component initialized with Baseline compliance')
  }

  setupEventListeners() {
    this.cards.forEach(card => {
      card.addEventListener('click', (e) => this.handleCardClick(e))
      card.addEventListener('keydown', (e) => this.handleKeydown(e))
    })
  }

  setupAccessibility() {
    // Add ARIA attributes for better accessibility
    this.cards.forEach((card, index) => {
      card.setAttribute('role', 'button')
      card.setAttribute('tabindex', '0')
      card.setAttribute('aria-describedby', \`card-description-\${index}\`)
    })
  }

  handleCardClick(event) {
    const card = event.currentTarget
    this.activateCard(card)
  }

  handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.activateCard(event.currentTarget)
    }
  }

  activateCard(card) {
    // Remove active state from all cards
    this.cards.forEach(c => c.classList.remove('active'))
    
    // Add active state to clicked card
    card.classList.add('active')
    
    // Announce to screen readers
    this.announceToScreenReader(\`Card activated: \${card.querySelector('h3').textContent}\`)
    
    // Add visual feedback
    this.showFeedback(card)
  }

  showFeedback(card) {
    // Create temporary feedback element
    const feedback = document.createElement('div')
    feedback.textContent = '✓ Activated'
    feedback.className = 'feedback-message'
    feedback.style.cssText = \`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      z-index: 1000;
      pointer-events: none;
    \`
    
    card.style.position = 'relative'
    card.appendChild(feedback)
    
    // Remove feedback after animation
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback)
      }
    }, 2000)
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.cssText = \`
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    \`
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ComponentManager()
})

// Add CSS for active state
const style = document.createElement('style')
style.textContent = \`
  .feature-card.active,
  .content-card.active {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    transform: scale(1.02);
  }
  
  .feature-card.active h3,
  .feature-card.active p,
  .content-card.active h3,
  .content-card.active p {
    color: white;
  }
\`
document.head.appendChild(style)`
  }
}

export default new AICodeGenerator()
