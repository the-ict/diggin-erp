import Card from "@/widgets/card/ui";
import HistoryChart from "@/widgets/historychart/ui";
import PageLink from "@/widgets/pagelink/ui";

export default function MainPage() {
  return (
    <div className="custom-container space-y-10">
      <PageLink />
      <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap pb-2">
        {[1,2,3,4,5,6,7].map(card => (
          <Card key={card} />
        ))}
      </div>

      <HistoryChart />
      <HistoryChart />
      <HistoryChart />
      <HistoryChart />
      <HistoryChart />
      <HistoryChart />
      <HistoryChart />
    </div>
  );
}