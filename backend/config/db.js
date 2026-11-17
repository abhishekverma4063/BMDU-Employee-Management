const { Sequelize } = require('sequelize');

let sequelize;

// Log the connection mode so we can debug on Render logs
if (process.env.DATABASE_URL) {
  console.log('🔗 Using DATABASE_URL for PostgreSQL connection.');

  // Render's internal PostgreSQL URLs don't require SSL;
  // external/cloud URLs do — rejectUnauthorized:false handles both safely.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: false,           // don't force SSL on Render internal network
        rejectUnauthorized: false, // ignore cert errors if SSL is used
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  console.log('🔗 DATABASE_URL not found — using individual DB_* env vars (local dev mode).');
  sequelize = new Sequelize(
    process.env.DB_NAME || 'bmdu_employees',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected successfully.');

    // Sync schema — creates tables if they don't exist (safe, non-destructive)
    await sequelize.sync({ alter: false });
    console.log('✅ Database schema synced.');
  } catch (error) {
    // Log full error details so it's visible in Render logs
    console.error('❌ PostgreSQL Connection Error:');
    console.error('   Message :', error.message);
    console.error('   Code    :', error.original?.code || 'N/A');
    console.error('   Detail  :', error.original?.detail || 'N/A');
    console.error('   DATABASE_URL set?', !!process.env.DATABASE_URL);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
