const { Op, fn, col, literal } = require('sequelize');
const Employee = require('../models/Employee');

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res, next) => {
  try {
    const { employeeName, email, phoneNumber, department, designation, joiningDate, status } = req.body;

    // Check for missing required fields
    if (!employeeName || !email || !phoneNumber || !department || !designation || !joiningDate) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided: name, email, phone, department, designation, joining date',
      });
    }

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: 'An employee with this email address already exists',
      });
    }

    const employee = await Employee.create({
      employeeName,
      email,
      phoneNumber,
      department,
      designation,
      joiningDate,
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees with search & filter
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res, next) => {
  try {
    const { search, department, status, page = 1, limit = 50 } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { employeeName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (department && department !== 'All') {
      where.department = department;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count: totalCount, rows: employees } = await Employee.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      total: totalCount,
      page: Number(page),
      pages: Math.ceil(totalCount / Number(limit)),
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const employee = await Employee.findByPk(Number(id));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const { employeeName, email, phoneNumber, department, designation, joiningDate, status } = req.body;

    // Check if updating email conflicts with another employee
    if (email) {
      const duplicate = await Employee.findOne({
        where: {
          email: email.toLowerCase().trim(),
          id: { [Op.ne]: Number(id) },
        },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another employee with this email already exists',
        });
      }
    }

    const employee = await Employee.findByPk(Number(id));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await employee.update({
      employeeName,
      email,
      phoneNumber,
      department,
      designation,
      joiningDate,
      status,
    });

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID format',
      });
    }

    const employee = await Employee.findByPk(Number(id));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    await employee.destroy();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: { id: Number(id) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get statistics overview
// @route   GET /api/employees/stats/overview
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const [totalEmployees, activeEmployees, inactiveEmployees, departmentStats] = await Promise.all([
      Employee.count(),
      Employee.count({ where: { status: 'Active' } }),
      Employee.count({ where: { status: 'Inactive' } }),
      Employee.findAll({
        attributes: [
          'department',
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', literal("CASE WHEN status = 'Active' THEN 1 ELSE 0 END")), 'active'],
          [fn('SUM', literal("CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END")), 'inactive'],
        ],
        group: ['department'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        raw: true,
      }),
    ]);

    // Normalize the stats shape to match the old Mongoose aggregate output
    const normalizedDeptStats = departmentStats.map((d) => ({
      _id: d.department,
      count: Number(d.count),
      active: Number(d.active),
      inactive: Number(d.inactive),
    }));

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        totalDepartments: normalizedDeptStats.length,
        departmentStats: normalizedDeptStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getStats,
};
