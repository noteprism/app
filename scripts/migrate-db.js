const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

// This script is used to run migrations in production
// It also handles failed migrations by cleaning them up first
async function main() {
  try {
    console.log('Connecting to database...');
    const prisma = new PrismaClient();
    
    // First check if _prisma_migrations table exists
    console.log('Checking for _prisma_migrations table...');
    try {
      await prisma.$queryRaw`SELECT * FROM _prisma_migrations LIMIT 1`;
      console.log('_prisma_migrations table exists, checking for failed migrations');
      
      // Check for failed migrations
      const failedMigrations = await prisma.$queryRaw`
        SELECT migration_name FROM _prisma_migrations WHERE applied_steps_count < 1
      `;
      
      if (failedMigrations.length > 0) {
        console.log(`Found ${failedMigrations.length} failed migrations, removing them...`);
        
        // Delete failed migrations from the _prisma_migrations table
        const deletedCount = await prisma.$executeRaw`
          DELETE FROM _prisma_migrations WHERE applied_steps_count < 1
        `;
        console.log(`Deleted ${deletedCount} failed migration records`);
      } else {
        console.log('No failed migrations found');
      }
    } catch (error) {
      console.log('_prisma_migrations table does not exist yet, will be created during migration');
    }
    
    // Run migrate deploy to apply migrations
    console.log('Running prisma migrate deploy...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('Migrations completed successfully');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main(); 