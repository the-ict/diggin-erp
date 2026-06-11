import Card from "@/widgets/card/ui";
import PageLink from "@/widgets/pagelink/ui";

export default function MainPage() {
  return (
    <div className="custom-container space-y-10">
      <PageLink />
      <div className="flex items-center gap-4">
        {[1,2,3,4,5,6,7].map(card => (
          <Card key={card} />
        ))}
      </div>
    </div>
  );
}