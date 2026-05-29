# pi-config

Portable pi coding agent config — shared across machines via git and symlinks.

## Setup

```bash
# 1. Create a private repo from this template
# 2. Clone it
git clone git@github.com:<your-username>/pi-config.git ~/repos/pi-config

# 3. Global config
ln -sf ~/repos/pi-config/global/AGENTS.md ~/.pi/agent/AGENTS.md
ln -sf ~/repos/pi-config/global/settings.json ~/.pi/agent/settings.json
ln -sf ~/repos/pi-config/global/extensions ~/.pi/agent/extensions
ln -sf ~/repos/pi-config/global/skills ~/.pi/agent/skills

# 4. Project configs (as needed)
PROJECT=~/path/to/your-project
NAME=my-project

# Copy existing config into the repo first (if not starting from template)
[ -f $PROJECT/.pi/settings.json ] && cp $PROJECT/.pi/settings.json ~/repos/pi-config/projects/$NAME/
[ -f $PROJECT/AGENTS.md ] && cp $PROJECT/AGENTS.md ~/repos/pi-config/projects/$NAME/

# Then symlink
ln -sf ~/repos/pi-config/projects/$NAME/settings.json $PROJECT/.pi/settings.json
ln -sf ~/repos/pi-config/projects/$NAME/skills $PROJECT/.pi/skills
ln -sf ~/repos/pi-config/projects/$NAME/AGENTS.md $PROJECT/AGENTS.md
```

## Structure

```
├── global/                    # Agent-wide config
│   ├── AGENTS.md
│   ├── settings.json
│   ├── extensions/
│   └── skills/
└── projects/                  # Project-specific pi config
    └── my-project/              # Example
        ├── AGENTS.md
        ├── settings.json
        └── skills/
```

## What's NOT synced

- `~/.pi/agent/auth.json` — API keys (machine-local)
- `~/.pi/agent/sessions/` — chat history (machine-local)

---

## How it works

Everything is symlinked. The repo is the source of truth — pi reads/writes through the symlinks as if the files were in their normal locations.

- Installing a new skill → lands directly in the repo, ready to commit
- Editing AGENTS.md → editing the file in the repo
- No special sync step needed

Just `git add -A && git commit` when you want to save changes.

### How `ln -sf` works

```
ln -sf <target> <link>
```

- `ln` — create a link
- `-s` — symbolic link (a pointer to another path)
- `-f` — force (replace existing file at `<link>`)

```bash
ln -sf ~/repos/pi-config/global/AGENTS.md ~/.pi/agent/AGENTS.md
#        ↑ target (source of truth)              ↑ link (where pi looks)
```

Pi reads/writes `~/.pi/agent/AGENTS.md` → follows the symlink → reads/writes the repo. The symlink is invisible to pi — no special behavior needed.

### Extension development

`tsconfig.json` and `package.json` live at the repo root — not in `~/.pi/agent/`. This is intentional:

- Without `tsconfig.json` — editor can't resolve types or know which files to include
- Without `package.json` listing `@earendil-works/pi-coding-agent` — editor can't resolve imports

Open the repo root (not `~/.pi/`) in your editor to get IntelliSense, linting, and type checking for extensions.

Example extension (`global/extensions/sound-on-done.ts`):

```typescript
import { execFile } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.on("agent_end", async () => {
    execFile("afplay", ["/System/Library/Sounds/Glass.aiff"]);
  });
}
```
