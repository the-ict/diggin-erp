import Sidebar from "@/widgets/sidebar/ui";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Component({ children }: Props) {
  return (
    <div>
      {children}
    </div>
  );
}