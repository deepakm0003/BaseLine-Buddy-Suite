import React, { useState } from 'react'
import {
  Globe,
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
  Download,
  Loader2,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Shield,
  Clock,
  Lightbulb
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import aiWebsiteAnalyzer from '../services/aiWebsiteAnalyzer'

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
  websiteInfo: {
    title: string
    description: string
    technology: string[]
    framework: string
    buildTool: string
    server: string
    cdn: string
    analytics: string
  }
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
      confidence: number
      evidence: string
    }>
    missing: Array<{
      name: string
      benefit: string
      implementation: string
      example: string
    }>
  }
  errors: Array<{
    type: 'critical' | 'warning' | 'info'
    category: 'performance' | 'accessibility' | 'security' | 'baseline' | 'seo'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    fix: string
    codeExample?: string
    lineNumber?: string
  }>
  performance: {
    bundleSizeReduction: number
    loadTimeImprovement: number
    polyfillElimination: number
    issues: string[]
  }
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    title: string
    description: string
    impact: string
    effort: string
    codeExample?: string
  }>
  aiInsights: {
    summary: string
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    criticalIssues: string[]
    websiteType: string
  }
}

const BaselineAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setAnalysisResult(null)

    try {
      // Use AI-powered website analysis service
      const result = await aiWebsiteAnalyzer.analyzeWebsite(url)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to analyze website. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const exportReport = () => {
    if (!analysisResult) {
      console.error('No analysis result available for export')
      alert('No analysis result available. Please analyze a website first.')
      return
    }

    try {
      console.log('Starting comprehensive PDF export...')
      const doc = new jsPDF()
      console.log('jsPDF instance created successfully')
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      console.log(`Page dimensions: ${pageWidth}x${pageHeight}`)

      // Helper utilities for wrapping and pagination
      const lineHeight = 5
      const marginLeft = 25
      const maxWidth = 160
      const ensureSpace = (needed: number) => {
        if (yPosition > pageHeight - needed) {
          doc.addPage()
          yPosition = 20
        }
      }
      const writeWrapped = (text: string, x: number, y: number, width = maxWidth, lh = lineHeight) => {
        const safeText = String(text || '')
        const lines = doc.splitTextToSize(safeText, width)
        lines.forEach((ln: string) => {
          ensureSpace(lh + 5)
          doc.text(ln, x, y)
          y += lh
        })
        return y
      }

      // Professional Header with Gradient
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, pageWidth, 60, 'F')
      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, pageWidth, 20, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text('Baseline Impact Analysis Report', 20, 35)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      // Removed emojis to avoid encoding issues
      doc.text(`Website: ${analysisResult.url}`, 20, 50)
      doc.text(`Generated: ${analysisResult.timestamp.toLocaleString()}`, 20, 58)

      let yPosition = 80

      // Executive Summary
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPosition - 8, pageWidth - 30, 40, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPosition - 8, pageWidth - 30, 40, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Executive Summary', 25, yPosition + 8)
      yPosition += 20
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Overall Baseline Score: ${analysisResult.overallScore}%`, 25, yPosition)
      yPosition += 8
      doc.text(`Baseline Compliance: ${analysisResult.baselineCompliance}%`, 25, yPosition)
      yPosition += 8
      doc.text(`Performance Impact: ${analysisResult.performanceImpact}%`, 25, yPosition)
      yPosition += 8
      doc.text(`Modern Alternatives: ${analysisResult.modernAlternatives}%`, 25, yPosition)
      yPosition += 15

      // Website Information
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPosition - 8, pageWidth - 30, 60, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPosition - 8, pageWidth - 30, 60, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Website Information', 25, yPosition + 8)
      yPosition += 20
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      yPosition = writeWrapped(`Title: ${analysisResult.websiteInfo.title}`, marginLeft, yPosition, maxWidth)
      yPosition = writeWrapped(`Description: ${analysisResult.websiteInfo.description}`, marginLeft, yPosition, maxWidth)
      yPosition = writeWrapped(`Technology Stack: ${analysisResult.websiteInfo.technology.join(', ')}`, marginLeft, yPosition, maxWidth)
      yPosition = writeWrapped(`Framework: ${analysisResult.websiteInfo.framework}`, marginLeft, yPosition, maxWidth)
      yPosition = writeWrapped(`Build Tool: ${analysisResult.websiteInfo.buildTool}`, marginLeft, yPosition, maxWidth)
      yPosition = writeWrapped(`Server: ${analysisResult.websiteInfo.server}`, marginLeft, yPosition, maxWidth)
      yPosition = writeWrapped(`CDN: ${analysisResult.websiteInfo.cdn}`, marginLeft, yPosition, maxWidth)
      yPosition = writeWrapped(`Analytics: ${analysisResult.websiteInfo.analytics}`, marginLeft, yPosition, maxWidth)
      yPosition += 10

      // AI Insights Section
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPosition - 8, pageWidth - 30, 80, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPosition - 8, pageWidth - 30, 80, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Insights & Analysis', 25, yPosition + 8)
      yPosition += 20
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      yPosition = writeWrapped(`Summary: ${analysisResult.aiInsights.summary}`, marginLeft, yPosition, maxWidth)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Strengths:', 25, yPosition)
      yPosition += 6
      doc.setFont('helvetica', 'normal')
      analysisResult.aiInsights.strengths.forEach(strength => {
        yPosition = writeWrapped(`• ${strength}`, 30, yPosition, 150)
      })
      yPosition += 5
      
      doc.setFont('helvetica', 'bold')
      doc.text('Weaknesses:', 25, yPosition)
      yPosition += 6
      doc.setFont('helvetica', 'normal')
      analysisResult.aiInsights.weaknesses.forEach(weakness => {
        yPosition = writeWrapped(`• ${weakness}`, 30, yPosition, 150)
      })
      yPosition += 5
      
      doc.setFont('helvetica', 'bold')
      doc.text('Opportunities:', 25, yPosition)
      yPosition += 6
      doc.setFont('helvetica', 'normal')
      analysisResult.aiInsights.opportunities.forEach(opportunity => {
        yPosition = writeWrapped(`• ${opportunity}`, 30, yPosition, 150)
      })
      yPosition += 15

      // Performance Impact
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPosition - 8, pageWidth - 30, 25, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPosition - 8, pageWidth - 30, 25, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Performance Impact', 25, yPosition + 5)
      
      const perf = [
        { label: 'Bundle Size Reduction', value: `${analysisResult.performance.bundleSizeReduction}%` },
        { label: 'Load Time Improvement', value: `${analysisResult.performance.loadTimeImprovement}%` },
        { label: 'Polyfills Eliminated', value: analysisResult.performance.polyfillElimination }
      ]

      perf.forEach((p, index) => {
        const x = 25 + (index * 60)
        doc.setTextColor(34, 197, 94)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text(String(p.value), x, yPosition + 15)
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(9)
        doc.text(p.label, x, yPosition + 20)
      })

      yPosition += 40

      // Baseline Features Used
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPosition - 8, pageWidth - 30, 60, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPosition - 8, pageWidth - 30, 60, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Baseline Features Used', 25, yPosition + 8)
      yPosition += 20
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      analysisResult.features.used.forEach((feature, index) => {
        ensureSpace(40)
        doc.text(`${index + 1}. ${feature.name} (${feature.status.toUpperCase()})`, 25, yPosition)
        yPosition += 5
        doc.text(`   Impact: ${feature.impact.toUpperCase()} | Confidence: ${Math.round(feature.confidence * 100)}%`, 25, yPosition)
        yPosition += 5
        yPosition = writeWrapped(`   Description: ${feature.description}`, 25, yPosition, maxWidth)
        yPosition = writeWrapped(`   Found in: ${feature.foundIn}${feature.lineNumber ? ` (Line ${feature.lineNumber})` : ''}`, 25, yPosition, maxWidth)
        if (feature.evidence) {
          yPosition = writeWrapped(`   Evidence: ${feature.evidence}`, 25, yPosition, maxWidth)
        }
        if (feature.suggestion) {
          yPosition = writeWrapped(`   Suggestion: ${feature.suggestion}`, 25, yPosition, maxWidth)
        }
        yPosition += 5
      })
      yPosition += 10

      // Error Analysis
      if (analysisResult.errors && analysisResult.errors.length > 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(15, yPosition - 8, pageWidth - 30, 50, 'F')
        doc.setDrawColor(226, 232, 240)
        doc.rect(15, yPosition - 8, pageWidth - 30, 50, 'S')
        
        doc.setTextColor(30, 41, 59)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text('Error Analysis', 25, yPosition + 8)
        yPosition += 20
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        analysisResult.errors.forEach((error, index) => {
          ensureSpace(40)
          doc.text(`${index + 1}. ${error.title} (${error.type.toUpperCase()})`, 25, yPosition)
          yPosition += 5
          doc.text(`   Category: ${error.category} | Impact: ${error.impact}`, 25, yPosition)
          yPosition += 5
          yPosition = writeWrapped(`   Description: ${error.description}`, 25, yPosition, maxWidth)
          yPosition = writeWrapped(`   Fix: ${error.fix}`, 25, yPosition, maxWidth)
          if (error.codeExample) {
            doc.setFont('courier', 'normal')
            yPosition = writeWrapped(`   Code: ${error.codeExample}`, 25, yPosition, maxWidth)
            doc.setFont('helvetica', 'normal')
          }
          yPosition += 8
        })
        yPosition += 15
      }

      // Comprehensive Recommendations
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPosition - 8, pageWidth - 30, 50, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPosition - 8, pageWidth - 30, 50, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('AI Recommendations', 25, yPosition + 8)
      yPosition += 20
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      analysisResult.recommendations.forEach((rec, index) => {
        ensureSpace(40)
        doc.setTextColor(30, 41, 59)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${rec.title} (Priority: ${rec.priority.toUpperCase()})`, 25, yPosition)
        
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        yPosition = writeWrapped(rec.description, 25, yPosition + 8, maxWidth)
        doc.text(`Impact: ${rec.impact} | Effort: ${rec.effort}`, 25, yPosition + 8)
        yPosition += 15
        if (rec.codeExample) {
          doc.text(`Code Example:`, 25, yPosition)
          yPosition += 5
          doc.setFont('courier', 'normal')
          yPosition = writeWrapped(rec.codeExample, 30, yPosition, maxWidth)
          doc.setFont('helvetica', 'normal')
        }
        yPosition += 10
      })
      yPosition += 15

      // Clean Footer (no emojis)
      doc.setFillColor(248, 250, 252)
      doc.rect(0, pageHeight - 40, pageWidth, 40, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(0, pageHeight - 40, pageWidth, 40, 'S')
      
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Baseline Impact Analyzer - Complete Analysis Report', 20, pageHeight - 30)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('AI-Powered Web Standards Analysis & Compliance Check', 20, pageHeight - 22)
      doc.text('Powered by official Baseline data and modern web standards', 20, pageHeight - 14)
      doc.text('Built by Deepak using Baseline data', 20, pageHeight - 6)

      console.log('PDF generation completed, saving file...')
      doc.save(`baseline-analysis-${analysisResult.url.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
      console.log('PDF saved successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      
      // Try a simple PDF generation as fallback
      try {
        console.log('Attempting fallback PDF generation...')
        const fallbackDoc = new jsPDF()
        fallbackDoc.text('Baseline Analysis Report', 20, 20)
        fallbackDoc.text(`Website: ${analysisResult.url}`, 20, 30)
        fallbackDoc.text(`Overall Score: ${analysisResult.overallScore}%`, 20, 40)
        fallbackDoc.text(`Baseline Compliance: ${analysisResult.baselineCompliance}%`, 20, 50)
        fallbackDoc.text(`Generated: ${new Date().toLocaleString()}`, 20, 60)
        fallbackDoc.save(`baseline-analysis-simple-${new Date().toISOString().split('T')[0]}.pdf`)
        console.log('Fallback PDF generated successfully')
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError)
        alert('Error generating PDF. Please check the browser console for details.')
      }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'baseline': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'newly': return <Info className="h-4 w-4 text-blue-500" />
      case 'limited': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Baseline Impact Analyzer</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered website analysis for Baseline compliance</p>
            </div>
          </div>
          {analysisResult && (
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysisResult ? (
          /* Analysis Input */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Analyze Your Website's Baseline Compliance
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Enter any website URL to get a comprehensive analysis of Baseline feature usage, 
                performance impact, and modernization recommendations.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    disabled={isAnalyzing}
                  />
                </div>
                <button
                  onClick={analyzeWebsite}
                  disabled={!url.trim() || isAnalyzing}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700 dark:text-red-300">{error}</span>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing website content and Baseline compliance...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Features Preview */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Website Analysis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deep analysis of HTML, CSS, and JavaScript for Baseline compliance
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Impact</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Calculate performance improvements from Baseline adoption
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                <Lightbulb className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Recommendations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered suggestions for modernizing your codebase
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-8">
            {/* Website Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Website Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Title</h4>
                  <p className="text-gray-600 dark:text-gray-400">{analysisResult.websiteInfo.title}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">{analysisResult.websiteInfo.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technology Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.websiteInfo.technology.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Framework</h4>
                  <p className="text-gray-600 dark:text-gray-400">{analysisResult.websiteInfo.framework}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Build Tool</h4>
                  <p className="text-gray-600 dark:text-gray-400">{analysisResult.websiteInfo.buildTool}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Server</h4>
                  <p className="text-gray-600 dark:text-gray-400">{analysisResult.websiteInfo.server}</p>
                </div>
              </div>
            </div>

            {/* Overall Score */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Analysis Complete
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Analyzed: <span className="font-mono text-sm">{analysisResult.url}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold ${getScoreBgColor(analysisResult.overallScore)}`}>
                    <span className={getScoreColor(analysisResult.overallScore)}>
                      {analysisResult.overallScore}%
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Overall Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Baseline Compliance</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-3xl font-bold text-green-600">
                    {analysisResult.baselineCompliance}%
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Baseline Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modern Standards</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-3xl font-bold text-blue-600">
                    {analysisResult.performanceImpact}%
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Performance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Optimization Score</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-3xl font-bold text-purple-600">
                    {analysisResult.modernAlternatives}%
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">Modernization</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upgrade Potential</p>
                </div>
              </div>
            </div>

            {/* Issues Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Issues Found</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-red-600 mb-2">{analysisResult.criticalIssues}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</div>
                </div>
                <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{analysisResult.warnings}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
                </div>
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Info className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">{analysisResult.suggestions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Suggestions</div>
                </div>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-600 mb-2">{analysisResult.totalIssues}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Issues</div>
                </div>
              </div>
            </div>

            {/* Error Analysis */}
            {analysisResult.errors && analysisResult.errors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Error Analysis</h3>
                <div className="space-y-4">
                  {analysisResult.errors.map((error, index) => (
                    <div key={index} className={`p-6 rounded-xl border-2 ${
                      error.type === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                      error.type === 'warning' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' :
                      'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            error.type === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                            error.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          }`}>
                            {error.type.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            error.category === 'performance' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                            error.category === 'accessibility' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            error.category === 'security' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                            error.category === 'baseline' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                          }`}>
                            {error.category.toUpperCase()}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          error.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                          error.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {error.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{error.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{error.description}</p>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How to fix:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{error.fix}</p>
                      </div>
                      {error.codeExample && (
                        <div className="bg-gray-900 dark:bg-gray-800 p-3 rounded-lg">
                          <pre className="text-xs text-gray-100 font-mono overflow-x-auto">
                            <code>{error.codeExample}</code>
                          </pre>
                        </div>
                      )}
                      {error.lineNumber && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          📍 Line {error.lineNumber}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Impact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Performance Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Zap className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-600 mb-2">-{analysisResult.performance.bundleSizeReduction}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bundle Size Reduction</div>
                </div>
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">+{analysisResult.performance.loadTimeImprovement}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Load Time Improvement</div>
                </div>
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-600 mb-2">{analysisResult.performance.polyfillElimination}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Polyfills Eliminated</div>
                </div>
              </div>
            </div>

            {/* Features Used */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Baseline Features Detected</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.features.used.map((feature, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(feature.status)}
                        <h4 className="font-semibold text-gray-900 dark:text-white">{feature.name}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feature.impact === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                          feature.impact === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        }`}>
                          {feature.impact} impact
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {feature.foundIn}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{feature.description}</p>
                    {feature.lineNumber && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        📍 Found at line {feature.lineNumber}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Confidence: {Math.round(feature.confidence * 100)}%
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full" 
                          style={{ width: `${feature.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                    {feature.evidence && (
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-medium">Evidence:</span> {feature.evidence}
                      </div>
                    )}
                    {feature.suggestion && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        💡 {feature.suggestion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recommendations</h3>
              <div className="space-y-4">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()} PRIORITY
                        </span>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{rec.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Impact: </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{rec.impact}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Effort: </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{rec.effort}</span>
                      </div>
                    </div>
                    {rec.codeExample && (
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono overflow-x-auto">
                          <code>{rec.codeExample}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI Insights</h3>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Summary</h4>
                <p className="text-gray-600 dark:text-gray-400">{analysisResult.aiInsights.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.aiInsights.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start">
                        <span className="mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl">
                  <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.aiInsights.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-red-700 dark:text-red-300 flex items-start">
                        <span className="mr-2">⚠</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.aiInsights.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-start">
                        <span className="mr-2">💡</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Missing Features */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Missing Baseline Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysisResult.features.missing.map((feature, index) => (
                  <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{feature.benefit}</p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Implementation:</div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">{feature.implementation}</p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs font-mono text-gray-800 dark:text-gray-200">
                      {feature.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BaselineAnalyzer
