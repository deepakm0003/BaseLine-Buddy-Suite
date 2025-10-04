import React, { useState, useEffect } from 'react'
import { Search, Grid, List } from 'lucide-react'
import FeatureCard from '../components/FeatureCard'
import FeatureTable from '../components/FeatureTable'
import baselineDataService from '../services/baselineDataService'

const Features: React.FC = () => {
  const [features, setFeatures] = useState<any[]>([])
  const [filteredFeatures, setFilteredFeatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedBaseline, setSelectedBaseline] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  useEffect(() => {
    loadFeatures()
  }, [])

  useEffect(() => {
    filterFeatures()
  }, [features, searchTerm, selectedGroup, selectedBaseline])

  const loadFeatures = async () => {
    setLoading(true)
    try {
      // Load real Baseline data from web-features package
      const allFeatures = baselineDataService.getAllFeatures()
      setFeatures(allFeatures)
    } catch (error) {
      console.error('Failed to load features:', error)
      // Fallback to mock data if real data fails
      const fallbackFeatures = [
        { id: '1', name: 'CSS Nesting', description: 'CSS Nesting support', group: 'css', baseline: { baseline: 'widely' } },
        { id: '2', name: 'Container Queries', description: 'CSS Container Queries', group: 'css', baseline: { baseline: 'widely' } },
        { id: '3', name: ':has() selector', description: 'CSS :has() pseudo-class', group: 'css', baseline: { baseline: 'widely' } },
        { id: '4', name: 'View Transitions', description: 'View Transitions API', group: 'javascript', baseline: { baseline: 'newly' } },
        { id: '5', name: 'structuredClone', description: 'structuredClone API', group: 'javascript', baseline: { baseline: 'widely' } }
      ]
      setFeatures(fallbackFeatures)
    } finally {
      setLoading(false)
    }
  }

  const filterFeatures = () => {
    let filtered = features

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Group filter
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(feature => feature.group === selectedGroup)
    }

    // Baseline filter
    if (selectedBaseline !== 'all') {
      filtered = filtered.filter(feature => feature.baseline.baseline === selectedBaseline)
    }

    setFilteredFeatures(filtered)
  }

  const groups = [...new Set(features.map(f => f.group))].sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading features...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Features</h1>
          <p className="mt-2 text-gray-600">
            Explore all web features and their Baseline status
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              {groups.map(group => (
                <option key={group} value={group} className="capitalize">
                  {group}
                </option>
              ))}
            </select>
            <select
              value={selectedBaseline}
              onChange={(e) => setSelectedBaseline(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="widely">Widely Available</option>
              <option value="newly">Newly Available</option>
              <option value="false">Limited Support</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredFeatures.length} of {features.length} features
        </p>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      ) : (
        <div className="card">
          <FeatureTable features={filteredFeatures} />
        </div>
      )}

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No features found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default Features

