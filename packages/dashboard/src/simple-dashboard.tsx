import { useState, useEffect } from 'react'

// Mock data for demonstration
const mockFeatures = [
  {
    id: 'grid',
    name: 'CSS Grid',
    description: 'CSS Grid Layout',
    group: 'css',
    baseline: { baseline: 'widely', baseline_high_date: '2017-03-14' },
    support: { chrome: '57', firefox: '52', safari: '10.1', edge: '16' }
  },
  {
    id: 'subgrid',
    name: 'CSS Subgrid',
    description: 'CSS Grid Subgrid',
    group: 'css',
    baseline: { baseline: 'newly', baseline_low_date: '2023-09-15' },
    support: { chrome: '117', firefox: '71', safari: '16' }
  },
  {
    id: 'container-queries',
    name: 'Container Queries',
    description: 'CSS Container Queries',
    group: 'css',
    baseline: { baseline: 'newly', baseline_low_date: '2023-02-14' },
    support: { chrome: '105', firefox: '110', safari: '16' }
  },
  {
    id: 'word-break-auto-phrase',
    name: 'word-break: auto-phrase',
    description: 'CSS word-break auto-phrase value',
    group: 'css',
    baseline: { baseline: false },
    support: { chrome: '119' }
  },
  {
    id: 'has-selector',
    name: ':has() selector',
    description: 'CSS :has() pseudo-class',
    group: 'css',
    baseline: { baseline: 'newly', baseline_low_date: '2022-12-13' },
    support: { chrome: '105', firefox: '103', safari: '15.4' }
  }
];

function SimpleDashboard() {
  const [features] = useState(mockFeatures);
  const [stats, setStats] = useState({
    total: 0,
    widely: 0,
    newly: 0,
    limited: 0
  });

  useEffect(() => {
    setStats({
      total: features.length,
      widely: features.filter(f => f.baseline.baseline === 'widely').length,
      newly: features.filter(f => f.baseline.baseline === 'newly').length,
      limited: features.filter(f => f.baseline.baseline === false).length
    });
  }, [features]);

  const getBaselineStatus = (baseline: string | false) => {
    switch (baseline) {
      case 'widely':
        return { label: 'Widely Available', color: 'bg-green-100 text-green-800' };
      case 'newly':
        return { label: 'Newly Available', color: 'bg-blue-100 text-blue-800' };
      case false:
        return { label: 'Limited Support', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Baseline Explorer Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Explore web features and their Baseline status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">T</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Features</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">W</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Widely Available</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.widely}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">N</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Newly Available</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.newly}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">L</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Limited Support</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.limited}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Baseline Features</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Current web features and their Baseline status
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {features.map((feature) => {
              const status = getBaselineStatus(feature.baseline.baseline as string);
              return (
                <li key={feature.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {feature.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <p className="truncate">{feature.description}</p>
                        </div>
                        <div className="mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="capitalize">{feature.group}</span>
                            {feature.baseline.baseline_low_date && (
                              <span className="ml-4">
                                Newly: {new Date(feature.baseline.baseline_low_date).toLocaleDateString()}
                              </span>
                            )}
                            {feature.baseline.baseline_high_date && (
                              <span className="ml-4">
                                Widely: {new Date(feature.baseline.baseline_high_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
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

export default SimpleDashboard;
