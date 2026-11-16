import { Eye, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const COLS = [
  'Employee ID', 'Name', 'Email', 'Phone',
  'Department', 'Designation', 'Joining Date', 'Status', 'Actions',
];

const EmployeeTable = ({ employees = [], onView, onEdit, onDelete }) => {
  if (!employees?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-3xl">👥</span>
        </div>
        <h3 className="text-slate-600 font-bold text-base">No employees found</h3>
        <p className="text-sm mt-1 text-slate-400">Adjust your search/filters or add a new employee.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {COLS.map((col) => (
              <th
                key={col}
                className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(employees || []).map((emp, idx) => (
            <tr
              key={emp._id}
              className={`border-b border-slate-100 hover:bg-indigo-50/40 transition-colors duration-150 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
              }`}
            >
              {/* Employee ID */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="font-mono text-xs text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                  {emp.employeeId}
                </span>
              </td>

              {/* Name */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm">
                    {emp.employeeName?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-800 font-semibold">{emp.employeeName}</span>
                </div>
              </td>

              {/* Email */}
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-xs">{emp.email}</td>

              {/* Phone */}
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-xs">{emp.phoneNumber}</td>

              {/* Department */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {emp.department}
                </span>
              </td>

              {/* Designation */}
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 text-xs font-medium">{emp.designation}</td>

              {/* Joining Date */}
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-xs">{formatDate(emp.joiningDate)}</td>

              {/* Status */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <StatusBadge status={emp.status} />
              </td>

              {/* Actions */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => onView(emp)}
                    title="View Details"
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    <Eye size={14} strokeWidth={2.2} />
                  </button>
                  <button
                    onClick={() => onEdit(emp)}
                    title="Edit Employee"
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                  >
                    <Pencil size={14} strokeWidth={2.2} />
                  </button>
                  <button
                    onClick={() => onDelete(emp)}
                    title="Delete Employee"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;


