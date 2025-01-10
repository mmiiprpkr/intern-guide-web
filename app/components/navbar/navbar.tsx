//app/componet
"use client";

import { useSession } from "@/hooks/use-session";
import UserNav from "./components/usernav";

export default function Navbar() {
  const { session } = useSession();

  return (
    <>
      <UserNav />
    </>
  );
}
