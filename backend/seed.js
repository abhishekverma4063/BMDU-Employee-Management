const dotenv = require('dotenv');
// Load env vars FIRST — before db.js reads process.env
dotenv.config();

const { sequelize } = require('./config/db');
const Employee = require('./models/Employee');

const sampleEmployees = [
  {
    employeeName: 'Aarav Sharma',
    email: 'aarav.sharma@bmdu.com',
    phoneNumber: '9876543210',
    department: 'Engineering',
    designation: 'Senior Full Stack Engineer',
    joiningDate: '2023-01-15',
    status: 'Active',
  },
  {
    employeeName: 'Priya Patel',
    email: 'priya.patel@bmdu.com',
    phoneNumber: '9876543211',
    department: 'Human Resources',
    designation: 'HR Business Partner',
    joiningDate: '2023-03-20',
    status: 'Active',
  },
  {
    employeeName: 'Rohan Verma',
    email: 'rohan.verma@bmdu.com',
    phoneNumber: '9876543212',
    department: 'Engineering',
    designation: 'DevOps Specialist',
    joiningDate: '2022-11-10',
    status: 'Active',
  },
  {
    employeeName: 'Sneha Reddy',
    email: 'sneha.reddy@bmdu.com',
    phoneNumber: '9876543213',
    department: 'Design',
    designation: 'Lead UI/UX Designer',
    joiningDate: '2023-05-01',
    status: 'Active',
  },
  {
    employeeName: 'Vikram Malhotra',
    email: 'vikram.m@bmdu.com',
    phoneNumber: '9876543214',
    department: 'Product',
    designation: 'Principal Product Manager',
    joiningDate: '2022-08-15',
    status: 'Active',
  },
  {
    employeeName: 'Ananya Iyer',
    email: 'ananya.iyer@bmdu.com',
    phoneNumber: '9876543215',
    department: 'Finance',
    designation: 'Financial Analyst',
    joiningDate: '2023-09-12',
    status: 'Active',
  },
  {
    employeeName: 'Karan Mehta',
    email: 'karan.mehta@bmdu.com',
    phoneNumber: '9876543216',
    department: 'Marketing',
    designation: 'Growth Marketing Lead',
    joiningDate: '2023-02-18',
    status: 'Active',
  },
  {
    employeeName: 'Neha Gupta',
    email: 'neha.gupta@bmdu.com',
    phoneNumber: '9876543217',
    department: 'Sales',
    designation: 'Enterprise Sales Director',
    joiningDate: '2022-06-25',
    status: 'Active',
  },
  {
    employeeName: 'Aditya Joshi',
    email: 'aditya.joshi@bmdu.com',
    phoneNumber: '9876543218',
    department: 'Operations',
    designation: 'Operations Coordinator',
    joiningDate: '2021-10-05',
    status: 'Inactive',
  },
  {
    employeeName: 'Meera Nair',
    email: 'meera.nair@bmdu.com',
    phoneNumber: '9876543219',
    department: 'Customer Support',
    designation: 'Support Team Lead',
    joiningDate: '2023-07-20',
    status: 'Active',
  },
  {
    employeeName: 'Rahul Kapoor',
    email: 'rahul.kapoor@bmdu.com',
    phoneNumber: '9876543220',
    department: 'Legal',
    designation: 'Corporate Counsel',
    joiningDate: '2022-04-14',
    status: 'Inactive',
  },
  {
    employeeName: 'Divya Sen',
    email: 'divya.sen@bmdu.com',
    phoneNumber: '9876543221',
    department: 'Engineering',
    designation: 'Frontend Developer',
    joiningDate: '2023-11-01',
    status: 'Active',
  },
];

const seedData = async () => {
  try {
    console.log('Connecting to MySQL...');
    await sequelize.authenticate();
    // Sync tables (create if not exist)
    await sequelize.sync({ force: false });
    console.log('✅ Connected to MySQL successfully.');

    // Count existing employees
    const count = await Employee.count();
    console.log(`Found ${count} existing employee(s) in the database.`);

    if (count > 0) {
      console.log('Clearing existing employee records...');
      await Employee.destroy({ truncate: true });
    }

    console.log(`Inserting ${sampleEmployees.length} sample employee records...`);
    for (const emp of sampleEmployees) {
      await Employee.create(emp);
    }

    console.log('🎉 Successfully seeded employee data into database!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
