import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/tokens.css";
import "./styles/chrome.css";
import "./styles/blocks.css";

createRoot(document.getElementById("root")!).render(<App />);
