const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      trim: true,
    },
    employeeName: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: (v) => {
          const digits = v.replace(/[\s\-\(\)\+\.]/g, '');
          return /^\d{7,15}$/.test(digits);
        },
        message: 'Please enter a valid phone number (7–15 digits)',
      },
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: [
          'Engineering',
          'Human Resources',
          'Finance',
          'Marketing',
          'Sales',
          'Operations',
          'Product',
          'Design',
          'Legal',
          'Customer Support',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      minlength: [2, 'Designation must be at least 2 characters'],
      maxlength: [100, 'Designation must be at most 100 characters'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: 'Status must be Active or Inactive',
      },
      default: 'Active',
    },
  },
  { timestamps: true }
);

// Auto-generate BMDU-XXXX employeeId before saving a new document
employeeSchema.pre('save', async function (next) {
  if (this.isNew && !this.employeeId) {
    const last = await mongoose
      .model('Employee')
      .findOne({ employeeId: /^BMDU-\d+$/ })
      .sort({ employeeId: -1 });

    let nextNum = 1;
    if (last && last.employeeId) {
      const num = parseInt(last.employeeId.replace('BMDU-', ''), 10);
      if (!isNaN(num)) nextNum = num + 1;
    }
    this.employeeId = `BMDU-${String(nextNum).padStart(4, '0')}`;
  }
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
