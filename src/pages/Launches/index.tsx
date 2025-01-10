import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Launch } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const Launches: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'success' | 'failure'>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'provider' | 'rocket'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data: launches, isLoading, error } = useQuery({
    queryKey: ['launches'],
    queryFn: api.getAllLaunches
  });

  if (isLoading) return <Loading fullScreen />;
  if (error) return <ErrorMessage fullScreen />;

  const providers = Array.from(new Set(launches?.map(launch => launch.launch_provider) || []));

  const filteredLaunches = launches?.filter(launch => {
    const matchesSearch = 
      launch.mission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      launch.rocket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      launch.launch_provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || launch.status === filterStatus;
    const matchesProvider = filterProvider === 'all' || launch.launch_provider === filterProvider;

    return matchesSearch && matchesStatus && matchesProvider;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.launch_date_utc).getTime() - new Date(b.launch_date_utc).getTime();
        break;
      case 'provider':
        comparison = a.launch_provider.localeCompare(b.launch_provider);
        break;
      case 'rocket':
        comparison = a.rocket.name.localeCompare(b.rocket.name);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold">Space Launches</h1>
        <p className="text-gray-600 mt-2">
          Track past and upcoming launches from all major space agencies and private companies.
        </p>
      </section>
      
      <section className="grid gap-4 md:grid-cols-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800">Total Launches</h3>
          <p className="text-2xl font-bold text-blue-600">{launches?.length || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800">Upcoming</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {launches?.filter(l => l.status === 'upcoming').length || 0}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">Successful</h3>
          <p className="text-2xl font-bold text-green-600">
            {launches?.filter(l => l.status === 'success').length || 0}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-bold text-red-800">Failed</h3>
          <p className="text-2xl font-bold text-red-600">
            {launches?.filter(l => l.status === 'failure').length || 0}
          </p>
        </div>
      </section>

      <section className="card p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search missions, rockets, or providers..."
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="p-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          >
            <option value="all">All Launches</option>
            <option value="upcoming">Upcoming</option>
            <option value="success">Successful</option>
            <option value="failure">Failed</option>
          </select>

          <select
            className="p-2 border rounded"
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
          >
            <option value="all">All Providers</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>

          <select
            className="p-2 border rounded"
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [newSortBy, newSortDirection] = e.target.value.split('-');
              setSortBy(newSortBy as typeof sortBy);
              setSortDirection(newSortDirection as typeof sortDirection);
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="provider-asc">Provider (A-Z)</option>
            <option value="provider-desc">Provider (Z-A)</option>
            <option value="rocket-asc">Rocket (A-Z)</option>
            <option value="rocket-desc">Rocket (Z-A)</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLaunches?.map(launch => (
          <div key={launch.id} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{launch.mission_name}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                launch.status === 'upcoming'
                  ? 'bg-yellow-100 text-yellow-800'
                  : launch.status === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {launch.status === 'upcoming' ? 'Upcoming' : launch.status === 'success' ? 'Success' : 'Failed'}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                {new Date(launch.launch_date_utc).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p><span className="font-medium">Provider:</span> {launch.launch_provider}</p>
              <p><span className="font-medium">Rocket:</span> {launch.rocket.name}</p>
              <p><span className="font-medium">Launch Site:</span> {launch.launch_site.name}</p>
              <p className="text-sm text-gray-500">{launch.mission.description}</p>
              {launch.source && (
                <p className="text-xs text-gray-400 mt-2">
                  Source: <a href={launch.source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {launch.source.name}
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Launches; 