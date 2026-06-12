import { redirect } from "next/navigation";
import MainPage from "@/features/main/ui";

export default function Component() {
  // This is a server component, so we need to handle auth differently
  // The actual auth check happens in the client component
  return <MainPage />;
}