# 🚀 Space Launches Comparison Platform

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-yellow)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-blue)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A cutting-edge web application designed to provide comprehensive analysis and comparison of global space launches. This platform aggregates data from various space agencies and private companies, offering detailed insights into launch vehicles, mission success rates, and industry trends.

## ✨ Key Features

### 🛸 Launch Database
- **Comprehensive Data**: Extensive collection of launch data from government agencies and private companies
- **Real-time Updates**: Live tracking of upcoming and recent launches
- **Historical Records**: Complete archive of past launches with detailed mission information

### 📊 Analytics & Comparison
- **Interactive Visualizations**: Dynamic charts and graphs for data analysis
- **Vehicle Comparison**: Side-by-side comparison of different launch vehicles
- **Success Rate Analysis**: Detailed statistics on mission outcomes
- **Cost Analysis**: Launch cost comparisons across different providers

### 📱 User Experience
- **Responsive Design**: Optimized for all devices and screen sizes
- **Intuitive Interface**: User-friendly navigation and data presentation
- **Performance Optimized**: Fast loading times and smooth interactions
- **Accessibility**: WCAG compliant design for all users

### 🔄 Real-time Features
- **Live Updates**: Real-time launch tracking and countdown timers
- **News Integration**: Latest space industry news and updates
- **Social Sharing**: Easy sharing of launch information and statistics

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Data Visualization**: Chart.js / D3.js
- **Date Handling**: date-fns
- **Meta Tags**: React Helmet Async

### Development Tools
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library
- **Performance Monitoring**: Lighthouse
- **Version Control**: Git

### Containerization & Deployment
- **Docker**: Conteneurisation complète de l'application
  - Image de base : Node 18 Alpine
  - Multi-stage build pour optimisation
  - Support du Hot Reload en développement
- **Docker Compose**: Orchestration des services
  - Configuration de développement et production
  - Gestion des variables d'environnement
  - Volumes pour la persistance des données
- **Ports**:
  - Development: 3000
  - Production: 80

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher) *[Pour installation standard]*
- npm ou yarn *[Pour installation standard]*
- Git
- Docker (optionnel, pour l'installation avec Docker)

### Installation Standard

1. Cloner le dépôt :
```bash
git clone https://github.com/leosand/Space_program.git
cd Space_program
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer .env avec vos clés API et configuration
```

4. Démarrer le serveur de développement :
```bash
npm run dev
```

### Installation avec Docker

1. Cloner le dépôt :
```bash
git clone https://github.com/leosand/Space_program.git
cd Space_program
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer .env avec vos clés API et configuration
```

3. Construire et démarrer avec Docker Compose :
```bash
docker-compose up --build
```

L'application sera accessible à :
- Mode développement : http://localhost:3000
- Mode production : http://localhost:80

Pour arrêter l'application :
```bash
docker-compose down
```

## 🐳 Utilisation avec Docker

### Prérequis
- Docker installé sur votre machine
- Docker Compose (inclus avec Docker Desktop pour Windows/Mac)

### Construction et Démarrage
1. Construire l'image :
```bash
docker build -t space-program .
```

2. Démarrer le conteneur :
```bash
docker run -p 3000:3000 space-program
```

### Utilisation de Docker Compose
1. Démarrer l'application :
```bash
docker-compose up
```

2. Arrêter l'application :
```bash
docker-compose down
```

### Variables d'Environnement avec Docker
Les variables d'environnement peuvent être configurées dans le fichier `docker-compose.yml` :
```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - VITE_API_URL=http://api.example.com
```

### Développement avec Docker
Pour le développement, utilisez le volume pour la mise à jour en temps réel :
```bash
docker-compose -f docker-compose.dev.yml up
```

## 🏗️ Project Structure

```
Space_program/
├── src/
│   ├── assets/          # Static assets and global styles
│   ├── components/      # Reusable UI components
│   ├── pages/          # Main application pages
│   ├── services/       # API and external service integrations
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions and utilities
│   ├── types/          # TypeScript type definitions
│   └── context/        # React Context providers
├── public/             # Public static files
├── tests/              # Test suites
└── docs/              # Documentation
```

## 🔧 Configuration

The project uses several configuration files:
- `vite.config.ts`: Vite and build configuration
- `tailwind.config.js`: TailwindCSS customization
- `tsconfig.json`: TypeScript compiler options
- `.eslintrc.js`: ESLint rules and plugins
- `.prettierrc`: Code formatting rules

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Leone Sand** - *Lead Developer* - [leosand](https://github.com/leosand)

## 🙏 Acknowledgments

- SpaceX API for comprehensive launch data
- NASA Open API for additional space information
- All contributors who have helped improve this project

## 📞 Support

For support, please:
- Open an issue on GitHub
- Contact the development team
- Check our [documentation](docs/) 