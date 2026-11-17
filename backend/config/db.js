const { Sequelize } = require('sequelize');

let sequelize;

// Production: use a single DATABASE_URL connection string (Railway, PlanetScale, etc.)
// Development: use individual DB_* environment variables
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // needed for Railway / most cloud MySQL providers
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
  sequelize = new Sequelize(
    process.env.DB_NAME || 'bmdu_employees',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
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
    console.log('✅ MySQL Connected successfully.');

    // Creates tables if they don't exist — safe for production
    await sequelize.sync({ alter: false });
    console.log('✅ Database schema synced.');
  } catch (error) {
    console.error(`❌ MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
