import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface FeatureTableProps {
  features: any[]
}

const FeatureTable: React.FC<FeatureTableProps> = ({ features }) => {
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedFeatures = [...features].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === 'baseline') {
      aValue = a.baseline.baseline
      bValue = b.baseline.baseline
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
    }
    if (typeof bValue === 'string') {
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getBaselineStatus = (baseline: string | false) => {
    switch (baseline) {
      case 'widely':
        return { label: 'Widely Available', color: 'status-widely' }
      case 'newly':
        return { label: 'Newly Available', color: 'status-newly' }
      case false:
        return { label: 'Limited Support', color: 'status-limited' }
      default:
        return { label: 'Unknown', color: 'status-limited' }
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Feature
                <SortIcon field="name" />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleSort('group')}
            >
              <div className="flex items-center">
                Group
                <SortIcon field="group" />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleSort('baseline')}
            >
              <div className="flex items-center">
                Baseline Status
                <SortIcon field="baseline" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedFeatures.map((feature) => {
            const status = getBaselineStatus(feature.baseline.baseline)
            const date = feature.baseline.baseline_low_date || feature.baseline.baseline_high_date
            
            return (
              <tr key={feature.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{feature.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {feature.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 capitalize">
                    {feature.group}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`status-badge ${status.color}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {date ? new Date(date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {feature.spec && (
                    <a
                      href={feature.spec}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default FeatureTable

