const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-purple-100 text-purple-700';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-success/10 text-success';
      case 'cancelled':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium capitalize ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
