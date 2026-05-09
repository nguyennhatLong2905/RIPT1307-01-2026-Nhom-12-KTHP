import { Metadata } from "next";
import MyListContent from "@/features/my-list/components/my-list-content";

export const metadata: Metadata = {
  title: "My List | LUXE CINEMA",
  description: "Your saved movies and shows on LUXE CINEMA.",
};

export default function MyListPage() {
  return (
    <div className="w-full h-full min-h-screen">
      <MyListContent />
    </div>
  );
}
