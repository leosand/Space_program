import { createServer } from 'vite';

async function startServer() {
  const server = await createServer({
    // Configuration du serveur
    server: {
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        // Configuration du proxy pour les API si nécessaire
        '/api/spacex': {
          target: 'https://api.spacexdata.com/v3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/spacex/, ''),
        },
        '/api/nasa': {
          target: 'https://api.nasa.gov',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/nasa/, ''),
        },
      },
    },
  });

  await server.listen();
  server.printUrls();
}

startServer(); 