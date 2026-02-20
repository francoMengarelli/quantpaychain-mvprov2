/**
 * Configuration Initialization
 * 
 * This file should be imported at the top of the main app entry point
 * to initialize and validate configuration
 */

import { validateConfig } from './config.mock';

/**
 * Initialize application configuration
 * Call this at app startup
 */
export function initConfig() {
  // Validate and log configuration
  validateConfig();
  
  // You can add more initialization logic here
  // For example, setting up global error handlers, logging, etc.
}

// Auto-initialize if not in test environment
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  initConfig();
}
