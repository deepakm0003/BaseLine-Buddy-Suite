import { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import PDFExporter from './components/PDFExporter';
import ScanResults from './components/ScanResults';

// Mock Baseline data for demonstration
const baselineFeatures = {
  'grid': {
    name: 'CSS Grid',
    description: 'CSS Grid Layout',
    group: 'css',
    baseline: 'widely',
    baseline_high_date: '2017-03-14',
    support: { chrome: '57', firefox: '52', safari: '10.1', edge: '16' }
  },
  'subgrid': {
    name: 'CSS Subgrid',
    description: 'CSS Grid Subgrid',
    group: 'css', 
    baseline: 'newly',
    baseline_low_date: '2023-09-15',
    support: { chrome: '117', firefox: '71', safari: '16' }
  },
  'container-queries': {
    name: 'Container Queries',
    description: 'CSS Container Queries',
    group: 'css',
    baseline: 'newly',
    baseline_low_date: '2023-02-14',
    support: { chrome: '105', firefox: '110', safari: '16' }
  },
  'word-break-auto-phrase': {
    name: 'word-break: auto-phrase',
    description: 'CSS word-break auto-phrase value',
    group: 'css',
    baseline: false,
    support: { chrome: '119' }
  },
  'has-selector': {
    name: ':has() selector',
    description: 'CSS :has() pseudo-class',
    group: 'css',
    baseline: 'newly',
    baseline_low_date: '2022-12-13',
    support: { chrome: '105', firefox: '103', safari: '15.4' }
  }
};

function analyzeFileContent(content: string, fileName: string) {
  const issues: any[] = [];
  const lines = content.split('\n');

  lines.forEach((line, lineIndex) => {
    // Check for CSS Grid - enhanced patterns
    if (line.includes('display: grid') || line.includes('display:grid') || 
        line.includes('grid-template') || line.includes('grid-area') ||
        line.includes('grid-column') || line.includes('grid-row')) {
      const feature = baselineFeatures['grid'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'info',
        message: 'CSS Grid is Baseline Widely available. Safe to use.',
        line: lineIndex + 1,
        file: fileName
      });
    }

    // Check for CSS Subgrid
    if (line.includes('subgrid')) {
      const feature = baselineFeatures['subgrid'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'warning',
        message: 'CSS Subgrid is Baseline Newly available. Use with caution.',
        suggestion: 'Consider adding a fallback for older browsers.',
        line: lineIndex + 1,
        file: fileName
      });
    }

    // Check for word-break: auto-phrase
    if (line.includes('word-break: auto-phrase') || line.includes('word-break:auto-phrase')) {
      const feature = baselineFeatures['word-break-auto-phrase'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'error',
        message: 'word-break: auto-phrase is not Baseline. Limited browser support.',
        suggestion: 'Use word-break: break-word for better compatibility.',
        line: lineIndex + 1,
        file: fileName
      });
    }

    // Check for :has() selector
    if (line.includes(':has(')) {
      const feature = baselineFeatures['has-selector'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'warning',
        message: ':has() selector is Baseline Newly available. Use with caution.',
        suggestion: 'Consider using JavaScript querySelector as a fallback.',
        line: lineIndex + 1,
        file: fileName
      });
    }

    // Check for container queries
    if (line.includes('@container')) {
      const feature = baselineFeatures['container-queries'];
      issues.push({
        type: 'css',
        feature: feature.name,
        baseline: feature.baseline,
        severity: 'warning',
        message: 'Container Queries are Baseline Newly available. Use with caution.',
        suggestion: 'Consider using media queries as a fallback.',
        line: lineIndex + 1,
        file: fileName
      });
    }

    // Check for JavaScript-specific patterns
    if (fileName.endsWith('.js') || fileName.endsWith('.jsx') || fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      // Check for modern JavaScript features
      if (line.includes('async') && line.includes('function')) {
        issues.push({
          type: 'javascript',
          feature: 'Async/Await',
          baseline: 'widely',
          severity: 'info',
          message: 'Async/Await is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }

      if (line.includes('fetch(')) {
        issues.push({
          type: 'javascript',
          feature: 'Fetch API',
          baseline: 'widely',
          severity: 'info',
          message: 'Fetch API is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }

      if (line.includes('Promise.')) {
        issues.push({
          type: 'javascript',
          feature: 'Promise',
          baseline: 'widely',
          severity: 'info',
          message: 'Promise is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }

      if (line.includes('localStorage')) {
        issues.push({
          type: 'javascript',
          feature: 'localStorage',
          baseline: 'widely',
          severity: 'info',
          message: 'localStorage is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }

      if (line.includes('sessionStorage')) {
        issues.push({
          type: 'javascript',
          feature: 'sessionStorage',
          baseline: 'widely',
          severity: 'info',
          message: 'sessionStorage is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }

      // Check for CSS-in-JS patterns
      if (line.includes('display: grid') || line.includes('display:grid')) {
        issues.push({
          type: 'css-in-js',
          feature: 'CSS Grid',
          baseline: 'widely',
          severity: 'info',
          message: 'CSS Grid is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }

      if (line.includes('grid-template')) {
        issues.push({
          type: 'css-in-js',
          feature: 'CSS Grid',
          baseline: 'widely',
          severity: 'info',
          message: 'CSS Grid is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }
    }

    // Check for HTML patterns
    if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
      if (line.includes('<dialog>')) {
        issues.push({
          type: 'html',
          feature: '<dialog> element',
          baseline: 'newly',
          severity: 'warning',
          message: '<dialog> element is Baseline Newly available. Use with caution.',
          suggestion: 'Consider using a polyfill for older browsers.',
          line: lineIndex + 1,
          file: fileName
        });
      }

      if (line.includes('<details>')) {
        issues.push({
          type: 'html',
          feature: '<details> element',
          baseline: 'widely',
          severity: 'info',
          message: '<details> element is Baseline Widely available. Safe to use.',
          line: lineIndex + 1,
          file: fileName
        });
      }
    }
  });

  return issues;
}

function EnhancedDashboard() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [scanResults, setScanResults] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [cliDemoResults, setCliDemoResults] = useState<any>(null);
  const [showCliDemo, setShowCliDemo] = useState(false);

  const handleFilesUploaded = useCallback(async (files: File[]) => {
    setIsUploading(true);
    setUploadedFiles(files);
    
    // Simulate file processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsUploading(false);
    setIsScanning(true);
    
    // Analyze uploaded files
    const allIssues: any[] = [];
    let scannedFiles = 0;
    let filesWithIssues = 0;

    for (const file of files) {
      try {
        const content = await file.text();
        const fileIssues = analyzeFileContent(content, file.name);
        
        if (fileIssues.length > 0) {
          allIssues.push(...fileIssues);
          filesWithIssues++;
        }
        scannedFiles++;
      } catch (error) {
        console.warn(`Failed to analyze ${file.name}:`, error);
      }
    }

    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = {
      issues: allIssues,
      summary: {
        total: allIssues.length,
        errors: allIssues.filter(i => i.severity === 'error').length,
        warnings: allIssues.filter(i => i.severity === 'warning').length,
        info: allIssues.filter(i => i.severity === 'info').length,
        baselineSafe: allIssues.filter(i => i.baseline === 'widely').length,
        baselineNewly: allIssues.filter(i => i.baseline === 'newly').length,
        baselineWidely: allIssues.filter(i => i.baseline === 'widely').length
      },
      files: {
        scanned: scannedFiles,
        withIssues: filesWithIssues
      }
    };

    setScanResults(results);
    setIsScanning(false);
    
    // Show CLI demo when files are uploaded
    setShowCliDemo(true);
    generateCliDemoResults(files);
  }, []);

  const generateCliDemoResults = async (files: File[]) => {
    // Analyze files using the same logic as the main analysis
    const allIssues: any[] = [];
    let scannedFiles = 0;
    let filesWithIssues = 0;

    for (const file of files) {
      try {
        const content = await file.text();
        const fileIssues = analyzeFileContent(content, file.name);
        allIssues.push(...fileIssues);
        scannedFiles++;
        if (fileIssues.length > 0) {
          filesWithIssues++;
        }
      } catch (error) {
        console.error(`Error analyzing file ${file.name}:`, error);
      }
    }

    // Calculate statistics
    const errors = allIssues.filter(issue => issue.severity === 'error').length;
    const warnings = allIssues.filter(issue => issue.severity === 'warning').length;
    const info = allIssues.filter(issue => issue.severity === 'info').length;
    const totalIssues = allIssues.length;

    const widelyAvailable = allIssues.filter(issue => issue.baseline === 'widely').length;
    const newlyAvailable = allIssues.filter(issue => issue.baseline === 'newly').length;
    const limitedSupport = allIssues.filter(issue => issue.baseline === 'limited').length;

    const mockCliResults = {
      command: `baseline-lint ${files.map(f => f.name).join(' ')} --format json --verbose`,
      output: {
        summary: {
          filesScanned: scannedFiles,
          filesWithIssues: filesWithIssues,
          totalIssues: totalIssues,
          errors: errors,
          warnings: warnings,
          info: info
        },
        baselineStatus: {
          widelyAvailable: widelyAvailable,
          newlyAvailable: newlyAvailable,
          limitedSupport: limitedSupport
        },
        issues: allIssues.slice(0, 5) // Show first 5 issues
      }
    };
    
    setCliDemoResults(mockCliResults);
  };

  const handlePDFExport = useCallback(() => {
    setIsExporting(true);
    // The PDFExporter component will handle the actual export
    setTimeout(() => setIsExporting(false), 2000);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Glitter Animation Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/5 to-transparent animate-shimmer-delayed"></div>
        </div>
        
        {/* Moving Icons Carousel - All Over Dashboard */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Row 1 - Top Area - Moving Right Fast */}
          <div className="absolute top-5 left-0 w-full flex animate-move-right-fast">
            <div className="flex space-x-8 whitespace-nowrap">
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-8">
                  <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-blue-400/30">
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-green-400/30">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-purple-400/30">
                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2 - Upper Middle - Moving Left Fast */}
          <div className="absolute top-20 right-0 w-full flex animate-move-left-fast">
            <div className="flex space-x-6 whitespace-nowrap">
              {[...Array(4)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-6">
                  <div className="w-14 h-14 bg-pink-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-pink-400/30">
                    <svg className="w-7 h-7 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="w-16 h-16 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-teal-400/30">
                    <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-cyan-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-cyan-400/30">
                    <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 3 - Middle Area - Moving Right */}
          <div className="absolute top-40 left-0 w-full flex animate-move-right">
            <div className="flex space-x-10 whitespace-nowrap">
              {[...Array(3)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-10">
                  <div className="w-18 h-18 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-red-400/30">
                    <svg className="w-9 h-9 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 bg-indigo-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-indigo-400/30">
                    <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="w-14 h-14 bg-yellow-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-yellow-400/30">
                    <svg className="w-7 h-7 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 4 - Lower Middle - Moving Left */}
          <div className="absolute top-60 right-0 w-full flex animate-move-left">
            <div className="flex space-x-8 whitespace-nowrap">
              {[...Array(3)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-8">
                  <div className="w-16 h-16 bg-orange-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-orange-400/30">
                    <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-emerald-400/30">
                    <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 bg-violet-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-violet-400/30">
                    <svg className="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 5 - Bottom Area - Moving Right Slow */}
          <div className="absolute bottom-10 left-0 w-full flex animate-move-right-slow">
            <div className="flex space-x-12 whitespace-nowrap">
              {[...Array(3)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-12">
                  <div className="w-20 h-20 bg-rose-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-rose-400/30">
                    <svg className="w-10 h-10 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="w-14 h-14 bg-sky-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-sky-400/30">
                    <svg className="w-7 h-7 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="w-16 h-16 bg-lime-500/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-lime-400/30">
                    <svg className="w-8 h-8 text-lime-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Floating Code Elements - Moving Carousel - Above content */}
        <div className="absolute top-16 left-0 w-full flex animate-move-right">
          <div className="flex space-x-12 whitespace-nowrap">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex space-x-12">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-blue-400/30 animate-glow-pulse">
                  <code className="text-sm text-blue-200 font-mono font-semibold">display: grid</code>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-green-400/30 animate-glow-pulse">
                  <code className="text-sm text-green-200 font-mono font-semibold">:has()</code>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-purple-400/30 animate-glow-pulse">
                  <code className="text-sm text-purple-200 font-mono font-semibold">@container</code>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-yellow-400/30 animate-glow-pulse">
                  <code className="text-sm text-yellow-200 font-mono font-semibold">subgrid</code>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-red-400/30 animate-glow-pulse">
                  <code className="text-sm text-red-200 font-mono font-semibold">auto-phrase</code>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-cyan-400/30 animate-glow-pulse">
                  <code className="text-sm text-cyan-200 font-mono font-semibold">@layer</code>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Floating Elements - Diagonal Movement */}
        <div className="absolute top-32 left-0 w-full flex animate-move-left">
          <div className="flex space-x-16 whitespace-nowrap">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex space-x-16">
                <div className="w-6 h-6 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-yellow-400/40 rounded-full animate-ping"></div>
                <div className="w-8 h-8 bg-pink-400/30 rounded-full animate-pulse"></div>
                <div className="w-5 h-5 bg-blue-400/40 rounded-full animate-ping"></div>
                <div className="w-7 h-7 bg-green-400/30 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Floating Elements - Bottom Diagonal */}
        <div className="absolute bottom-32 right-0 w-full flex animate-move-right">
          <div className="flex space-x-20 whitespace-nowrap">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex space-x-20">
                <div className="w-10 h-10 bg-purple-400/30 rounded-full animate-pulse"></div>
                <div className="w-6 h-6 bg-orange-400/40 rounded-full animate-ping"></div>
                <div className="w-8 h-8 bg-teal-400/30 rounded-full animate-pulse"></div>
                <div className="w-5 h-5 bg-red-400/40 rounded-full animate-ping"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400/60 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-yellow-400/60 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-red-400/60 rounded-full animate-pulse"></div>
          <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-ping"></div>
          <div className="absolute top-1/6 right-1/2 w-1 h-1 bg-pink-400/60 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/6 left-1/2 w-1.5 h-1.5 bg-teal-400/60 rounded-full animate-ping"></div>
        </div>
        
        {/* Twinkling Stars */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
          <div className="absolute top-32 right-40 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-60 left-60 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 right-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-40 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-40 right-60 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-60 left-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-80 left-80 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '1.8s'}}></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Baseline Explorer Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Upload your files and get instant Baseline compliance analysis
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Files for Analysis</h2>
          <FileUpload 
            onFilesUploaded={handleFilesUploaded}
            isUploading={isUploading}
          />
          
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{file.name}</span>
                    <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PDF Export Button */}
        {scanResults && (
          <div className="flex justify-end mb-6">
            <PDFExporter 
              reportData={scanResults}
              onExport={handlePDFExport}
              isExporting={isExporting}
            />
          </div>
        )}

        {/* Scan Results */}
        <ScanResults 
          results={scanResults}
          isLoading={isScanning}
        />

        {/* Interactive CLI Demo - Shows when files are uploaded */}
        {showCliDemo && cliDemoResults && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 shadow rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🔧 CLI Tool Demo - Your Files</h2>
              <p className="text-lg text-gray-600">See how the CLI tool would analyze your uploaded files</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Command that would be run */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💻 Command Executed</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="text-yellow-400"># CLI command for your files</div>
                  <div>$ {cliDemoResults.command}</div>
                  <div className="text-gray-500 mt-2"># This is what the CLI tool would run</div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Files analyzed:</strong> {uploadedFiles.map(f => f.name).join(', ')}</p>
                  <p><strong>Format:</strong> JSON with verbose output</p>
                  <p><strong>Options:</strong> Full Baseline compliance checking</p>
                </div>
              </div>

              {/* CLI Output Results */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 CLI Output Results</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="text-blue-400">📊 Baseline Compliance Report</div>
                  <div className="text-blue-400">==================================================</div>
                  <div className="text-white">📁 Files Scanned: {cliDemoResults.output.summary.filesScanned}</div>
                  <div className="text-yellow-400">⚠️  Files with Issues: {cliDemoResults.output.summary.filesWithIssues}</div>
                  <div className="text-white">🔍 Issues Found:</div>
                  <div className="text-red-400">  ❌ Errors: {cliDemoResults.output.summary.errors}</div>
                  <div className="text-yellow-400">  ⚠️  Warnings: {cliDemoResults.output.summary.warnings}</div>
                  <div className="text-blue-400">  ℹ️  Info: {cliDemoResults.output.summary.info}</div>
                  <div className="text-white">📈 Baseline Status:</div>
                  <div className="text-green-400">  ✅ Widely Available: {cliDemoResults.output.baselineStatus.widelyAvailable}</div>
                  <div className="text-yellow-400">  🆕 Newly Available: {cliDemoResults.output.baselineStatus.newlyAvailable}</div>
                  <div className="text-red-400">  ❌ Limited Support: {cliDemoResults.output.baselineStatus.limitedSupport}</div>
                </div>
              </div>
            </div>

            {/* Detailed Issues Found */}
            {cliDemoResults.output.issues.length > 0 && (
              <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Issues Found in Your Files</h3>
                <div className="space-y-4">
                  {cliDemoResults.output.issues.map((issue: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              issue.severity === 'error' ? 'bg-red-100 text-red-800' :
                              issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.severity.toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{issue.feature}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>File:</strong> {issue.file} (Line {issue.line}, Column {issue.column})
                          </p>
                          <p className="text-sm text-gray-700 mb-2">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                              <strong>💡 Suggestion:</strong> {issue.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CLI Features Showcase */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">CI/CD Integration</h4>
                <p className="text-sm text-gray-600">This command can be integrated into your build pipeline for automated Baseline compliance checking</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Multiple Formats</h4>
                <p className="text-sm text-gray-600">Output can be generated in JSON, HTML, or text format for different use cases and team workflows</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Batch Processing</h4>
                <p className="text-sm text-gray-600">Process multiple files simultaneously with recursive scanning and parallel processing for performance</p>
              </div>
            </div>

            {/* Try Different CLI Commands */}
            <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎮 Try Different CLI Commands</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    const newCommand = `baseline-lint ${uploadedFiles.map(f => f.name).join(' ')} --format html --output report.html`;
                    setCliDemoResults({...cliDemoResults, command: newCommand});
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📊 Generate HTML Report
                </button>
                <button 
                  onClick={() => {
                    const newCommand = `baseline-lint ${uploadedFiles.map(f => f.name).join(' ')} --baseline-level newly --enable-ai`;
                    setCliDemoResults({...cliDemoResults, command: newCommand});
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  🤖 AI-Powered Analysis
                </button>
                <button 
                  onClick={() => {
                    const newCommand = `baseline-lint ${uploadedFiles.map(f => f.name).join(' ')} --include "**/*.css" --exclude "**/node_modules/**"`;
                    setCliDemoResults({...cliDemoResults, command: newCommand});
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🔍 Advanced Filtering
                </button>
                <button 
                  onClick={() => {
                    const newCommand = `baseline-lint ${uploadedFiles.map(f => f.name).join(' ')} --format json --output baseline-report.json --verbose`;
                    setCliDemoResults({...cliDemoResults, command: newCommand});
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  📋 CI/CD Integration
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Baseline Buddy Tools Showcase */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🚀 Baseline Buddy Suite</h2>
            <p className="text-lg text-gray-600">Complete AI-powered ecosystem for modern web development</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* VS Code Extension */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">VS Code Extension</h3>
              </div>
              <p className="text-gray-600 mb-4">Real-time Baseline checking as you code with inline warnings, hover tooltips, and quick fixes.</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Inline diagnostics
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Hover tooltips
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Quick fixes
                </div>
              </div>
            </div>

            {/* CLI Tool */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">CLI Tool</h3>
              </div>
              <p className="text-gray-600 mb-4">Command-line scanner for CI/CD integration with multiple output formats and batch processing.</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  CI/CD integration
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Multiple formats
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Batch processing
                </div>
              </div>
            </div>

            {/* Dashboard */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Web Dashboard</h3>
              </div>
              <p className="text-gray-600 mb-4">Interactive dashboard with file upload, real-time analysis, and professional PDF reports.</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  File upload
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  PDF reports
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time analysis
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Why Choose Baseline Buddy?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
                  <p className="text-sm text-gray-600">Smart suggestions and auto-fixes powered by advanced AI</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Real-time</h4>
                  <p className="text-sm text-gray-600">Instant feedback as you code with live Baseline checking</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Team Ready</h4>
                  <p className="text-sm text-gray-600">Perfect for teams with CI/CD integration and sharing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Generated by Baseline Buddy Suite - AI-powered Baseline compliance checking
          </p>
        </div>
      </div>
    </div>
  );
}

export default EnhancedDashboard;
