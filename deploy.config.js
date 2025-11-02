// ⚠️ WARNING: This file contains API credentials
// ⚠️ This repository should remain PRIVATE
// ⚠️ Do NOT share this repository or make it public
// ⚠️ Revoke API keys immediately if this repository is exposed

module.exports = {
  backend: {
    PORT: 3001,

    // Bybit API Credentials
    // ⚠️ SECURITY NOTICE: These credentials have access to your Bybit account
    // Ensure API permissions are set to READ-ONLY
    BYBIT_API_KEY: 'A2OHqYPBoDV8nBRVms',
    BYBIT_API_SECRET: 'cTpc6j8smrfxpJlfkOq3spx3UDnoJ0kWtEts',
  },

  frontend: {
    NEXT_PUBLIC_API_URL: 'http://localhost:3001',
  },

  // Production settings (update these for production deployment)
  production: {
    backend: {
      PORT: 3001,
      // For production, consider using environment variables instead
      // BYBIT_API_KEY: process.env.BYBIT_API_KEY,
      // BYBIT_API_SECRET: process.env.BYBIT_API_SECRET,
    },
    frontend: {
      NEXT_PUBLIC_API_URL: 'https://your-api-domain.com',
    },
  },
};
