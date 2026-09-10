import DashboardCard from "./DashboardCard";

interface DashboardCardsProps {
  totalTickets: number;
  openTickets: number;
  assignedTickets: number;
  resolvedTickets: number;
}

const DashboardCards = ({
  totalTickets,
  openTickets,
  assignedTickets,
  resolvedTickets,
}: DashboardCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total Tickets"
        value={totalTickets}
        description="All recorded issues"
        badgeColor="blue"
      />

      <DashboardCard
        title="Open Tickets"
        value={openTickets}
        description="Awaiting agent response"
        badgeColor="amber"
      />

      <DashboardCard
        title="In Progress / Assigned"
        value={assignedTickets}
        description="Under active investigation"
        badgeColor="purple"
      />

      <DashboardCard
        title="Resolved / Closed"
        value={resolvedTickets}
        description="Successfully handled"
        badgeColor="emerald"
      />
    </div>
  );
};

export default DashboardCards;