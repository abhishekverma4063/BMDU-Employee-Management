const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Sequelize unique constraint violation (duplicate email, employeeId, etc.)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors && err.errors[0] ? err.errors[0].path : 'field';
    message = `An employee with this ${field} already exists`;
    statusCode = 409;
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map((e) => e.message);
    message = errors.join(', ');
    statusCode = 400;
  }

  // Sequelize database connection / query errors
  if (err.name === 'SequelizeDatabaseError') {
    message = 'Database error occurred';
    statusCode = 500;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
