import React from 'react'
import { ExternalLink, Calendar, Users } from 'lucide-react'

interface FeatureCardProps {
  feature: {
    id: string
    name: string
    description: string
    group: string
    baseline: {
      baseline: string | false
      baseline_low_date?: string
      baseline_high_date?: string
    }
    spec?: string
  }
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
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

  const status = getBaselineStatus(feature.baseline.baseline)

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
        <span className={`status-badge ${status.color}`}>
          {status.label}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {feature.description}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {feature.baseline.baseline_low_date && (
            <span>Newly: {new Date(feature.baseline.baseline_low_date).toLocaleDateString()}</span>
          )}
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span className="capitalize">{feature.group}</span>
        </div>
      </div>
      
      {feature.spec && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href={feature.spec}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Specification
          </a>
        </div>
      )}
    </div>
  )
}

export default FeatureCard

