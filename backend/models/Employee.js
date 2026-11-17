const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Employee extends Model {}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true, // generated in hook before creation
    },
    employeeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Employee name is required' },
        len: { args: [2, 100], msg: 'Name must be between 2 and 100 characters' },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Please enter a valid email address' },
      },
      set(value) {
        this.setDataValue('email', value ? value.toLowerCase().trim() : value);
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Phone number is required' },
        isValidPhone(value) {
          const digits = value.replace(/[\s\-\(\)\+\.]/g, '');
          if (!/^\d{7,15}$/.test(digits)) {
            throw new Error('Please enter a valid phone number (7–15 digits)');
          }
        },
      },
    },
    department: {
      type: DataTypes.ENUM(
        'Engineering',
        'Human Resources',
        'Finance',
        'Marketing',
        'Sales',
        'Operations',
        'Product',
        'Design',
        'Legal',
        'Customer Support'
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Department is required' },
      },
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Designation is required' },
        len: { args: [2, 100], msg: 'Designation must be between 2 and 100 characters' },
      },
    },
    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Joining date is required' },
        isDate: { msg: 'Please enter a valid date' },
      },
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
      validate: {
        isIn: {
          args: [['Active', 'Inactive']],
          msg: 'Status must be Active or Inactive',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Auto-generate a unique employeeId before creating a new record
Employee.addHook('beforeCreate', async (employee) => {
  if (!employee.employeeId) {
    // Find the last BMDU-XXXX record by sorting and taking the latest
    const { Op } = require('sequelize');
    const last = await Employee.findOne({
      where: { employeeId: { [Op.like]: 'BMDU-%' } },
      order: [['id', 'DESC']],
    });

    let nextNum = 1;
    if (last && last.employeeId) {
      const num = parseInt(last.employeeId.replace('BMDU-', ''), 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    employee.employeeId = `BMDU-${String(nextNum).padStart(4, '0')}`;
  }
});

module.exports = Employee;
