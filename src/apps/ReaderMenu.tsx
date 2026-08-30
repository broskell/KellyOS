import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function ReaderMenu({ to, extra }: { to: string; extra?: ReactNode }) {
  return (
    <div className="os-menubar">
      <span className="px-2 font-chrome">File</span>
      {extra}
      <Link to={to}>Reader Mode</Link>
    </div>
  );
}
