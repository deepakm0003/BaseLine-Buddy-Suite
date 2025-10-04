import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  Shield, 
  Palette,
  Zap,
  Save,
  RefreshCw,
  Mail,
  CheckCircle
} from 'lucide-react'

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      desktop: false
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      compactMode: false
    },
    baseline: {
      strictMode: true,
      autoCheck: true,
      showWarnings: true,
      includeExperimental: false
    },
    ai: {
      enabled: true,
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [, /* setDarkMode */] = useState(true) // Always dark mode

  // Always apply dark mode, font size, compact mode, and AI settings
  useEffect(() => {
    document.documentElement.classList.add('dark')
    applyFontSize(settings.appearance.fontSize)
    applyCompactMode(settings.appearance.compactMode)
    applyAISettings(settings.ai)
  }, [settings.appearance.fontSize, settings.appearance.compactMode, settings.ai])

  const applyFontSize = (fontSize: string) => {
    const root = document.documentElement
    root.classList.remove('font-small', 'font-medium', 'font-large')
    root.classList.add(`font-${fontSize}`)
  }

  const applyCompactMode = (compact: boolean) => {
    const root = document.documentElement
    if (compact) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }
  }

  const applyAISettings = (aiSettings: any) => {
    // Store AI settings for use by Copilot
    localStorage.setItem('ai-config', JSON.stringify(aiSettings))
    
    // Apply AI enabled/disabled
    if (aiSettings.enabled) {
      document.documentElement.classList.add('ai-enabled')
    } else {
      document.documentElement.classList.remove('ai-enabled')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage
      const updatedSettings = {
        ...settings,
        appearance: {
          ...settings.appearance,
          theme: 'dark' // Always dark mode
        }
      }
      localStorage.setItem('baseline-settings', JSON.stringify(updatedSettings))
      setSettings(updatedSettings)
      
      // Apply Baseline settings
      applyBaselineSettings(updatedSettings.baseline)
      
      // Show success notification
      if (settings.notifications.browser) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Baseline Buddy', {
            body: 'Settings saved successfully!',
            icon: '/favicon.ico'
          })
        }
      }
      
      console.log('Settings saved:', updatedSettings)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const applyBaselineSettings = (baselineSettings: any) => {
    // Store Baseline settings for use by other components
    localStorage.setItem('baseline-config', JSON.stringify(baselineSettings))
    
    // Apply strict mode
    if (baselineSettings.strictMode) {
      document.documentElement.classList.add('strict-mode')
    } else {
      document.documentElement.classList.remove('strict-mode')
    }
    
    // Apply auto check
    if (baselineSettings.autoCheck) {
      document.documentElement.classList.add('auto-check')
    } else {
      document.documentElement.classList.remove('auto-check')
    }
    
    // Apply show warnings
    if (baselineSettings.showWarnings) {
      document.documentElement.classList.add('show-warnings')
    } else {
      document.documentElement.classList.remove('show-warnings')
    }
  }

  const handleNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        new Notification('Baseline Buddy', {
          body: 'Browser notifications enabled!',
          icon: '/favicon.ico'
        })
      }
    }
  }

  const handleEmailNotification = () => {
    setEmailModalOpen(true)
  }

  const sendFeedbackEmail = async () => {
    if (!email || !feedback) return

    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create email content
      const emailContent = {
        to: email,
        subject: 'Baseline Buddy - Feedback Received',
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <div style="background: white; color: #333; padding: 30px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px; color: white;">⚡</span>
                </div>
                <h1 style="color: #333; margin: 0; font-size: 28px;">Baseline Buddy</h1>
                <p style="color: #666; margin: 10px 0 0; font-size: 16px;">Your Baseline Experience Feedback</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #333; margin: 0 0 15px; font-size: 20px;">Thank you for your feedback!</h2>
                <p style="color: #666; margin: 0; line-height: 1.6;">
                  We've received your feedback about your Baseline Buddy experience. 
                  Your input helps us improve the tool for all developers.
                </p>
              </div>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin: 0 0 10px; font-size: 16px;">Your Feedback:</h3>
                <p style="color: #333; margin: 0; font-style: italic; background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1976d2;">
                  "${feedback}"
                </p>
              </div>
              
              <div style="background: #f1f8e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #388e3c; margin: 0 0 10px; font-size: 16px;">What's Next?</h3>
                <ul style="color: #333; margin: 0; padding-left: 20px;">
                  <li>We'll review your feedback and consider it for future updates</li>
                  <li>Keep using Baseline Buddy to stay updated with web standards</li>
                  <li>Share your experience with other developers</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; margin: 0; font-size: 14px;">
                  Keep building amazing web experiences with Baseline Buddy! 🚀
                </p>
                <p style="color: #999; margin: 10px 0 0; font-size: 12px;">
                  This is an automated email. Please do not reply directly to this message.
                </p>
              </div>
            </div>
          </div>
        `
      }
      
      console.log('Email would be sent:', emailContent)
      setEmailSent(true)
      setEmailModalOpen(false)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setEmailSent(false)
        setEmail('')
        setFeedback('')
      }, 3000)
      
    } catch (error) {
      console.error('Failed to send email:', error)
    }
  }

  const handleReset = () => {
    setSettings({
      notifications: {
        email: true,
        browser: true,
        desktop: false
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        compactMode: false
      },
      baseline: {
        strictMode: true,
        autoCheck: true,
        showWarnings: true,
        includeExperimental: false
      },
      ai: {
        enabled: true,
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000
      }
    })
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure your Baseline Buddy experience
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
            <Save className="h-4 w-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Settings Sections */}
        <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-600">Receive updates via email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => {
                    updateSetting('notifications', 'email', e.target.checked)
                    if (e.target.checked) {
                      handleEmailNotification()
                    }
                  }}
                className="sr-only peer"
              />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

            <div className="flex items-center justify-between">
          <div>
                <div className="font-medium text-gray-900">Browser Notifications</div>
                <div className="text-sm text-gray-600">Show browser notifications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
            <input
                  type="checkbox"
                  checked={settings.notifications.browser}
                  onChange={(e) => {
                    updateSetting('notifications', 'browser', e.target.checked)
                    if (e.target.checked) {
                      handleNotificationPermission()
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
      </div>

          <div className="flex items-center justify-between">
            <div>
                <div className="font-medium text-gray-900">Desktop Notifications</div>
                <div className="text-sm text-gray-600">Show desktop notifications</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                  checked={settings.notifications.desktop}
                  onChange={(e) => updateSetting('notifications', 'desktop', e.target.checked)}
                className="sr-only peer"
              />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            </div>
          </div>
          </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Palette className="h-5 w-5 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
          </div>
          <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
              <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400">
                Dark Mode (Default)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
            </label>
            <select
                value={settings.appearance.fontSize}
                onChange={(e) => {
                  updateSetting('appearance', 'fontSize', e.target.value)
                  applyFontSize(e.target.value)
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Compact Mode</div>
                <div className="text-sm text-gray-600">Use compact layout</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appearance.compactMode}
                  onChange={(e) => {
                    updateSetting('appearance', 'compactMode', e.target.checked)
                    applyCompactMode(e.target.checked)
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Baseline Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Baseline Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Strict Mode</div>
                <div className="text-sm text-gray-600">Only show Baseline Widely features</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.baseline.strictMode}
                  onChange={(e) => {
                    updateSetting('baseline', 'strictMode', e.target.checked)
                    applyBaselineSettings({...settings.baseline, strictMode: e.target.checked})
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
      </div>

          <div className="flex items-center justify-between">
            <div>
                <div className="font-medium text-gray-900">Auto Check</div>
                <div className="text-sm text-gray-600">Automatically check files on save</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.baseline.autoCheck}
                  onChange={(e) => {
                    updateSetting('baseline', 'autoCheck', e.target.checked)
                    applyBaselineSettings({...settings.baseline, autoCheck: e.target.checked})
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Show Warnings</div>
                <div className="text-sm text-gray-600">Display warning messages</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                  checked={settings.baseline.showWarnings}
                  onChange={(e) => {
                    updateSetting('baseline', 'showWarnings', e.target.checked)
                    applyBaselineSettings({...settings.baseline, showWarnings: e.target.checked})
                  }}
                className="sr-only peer"
              />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

        {/* AI Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-5 w-5 text-yellow-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
                <div className="font-medium text-gray-900">Enable AI Assistant</div>
                <div className="text-sm text-gray-600">Use AI for code suggestions</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ai.enabled}
                  onChange={(e) => {
                    updateSetting('ai', 'enabled', e.target.checked)
                    applyAISettings({...settings.ai, enabled: e.target.checked})
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={settings.ai.model}
                onChange={(e) => updateSetting('ai', 'model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
              </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature: {settings.ai.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.ai.temperature}
                onChange={(e) => updateSetting('ai', 'temperature', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>More focused</span>
                <span>More creative</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tokens: {settings.ai.maxTokens}
              </label>
              <input
                type="range"
                min="100"
                max="4000"
                step="100"
                value={settings.ai.maxTokens}
                onChange={(e) => updateSetting('ai', 'maxTokens', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Shorter responses</span>
                <span>Longer responses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback about Baseline Buddy
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us about your experience with Baseline Buddy..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={sendFeedbackEmail}
                  disabled={!email || !feedback}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {emailSent && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Feedback sent successfully! Check your email.</span>
        </div>
      )}
    </div>
  )
}

export default Settings