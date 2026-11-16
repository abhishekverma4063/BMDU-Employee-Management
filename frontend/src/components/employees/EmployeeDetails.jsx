import { X, Mail, Phone, Building2, Briefcase, Calendar } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3.5 py-3.5 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={14} className="text-indigo-500" strokeWidth={2.2} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-slate-800 text-sm font-semibold mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const EmployeeDetails = ({ isOpen, employee, onClose, onEdit }) => {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-6 py-6">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-3xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">
              {employee.employeeName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-tight">{employee.employeeName}</h2>
              <p className="text-slate-400 text-sm">{employee.designation}</p>
              <div className="mt-2.5">
                <StatusBadge status={employee.status} />
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            <span className="font-mono text-xs text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
              {employee.employeeId}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-2 max-h-[55vh] overflow-y-auto">
          <InfoRow icon={Mail}     label="Email"       value={employee.email} />
          <InfoRow icon={Phone}    label="Phone"       value={employee.phoneNumber} />
          <InfoRow icon={Building2}label="Department"  value={employee.department} />
          <InfoRow icon={Briefcase}label="Designation" value={employee.designation} />
          <InfoRow icon={Calendar} label="Joining Date"value={fmt(employee.joiningDate)} />
          <InfoRow icon={Calendar} label="Record Added" value={fmt(employee.createdAt)} />
          <InfoRow icon={Calendar} label="Last Updated" value={fmt(employee.updatedAt)} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-white transition-all"
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(employee); }}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md shadow-indigo-500/20"
          >
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
