import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface LaunchStatistics {
  total: number;
  success: number;
  failure: number;
  upcoming: number;
  byYear: Record<string, number>;
  byProvider: Record<string, number>;
  sources: Array<{
    name: string;
    url: string;
  }>;
}

const Statistics: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery<LaunchStatistics>({
    queryKey: ['launchStats'],
    queryFn: () => api.getLaunchStatistics()
  });

  if (isLoading) return <Loading fullScreen />;
  if (error) return <ErrorMessage fullScreen />;

  const yearlyData = {
    labels: Object.keys(stats?.byYear || {}),
    datasets: [
      {
        label: 'Number of Launches',
        data: Object.values(stats?.byYear || {}),
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 1,
      },
    ],
  };

  const providerData = {
    labels: Object.keys(stats?.byProvider || {}),
    datasets: [
      {
        data: Object.values(stats?.byProvider || {}),
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(249, 115, 22, 0.5)',
          'rgba(168, 85, 247, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Launch Statistics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive statistics from all major launch providers worldwide, including both government agencies and private companies.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800">Total Launches</h3>
          <p className="text-2xl font-bold text-blue-600">{stats?.total || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-green-800">Successful Launches</h3>
          <p className="text-2xl font-bold text-green-600">{stats?.success || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-bold text-red-800">Failed Launches</h3>
          <p className="text-2xl font-bold text-red-600">{stats?.failure || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800">Upcoming Launches</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats?.upcoming || 0}</p>
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Launches by Year</h2>
          <Bar
            data={yearlyData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: false,
                },
              },
            }}
          />
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Launches by Provider</h2>
          <div className="aspect-square">
            <Pie
              data={providerData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <section className="card p-6">
        <h2 className="text-xl font-bold mb-4">Data Sources</h2>
        <div className="space-y-4">
          {stats?.sources.map((source: any) => (
            <div key={source.name} className="border-b pb-4">
              <h3 className="font-bold text-lg">{source.name}</h3>
              <p className="text-gray-600">
                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Access Data Source
                </a>
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>* All data is regularly updated from official APIs and verified sources.</p>
          <p>* Launch success rates and statistics are calculated based on completed missions only.</p>
          <p>* Upcoming launches are based on officially announced schedules and may be subject to change.</p>
        </div>
      </section>
    </div>
  );
};

export default Statistics; 