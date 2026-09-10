interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({
  message = "Something went wrong",
}: ErrorStateProps) => {
  return (
    <div className="rounded-xl bg-red-50 p-8 text-center">
      <p className="text-red-600">{message}</p>
    </div>
  );
};

export default ErrorState;