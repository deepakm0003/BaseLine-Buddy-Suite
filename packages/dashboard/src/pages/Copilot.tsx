import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Sparkles,
  Settings,
  X,
  Download
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import baselineDataService from '../services/baselineDataService'
import geminiService from '../services/geminiService'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isCode?: boolean
  baselineStatus?: 'safe' | 'warning' | 'unsafe'
  suggestions?: string[]
}

const Copilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm Baseline Copilot, your AI assistant! I can help you with programming, web development, technology, and much more. Ask me anything!",
      timestamp: new Date(),
      baselineStatus: 'safe'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiSettings, setAiSettings] = useState<any>(null)
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const exportChatToPDF = () => {
    try {
      console.log('Starting Copilot PDF export...')
      const doc = new jsPDF()
      console.log('Copilot jsPDF instance created successfully')
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPos = 20

      // Professional Header with Gradient Effect
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, pageWidth, 50, 'F')
      
      // Add a subtle gradient effect
      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, pageWidth, 15, 'F')
      
      // Title with better typography - using simple text
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('Baseline Copilot Chat Export', 20, 30)
      
      // Subtitle
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('AI-Powered Web Development Assistant Conversation', 20, 40)
      
      // Date with icon - using simple text
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 50)
    
    yPos = 70

      // Chat Summary
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPos - 8, pageWidth - 30, 25, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPos - 8, pageWidth - 30, 25, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Chat Summary', 25, yPos + 5)
      yPos += 15
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total Messages: ${messages.length}`, 25, yPos)
      yPos += 7
      doc.text(`User Messages: ${messages.filter(m => m.type === 'user').length}`, 25, yPos)
      yPos += 7
      doc.text(`Assistant Messages: ${messages.filter(m => m.type === 'assistant').length}`, 25, yPos)
      yPos += 15

      // Chat Messages
      doc.setFillColor(248, 250, 252)
      doc.rect(15, yPos - 8, pageWidth - 30, 20, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, yPos - 8, pageWidth - 30, 20, 'S')
      
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Conversation', 25, yPos + 5)
      yPos += 20

    // Process each message
    messages.forEach((message) => {
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = 20
      }

      // Message header
      const headerColor = message.type === 'user' ? [59, 130, 246] : [34, 197, 94]
      doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
      doc.rect(15, yPos - 5, pageWidth - 30, 15, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(message.type === 'user' ? 'You' : 'Baseline Copilot', 20, yPos + 3)
      
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(message.timestamp.toLocaleString(), pageWidth - 80, yPos + 3)
      
      yPos += 15

      // Message content
      doc.setTextColor(30, 41, 59)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      // Handle code blocks
      if (message.isCode || message.content.includes('```')) {
        doc.setFillColor(30, 41, 59)
        doc.rect(20, yPos - 3, pageWidth - 40, 15, 'F')
        doc.setDrawColor(226, 232, 240)
        doc.rect(20, yPos - 3, pageWidth - 40, 15, 'S')
        
        doc.setTextColor(255, 255, 255)
        doc.setFont('courier', 'normal')
        doc.text(message.content, 25, yPos + 3, { maxWidth: pageWidth - 50 })
        doc.setFont('helvetica', 'normal')
        yPos += 20
      } else {
        // Regular text
        const lines = doc.splitTextToSize(message.content, pageWidth - 50)
        doc.text(lines, 20, yPos, { maxWidth: pageWidth - 50 })
        yPos += lines.length * 4 + 5
      }

      // Baseline status indicator
      if (message.baselineStatus) {
        const statusColor = message.baselineStatus === 'safe' ? [34, 197, 94] : 
                           message.baselineStatus === 'warning' ? [245, 158, 11] : [239, 68, 68]
        const statusText = message.baselineStatus === 'safe' ? 'Safe' : 
                          message.baselineStatus === 'warning' ? 'Warning' : 'Unsafe'
        
        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2])
        doc.rect(20, yPos - 3, 60, 10, 'F')
        
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.text(statusText, 25, yPos + 2)
        yPos += 15
      }

      // Suggestions
      if (message.suggestions && message.suggestions.length > 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(20, yPos - 3, pageWidth - 40, 20, 'F')
        doc.setDrawColor(226, 232, 240)
        doc.rect(20, yPos - 3, pageWidth - 40, 20, 'S')
        
        doc.setTextColor(30, 41, 59)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text('Suggestions:', 25, yPos + 3)
        yPos += 8
        
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        message.suggestions.forEach(suggestion => {
          doc.text(`• ${suggestion}`, 25, yPos)
          yPos += 4
        })
        yPos += 5
      }

      yPos += 10
    })

    // Professional Footer
    doc.setFillColor(248, 250, 252)
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'S')
    
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated by Baseline Copilot - AI-Powered Web Development Assistant', 20, pageHeight - 20)
    doc.text('Powered by Baseline web standards and AI technology', 20, pageHeight - 12)
    doc.text('Built with ❤️ by Deepak using Baseline data', 20, pageHeight - 4)

      console.log('Copilot PDF generation completed, saving file...')
      doc.save(`baseline-copilot-chat-${new Date().toISOString().split('T')[0]}.pdf`)
      console.log('Copilot PDF saved successfully!')
    } catch (error) {
      console.error('Error generating Copilot PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load AI settings on component mount
  useEffect(() => {
    const loadAiSettings = () => {
      try {
        const savedSettings = localStorage.getItem('ai-config')
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings)
          setAiSettings(parsed)
        } else {
          // Default AI settings
          const defaultSettings = {
            enabled: true,
            model: 'gpt-4',
            temperature: 0.7,
            maxTokens: 1000
          }
          setAiSettings(defaultSettings)
        }
      } catch (error) {
        console.error('Failed to load AI settings:', error)
        setAiSettings({ enabled: true, model: 'gpt-4', temperature: 0.7, maxTokens: 1000 })
      }
    }

    loadAiSettings()
  }, [])


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    console.log('Sending message:', input.trim())
    console.log('AI Settings:', aiSettings)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('Generating AI response...')
      // Simulate AI response with Baseline data
      const response = await generateAIResponse(input.trim())
      console.log('AI Response received:', response)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        isCode: response.isCode,
        baselineStatus: response.baselineStatus,
        suggestions: response.suggestions
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        baselineStatus: 'unsafe'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (query: string): Promise<{
    content: string
    isCode?: boolean
    baselineStatus?: 'safe' | 'warning' | 'unsafe'
    suggestions?: string[]
  }> => {
    console.log('generateAIResponse called with:', query)
    console.log('AI Settings enabled:', aiSettings?.enabled)
    
    // Check if AI is enabled
    if (aiSettings?.enabled) {
      try {
        console.log('Using Gemini service...')
        // Use Gemini service for AI responses
        const response = await geminiService.generateResponse(query)
        console.log('Gemini response:', response)
        return response
      } catch (error) {
        console.error('AI service error:', error)
        // Fall back to intelligent responses
      }
    }
    
    console.log('Using fallback intelligent responses...')

    // Fallback to intelligent mock responses
    const lowerQuery = query.toLowerCase()

    // Check for specific Baseline features first
    const baselineFeature = checkForBaselineFeature(lowerQuery)
    if (baselineFeature) {
      return baselineFeature
    }

    // Web development questions
    if (lowerQuery.includes('react') || lowerQuery.includes('jsx')) {
      return {
        content: `🚀 **React Development Guide**

React is a powerful JavaScript library for building user interfaces. Here's what you need to know:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

**Key Concepts:**
- **Hooks:** useState, useEffect, useContext
- **Components:** Functional vs Class components
- **State Management:** Redux, Context API, Zustand
- **Performance:** Memoization, lazy loading

Would you like me to explain any specific React concept?`,
        isCode: true,
        baselineStatus: 'safe'
      }
    }

    // CSS questions
    if (lowerQuery.includes('css') || lowerQuery.includes('styling')) {
      return {
        content: `🎨 **CSS Development Guide**

CSS (Cascading Style Sheets) is used to style web pages. Here are the key concepts:

\`\`\`css
/* Modern CSS Grid Layout */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Flexbox for flexible layouts */
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* CSS Custom Properties (Variables) */
:root {
  --primary-color: #007bff;
  --spacing: 1rem;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing);
}
\`\`\`

**Modern CSS Features:**
- **Grid & Flexbox** - Advanced layout systems
- **Custom Properties** - CSS variables
- **Container Queries** - Component-based responsive design
- **CSS Nesting** - Nested selectors (now widely supported)

What specific CSS topic would you like to explore?`,
        isCode: true,
        baselineStatus: 'safe'
      }
    }

    // JavaScript questions
    if (lowerQuery.includes('javascript') || lowerQuery.includes('js')) {
      return {
        content: `💻 **JavaScript Development Guide**

JavaScript is the programming language of the web. Here's what you need to know:

\`\`\`javascript
// Modern ES6+ features
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Arrow functions and destructuring
const processUser = ({ name, email, age }) => {
  return {
    displayName: name.toUpperCase(),
    contact: email,
    isAdult: age >= 18
  };
};

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
\`\`\`

**Key Concepts:**
- **ES6+ Features:** Arrow functions, destructuring, async/await
- **DOM Manipulation:** Selecting elements, event handling
- **APIs:** Fetch, Web APIs, third-party integrations
- **Modules:** Import/export, ES6 modules

What JavaScript topic interests you?`,
        isCode: true,
        baselineStatus: 'safe'
      }
    }

    // Programming/Technology questions
    if (lowerQuery.includes('programming') || lowerQuery.includes('coding') || lowerQuery.includes('code')) {
      return {
        content: `💻 **Programming & Development**

I can help you with various programming topics and technologies:

**Popular Programming Languages:**
- **JavaScript/TypeScript** - Web development, full-stack
- **Python** - Data science, AI, backend development
- **Java** - Enterprise applications, Android development
- **C#** - .NET ecosystem, Windows applications
- **Go** - System programming, microservices
- **Rust** - Performance-critical applications, systems programming

**Development Areas:**
- **Web Development** - Frontend (React, Vue, Angular), Backend (Node.js, Python, Java)
- **Mobile Development** - React Native, Flutter, Native iOS/Android
- **Data Science** - Python, R, Machine Learning, AI
- **DevOps** - Docker, Kubernetes, CI/CD, Cloud platforms
- **Cloud Computing** - AWS, Azure, Google Cloud Platform

**Development Tools:**
- **Version Control:** Git, GitHub, GitLab
- **IDEs:** VS Code, IntelliJ, Sublime Text
- **Frameworks:** React, Vue, Angular, Express, Django
- **Databases:** PostgreSQL, MongoDB, MySQL

What specific programming topic would you like to explore?`,
        baselineStatus: 'safe'
      }
    }

    // AI/Technology questions
    if (lowerQuery.includes('ai') || lowerQuery.includes('artificial intelligence') || lowerQuery.includes('machine learning')) {
      return {
        content: `🤖 **AI & Machine Learning**

Artificial Intelligence and Machine Learning are transforming technology:

**AI Categories:**
- **Machine Learning** - Algorithms that learn from data
- **Deep Learning** - Neural networks for complex patterns
- **Natural Language Processing** - Understanding human language
- **Computer Vision** - Image and video analysis
- **Robotics** - Physical AI systems

**Popular AI Tools & Frameworks:**
- **Python Libraries:** TensorFlow, PyTorch, Scikit-learn
- **Cloud AI Services:** AWS AI, Azure Cognitive Services, Google AI
- **Large Language Models:** GPT, Claude, Gemini, LLaMA
- **AI Development Tools:** Jupyter Notebooks, MLflow, Weights & Biases

**Applications:**
- **Chatbots & Virtual Assistants** - Customer service, personal assistants
- **Image Recognition** - Medical diagnosis, autonomous vehicles
- **Language Translation** - Real-time translation, content localization
- **Recommendation Systems** - E-commerce, content platforms

What aspect of AI interests you most?`,
        baselineStatus: 'safe'
      }
    }

    // Test message handling
    if (lowerQuery.includes('test') || lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      return {
        content: `✅ **Baseline Copilot is Working!**

Great! I'm functioning properly and ready to help you with:

**🔧 Technical Topics:**
- Web development (HTML, CSS, JavaScript)
- Programming languages and frameworks
- Browser compatibility and Baseline features
- Performance optimization

**💡 What I Can Do:**
- Answer technical questions
- Provide code examples
- Explain complex concepts
- Help with debugging

**🚀 Try asking me:**
- "How does CSS Grid work?"
- "Explain JavaScript promises"
- "What is React?"
- "How to optimize website performance?"

I'm here to help! What would you like to know?`,
        baselineStatus: 'safe'
      }
    }

    // General questions - provide helpful response
    return {
      content: `🤔 **I'm Baseline Copilot - Your AI Assistant!**

I can help you with a wide range of topics:

**🌐 Web Development:**
- CSS, JavaScript, HTML best practices
- React, Vue, Angular frameworks
- Browser compatibility and web standards
- Performance optimization techniques

**💻 Programming:**
- Multiple programming languages (Python, Java, C#, Go, Rust)
- Software architecture and design patterns
- Development tools and workflows
- Code optimization and debugging

**🤖 Technology:**
- AI and machine learning concepts
- Cloud computing and DevOps
- Emerging technologies and trends
- Technical problem-solving strategies

**📚 General Knowledge:**
- Science and technology topics
- Learning and education resources
- Business and entrepreneurship
- Any topic you're curious about!

Just ask me anything - I'm here to help! What would you like to know?`,
      baselineStatus: 'safe'
    }
  }


  const checkForBaselineFeature = (query: string): any => {
    try {
      // Search for features by name
      const searchResults = baselineDataService.searchFeatures(query)
      
      if (searchResults.length > 0) {
        const feature = searchResults[0] // Get the first match
        const safetyCheck = baselineDataService.isFeatureSafeToUse(feature.id)
        
        let statusIcon = '✅'
        let statusText = 'Baseline Widely Available'
        let baselineStatus: 'safe' | 'warning' | 'unsafe' = 'safe'
        
        if (feature.baseline === 'high') {
          statusIcon = '✅'
          statusText = 'Baseline Widely Available'
          baselineStatus = 'safe'
        } else if (feature.baseline === 'low') {
          statusIcon = '⚠️'
          statusText = 'Baseline Newly Available'
          baselineStatus = 'warning'
        } else {
          statusIcon = '❌'
          statusText = 'Limited Availability'
          baselineStatus = 'unsafe'
        }

        const supportInfo = Object.entries(feature.support)
          .map(([browser, version]) => `${browser}: ${version}`)
          .join(', ')

        return {
          content: `${statusIcon} **${feature.name} - ${statusText}**

${feature.description}

**Browser Support:**
${supportInfo}

**Baseline Status:** ${statusText}
${feature.baseline_high_date ? `**Became Widely Available:** ${feature.baseline_high_date}` : ''}
${feature.baseline_low_date ? `**Became Newly Available:** ${feature.baseline_low_date}` : ''}

${safetyCheck.safe ? 
  '✅ **Safe to use in production**' : 
  '⚠️ **Use with caution or progressive enhancement**'
}

${feature.spec ? `**Specification:** ${feature.spec}` : ''}`,
          baselineStatus,
          isCode: false
        }
      }
    } catch (error) {
      console.warn('Error checking Baseline feature:', error)
    }
    
    return null
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status?: 'safe' | 'warning' | 'unsafe') => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'unsafe':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status?: 'safe' | 'warning' | 'unsafe') => {
    switch (status) {
      case 'safe':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'unsafe':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Baseline Copilot</h1>
              <p className="text-sm text-gray-600">AI Assistant for Modern Web Features</p>
            </div>
          </div>
                 <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2 text-sm text-gray-500">
                     <div className={`w-2 h-2 rounded-full ${aiSettings?.enabled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                     <span>{aiSettings?.enabled ? 'AI Assistant Ready' : 'Fallback Mode'}</span>
                   </div>
                   <button
                     onClick={exportChatToPDF}
                     className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                     title="Export Chat to PDF"
                   >
                     <Download className="h-4 w-4" />
                     <span className="text-sm">Export PDF</span>
                   </button>
                   <button
                     onClick={() => setShowSettings(!showSettings)}
                     className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                     title="AI Settings"
                   >
                     <Settings className="h-4 w-4" />
                   </button>
                 </div>
        </div>
      </div>

      {/* AI Settings Panel */}
      {showSettings && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-yellow-800">AI Assistant Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-yellow-700">
            <div className="flex items-center justify-between">
              <span>AI Assistant:</span>
              <span className={`px-2 py-1 rounded text-xs ${aiSettings?.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {aiSettings?.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Model:</span>
              <span className="text-xs text-yellow-600">{aiSettings?.model || 'GPT-4'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Temperature:</span>
              <span className="text-xs text-yellow-600">{aiSettings?.temperature || 0.7}</span>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              Configure AI settings in the Settings page for full control.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl flex space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
              >
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`rounded-lg px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : `border ${getStatusColor(message.baselineStatus)}`
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {message.type === 'assistant' && getStatusIcon(message.baselineStatus)}
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {message.isCode && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="prose prose-sm max-w-none">
                  {message.isCode ? (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code>{message.content}</code>
                    </pre>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>

                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                  <span className="text-sm text-gray-600">Baseline Copilot is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything - programming, technology, web development, or any topic!"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Send</span>
          </button>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setInput("How to use React hooks?")}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            React Hooks
          </button>
          <button
            onClick={() => setInput("What is CSS Grid?")}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            CSS Grid
          </button>
          <button
            onClick={() => setInput("Explain JavaScript async/await")}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            Async/Await
          </button>
          <button
            onClick={() => setInput("What is machine learning?")}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            Machine Learning
          </button>
          <button
            onClick={() => setInput("How to optimize website performance?")}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            Performance
          </button>
          <button
            onClick={() => setInput("What is cloud computing?")}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
          >
            Cloud Computing
          </button>
          <button
            onClick={() => setInput("Test message")}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
          >
            Test Copilot
          </button>
        </div>
      </div>
    </div>
  )
}

export default Copilot
