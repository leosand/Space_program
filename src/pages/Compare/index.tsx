import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Launch } from '../../services/api';
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
  RadialLinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonMetrics {
  successRate: number;
  costPerLaunch: number;
  payloadLEO: number;
  payloadGTO: number;
  heightMeters: number;
  totalLaunches: number;
  upcomingLaunches: number;
}

interface MetricLabels {
  successRate: string;
  costPerLaunch: string;
  payloadLEO: string;
  payloadGTO: string;
  heightMeters: string;
  totalLaunches: string;
  upcomingLaunches: string;
}

interface RocketMetrics {
  [key: string]: Partial<ComparisonMetrics>;
}

const Compare: React.FC = () => {
  const [selectedRockets, setSelectedRockets] = useState<string[]>([]);
  const [comparisonMetric, setComparisonMetric] = useState<keyof ComparisonMetrics>('successRate');

  const { data: launches, isLoading, error } = useQuery({
    queryKey: ['launches'],
    queryFn: api.getAllLaunches
  });

  if (isLoading) return <Loading fullScreen />;
  if (error) return <ErrorMessage fullScreen />;

  const rocketMetrics = launches?.reduce((acc: RocketMetrics, launch: Launch) => {
    const rocketName = launch.rocket.name;
    if (!acc[rocketName]) {
      acc[rocketName] = {
        name: rocketName,
        totalLaunches: 0,
        successRate: launch.rocket.success_rate_pct || 0,
        costPerLaunch: launch.rocket.cost_per_launch || 0,
        payloadLEO: launch.rocket.specifications?.payload_leo_kg || 0,
        payloadGTO: launch.rocket.specifications?.payload_gto_kg || 0,
        heightMeters: launch.rocket.specifications?.height_m || 0,
        upcomingLaunches: 0
      };
    }
    acc[rocketName].totalLaunches = (acc[rocketName].totalLaunches || 0) + 1;
    if (launch.status === 'upcoming') {
      acc[rocketName].upcomingLaunches = (acc[rocketName].upcomingLaunches || 0) + 1;
    }
    return acc;
  }, {});

  const availableRockets = Object.keys(rocketMetrics || {});

  const metricLabels: MetricLabels = {
    successRate: "Taux de réussite",
    costPerLaunch: "Coût par lancement",
    payloadLEO: "Charge utile (LEO)",
    payloadGTO: "Charge utile (GTO)",
    heightMeters: "Hauteur (m)",
    totalLaunches: "Lancements totaux",
    upcomingLaunches: "Lancements à venir"
  };

  const barData = {
    labels: [metricLabels[comparisonMetric]],
    datasets: selectedRockets.map((rocketName, index) => ({
      label: rocketName,
      data: [rocketMetrics?.[rocketName]?.[comparisonMetric] || 0],
      backgroundColor: `hsla(${index * 60}, 70%, 60%, 0.5)`,
      borderColor: `hsla(${index * 60}, 70%, 60%, 1)`,
      borderWidth: 1,
    })),
  };

  const radarData = {
    labels: ['Success Rate', 'Payload Capacity', 'Cost Efficiency', 'Launch Frequency', 'Reliability'],
    datasets: selectedRockets.map((rocketName, index) => {
      const metrics = rocketMetrics?.[rocketName] || {};
      const maxPayload = Math.max(metrics.payloadLEO || 0, metrics.payloadGTO || 0);
      const costEfficiency = maxPayload / (metrics.costPerLaunch || 1);
      const launchFrequency = metrics.totalLaunches || 0;
      
      return {
        label: rocketName,
        data: [
          metrics.successRate || 0,
          maxPayload / 50000, // Normalized to 0-100
          costEfficiency * 100,
          launchFrequency * 10,
          metrics.successRate || 0,
        ],
        backgroundColor: `hsla(${index * 60}, 70%, 60%, 0.2)`,
        borderColor: `hsla(${index * 60}, 70%, 60%, 1)`,
        borderWidth: 2,
      };
    }),
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Launch Vehicle Comparison</h1>
        <p className="text-gray-600 mt-2">
          Compare specifications and performance metrics of different launch vehicles.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold mb-4">Select Launch Vehicles</h2>
        <div className="flex flex-wrap gap-2">
          {availableRockets.map(rocketName => (
            <button
              key={rocketName}
              onClick={() => {
                if (selectedRockets.includes(rocketName)) {
                  setSelectedRockets(prev => prev.filter(r => r !== rocketName));
                } else if (selectedRockets.length < 3) {
                  setSelectedRockets(prev => [...prev, rocketName]);
                }
              }}
              className={`px-4 py-2 rounded ${
                selectedRockets.includes(rocketName)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {rocketName}
            </button>
          ))}
        </div>
      </section>

      {selectedRockets.length > 0 && (
        <>
          <section className="card p-6">
            <h2 className="text-xl font-bold mb-4">Comparison Metric</h2>
            <select
              className="w-full p-2 border rounded"
              value={comparisonMetric}
              onChange={(e) => setComparisonMetric(e.target.value as keyof ComparisonMetrics)}
            >
              {Object.entries(metricLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </section>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Direct Comparison</h2>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Overall Performance</h2>
              <Radar
                data={radarData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>
          </div>

          <section className="card p-6">
            <h2 className="text-xl font-bold mb-4">Detailed Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">Specification</th>
                    {selectedRockets.map(rocketName => (
                      <th key={rocketName} className="p-2 text-left">{rocketName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metricLabels).map(([key, label]) => (
                    <tr key={key} className="border-t">
                      <td className="p-2 font-medium">{label}</td>
                      {selectedRockets.map(rocketName => (
                        <td key={rocketName} className="p-2">
                          {formatMetric(
                            key as keyof ComparisonMetrics,
                            rocketMetrics?.[rocketName]?.[key as keyof ComparisonMetrics] as number
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

function formatMetric(key: keyof ComparisonMetrics, value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  
  switch (key) {
    case 'successRate':
      return `${value.toFixed(1)}%`;
    case 'costPerLaunch':
      return `$${(value / 1000000).toFixed(1)}M`;
    case 'payloadLEO':
    case 'payloadGTO':
      return `${value.toLocaleString()} kg`;
    case 'heightMeters':
      return `${value.toFixed(1)}m`;
    case 'totalLaunches':
    case 'upcomingLaunches':
      return value.toString();
    default:
      return value.toString();
  }
}

export default Compare; 