/**
 * Health Check API Template
 *
 * This template provides comprehensive health check endpoints for monitoring
 * application status, dependencies, and system metrics.
 */

const express = require('express');
const router = express.Router();
const os = require('os');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// Health check cache to avoid repeated expensive checks
let healthCache = {
  timestamp: 0,
  data: null,
  ttl: 30000, // 30 seconds
};

/**
 * Basic health check - fast, no dependencies
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

/**
 * Detailed health check - includes dependencies
 */
router.get('/health/detailed', async (req, res) => {
  try {
    // Check cache
    const now = Date.now();
    if (healthCache.data && (now - healthCache.timestamp) < healthCache.ttl) {
      return res.status(200).json(healthCache.data);
    }

    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      system: getSystemInfo(),
      dependencies: await checkDependencies(),
      database: await checkDatabase(),
      cache: await checkCache(),
      external: await checkExternalServices(),
    };

    // Determine overall status
    const hasErrors = Object.values(healthData.dependencies).some(dep => !dep.healthy) ||
                     !healthData.database.healthy ||
                     !healthData.cache.healthy ||
                     Object.values(healthData.external).some(svc => !svc.healthy);

    if (hasErrors) {
      healthData.status = 'degraded';
      res.status(207); // Multi-status
    } else {
      res.status(200);
    }

    // Cache result
    healthCache = {
      timestamp: now,
      data: healthData,
    };

    res.json(healthData);
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

/**
 * Readiness check - for Kubernetes/load balancers
 */
router.get('/health/ready', async (req, res) => {
  try {
    // Quick checks for readiness
    const isReady = await checkReadiness();

    if (isReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

/**
 * Liveness check - for Kubernetes
 */
router.get('/health/live', (req, res) => {
  // Simple liveness check - if we can respond, we're alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Metrics endpoint - for Prometheus
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await generateMetrics();
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(metrics);
  } catch (error) {
    res.status(500).send(`# Error generating metrics: ${error.message}`);
  }
});

// Helper functions

function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      usage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%',
    },
    loadAverage: os.loadavg(),
    nodeVersion: process.version,
  };
}

async function checkDependencies() {
  const dependencies = {};

  // Check database connection
  try {
    // Add your database health check here
    dependencies.database = { healthy: true };
  } catch (error) {
    dependencies.database = { healthy: false, error: error.message };
  }

  // Check Redis/cache
  try {
    // Add your cache health check here
    dependencies.cache = { healthy: true };
  } catch (error) {
    dependencies.cache = { healthy: false, error: error.message };
  }

  // Check external APIs
  try {
    // Add external API health checks here
    dependencies.externalAPI = { healthy: true };
  } catch (error) {
    dependencies.externalAPI = { healthy: false, error: error.message };
  }

  return dependencies;
}

async function checkDatabase() {
  try {
    // Implement your database health check
    // Example: await pool.query('SELECT 1');

    return {
      healthy: true,
      connectionPool: {
        total: 10,
        idle: 5,
        waiting: 0,
      },
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
    };
  }
}

async function checkCache() {
  try {
    // Implement your cache health check
    // Example: await redis.ping()

    return {
      healthy: true,
      hitRate: '95%',
      memoryUsage: '45%',
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
    };
  }
}

async function checkExternalServices() {
  const services = {};

  // Check external APIs
  const externalServices = [
    { name: 'payment-api', url: process.env.PAYMENT_API_URL },
    { name: 'email-service', url: process.env.EMAIL_SERVICE_URL },
  ];

  for (const service of externalServices) {
    if (service.url) {
      try {
        const response = await fetch(service.url + '/health', {
          timeout: 5000,
        });
        services[service.name] = {
          healthy: response.ok,
          status: response.status,
        };
      } catch (error) {
        services[service.name] = {
          healthy: false,
          error: error.message,
        };
      }
    }
  }

  return services;
}

async function checkReadiness() {
  // Implement readiness checks
  // Return true if app is ready to serve traffic

  try {
    // Check if database is ready
    await checkDatabase();
    // Check if cache is ready
    await checkCache();
    // Check if required services are available
    const external = await checkExternalServices();
    const allExternalHealthy = Object.values(external).every(svc => svc.healthy);

    return allExternalHealthy;
  } catch (error) {
    return false;
  }
}

async function generateMetrics() {
  // Generate Prometheus-compatible metrics
  const metrics = [];

  // Application metrics
  metrics.push('# HELP app_uptime_seconds Application uptime in seconds');
  metrics.push('# TYPE app_uptime_seconds gauge');
  metrics.push(`app_uptime_seconds ${process.uptime()}`);

  metrics.push('# HELP app_memory_usage_bytes Application memory usage');
  metrics.push('# TYPE app_memory_usage_bytes gauge');
  metrics.push(`app_memory_usage_bytes ${process.memoryUsage().heapUsed}`);

  // System metrics
  metrics.push('# HELP system_memory_total_bytes Total system memory');
  metrics.push('# TYPE system_memory_total_bytes gauge');
  metrics.push(`system_memory_total_bytes ${os.totalmem()}`);

  metrics.push('# HELP system_memory_free_bytes Free system memory');
  metrics.push('# TYPE system_memory_free_bytes gauge');
  metrics.push(`system_memory_free_bytes ${os.freemem()}`);

  // Custom business metrics (add your own)
  metrics.push('# HELP requests_total Total number of requests');
  metrics.push('# TYPE requests_total counter');
  metrics.push('requests_total 0'); // Replace with actual counter

  return metrics.join('\n') + '\n';
}

module.exports = router;