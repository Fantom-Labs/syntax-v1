
import Header from "@/components/Header";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { EventCard } from "@/components/dashboard/EventCard";
import { InvestmentCard } from "@/components/dashboard/InvestmentCard";
import { MatchCard } from "@/components/dashboard/MatchCard";
import { NewsCard } from "@/components/dashboard/NewsCard";
import { useDashboardData } from "@/hooks/useDashboardData";

const Index = () => {
  const { displayName, investments, nextMatch, news } = useDashboardData();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventCard />
          <InvestmentCard investments={investments} />
          <MatchCard nextMatch={nextMatch} />
        </div>

        <NewsCard news={news} />
      </main>
    </div>
  );
};

export default Index;
