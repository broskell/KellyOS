import { useNavigate } from "react-router-dom";
import { specForPath } from "../wm/specs";
import { useWmStore } from "../wm/store";
import type { LaunchTarget } from "./resolve";

export function useRegistryLaunch() {
  const navigate = useNavigate();
  const open = useWmStore((s) => s.open);

  return (target: LaunchTarget) => {
    const spec = specForPath(target.path);
    if (spec) open(spec);
    navigate(target.path);
  };
}
