// import baselineDataService from './baselineDataService'

interface WebsiteContent {
  html: string
  css: string[]
  javascript: string[]
  url: string
  title: string
  description: string
}

interface AnalysisResult {
  url: string
  timestamp: Date
  overallScore: number
  baselineCompliance: number
  performanceImpact: number
  modernAlternatives: number
  totalIssues: number
  criticalIssues: number
  warnings: number
  suggestions: number
  features: {
    used: Array<{
      name: string
      status: 'baseline' | 'newly' | 'limited'
      impact: 'high' | 'medium' | 'low'
      description: string
      browserSupport: Record<string, string>
      suggestion?: string
      foundIn: string
      lineNumber?: number
    }>
    missing: Array<{
      name: string
      benefit: string
      implementation: string
      example: string
    }>
  }
  performance: {
    bundleSizeReduction: number
    loadTimeImprovement: number
    polyfillElimination: number
  }
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    impact: string
    effort: string
    codeExample?: string
  }>
}

class WebsiteAnalyzer {
  private async fetchWebsiteContent(url: string): Promise<WebsiteContent> {
    try {
      // Add CORS proxy for development
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      const response = await fetch(proxyUrl)
      const data = await response.json()
      
      if (!data.contents) {
        throw new Error('Failed to fetch website content')
      }

      const html = data.contents
      
      // Extract CSS and JS from HTML
      const cssLinks = this.extractCSSLinks(html)
      const jsScripts = this.extractJSScripts(html)
      
      // Extract inline CSS and JS
      const inlineCSS = this.extractInlineCSS(html)
      const inlineJS = this.extractInlineJS(html)
      
      // Get title and description
      const title = this.extractTitle(html)
      const description = this.extractDescription(html)

      return {
        html,
        css: [...cssLinks, ...inlineCSS],
        javascript: [...jsScripts, ...inlineJS],
        url,
        title,
        description
      }
    } catch (error) {
      console.error('Error fetching website:', error)
      throw new Error('Failed to fetch website content. Please check the URL and try again.')
    }
  }

  private extractCSSLinks(html: string): string[] {
    const cssRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi
    const matches = html.match(cssRegex)
    return matches ? matches.map(match => {
      const hrefMatch = match.match(/href=["']([^"']+)["']/)
      return hrefMatch ? hrefMatch[1] : ''
    }).filter(Boolean) : []
  }

  private extractJSScripts(html: string): string[] {
    const jsRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi
    const matches = html.match(jsRegex)
    return matches ? matches.map(match => {
      const srcMatch = match.match(/src=["']([^"']+)["']/)
      return srcMatch ? srcMatch[1] : ''
    }).filter(Boolean) : []
  }

  private extractInlineCSS(html: string): string[] {
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
    const matches = html.match(styleRegex)
    return matches ? matches.map(match => {
      const contentMatch = match.match(/<style[^>]*>([\s\S]*?)<\/style>/)
      return contentMatch ? contentMatch[1] : ''
    }).filter(Boolean) : []
  }

  private extractInlineJS(html: string): string[] {
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
    const matches = html.match(scriptRegex)
    return matches ? matches.map(match => {
      const contentMatch = match.match(/<script[^>]*>([\s\S]*?)<\/script>/)
      return contentMatch ? contentMatch[1] : ''
    }).filter(Boolean) : []
  }

  private extractTitle(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    return titleMatch ? titleMatch[1].trim() : 'Untitled'
  }

  private extractDescription(html: string): string {
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    return descMatch ? descMatch[1].trim() : ''
  }

  private detectBaselineFeatures(content: string, type: 'html' | 'css' | 'js'): Array<{
    name: string
    status: 'baseline' | 'newly' | 'limited'
    impact: 'high' | 'medium' | 'low'
    description: string
    browserSupport: Record<string, string>
    suggestion?: string
    foundIn: string
    lineNumber?: number
  }> {
    const features: Array<{
      name: string
      status: 'baseline' | 'newly' | 'limited'
      impact: 'high' | 'medium' | 'low'
      description: string
      browserSupport: Record<string, string>
      suggestion?: string
      foundIn: string
      lineNumber?: number
    }> = []

    const lines = content.split('\n')

    // CSS Features Detection
    if (type === 'css' || type === 'html') {
      // CSS Grid
      if (content.includes('display: grid') || content.includes('display:grid')) {
        const lineNumber = lines.findIndex(line => line.includes('display: grid') || line.includes('display:grid'))
        features.push({
          name: 'CSS Grid',
          status: 'baseline',
          impact: 'high',
          description: 'Modern CSS layout system',
          browserSupport: { chrome: '57+', firefox: '52+', safari: '10.1+' },
          suggestion: 'Excellent! CSS Grid is Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // CSS Flexbox
      if (content.includes('display: flex') || content.includes('display:flex')) {
        const lineNumber = lines.findIndex(line => line.includes('display: flex') || line.includes('display:flex'))
        features.push({
          name: 'CSS Flexbox',
          status: 'baseline',
          impact: 'high',
          description: 'Flexible box layout',
          browserSupport: { chrome: '29+', firefox: '28+', safari: '9+' },
          suggestion: 'Great! Flexbox is Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // CSS Custom Properties
      if (content.includes('--') && (content.includes('var(') || content.includes(':root'))) {
        const lineNumber = lines.findIndex(line => line.includes('--') && (line.includes('var(') || line.includes(':root')))
        features.push({
          name: 'CSS Custom Properties',
          status: 'baseline',
          impact: 'high',
          description: 'CSS variables for dynamic styling',
          browserSupport: { chrome: '49+', firefox: '31+', safari: '9.1+' },
          suggestion: 'Perfect! CSS Custom Properties are Baseline.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // CSS Container Queries
      if (content.includes('@container') || content.includes('container-type')) {
        const lineNumber = lines.findIndex(line => line.includes('@container') || line.includes('container-type'))
        features.push({
          name: 'CSS Container Queries',
          status: 'baseline',
          impact: 'medium',
          description: 'Component-based responsive design',
          browserSupport: { chrome: '105+', firefox: '110+', safari: '16+' },
          suggestion: 'Good! Container Queries are now Baseline.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // CSS Nesting
      if (content.includes('&') && content.includes('{')) {
        const lineNumber = lines.findIndex(line => line.includes('&') && line.includes('{'))
        features.push({
          name: 'CSS Nesting',
          status: 'baseline',
          impact: 'medium',
          description: 'Nested CSS rules for better organization',
          browserSupport: { chrome: '112+', firefox: '117+', safari: '16.5+' },
          suggestion: 'Excellent! CSS Nesting is now Baseline.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // :has() selector
      if (content.includes(':has(')) {
        const lineNumber = lines.findIndex(line => line.includes(':has('))
        features.push({
          name: ':has() selector',
          status: 'baseline',
          impact: 'medium',
          description: 'Parent selector for complex styling',
          browserSupport: { chrome: '105+', firefox: '103+', safari: '15.4+' },
          suggestion: 'Great! :has() selector is now Baseline.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // View Transitions
      if (content.includes('view-transition') || content.includes('startViewTransition')) {
        const lineNumber = lines.findIndex(line => line.includes('view-transition') || line.includes('startViewTransition'))
        features.push({
          name: 'View Transitions',
          status: 'newly',
          impact: 'low',
          description: 'Smooth transitions between page states',
          browserSupport: { chrome: '111+', firefox: 'Not supported', safari: 'Not supported' },
          suggestion: 'Use with caution. View Transitions are newly available but not widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // CSS Subgrid
      if (content.includes('subgrid')) {
        const lineNumber = lines.findIndex(line => line.includes('subgrid'))
        features.push({
          name: 'CSS Subgrid',
          status: 'newly',
          impact: 'low',
          description: 'Nested grid layouts',
          browserSupport: { chrome: '117+', firefox: '71+', safari: '16+' },
          suggestion: 'Consider progressive enhancement. Subgrid is newly available.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }
    }

    // JavaScript Features Detection
    if (type === 'js' || type === 'html') {
      // Fetch API
      if (content.includes('fetch(') || content.includes('fetch (')) {
        const lineNumber = lines.findIndex(line => line.includes('fetch(') || line.includes('fetch ('))
        features.push({
          name: 'Fetch API',
          status: 'baseline',
          impact: 'high',
          description: 'Modern replacement for XMLHttpRequest',
          browserSupport: { chrome: '42+', firefox: '39+', safari: '10.1+' },
          suggestion: 'Perfect! Fetch API is Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // Promises
      if (content.includes('Promise') || content.includes('.then(') || content.includes('async ')) {
        const lineNumber = lines.findIndex(line => line.includes('Promise') || line.includes('.then(') || line.includes('async '))
        features.push({
          name: 'Promises',
          status: 'baseline',
          impact: 'high',
          description: 'Asynchronous programming with Promises',
          browserSupport: { chrome: '32+', firefox: '29+', safari: '8+' },
          suggestion: 'Excellent! Promises are Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // Async/Await
      if (content.includes('async ') && content.includes('await ')) {
        const lineNumber = lines.findIndex(line => line.includes('async ') && line.includes('await '))
        features.push({
          name: 'Async/Await',
          status: 'baseline',
          impact: 'high',
          description: 'Modern asynchronous JavaScript syntax',
          browserSupport: { chrome: '55+', firefox: '52+', safari: '10.1+' },
          suggestion: 'Great! Async/await is Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // Arrow Functions
      if (content.includes('=>') || content.includes('() =>')) {
        const lineNumber = lines.findIndex(line => line.includes('=>') || line.includes('() =>'))
        features.push({
          name: 'Arrow Functions',
          status: 'baseline',
          impact: 'high',
          description: 'Concise function syntax',
          browserSupport: { chrome: '45+', firefox: '22+', safari: '10+' },
          suggestion: 'Perfect! Arrow functions are Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // Template Literals
      if (content.includes('`') && content.includes('${')) {
        const lineNumber = lines.findIndex(line => line.includes('`') && line.includes('${'))
        features.push({
          name: 'Template Literals',
          status: 'baseline',
          impact: 'high',
          description: 'String interpolation with template literals',
          browserSupport: { chrome: '41+', firefox: '34+', safari: '9+' },
          suggestion: 'Excellent! Template literals are Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // Destructuring
      if (content.includes('{') && content.includes('}') && (content.includes('const {') || content.includes('let {'))) {
        const lineNumber = lines.findIndex(line => line.includes('{') && line.includes('}') && (line.includes('const {') || line.includes('let {')))
        features.push({
          name: 'Destructuring',
          status: 'baseline',
          impact: 'high',
          description: 'Extract values from objects and arrays',
          browserSupport: { chrome: '49+', firefox: '41+', safari: '8+' },
          suggestion: 'Great! Destructuring is Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }

      // Modules (import/export)
      if (content.includes('import ') || content.includes('export ')) {
        const lineNumber = lines.findIndex(line => line.includes('import ') || line.includes('export '))
        features.push({
          name: 'ES6 Modules',
          status: 'baseline',
          impact: 'high',
          description: 'Modern JavaScript module system',
          browserSupport: { chrome: '61+', firefox: '60+', safari: '10.1+' },
          suggestion: 'Perfect! ES6 modules are Baseline and widely supported.',
          foundIn: type,
          lineNumber: lineNumber + 1
        })
      }
    }

    return features
  }

  private calculatePerformanceImpact(features: any[]): {
    bundleSizeReduction: number
    loadTimeImprovement: number
    polyfillElimination: number
  } {
    const baselineFeatures = features.filter(f => f.status === 'baseline').length
    const totalFeatures = features.length
    
    const bundleSizeReduction = Math.min(90, (baselineFeatures / totalFeatures) * 100)
    const loadTimeImprovement = Math.min(50, (baselineFeatures / totalFeatures) * 30)
    const polyfillElimination = Math.min(15, baselineFeatures)

    return {
      bundleSizeReduction: Math.round(bundleSizeReduction),
      loadTimeImprovement: Math.round(loadTimeImprovement),
      polyfillElimination: Math.round(polyfillElimination)
    }
  }

  private generateRecommendations(_features: any[], content: string): Array<{
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    impact: string
    effort: string
    codeExample?: string
  }> {
    const recommendations: Array<{
      priority: 'high' | 'medium' | 'low'
      title: string
      description: string
      impact: string
      effort: string
      codeExample?: string
    }> = []

    // Check for jQuery usage
    if (content.includes('jQuery') || content.includes('$(') || content.includes('jquery')) {
      recommendations.push({
        priority: 'high',
        title: 'Replace jQuery with modern JavaScript',
        description: 'jQuery is no longer needed with modern Baseline features',
        impact: 'High performance improvement and reduced bundle size',
        effort: 'Medium - requires refactoring existing code',
        codeExample: '// Instead of: $(".button").click()\n// Use: document.querySelector(".button").addEventListener("click")'
      })
    }

    // Check for old CSS practices
    if (content.includes('float:') && !content.includes('display: grid') && !content.includes('display: flex')) {
      recommendations.push({
        priority: 'high',
        title: 'Replace float layouts with CSS Grid or Flexbox',
        description: 'Modern layout systems provide better control and responsiveness',
        impact: 'Better responsive design and easier maintenance',
        effort: 'Medium - requires CSS refactoring',
        codeExample: '.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n}'
      })
    }

    // Check for missing modern features
    if (!content.includes('display: grid') && !content.includes('display: flex')) {
      recommendations.push({
        priority: 'medium',
        title: 'Implement CSS Grid or Flexbox',
        description: 'Modern layout systems for better responsive design',
        impact: 'Improved layout control and responsiveness',
        effort: 'Low - mostly CSS changes',
        codeExample: '.container {\n  display: grid;\n  gap: 1rem;\n}'
      })
    }

    if (!content.includes('--') && !content.includes('var(')) {
      recommendations.push({
        priority: 'medium',
        title: 'Add CSS Custom Properties',
        description: 'Use CSS variables for better maintainability',
        impact: 'Easier theming and maintenance',
        effort: 'Low - mostly CSS refactoring',
        codeExample: ':root {\n  --primary-color: #007bff;\n}\n.button {\n  background-color: var(--primary-color);\n}'
      })
    }

    if (!content.includes('fetch(') && content.includes('XMLHttpRequest')) {
      recommendations.push({
        priority: 'high',
        title: 'Replace XMLHttpRequest with Fetch API',
        description: 'Fetch API is more modern and Baseline',
        impact: 'Better performance and modern syntax',
        effort: 'Medium - requires JavaScript refactoring',
        codeExample: '// Instead of XMLHttpRequest\nfetch("/api/data")\n  .then(response => response.json())\n  .then(data => console.log(data));'
      })
    }

    return recommendations
  }

  async analyzeWebsite(url: string): Promise<AnalysisResult> {
    try {
      // Fetch website content
      const content = await this.fetchWebsiteContent(url)
      
      // Combine all content for analysis
      const allContent = [
        content.html,
        ...content.css,
        ...content.javascript
      ].join('\n')

      // Detect features in different content types
      const htmlFeatures = this.detectBaselineFeatures(content.html, 'html')
      const cssFeatures = content.css.flatMap(css => this.detectBaselineFeatures(css, 'css'))
      const jsFeatures = content.javascript.flatMap(js => this.detectBaselineFeatures(js, 'js'))

      const allFeatures = [...htmlFeatures, ...cssFeatures, ...jsFeatures]

      // Remove duplicates
      const uniqueFeatures = allFeatures.filter((feature, index, self) => 
        index === self.findIndex(f => f.name === feature.name)
      )

      // Calculate scores
      const baselineFeatures = uniqueFeatures.filter(f => f.status === 'baseline')
      const newlyFeatures = uniqueFeatures.filter(f => f.status === 'newly')
      const limitedFeatures = uniqueFeatures.filter(f => f.status === 'limited')

      const baselineCompliance = uniqueFeatures.length > 0 ? 
        Math.round((baselineFeatures.length / uniqueFeatures.length) * 100) : 0

      const overallScore = Math.round(
        (baselineCompliance * 0.6) + 
        (Math.max(0, 100 - (limitedFeatures.length * 10)) * 0.4)
      )

      const performanceImpact = this.calculatePerformanceImpact(uniqueFeatures)
      const modernAlternatives = Math.round((baselineFeatures.length / Math.max(uniqueFeatures.length, 1)) * 100)

      // Generate recommendations
      const recommendations = this.generateRecommendations(uniqueFeatures, allContent)

      // Calculate issues
      const criticalIssues = limitedFeatures.length
      const warnings = newlyFeatures.length
      const suggestions = recommendations.length
      const totalIssues = criticalIssues + warnings + suggestions

      // Missing features (suggestions for improvement)
      const missingFeatures = [
        {
          name: 'CSS Container Queries',
          benefit: 'Component-based responsive design without media queries',
          implementation: 'Use @container for component-level responsive design',
          example: '@container (min-width: 300px) { .card { display: flex; } }'
        },
        {
          name: 'CSS :has() selector',
          benefit: 'Parent selection without JavaScript',
          implementation: 'Use :has() for complex selector patterns',
          example: '.card:has(.button) { border: 2px solid blue; }'
        },
        {
          name: 'CSS Nesting',
          benefit: 'Better code organization and maintainability',
          implementation: 'Nest CSS rules inside parent selectors',
          example: '.card { color: blue; &:hover { color: red; } }'
        }
      ].filter(feature => 
        !uniqueFeatures.some(f => f.name === feature.name)
      )

      return {
        url,
        timestamp: new Date(),
        overallScore,
        baselineCompliance,
        performanceImpact: Math.round(performanceImpact.bundleSizeReduction),
        modernAlternatives,
        totalIssues,
        criticalIssues,
        warnings,
        suggestions,
        features: {
          used: uniqueFeatures,
          missing: missingFeatures
        },
        performance: performanceImpact,
        recommendations
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      throw error
    }
  }
}

export default new WebsiteAnalyzer()
