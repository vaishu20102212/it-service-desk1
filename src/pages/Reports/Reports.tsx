import { useTickets } from "../../hooks/useTickets";
import { useCategories } from "../../hooks/useCategories";
import { useUsers } from "../../hooks/useUsers";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";

const Reports = () => {
  const { tickets, loading: ticketsLoading, error: ticketsError } = useTickets();
  const { categories, loading: categoriesLoading } = useCategories();
  const { users, loading: usersLoading } = useUsers();

  if (ticketsLoading || categoriesLoading || usersLoading) return <Loading />;
  if (ticketsError) return <ErrorState message={ticketsError} />;

  const total = tickets.length;
  const resolvedCount = tickets.filter(
    (t) => t.status === "resolved" || t.status === "closed"
  ).length;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;
  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "in_progress" || t.status === "assigned"
  ).length;
  const criticalCount = tickets.filter((t) => t.priority === "critical").length;

  // Categories breakdown
  const categoryStats = categories.map((cat) => {
    const count = tickets.filter((t) => t.category === cat.name).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { name: cat.name, count, percentage };
  });

  // Priorities breakdown
  const priorities = [
    { label: "Critical", key: "critical", color: "bg-red-500", count: tickets.filter((t) => t.priority === "critical").length },
    { label: "High", key: "high", color: "bg-amber-500", count: tickets.filter((t) => t.priority === "high").length },
    { label: "Medium", key: "medium", color: "bg-blue-500", count: tickets.filter((t) => t.priority === "medium").length },
    { label: "Low", key: "low", color: "bg-emerald-500", count: tickets.filter((t) => t.priority === "low").length },
  ];

  // Agent Workload breakdown
  const agents = users.filter((u) => u.role === "support_agent");
  const agentWorkload = agents.map((agent) => {
    const assigned = tickets.filter((t) => t.assignedAgent === agent.id).length;
    const resolved = tickets.filter(
      (t) => t.assignedAgent === agent.id && (t.status === "resolved" || t.status === "closed")
    ).length;
    const rate = assigned > 0 ? Math.round((resolved / assigned) * 100) : 0;
    return { agent, assigned, resolved, rate };
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Service Desk Reports & Analytics
        </h1>
        <p className="text-sm text-gray-500">
          System-wide performance, ticket distribution, and resolution metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Resolution Rate
          </span>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {resolutionRate}%
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {resolvedCount} of {total} tickets resolved
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Open Queue
          </span>
          <h2 className="mt-2 text-3xl font-bold text-amber-600">
            {openCount}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Awaiting triage or assignment
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Active Investigations
          </span>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {inProgressCount}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Assigned or currently in progress
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Critical Incidents
          </span>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {criticalCount}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            High-severity issues logged
          </p>
        </div>
      </div>

      {/* Charts / Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            Tickets by Category
          </h3>

          <div className="space-y-3.5">
            {categoryStats.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-500">{item.count} tickets ({item.percentage}%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            Priority Breakdown
          </h3>

          <div className="space-y-4">
            {priorities.map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-700">{item.label} Priority</span>
                    <span className="text-gray-500">{item.count} tickets ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Support Agent Performance & Workload */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-base font-bold text-gray-900">
          Support Agent Workload & Resolution Metrics
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Agent Name</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Assigned Tickets</th>
                <th className="px-5 py-3">Resolved / Closed</th>
                <th className="px-5 py-3">Resolution Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {agentWorkload.map(({ agent, assigned, resolved, rate }) => (
                <tr key={agent.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    {agent.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {agent.department}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-blue-600">
                    {assigned}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-600">
                    {resolved}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
