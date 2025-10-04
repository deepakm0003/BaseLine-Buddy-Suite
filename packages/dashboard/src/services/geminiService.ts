// Gemini API Service with robust error handling
const GEMINI_API_KEY = 'AIzaSyCPfgCWx3n6enM_NkQ58dezcqBJZqO5kME'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'

interface GeminiResponse {
  content: string
  isCode?: boolean
  baselineStatus?: 'safe' | 'warning' | 'unsafe'
  suggestions?: string[]
}

class GeminiService {
  private isApiConfigured(): boolean {
    return !!GEMINI_API_KEY && GEMINI_API_KEY.length > 20
  }

  async generateResponse(query: string): Promise<GeminiResponse> {
    console.log('GeminiService.generateResponse called with:', query)
    console.log('API configured:', this.isApiConfigured())
    
    // Always try API first if configured
    if (this.isApiConfigured()) {
      try {
        console.log('Attempting Gemini API call...')
        const response = await this.callGeminiAPI(query)
        if (response) {
          console.log('Gemini API response successful:', response)
          return response
        }
      } catch (error) {
        console.warn('Gemini API failed, falling back to intelligent responses:', error)
      }
    }

    console.log('Using fallback intelligent responses...')
    // Fallback to intelligent mock responses
    return this.getIntelligentResponse(query)
  }

  private async callGeminiAPI(query: string): Promise<GeminiResponse | null> {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Baseline Copilot, an AI assistant specialized in web development and Baseline compatibility. 

Context: You help developers understand web features, their browser support, and Baseline status.

User Query: ${query}

Please provide a helpful, accurate response. If the query is about web features, include Baseline status information. If it's about code, provide working examples. Be concise but comprehensive.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 10
          }
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const content = data.candidates[0].content.parts[0].text
        
        return {
          content: content,
          isCode: this.containsCode(content),
          baselineStatus: this.determineBaselineStatus(query, content),
          suggestions: this.extractSuggestions(content)
        }
      }

      return null
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }

  private getIntelligentResponse(query: string): GeminiResponse {
    const lowerQuery = query.toLowerCase()

    // Baseline-specific responses
    if (lowerQuery.includes('baseline') || lowerQuery.includes('compatibility')) {
      return {
        content: `🔍 **Baseline Compatibility Check**

Baseline is a web compatibility standard that indicates when a web feature is ready for production use. Here's what you need to know:

**Baseline Status Levels:**
- ✅ **Baseline Widely** - Safe for production, supported in all major browsers
- ⚠️ **Baseline Newly** - Recently available, use with progressive enhancement
- ❌ **Limited Support** - Not yet Baseline, requires polyfills or careful consideration

**How to Check:**
1. Visit [web.dev/baseline](https://web.dev/baseline) for official status
2. Use browser dev tools to test feature support
3. Implement progressive enhancement for newer features

**Best Practices:**
- Always provide fallbacks for non-Baseline features
- Use feature detection before using new APIs
- Test across different browsers and devices

Would you like me to check a specific feature's Baseline status?`,
        baselineStatus: 'safe'
      }
    }

    // CSS questions
    if (lowerQuery.includes('css') || lowerQuery.includes('styling')) {
      return {
        content: `🎨 **CSS Development Guide**

Here's a comprehensive guide to modern CSS:

**Layout Systems:**
\`\`\`css
/* CSS Grid - Baseline Widely Available */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Flexbox - Baseline Widely Available */
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

**Modern CSS Features:**
- **CSS Nesting** - Now Baseline Widely (March 2024)
- **Container Queries** - Baseline Widely (February 2023)
- **CSS Subgrid** - Baseline Widely (September 2023)
- **:has() selector** - Baseline Widely (December 2022)

**Best Practices:**
- Use CSS custom properties for theming
- Implement responsive design with mobile-first approach
- Leverage CSS Grid for complex layouts
- Use Flexbox for component-level layouts

What specific CSS topic would you like to explore?`,
        isCode: true,
        baselineStatus: 'safe'
      }
    }

    // JavaScript questions
    if (lowerQuery.includes('javascript') || lowerQuery.includes('js')) {
      return {
        content: `💻 **JavaScript Development Guide**

Modern JavaScript development with Baseline compatibility:

**ES6+ Features (Baseline Widely):**
\`\`\`javascript
// Async/Await - Baseline Widely Available
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Destructuring - Baseline Widely Available
const { name, email, age } = user;

// Arrow Functions - Baseline Widely Available
const processData = (data) => data.map(item => item.value);
\`\`\`

**Modern APIs:**
- **Fetch API** - Baseline Widely Available
- **Promises** - Baseline Widely Available
- **structuredClone** - Baseline Widely Available
- **View Transitions** - Baseline Newly Available

**Best Practices:**
- Use modern syntax with Babel for older browsers
- Implement progressive enhancement
- Test across different browsers
- Use feature detection for newer APIs

What JavaScript topic interests you?`,
        isCode: true,
        baselineStatus: 'safe'
      }
    }

    // General programming questions
    if (lowerQuery.includes('programming') || lowerQuery.includes('coding')) {
      return {
        content: `🚀 **Programming & Development**

I can help you with various programming topics:

**Web Development:**
- Frontend: HTML, CSS, JavaScript, React, Vue, Angular
- Backend: Node.js, Python, PHP, Java, C#
- Databases: SQL, NoSQL, MongoDB, PostgreSQL
- DevOps: Docker, CI/CD, Cloud platforms

**Programming Languages:**
- **JavaScript/TypeScript** - Web development, full-stack
- **Python** - Data science, AI, backend development
- **Java** - Enterprise applications, Android
- **C#** - .NET ecosystem, Windows applications
- **Go** - System programming, microservices
- **Rust** - Performance-critical applications

**Development Tools:**
- Version Control: Git, GitHub, GitLab
- IDEs: VS Code, IntelliJ, Sublime Text
- Testing: Jest, Cypress, Selenium
- Build Tools: Webpack, Vite, Parcel

What would you like to learn about?`,
        baselineStatus: 'safe'
      }
    }

    // Default response
    return {
      content: `🤖 **Baseline Copilot - Your AI Assistant**

I'm here to help you with web development, programming, and technology questions! I can assist with:

**🌐 Web Development:**
- HTML, CSS, JavaScript best practices
- React, Vue, Angular frameworks
- Browser compatibility and Baseline features
- Performance optimization

**💻 Programming:**
- Multiple programming languages
- Software architecture and design patterns
- Development tools and workflows
- Code optimization and debugging

**🔧 Technology:**
- AI and machine learning concepts
- Cloud computing and DevOps
- Emerging technologies and trends
- Technical problem-solving

Just ask me anything - I'm here to help! What would you like to know?`,
      baselineStatus: 'safe'
    }
  }

  private containsCode(content: string): boolean {
    return content.includes('```') || content.includes('`') || content.includes('function') || content.includes('const ')
  }

  private determineBaselineStatus(_query: string, content: string): 'safe' | 'warning' | 'unsafe' {
    const lowerContent = content.toLowerCase()
    
    if (lowerContent.includes('baseline widely') || lowerContent.includes('widely available')) {
      return 'safe'
    } else if (lowerContent.includes('baseline newly') || lowerContent.includes('newly available')) {
      return 'warning'
    } else if (lowerContent.includes('limited support') || lowerContent.includes('not supported')) {
      return 'unsafe'
    }
    
    return 'safe'
  }

  private extractSuggestions(content: string): string[] {
    const suggestions: string[] = []
    
    if (content.includes('progressive enhancement')) {
      suggestions.push('Use progressive enhancement for better browser support')
    }
    if (content.includes('feature detection')) {
      suggestions.push('Implement feature detection before using new APIs')
    }
    if (content.includes('fallback')) {
      suggestions.push('Always provide fallbacks for newer features')
    }
    
    return suggestions
  }
}

export default new GeminiService()
