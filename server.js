/**
 * Server entry point
 * Inicializa la aplicación y maneja el ciclo de vida del servidor
 */

const app = require('./src/app');
const { port } = require('./src/config/env');
const logger = require('./src/utils/logger');
const { testConnection } = require('./src/config/database');

let server;

/**
 * Graceful shutdown handler
 * Maneja el cierre controlado del servidor
 */
const gracefulShutdown = () => {
  logger.info('Recibida señal de terminación. Cerrando servidor...');
  
  if (server) {
    server.close(() => {
      logger.info('Servidor cerrado exitosamente');
      process.exit(0);
    });
  }

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('No se pudo cerrar el servidor gracefulmente. Forzando salida...');
    process.exit(1);
  }, 10000);
};

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Verificar conexión a base de datos
    const isConnected = await testConnection();
    
    if (!isConnected) {
      logger.error('No se pudo conectar a la base de datos');
      process.exit(1);
    }

    // Iniciar servidor
    server = app.listen(port, () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${port}`);
      logger.info(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
      logger.info('✨ API lista para recibir peticiones');
    });

    // Configurar manejadores de señales
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();