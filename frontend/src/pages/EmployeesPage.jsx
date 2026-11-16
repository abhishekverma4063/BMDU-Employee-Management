import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, X, RefreshCw, Filter, SlidersHorizontal } from 'lucide-react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeForm from '../components/employees/EmployeeForm';
import EmployeeDetails from '../components/employees/EmployeeDetails';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import Toast from '../components/ui/Toast';

const DEPARTMENTS = [
  'All', 'Engineering', 'Human Resources', 'Finance', 'Marketing',
  'Sales', 'Operations', 'Product', 'Design', 'Legal', 'Customer Support',
];

const STATUS_TABS = [
  { key: 'All',      label: 'All',      dot: null },
  { key: 'Active',   label: 'Active',   dot: 'bg-emerald-500' },
  { key: 'Inactive', label: 'Inactive', dot: 'bg-rose-500' },
];

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toasts, removeToast, toast } = useToast();

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = {};
      if (search.trim())         params.search     = search.trim();
      if (deptFilter !== 'All')  params.department = deptFilter;
      if (statusFilter !== 'All') params.status    = statusFilter;

      const res = await getEmployees(params);
      setEmployees(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch employees');
    } finally {
      setIsLoading(false);
    }
  }, [search, deptFilter, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchEmployees, 350);
    return () => clearTimeout(t);
  }, [fetchEmployees]);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    try {
      setIsSubmitting(true);
      await createEmployee(data);
      toast.success('Employee created successfully 🎉');
      setIsFormOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setIsSubmitting(true);
      await updateEmployee(selectedEmployee._id, data);
      toast.success('Employee updated successfully ✅');
      setIsFormOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.message || 'Failed to update employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(selectedEmployee._id);
      toast.success('Employee deleted');
      setIsDeleteOpen(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.message || 'Failed to delete employee');
    }
  };

  const openAdd    = ()    => { setSelectedEmployee(null); setIsFormOpen(true); };
  const openEdit   = (emp) => { setSelectedEmployee(emp); setIsFormOpen(true); };
  const openView   = (emp) => { setSelectedEmployee(emp); setIsDetailsOpen(true); };
  const openDelete = (emp) => { setSelectedEmployee(emp); setIsDeleteOpen(true); };

  const clearFilters = () => { setSearch(''); setDeptFilter('All'); setStatusFilter('All'); };
  const hasFilters = search || deptFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Employees</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {isLoading ? 'Loading…' : `${total} record${total !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEmployees}
            title="Refresh"
            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md shadow-indigo-500/25 hover:shadow-lg"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Employee
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 hover:border-slate-300 transition-all"
            />
          </div>

          {/* Department */}
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 appearance-none bg-white min-w-[175px] hover:border-slate-300 transition-all"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
              ))}
            </select>
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {STATUS_TABS.map(({ key, label, dot }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-200
                  ${statusFilter === key
                    ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                  }
                `}
              >
                {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                {label}
              </button>
            ))}
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-500 hover:text-rose-600 border border-slate-200 rounded-xl hover:border-rose-200 hover:bg-rose-50 transition-all whitespace-nowrap"
            >
              <X size={13} strokeWidth={2.5} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingSpinner text="Fetching employees…" />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-3xl mb-3">⚠️</span>
            <p className="text-slate-600 font-semibold mb-2">{error}</p>
            <button onClick={fetchEmployees} className="text-indigo-600 text-sm font-medium hover:underline">
              Retry
            </button>
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}

        {/* Footer */}
        {!isLoading && !error && employees.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
            <p className="text-xs text-slate-400 font-medium">
              Showing <span className="font-bold text-slate-600">{employees.length}</span> of{' '}
              <span className="font-bold text-slate-600">{total}</span> employees
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedEmployee(null); }}
        onSubmit={selectedEmployee ? handleUpdate : handleCreate}
        initialData={selectedEmployee}
        isLoading={isSubmitting}
      />

      <EmployeeDetails
        isOpen={isDetailsOpen}
        employee={selectedEmployee}
        onClose={() => { setIsDetailsOpen(false); setSelectedEmployee(null); }}
        onEdit={openEdit}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete ${selectedEmployee?.employeeName}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => { setIsDeleteOpen(false); setSelectedEmployee(null); }}
        isDangerous
      />
    </div>
  );
};

export default EmployeesPage;
