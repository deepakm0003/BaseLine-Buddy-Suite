import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Features from './pages/Features'
import Copilot from './pages/Copilot'
import FileAnalysis from './pages/FileAnalysis'
import BaselineAnalyzer from './pages/BaselineAnalyzer'
import CodeGenerator from './pages/CodeGenerator'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/features" element={<Layout><Features /></Layout>} />
        <Route path="/baseline-analyzer" element={<BaselineAnalyzer />} />
        <Route path="/copilot" element={<Copilot />} />
        <Route path="/file-analysis" element={<FileAnalysis />} />
        <Route path="/code-generator" element={<CodeGenerator />} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App

