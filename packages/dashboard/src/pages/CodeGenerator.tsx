import React, { useState, useRef } from 'react'
import { 
  Code, 
  Sparkles, 
  Copy, 
  Download, 
  Zap,
  Shield,
  Target,
  CheckCircle,
  RefreshCw,
  FileText,
  Layers,
  Monitor,
  Maximize2
} from 'lucide-react'
import aiCodeGenerator from '../services/aiCodeGenerator'

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

const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('vanilla')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const previewRef = useRef<HTMLIFrameElement>(null)

  const frameworks = [
    {
      id: 'vanilla',
      name: 'HTML/CSS/JS',
      icon: '🌐',
      color: 'from-blue-500 to-cyan-500',
      description: 'Pure HTML, CSS, and JavaScript with modern features'
    },
    {
      id: 'react',
      name: 'React',
      icon: '⚛️',
      color: 'from-blue-500 to-cyan-500',
      description: 'Modern React with hooks and functional components'
    },
    {
      id: 'vue',
      name: 'Vue.js',
      icon: '💚',
      color: 'from-green-500 to-emerald-500',
      description: 'Vue 3 with Composition API and TypeScript'
    },
    {
      id: 'angular',
      name: 'Angular',
      icon: '🔴',
      color: 'from-red-500 to-pink-500',
      description: 'Angular with standalone components and signals'
    }
  ]

  const generateCode = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGeneratedCode(null)
    
    try {
      const result = await aiCodeGenerator.generateCode(prompt, selectedFramework)
      setGeneratedCode(result)
    } catch (error) {
      console.error('Code generation failed:', error)
      alert('Failed to generate code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getCurrentCode = () => {
    if (!generatedCode) return ''
    
    switch (activeTab) {
      case 'html': return generatedCode.html
      case 'css': return generatedCode.css
      case 'js': return generatedCode.javascript
      default: return generatedCode.html
    }
  }

  const getPreviewHTML = () => {
    if (!generatedCode) return ''
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  <style>${generatedCode.css}</style>
</head>
<body>
  ${generatedCode.html}
  <script>${generatedCode.javascript}</script>
</body>
</html>`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAllFiles = () => {
    if (!generatedCode) return
    
    downloadCode(generatedCode.html, 'index.html')
    downloadCode(generatedCode.css, 'styles.css')
    downloadCode(generatedCode.javascript, 'script.js')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Baseline Code Generator</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered code generation with Baseline compliance</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Generate Code</h2>
              
              {/* Framework Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Framework
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {frameworks.map((framework) => (
                    <button
                      key={framework.id}
                      onClick={() => setSelectedFramework(framework.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedFramework === framework.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl mb-2">{framework.icon}</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{framework.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{framework.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Describe what you want to build
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Create a responsive navigation component with dropdown menus, search functionality, and mobile hamburger menu..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCode}
                disabled={!prompt.trim() || isGenerating}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                    Generating Code...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Code
                  </>
                )}
              </button>
            </div>

            {/* Features Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What You'll Get</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">100% Baseline compliant code</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Accessibility-first with ARIA support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Performance optimized</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Framework-specific best practices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {generatedCode ? (
              <>
                {/* Code Result with Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Code</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(getCurrentCode())}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={downloadAllFiles}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download All</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Code Tabs */}
                  <div className="flex space-x-1 mb-4">
                    {[
                      { id: 'html', label: 'HTML', icon: FileText },
                      { id: 'css', label: 'CSS', icon: Layers },
                      { id: 'js', label: 'JavaScript', icon: Code }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'html' | 'css' | 'js')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-96">
                    <pre className="text-sm text-gray-100 font-mono">
                      <code>{getCurrentCode()}</code>
                    </pre>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Monitor className="h-5 w-5 mr-2 text-green-500" />
                      Live Preview
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                        <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : 'h-96'}`}>
                    <iframe
                      ref={previewRef}
                      srcDoc={getPreviewHTML()}
                      className="w-full h-full border-0"
                      title="Live Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>

                {/* Code Analysis */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Code Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-1">{generatedCode.baselineCompliance}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Baseline Compliance</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{generatedCode.features.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Features Used</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{generatedCode.accessibility.length}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Accessibility Features</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Layers className="h-4 w-4 mr-2 text-blue-500" />
                        Baseline Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedCode.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-500" />
                        Accessibility Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedCode.accessibility.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                        Performance Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedCode.performance.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready to Generate</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Describe what you want to build and choose your framework to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


export default CodeGenerator
