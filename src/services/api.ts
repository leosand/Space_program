import axios from 'axios';

interface LaunchStatistics {
  total: number;
  success: number;
  failure: number;
  upcoming: number;
  byYear: Record<string, number>;
  byProvider: Record<string, number>;
  sources: string[];
}

interface Launch {
  id: string;
  name: string;
  date: string;
  success: boolean;
  upcoming: boolean;
  provider: string;
  rocket: {
    name: string;
    type: string;
  };
}

// Données de test pour le développement
const mockLaunches: Launch[] = [
  {
    id: '1',
    mission_name: 'Starlink 4-1',
    launch_date_utc: '2024-01-15T10:00:00Z',
    status: 'upcoming',
    launch_provider: 'SpaceX',
    rocket: {
      name: 'Falcon 9',
      type: 'Orbital Launch Vehicle',
      success_rate_pct: 98,
      cost_per_launch: 62000000,
      specifications: {
        payload_leo_kg: 22800,
        payload_gto_kg: 8300,
        height_m: 70
      }
    },
    launch_site: {
      name: 'Kennedy Space Center LC-39A',
      location: 'Florida, USA'
    },
    mission: {
      description: 'Mission de déploiement de satellites Starlink',
      type: 'Satellite Deployment'
    }
  },
  {
    id: '2',
    mission_name: 'Artemis II',
    launch_date_utc: '2024-09-01T00:00:00Z',
    status: 'upcoming',
    launch_provider: 'NASA',
    rocket: {
      name: 'SLS Block 1',
      type: 'Super Heavy-Lift Launch Vehicle',
      success_rate_pct: 100,
      cost_per_launch: 2000000000,
      specifications: {
        payload_leo_kg: 95000,
        payload_gto_kg: 27000,
        height_m: 98
      }
    },
    launch_site: {
      name: 'Kennedy Space Center LC-39B',
      location: 'Florida, USA'
    },
    mission: {
      description: 'Premier vol habité autour de la Lune depuis Apollo',
      type: 'Crewed Lunar Mission'
    }
  },
  {
    id: '3',
    mission_name: 'Neutron Test Flight',
    launch_date_utc: '2024-12-01T00:00:00Z',
    status: 'upcoming',
    launch_provider: 'Rocket Lab',
    rocket: {
      name: 'Neutron',
      type: 'Medium-Lift Launch Vehicle',
      success_rate_pct: 0,
      cost_per_launch: 50000000,
      specifications: {
        payload_leo_kg: 13000,
        payload_gto_kg: 1500,
        height_m: 40
      }
    },
    launch_site: {
      name: 'Wallops Flight Facility',
      location: 'Virginia, USA'
    },
    mission: {
      description: 'Premier vol du lanceur Neutron',
      type: 'Test Flight'
    }
  },
  {
    id: '4',
    mission_name: 'Starlink 3-5',
    launch_date_utc: '2023-12-15T10:00:00Z',
    status: 'success',
    launch_provider: 'SpaceX',
    rocket: {
      name: 'Falcon 9',
      type: 'Orbital Launch Vehicle',
      success_rate_pct: 98,
      cost_per_launch: 62000000,
      specifications: {
        payload_leo_kg: 22800,
        payload_gto_kg: 8300,
        height_m: 70
      }
    },
    launch_site: {
      name: 'Cape Canaveral SLC-40',
      location: 'Florida, USA'
    },
    mission: {
      description: 'Mission réussie de déploiement de satellites Starlink',
      type: 'Satellite Deployment'
    }
  },
  {
    id: '5',
    mission_name: 'Electron Test',
    launch_date_utc: '2023-11-20T15:00:00Z',
    status: 'failure',
    launch_provider: 'Rocket Lab',
    rocket: {
      name: 'Electron',
      type: 'Small-Lift Launch Vehicle',
      success_rate_pct: 92,
      cost_per_launch: 7500000,
      specifications: {
        payload_leo_kg: 300,
        payload_gto_kg: null,
        height_m: 18
      }
    },
    launch_site: {
      name: 'Rocket Lab LC-1',
      location: 'Mahia Peninsula, New Zealand'
    },
    mission: {
      description: 'Échec du lancement dû à une anomalie du second étage',
      type: 'Test Flight'
    }
  }
];

class ApiService {
  private async getSpaceXLaunches(): Promise<Launch[]> {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SPACEX_API_URL}/launches`);
      return response.data.map((launch: any) => ({
        id: launch.id,
        mission_name: launch.name,
        launch_date_utc: launch.date_utc,
        status: launch.upcoming ? 'upcoming' : launch.success ? 'success' : 'failure',
        launch_provider: 'SpaceX',
        rocket: {
          name: launch.rocket.name,
          type: launch.rocket.type,
          success_rate_pct: launch.rocket.success_rate_pct,
          cost_per_launch: launch.rocket.cost_per_launch,
          specifications: {
            payload_leo_kg: launch.rocket.payload_weights?.find((w: any) => w.id === 'leo')?.kg,
            payload_gto_kg: launch.rocket.payload_weights?.find((w: any) => w.id === 'gto')?.kg,
            height_m: launch.rocket.height?.meters
          }
        },
        launch_site: {
          name: launch.launchpad.name,
          location: launch.launchpad.locality,
        },
        mission: {
          description: launch.details || 'Pas de description disponible',
          type: launch.payload?.[0]?.type || 'Inconnu',
        },
        source: {
          name: 'SpaceX API',
          url: 'https://api.spacexdata.com',
        },
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des lancements SpaceX:', error);
      return [];
    }
  }

  async getAllLaunches(): Promise<Launch[]> {
    try {
      // En développement, utiliser les données de test
      if (import.meta.env.DEV) {
        return mockLaunches;
      }

      const spacexLaunches = await this.getSpaceXLaunches();
      return [...spacexLaunches]
        .sort((a, b) => new Date(b.launch_date_utc).getTime() - new Date(a.launch_date_utc).getTime());
    } catch (error) {
      console.error('Erreur lors de la récupération des lancements:', error);
      return mockLaunches; // Utiliser les données de test en cas d'erreur
    }
  }

  async getLaunchStatistics(): Promise<LaunchStatistics> {
    try {
      const launches = await this.getAllLaunches();
      const stats: LaunchStatistics = {
        total: launches.length,
        success: launches.filter(l => l.success).length,
        failure: launches.filter(l => l.success === false).length,
        upcoming: launches.filter(l => l.upcoming).length || 0,
        byYear: {},
        byProvider: {},
        sources: ['SpaceX', 'NASA']
      };

      // Grouper par année
      launches.forEach(launch => {
        const year = new Date(launch.launch_date_utc).getFullYear().toString();
        stats.byYear[year] = (stats.byYear[year] || 0) + 1;
      });

      // Grouper par fournisseur
      launches.forEach(launch => {
        stats.byProvider[launch.launch_provider] = (stats.byProvider[launch.launch_provider] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching launch statistics:', error);
      throw error;
    }
  }

  async getRocketDetails(rocketId: string) {
    try {
      const launches = await this.getAllLaunches();
      return launches.find(launch => launch.rocket.name === rocketId)?.rocket;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la fusée:', error);
      throw error;
    }
  }
}

export const api = new ApiService(); 