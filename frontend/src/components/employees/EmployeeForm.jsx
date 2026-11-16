import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, Calendar, ChevronDown } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL: InputField MUST be defined at MODULE LEVEL — not inside any other
// component or render function. If it's inside, React treats it as a new
// component type on every render → unmounts → focus lost after every keystroke.
// ─────────────────────────────────────────────────────────────────────────────
const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, required, value, onChange, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
          <Icon size={15} strokeWidth={2} />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`
          w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl border text-sm text-slate-800
          placeholder-slate-300 outline-none transition-all duration-200
          focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500
          ${error
            ? 'border-rose-400 bg-rose-50/50 focus:ring-rose-500/20 focus:border-rose-500'
            : 'border-slate-200 bg-white hover:border-slate-300'
          }
        `}
      />
    </div>
    {error && (
      <p className="text-rose-500 text-xs flex items-center gap-1 font-medium">
        <span className="inline-block w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-center leading-3.5 text-[9px] font-bold flex-shrink-0">!</span>
        {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Same rule: SelectField at module level
// ─────────────────────────────────────────────────────────────────────────────
const SelectField = ({ label, name, required, value, onChange, error, options, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      <Building2
        size={15}
        strokeWidth={2}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none"
      />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full pl-10 pr-9 py-3 rounded-xl border text-sm text-slate-800 outline-none
          appearance-none bg-white transition-all duration-200
          focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500
          ${error
            ? 'border-rose-400 bg-rose-50/50'
            : 'border-slate-200 hover:border-slate-300'
          }
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
    {error && (
      <p className="text-rose-500 text-xs flex items-center gap-1 font-medium">
        <span className="inline-block w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-center text-[9px] font-bold flex-shrink-0 leading-[14px]">!</span>
        {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  'Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales',
  'Operations', 'Product', 'Design', 'Legal', 'Customer Support',
];

const EMPTY_FORM = {
  employeeName: '', email: '', phoneNumber: '',
  department: '', designation: '', joiningDate: '', status: 'Active',
};

const validate = (form) => {
  const e = {};

  if (!form.employeeName.trim())
    e.employeeName = 'Employee name is required';
  else if (form.employeeName.trim().length < 2)
    e.employeeName = 'Name must be at least 2 characters';

  if (!form.email.trim())
    e.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
    e.email = 'Enter a valid email address';

  if (!form.phoneNumber.trim()) {
    e.phoneNumber = 'Phone number is required';
  } else {
    // Strip formatting chars (+, -, spaces, parens, dots) then check 7–15 digits
    const digits = form.phoneNumber.replace(/[\s\-\(\)\+\.]/g, '');
    if (!/^\d{7,15}$/.test(digits))
      e.phoneNumber = 'Enter a valid phone number (7–15 digits)';
  }

  if (!form.department)        e.department  = 'Department is required';
  if (!form.designation.trim()) e.designation = 'Designation is required';
  if (!form.joiningDate)        e.joiningDate = 'Joining date is required';

  return e;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main EmployeeForm component
// ─────────────────────────────────────────────────────────────────────────────
const EmployeeForm = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = !!initialData;

  // Sync form when initialData or modal open state changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          employeeName: initialData.employeeName || '',
          email:        initialData.email || '',
          phoneNumber:  initialData.phoneNumber || '',
          department:   initialData.department || '',
          designation:  initialData.designation || '',
          joiningDate:  initialData.joiningDate
            ? new Date(initialData.joiningDate).toISOString().split('T')[0]
            : '',
          status: initialData.status || 'Active',
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Single stable handler — no new function reference per field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Premium gradient header ── */}
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-7 py-6 flex-shrink-0">
          {/* Decorative orb */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-md bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center">
                  <User size={12} className="text-indigo-300" />
                </div>
                <span className="text-indigo-300 text-xs font-semibold uppercase tracking-widest">
                  {isEditing ? 'Edit Record' : 'New Record'}
                </span>
              </div>
              <h2 className="text-white text-xl font-bold">
                {isEditing ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                {isEditing ? 'Update the employee information below' : 'Fill in all required fields to create a record'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Form body ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto bg-slate-50 px-7 py-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Employee Name"
              name="employeeName"
              placeholder="e.g. John Doe"
              icon={User}
              required
              value={form.employeeName}
              onChange={handleChange}
              error={errors.employeeName}
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@bmdu.com"
              icon={Mail}
              required
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              placeholder="+91 98765 43210"
              icon={Phone}
              required
              value={form.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
            />
            <SelectField
              label="Department"
              name="department"
              placeholder="Select Department"
              required
              options={DEPARTMENTS}
              value={form.department}
              onChange={handleChange}
              error={errors.department}
            />
            <InputField
              label="Designation"
              name="designation"
              placeholder="e.g. Senior Engineer"
              icon={Briefcase}
              required
              value={form.designation}
              onChange={handleChange}
              error={errors.designation}
            />
            <InputField
              label="Joining Date"
              name="joiningDate"
              type="date"
              icon={Calendar}
              required
              value={form.joiningDate}
              onChange={handleChange}
              error={errors.joiningDate}
            />
          </div>

          {/* Status toggle */}
          <div className="mt-5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2.5">
              Employment Status
            </label>
            <div className="flex gap-3">
              {[
                { val: 'Active',   color: 'emerald', dot: 'bg-emerald-500' },
                { val: 'Inactive', color: 'slate',   dot: 'bg-slate-400'   },
              ].map(({ val, color, dot }) => (
                <label
                  key={val}
                  className={`
                    flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl border-2 cursor-pointer
                    text-sm font-semibold transition-all duration-200 select-none
                    ${form.status === val
                      ? val === 'Active'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100'
                        : 'border-slate-500 bg-slate-100 text-slate-700'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-500'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="status"
                    value={val}
                    checked={form.status === val}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className={`w-2 h-2 rounded-full ${form.status === val ? dot : 'bg-slate-300'} transition-colors`} />
                  {val}
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="bg-white border-t border-slate-200 px-7 py-4 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-slate-400">
            Fields marked <span className="text-rose-500 font-bold">*</span> are required
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="
                px-6 py-2.5 rounded-xl text-white text-sm font-semibold
                bg-gradient-to-r from-indigo-600 to-blue-600
                hover:from-indigo-700 hover:to-blue-700
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30
                transition-all duration-200 flex items-center gap-2
              "
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isEditing ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
