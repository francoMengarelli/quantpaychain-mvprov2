/**
 * Mock Configuration for QuantPayChain
 * 
 * This file provides default/mock values for all configuration variables
 * allowing the application to run without environment variables.
 * 
 * ⚠️ IMPORTANT: This is for DEMO/DEVELOPMENT purposes only
 * In production, replace these with actual environment variables
 */

export const config = {
  // ============================================
  // DATABASE
  // ============================================
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db', // SQLite for demo
  },

  // ============================================
  // AUTHENTICATION (NextAuth.js)
  // ============================================
  auth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET || 'quantpaychain-demo-secret-key-min-32-characters-long-for-security',
  },

  // ============================================
  // STRIPE PAYMENT (Demo Mode)
  // ============================================
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key_not_real',
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_key_not_real',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo_not_real',
    // Flag to indicate if using mock mode
    mockMode: !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('demo'),
  },

  // ============================================
  // AI AUDITOR (Demo Mode)
  // ============================================
  ai: {
    provider: process.env.AI_PROVIDER || 'mock',
    openai: {
      apiKey: process.env.OPENAI_API_KEY || 'sk-demo-openai-key',
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-demo-key',
    },
    // Flag to indicate if using mock mode
    mockMode: !process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY,
  },

  // ============================================
  // WEB3 & BLOCKCHAIN (Demo Mode)
  // ============================================
  web3: {
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-wallet-connect-id',
    ethereumRpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
    ethereumMainnetRpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo',
    contracts: {
      propertyToken: process.env.NEXT_PUBLIC_PROPERTY_TOKEN_CONTRACT || '0x0000000000000000000000000000000000000000',
      paymentProcessor: process.env.NEXT_PUBLIC_PAYMENT_PROCESSOR_CONTRACT || '0x0000000000000000000000000000000000000000',
    },
    // Flag to indicate if using mock mode
    mockMode: !process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  },

  // ============================================
  // POST-QUANTUM CRYPTOGRAPHY
  // ============================================
  pqc: {
    mode: process.env.PQC_MODE || 'simulated',
    algorithm: process.env.PQC_ALGORITHM || 'dilithium3',
  },

  // ============================================
  // IPFS/PINATA (Demo Mode)
  // ============================================
  ipfs: {
    pinataJwt: process.env.PINATA_JWT || 'demo-pinata-jwt',
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || 'demo-pinata-key',
    secret: process.env.NEXT_PUBLIC_PINATA_SECRET || 'demo-pinata-secret',
    gateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    // Flag to indicate if using mock mode
    mockMode: !process.env.PINATA_JWT,
  },

  // ============================================
  // AWS S3 (Demo Mode - not used if mocked)
  // ============================================
  aws: {
    bucketName: process.env.AWS_BUCKET_NAME || 'demo-bucket',
    folderPrefix: process.env.AWS_FOLDER_PREFIX || 'contracts/',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'demo-access-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'demo-secret-key',
    region: process.env.AWS_REGION || 'us-east-1',
    // Flag to indicate if using mock mode
    mockMode: !process.env.AWS_ACCESS_KEY_ID,
  },

  // ============================================
  // EMAIL NOTIFICATIONS (Demo Mode)
  // ============================================
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: process.env.SMTP_PORT || '587',
      user: process.env.SMTP_USER || 'demo@quantpaychain.com',
      password: process.env.SMTP_PASSWORD || 'demo-password',
      from: process.env.SMTP_FROM || 'noreply@quantpaychain.com',
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || 'demo-sendgrid-key',
    },
    // Flag to indicate if using mock mode
    mockMode: !process.env.SMTP_HOST && !process.env.SENDGRID_API_KEY,
  },

  // ============================================
  // KYC/AML VERIFICATION (Demo Mode)
  // ============================================
  kyc: {
    provider: process.env.KYC_PROVIDER || 'mock',
    sumsub: {
      appToken: process.env.SUMSUB_APP_TOKEN || 'demo-sumsub-token',
      secretKey: process.env.SUMSUB_SECRET_KEY || 'demo-sumsub-secret',
    },
    // Flag to indicate if using mock mode
    mockMode: !process.env.KYC_PROVIDER || process.env.KYC_PROVIDER === 'mock',
  },

  // ============================================
  // SECURITY & RATE LIMITING
  // ============================================
  security: {
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
    corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000,https://quantpaychain.com').split(','),
  },

  // ============================================
  // APPLICATION SETTINGS
  // ============================================
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    features: {
      cryptoPayments: process.env.FEATURE_CRYPTO_PAYMENTS !== 'false',
      aiAuditor: process.env.FEATURE_AI_AUDITOR !== 'false',
      pqcSignatures: process.env.FEATURE_PQC_SIGNATURES !== 'false',
      blockchainIntegration: process.env.FEATURE_BLOCKCHAIN_INTEGRATION === 'true',
    },
  },

  // ============================================
  // MONITORING & LOGGING
  // ============================================
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || '',
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  },

  // ============================================
  // CRON JOBS
  // ============================================
  cron: {
    secret: process.env.CRON_SECRET || 'demo-cron-secret',
  },

  // ============================================
  // DEVELOPMENT & TESTING
  // ============================================
  dev: {
    debug: process.env.DEBUG === 'true',
    testUser: {
      email: process.env.TEST_USER_EMAIL || 'investor@quantpay.com',
      password: process.env.TEST_USER_PASSWORD || 'Demo1234!',
    },
  },

  // ============================================
  // HELPER METHODS
  // ============================================
  
  /**
   * Check if running in mock/demo mode
   */
  isDemoMode(): boolean {
    return this.stripe.mockMode || this.ai.mockMode || this.web3.mockMode;
  },

  /**
   * Get all mock flags
   */
  getMockFlags() {
    return {
      stripe: this.stripe.mockMode,
      ai: this.ai.mockMode,
      web3: this.web3.mockMode,
      ipfs: this.ipfs.mockMode,
      aws: this.aws.mockMode,
      email: this.email.mockMode,
      kyc: this.kyc.mockMode,
    };
  },

  /**
   * Validate required configuration
   * Returns array of missing required configs
   */
  validate(): string[] {
    const missing: string[] = [];

    // Only database and auth are truly required
    if (!this.database.url) {
      missing.push('DATABASE_URL');
    }
    if (!this.auth.secret || this.auth.secret.length < 32) {
      missing.push('NEXTAUTH_SECRET (must be at least 32 characters)');
    }

    return missing;
  },

  /**
   * Get configuration summary for logging
   */
  getSummary() {
    const mockFlags = this.getMockFlags();
    const mockCount = Object.values(mockFlags).filter(v => v).length;
    
    return {
      environment: this.app.nodeEnv,
      demoMode: this.isDemoMode(),
      mockServices: mockCount,
      mockFlags,
      features: this.app.features,
    };
  },
};

// Export individual sections for convenience
export const {
  database,
  auth,
  stripe,
  ai,
  web3,
  pqc,
  ipfs,
  aws,
  email,
  kyc,
  security,
  app,
  monitoring,
  cron,
  dev,
} = config;

// Export default
export default config;

/**
 * Mock Service Indicators
 * 
 * Use these to conditionally enable/disable real API calls
 */
export const MOCK_SERVICES = {
  STRIPE: config.stripe.mockMode,
  AI: config.ai.mockMode,
  WEB3: config.web3.mockMode,
  IPFS: config.ipfs.mockMode,
  AWS: config.aws.mockMode,
  EMAIL: config.email.mockMode,
  KYC: config.kyc.mockMode,
};

/**
 * Validation helper - call at startup
 */
export function validateConfig() {
  const missing = config.validate();
  if (missing.length > 0) {
    console.warn('⚠️  Missing required configuration:', missing);
  }
  
  const summary = config.getSummary();
  console.log('📋 Configuration Summary:', {
    environment: summary.environment,
    demoMode: summary.demoMode,
    mockServices: `${summary.mockServices}/7`,
    features: summary.features,
  });
  
  if (summary.demoMode) {
    console.log('🎭 Running in DEMO MODE - Some services are mocked');
    console.log('📝 Mock services:', summary.mockFlags);
  }
}
