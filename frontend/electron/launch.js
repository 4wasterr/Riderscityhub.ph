import { spawn } from "child_process";
import electron from "electron";

// When running inside VS Code or certain IDE terminals, ELECTRON_RUN_AS_NODE=1
// is set in the environment, which forces Electron to run as headless Node CLI
// instead of launching the desktop GUI window.
// Deleting it unsets the variable completely so Electron boots in GUI mode.
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electron, ["."], {
  stdio: "inherit",
  env,
  shell: false,
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});

