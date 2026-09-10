interface DashboardCardProps {
  title: string;
  value: number;
  description?: string;
  badgeColor?: "blue" | "amber" | "purple" | "emerald";
}

const DashboardCard = ({
  title,
  value,
  description,
  badgeColor = "blue",
}: DashboardCardProps) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
  };

  const style = colorMap[badgeColor] || colorMap.blue;

  return (
    <div className={`rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </p>
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${style.bg} ${style.text} text-sm font-bold`}>
          #
        </span>
      </div>

      <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </h2>

      {description && (
        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;