const express = require('express');
const router = express.Router();

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getStats,
} = require('../controllers/employeeController');

// Stats route must be before /:id to avoid conflicts
router.get('/stats/overview', getStats);

router.route('/').get(getEmployees).post(createEmployee);

router.route('/:id').get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

module.exports = router;
