const StatusBadge = ({ status }) => {
  const isActive = status === 'Active';
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide
        ${isActive
          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
        }
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {status}
    </span>
  );
};

export default StatusBadge;
