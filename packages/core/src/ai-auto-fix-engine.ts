/**
 * AI Auto-Fix Engine - Intelligent code analysis and automatic fixes
 * 
 * This module provides AI-powered automatic fixes for Baseline compliance issues
 * with detailed explanations and smart code replacements.
 */

export interface AutoFixSuggestion {
  id: string;
  originalCode: string;
  fixedCode: string;
  explanation: string;
  confidence: number; // 0-1
  baselineStatus: 'widely' | 'newly' | 'limited';
  browserSupport: {
    chrome: string;
    firefox: string;
    safari: string;
    edge: string;
  };
  alternatives: string[];
  reasoning: string;
  category: 'css' | 'javascript' | 'html';
  severity: 'error' | 'warning' | 'info';
}

export interface FixContext {
  filePath: string;
  lineNumber: number;
  columnNumber: number;
  fileType: 'css' | 'js' | 'ts' | 'jsx' | 'tsx' | 'html';
  surroundingCode: string;
  projectType: 'react' | 'vue' | 'angular' | 'vanilla' | 'node';
}

export class AIAutoFixEngine {
  private fixDatabase: Map<string, AutoFixSuggestion[]> = new Map();
  private confidenceThreshold = 0.7;

  constructor() {
    this.initializeFixDatabase();
  }

  /**
   * Analyze code and generate automatic fixes
   */
  async analyzeAndFix(code: string, context: FixContext): Promise<AutoFixSuggestion[]> {
    const issues = this.detectBaselineIssues(code, context);
    const fixes: AutoFixSuggestion[] = [];

    for (const issue of issues) {
      const fix = await this.generateFix(issue, context);
      if (fix && fix.confidence >= this.confidenceThreshold) {
        fixes.push(fix);
      }
    }

    return fixes;
  }

  /**
   * Apply a specific fix to code
   */
  applyFix(code: string, fix: AutoFixSuggestion, context: FixContext): string {
    const lines = code.split('\n');
    const targetLine = lines[context.lineNumber - 1];
    
    if (targetLine.includes(fix.originalCode)) {
      const fixedLine = targetLine.replace(fix.originalCode, fix.fixedCode);
      lines[context.lineNumber - 1] = fixedLine;
      return lines.join('\n');
    }
    
    return code;
  }

  /**
   * Get detailed explanation for a fix
   */
  getFixExplanation(fix: AutoFixSuggestion): string {
    return `
🤖 AI Auto-Fix Applied

Original: ${fix.originalCode}
Fixed: ${fix.fixedCode}

📊 Baseline Status: ${fix.baselineStatus.toUpperCase()}
🎯 Confidence: ${Math.round(fix.confidence * 100)}%

💡 Explanation:
${fix.explanation}

🔍 Reasoning:
${fix.reasoning}

🌐 Browser Support:
• Chrome: ${fix.browserSupport.chrome}
• Firefox: ${fix.browserSupport.firefox}
• Safari: ${fix.browserSupport.safari}
• Edge: ${fix.browserSupport.edge}

🔄 Alternatives:
${fix.alternatives.map(alt => `• ${alt}`).join('\n')}
    `.trim();
  }

  /**
   * Detect Baseline issues in code
   */
  private detectBaselineIssues(code: string, context: FixContext): string[] {
    const issues: string[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      // CSS Issues
      if (context.fileType === 'css' || line.includes(':')) {
        // word-break: auto-phrase
        if (line.includes('word-break: auto-phrase') || line.includes('word-break:auto-phrase')) {
          issues.push('word-break: auto-phrase');
        }
        
        // CSS Grid with subgrid
        if (line.includes('subgrid')) {
          issues.push('subgrid');
        }
        
        // Container queries
        if (line.includes('@container')) {
          issues.push('@container');
        }
        
        // :has() selector
        if (line.includes(':has(')) {
          issues.push(':has()');
        }
        
        // CSS Nesting
        if (line.includes('&') && line.includes('{')) {
          issues.push('css-nesting');
        }
        
        // View Transitions
        if (line.includes('view-transition-name')) {
          issues.push('view-transitions');
        }
      }

      // JavaScript Issues
      if (context.fileType === 'js' || context.fileType === 'ts' || context.fileType === 'jsx' || context.fileType === 'tsx') {
        // Modern JavaScript features
        if (line.includes('??') && !line.includes('??=')) {
          issues.push('nullish-coalescing');
        }
        
        if (line.includes('?.') && !line.includes('?.(')) {
          issues.push('optional-chaining');
        }
        
        if (line.includes('async') && line.includes('await')) {
          issues.push('async-await');
        }
      }

      // HTML Issues
      if (context.fileType === 'html') {
        if (line.includes('<dialog>')) {
          issues.push('<dialog>');
        }
        
        if (line.includes('<details>')) {
          issues.push('<details>');
        }
      }
    });

    return issues;
  }

  /**
   * Generate fix for a specific issue
   */
  private async generateFix(issue: string, context: FixContext): Promise<AutoFixSuggestion | null> {
    const fixKey = `${issue}-${context.fileType}`;
    const availableFixes = this.fixDatabase.get(fixKey);
    
    if (!availableFixes || availableFixes.length === 0) {
      return null;
    }

    // Select the best fix based on context
    const bestFix = this.selectBestFix(availableFixes, context);
    return bestFix;
  }

  /**
   * Select the best fix based on context
   */
  private selectBestFix(fixes: AutoFixSuggestion[], context: FixContext): AutoFixSuggestion {
    // Sort by confidence and baseline status
    return fixes.sort((a, b) => {
      if (a.baselineStatus === 'widely' && b.baselineStatus !== 'widely') return -1;
      if (b.baselineStatus === 'widely' && a.baselineStatus !== 'widely') return 1;
      return b.confidence - a.confidence;
    })[0];
  }

  /**
   * Initialize the fix database with comprehensive fixes
   */
  private initializeFixDatabase(): void {
    // CSS Fixes
    this.addFix('word-break: auto-phrase-css', {
      id: 'word-break-autophrase-fix',
      originalCode: 'word-break: auto-phrase',
      fixedCode: 'word-break: break-word',
      explanation: 'Replaced auto-phrase with break-word for full Baseline support. Auto-phrase is only supported in Chrome and may be safe in future Baseline releases.',
      confidence: 0.95,
      baselineStatus: 'widely',
      browserSupport: {
        chrome: '117',
        firefox: 'N/A',
        safari: 'N/A',
        edge: '117'
      },
      alternatives: [
        'word-break: break-all',
        'word-break: keep-all',
        'overflow-wrap: break-word'
      ],
      reasoning: 'break-word provides better cross-browser compatibility and is Baseline Widely available.',
      category: 'css',
      severity: 'error'
    });

    this.addFix('subgrid-css', {
      id: 'subgrid-fix',
      originalCode: 'subgrid',
      fixedCode: 'grid',
      explanation: 'Replaced subgrid with grid for better Baseline support. Subgrid is Baseline Newly available and may need fallbacks.',
      confidence: 0.85,
      baselineStatus: 'newly',
      browserSupport: {
        chrome: '117',
        firefox: '71',
        safari: '16',
        edge: '117'
      },
      alternatives: [
        'display: grid',
        'display: flex',
        'display: block'
      ],
      reasoning: 'Standard grid provides better browser support while subgrid offers advanced features.',
      category: 'css',
      severity: 'warning'
    });

    this.addFix('@container-css', {
      id: 'container-queries-fix',
      originalCode: '@container',
      fixedCode: '@media (min-width: 768px)',
      explanation: 'Replaced container queries with media queries for better Baseline support. Container queries are Baseline Newly available.',
      confidence: 0.80,
      baselineStatus: 'newly',
      browserSupport: {
        chrome: '105',
        firefox: '110',
        safari: '16',
        edge: '105'
      },
      alternatives: [
        '@media (min-width: 768px)',
        '@media (max-width: 1024px)',
        'JavaScript-based container detection'
      ],
      reasoning: 'Media queries provide similar functionality with better browser support.',
      category: 'css',
      severity: 'warning'
    });

    this.addFix(':has()-css', {
      id: 'has-selector-fix',
      originalCode: ':has(',
      fixedCode: '.has-',
      explanation: 'Replaced :has() selector with class-based approach for better Baseline support. :has() is Baseline Newly available.',
      confidence: 0.75,
      baselineStatus: 'newly',
      browserSupport: {
        chrome: '105',
        firefox: '103',
        safari: '15.4',
        edge: '105'
      },
      alternatives: [
        'JavaScript querySelector',
        'Class-based selectors',
        'CSS-in-JS solutions'
      ],
      reasoning: 'Class-based selectors provide better browser compatibility.',
      category: 'css',
      severity: 'warning'
    });

    this.addFix('css-nesting-css', {
      id: 'css-nesting-fix',
      originalCode: '&',
      fixedCode: '.parent',
      explanation: 'Replaced CSS nesting with traditional selectors for better Baseline support. CSS nesting is Baseline Newly available.',
      confidence: 0.70,
      baselineStatus: 'newly',
      browserSupport: {
        chrome: '112',
        firefox: '117',
        safari: '16.5',
        edge: '112'
      },
      alternatives: [
        'Traditional CSS selectors',
        'CSS-in-JS solutions',
        'SCSS/Sass preprocessing'
      ],
      reasoning: 'Traditional selectors provide better browser support and are more widely understood.',
      category: 'css',
      severity: 'info'
    });

    // JavaScript Fixes
    this.addFix('nullish-coalescing-js', {
      id: 'nullish-coalescing-fix',
      originalCode: '??',
      fixedCode: '||',
      explanation: 'Replaced nullish coalescing with logical OR for better Baseline support. Nullish coalescing is Baseline Widely available but may need transpilation.',
      confidence: 0.90,
      baselineStatus: 'widely',
      browserSupport: {
        chrome: '80',
        firefox: '72',
        safari: '13.1',
        edge: '80'
      },
      alternatives: [
        '|| (logical OR)',
        'Ternary operator',
        'if-else statements'
      ],
      reasoning: 'Logical OR provides similar functionality with better browser support.',
      category: 'javascript',
      severity: 'info'
    });

    this.addFix('optional-chaining-js', {
      id: 'optional-chaining-fix',
      originalCode: '?.',
      fixedCode: '.',
      explanation: 'Replaced optional chaining with standard property access for better Baseline support. Optional chaining is Baseline Widely available but may need transpilation.',
      confidence: 0.85,
      baselineStatus: 'widely',
      browserSupport: {
        chrome: '80',
        firefox: '72',
        safari: '13.1',
        edge: '80'
      },
      alternatives: [
        'Standard property access',
        'if-else checks',
        'try-catch blocks'
      ],
      reasoning: 'Standard property access with proper null checks provides better browser support.',
      category: 'javascript',
      severity: 'info'
    });

    // HTML Fixes
    this.addFix('<dialog>-html', {
      id: 'dialog-element-fix',
      originalCode: '<dialog>',
      fixedCode: '<div role="dialog">',
      explanation: 'Replaced dialog element with accessible div for better Baseline support. Dialog element is Baseline Newly available.',
      confidence: 0.80,
      baselineStatus: 'newly',
      browserSupport: {
        chrome: '37',
        firefox: '98',
        safari: '15.4',
        edge: '79'
      },
      alternatives: [
        '<div role="dialog">',
        'Modal libraries',
        'Custom modal components'
      ],
      reasoning: 'Accessible div with proper ARIA attributes provides better browser support.',
      category: 'html',
      severity: 'warning'
    });

    this.addFix('<details>-html', {
      id: 'details-element-fix',
      originalCode: '<details>',
      fixedCode: '<div class="details">',
      explanation: 'Replaced details element with accessible div for better Baseline support. Details element is Baseline Widely available but may need JavaScript.',
      confidence: 0.75,
      baselineStatus: 'widely',
      browserSupport: {
        chrome: '12',
        firefox: '49',
        safari: '6',
        edge: '79'
      },
      alternatives: [
        '<div class="details">',
        'Accordion components',
        'Collapsible sections'
      ],
      reasoning: 'Custom div with JavaScript provides better control and browser support.',
      category: 'html',
      severity: 'info'
    });
  }

  /**
   * Add a fix to the database
   */
  private addFix(key: string, fix: AutoFixSuggestion): void {
    if (!this.fixDatabase.has(key)) {
      this.fixDatabase.set(key, []);
    }
    this.fixDatabase.get(key)!.push(fix);
  }

  /**
   * Get all available fixes for a specific issue
   */
  getAvailableFixes(issue: string, fileType: string): AutoFixSuggestion[] {
    const key = `${issue}-${fileType}`;
    return this.fixDatabase.get(key) || [];
  }

  /**
   * Get fix statistics
   */
  getFixStatistics(): { totalFixes: number; categories: Record<string, number> } {
    let totalFixes = 0;
    const categories: Record<string, number> = {};

    for (const fixes of this.fixDatabase.values()) {
      totalFixes += fixes.length;
      for (const fix of fixes) {
        categories[fix.category] = (categories[fix.category] || 0) + 1;
      }
    }

    return { totalFixes, categories };
  }
}

export default AIAutoFixEngine;
