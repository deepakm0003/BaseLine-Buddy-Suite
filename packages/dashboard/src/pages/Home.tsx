import React from 'react'
import { Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileCode, 
  Zap,
  ArrowRight,
  CheckCircle,
  Target,
  Code
} from 'lucide-react'

const Home: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Baseline Impact Analyzer',
      description: 'AI-powered website analysis for Baseline compliance',
      href: '/baseline-analyzer',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      features: [
        'Analyze any website URL for Baseline compliance',
        'Get performance impact calculations',
        'Receive smart modernization recommendations',
        'Export comprehensive compliance reports'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Baseline Copilot',
      description: 'AI-powered chat assistant for web feature questions',
      href: '/copilot',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      features: [
        'Ask about any CSS, JS, or HTML feature',
        'Get instant Baseline compatibility status',
        'Receive AI-generated code suggestions',
        'Learn about browser support and fallbacks'
      ]
    },
    {
      icon: FileCode,
      title: 'File Analysis',
      description: 'Upload and analyze your web files for Baseline compliance',
      href: '/file-analysis',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      features: [
        'Upload CSS, JS, HTML files',
        'Automatic Baseline compliance checking',
        'Detailed issue reports with suggestions',
        'Export analysis results'
      ]
    },
    {
      icon: LayoutDashboard,
      title: 'Baseline Dashboard',
      description: 'Comprehensive overview of Baseline features and trends',
      href: '/dashboard',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      features: [
        'Visual Baseline feature browser',
        'Feature adoption statistics',
        'Browser support tracking',
        'Team compliance reports'
      ]
    },
    {
      icon: Code,
      title: 'Code Generator',
      description: 'AI-powered code generation with Baseline compliance',
      href: '/code-generator',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      features: [
        'Generate React, Vue, Angular components',
        '100% Baseline compliant code',
        'Accessibility-first with ARIA support',
        'Performance optimized output'
      ]
    },
  ]


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Baseline Buddy Suite</h1>
                <p className="text-gray-600 dark:text-gray-400">AI-Powered Ecosystem for Modern Web Features</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Baseline Tool
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Select the tool that best fits your needs. Whether you want to chat with AI, 
            analyze files, or explore the Baseline database.
          </p>
        </div>

        {/* Main Features Grid - Responsive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.href}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 min-h-[400px] flex flex-col relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Header Section */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                      <ArrowRight className="h-3 w-3 text-gray-600 dark:text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="relative z-10 flex-1 mb-4">
                  <div className="space-y-2">
                    {feature.features.slice(0, 3).map((item, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item}</span>
                      </div>
                    ))}
                    {feature.features.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        +{feature.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="relative z-10 mt-auto">
                  <div className={`inline-flex items-center justify-center w-full px-4 py-2 rounded-lg text-white font-semibold text-sm ${feature.color} group-hover:shadow-md transition-all duration-300 group-hover:scale-105`}>
                    <span>Get Started</span>
                    <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 dark:to-gray-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </Link>
          ))}
        </div>


        {/* Stats Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Powered by AI & Baseline Data
            </h3>
            <p className="text-purple-100 text-lg">
              Get instant, accurate answers about web feature compatibility
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Web Features</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-purple-100">Baseline Accurate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">AI</div>
              <div className="text-purple-100">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Real-time</div>
              <div className="text-purple-100">Updates</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Built with ❤️ using <span className="font-semibold text-gray-700 dark:text-gray-300">Baseline data</span> by <span className="font-semibold text-gray-700 dark:text-gray-300">Deepak</span>
          </p>
          <p className="text-xs mt-2 text-gray-400 dark:text-gray-500">
            Powered by official Baseline web standards and AI technology
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
