import { execFile } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("agent_end", async () => {
    execFile("afplay", ["/System/Library/Sounds/Glass.aiff"]);
  });
}
