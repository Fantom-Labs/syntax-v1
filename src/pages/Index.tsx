
import Header from "@/components/Header";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { EventCard } from "@/components/dashboard/EventCard";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const { displayName } = useDashboardData();

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12">
      <Header />
      <header className="mb-8 md:mb-16">
        <h1 className="text-4xl font-medium">
          Hello, <span className="name-underline">{displayName}</span>.
        </h1>
      </header>

      <main className="space-y-8">
        <DashboardNavigation />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventCard />
          <TaskCard />
        </div>
      </main>
    </div>
  );
};

export default Index;
