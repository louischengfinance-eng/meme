#!/usr/bin/env node

/**
 * 🚀 One-Command Deployment Script
 *
 * This script automatically:
 * 1. Reads credentials from deploy.config.js
 * 2. Creates .env files for backend and frontend
 * 3. Installs dependencies if needed
 * 4. Provides instructions to start servers
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Crypto Monitoring Dashboard - Deployment Script\n');

// Load configuration
const config = require('./deploy.config.js');
const isProd = process.argv.includes('--production');
const envConfig = isProd ? config.production : config;

console.log(`📦 Environment: ${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}\n`);

// Create backend .env file
function createBackendEnv() {
  console.log('📝 Creating backend/.env file...');

  const backendEnvContent = `PORT=${envConfig.backend.PORT}

# Bybit API Credentials
BYBIT_API_KEY=${envConfig.backend.BYBIT_API_KEY}
BYBIT_API_SECRET=${envConfig.backend.BYBIT_API_SECRET}
`;

  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ backend/.env created\n');
}

// Create frontend .env.local file
function createFrontendEnv() {
  console.log('📝 Creating frontend/.env.local file...');

  const frontendEnvContent = `NEXT_PUBLIC_API_URL=${envConfig.frontend.NEXT_PUBLIC_API_URL}
`;

  const frontendEnvPath = path.join(__dirname, 'frontend', '.env.local');
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ frontend/.env.local created\n');
}

// Check if dependencies are installed
function checkDependencies(dir) {
  const nodeModulesPath = path.join(__dirname, dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

// Install dependencies
function installDependencies(dir) {
  console.log(`📦 Installing ${dir} dependencies...`);
  const dirPath = path.join(__dirname, dir);

  try {
    execSync('npm install', { cwd: dirPath, stdio: 'inherit' });
    console.log(`✅ ${dir} dependencies installed\n`);
  } catch (error) {
    console.error(`❌ Failed to install ${dir} dependencies:`, error.message);
    process.exit(1);
  }
}

// Main deployment flow
async function deploy() {
  try {
    // Create environment files
    createBackendEnv();
    createFrontendEnv();

    // Check and install dependencies
    const backendDepsInstalled = checkDependencies('backend');
    const frontendDepsInstalled = checkDependencies('frontend');

    if (!backendDepsInstalled) {
      installDependencies('backend');
    } else {
      console.log('✅ Backend dependencies already installed\n');
    }

    if (!frontendDepsInstalled) {
      installDependencies('frontend');
    } else {
      console.log('✅ Frontend dependencies already installed\n');
    }

    // Success message
    console.log('🎉 Deployment preparation complete!\n');
    console.log('📋 Next steps:\n');
    console.log('Terminal 1 (Backend):');
    console.log('  cd backend');
    console.log('  npm run dev\n');
    console.log('Terminal 2 (Frontend):');
    console.log('  cd frontend');
    console.log('  npm run dev\n');
    console.log('Then open: http://localhost:3000\n');

    if (!isProd) {
      console.log('💡 Tip: Run with --production flag for production deployment\n');
    }

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
deploy();
