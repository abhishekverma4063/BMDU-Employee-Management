import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle } from 'lucide-react';
import { createEmployee } from '../services/employeeService';
import { useToast } from '../components/ui/Toast';
import Toast from '../components/ui/Toast';
import EmployeeForm from '../components/employees/EmployeeForm';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, removeToast, toast } = useToast();

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      await createEmployee(formData);
      toast.success('Employee created successfully! 🎉');
      setTimeout(() => navigate('/employees'), 1200);
    } catch (err) {
      toast.error(err.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Use EmployeeForm as a modal that opens immediately */}
      <EmployeeForm
        isOpen={true}
        onClose={() => navigate('/employees')}
        onSubmit={handleCreate}
        initialData={null}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AddEmployeePage;
