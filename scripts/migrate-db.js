const { execSync } = require('child_process');

// This script is used to run migrations in production
async function main() {
  try {
    console.log('Running migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main(); 