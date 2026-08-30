import { useEffect, useState } from "react";

export function useCompact() {
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 47.99rem)").matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 47.99rem)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return compact;
}
