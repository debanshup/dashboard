"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("analytics/avg-impact-vs-time");
  }, []);

  return <div></div>;
}
