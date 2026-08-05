import type { ReactNode } from "react";
import AppLayoutContent from "@/components/layout/AppLayoutContent";

type Props = {
  children: ReactNode;
};

export default function AppLayout(props: Props) {
  return <AppLayoutContent>{props.children}</AppLayoutContent>;
}
