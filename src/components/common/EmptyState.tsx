interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({
  message = "No data found",
}: EmptyStateProps) => {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-sm">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;