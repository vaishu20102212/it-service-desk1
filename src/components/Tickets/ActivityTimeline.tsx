import type { Activity } from "../../types/activity";

interface ActivityTimelineProps {
  activities: Activity[];
}

const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-400">
        No activity records found for this ticket.
      </div>
    );
  }

  // Sort activities chronologically
  const sortedActivities = [...activities].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const getActionColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes("created")) return "bg-blue-500 text-white";
    if (act.includes("assigned")) return "bg-purple-500 text-white";
    if (act.includes("in progress")) return "bg-amber-500 text-white";
    if (act.includes("resolved") || act.includes("resolution")) return "bg-emerald-500 text-white";
    if (act.includes("closed")) return "bg-gray-700 text-white";
    if (act.includes("cancelled")) return "bg-red-500 text-white";
    if (act.includes("comment")) return "bg-indigo-500 text-white";
    return "bg-gray-500 text-white";
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
      {sortedActivities.map((item) => (
        <div key={item.id} className="relative flex items-start gap-3.5">
          {/* Node dot */}
          <div
            className={`absolute -left-6 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] shadow-sm ring-4 ring-white ${getActionColor(
              item.action
            )}`}
          >
            •
          </div>

          <div className="flex-1 rounded-xl bg-gray-50/80 p-3.5 border border-gray-100 transition hover:bg-gray-50">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-xs font-bold text-gray-900">
                {item.action}
              </span>
              <span className="text-[11px] font-medium text-gray-400">
                {item.time || new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span>By: <strong className="text-gray-700">{item.actorName}</strong></span>
              {item.details && (
                <>
                  <span>•</span>
                  <span className="text-gray-600">{item.details}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
