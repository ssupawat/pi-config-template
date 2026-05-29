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
ln -sf ~/repos/pi-config/projects/<project>/settings.json <project>/.pi/settings.json
ln -sf ~/repos/pi-config/projects/<project>/skills <project>/.pi/skills
ln -sf ~/repos/pi-config/projects/<project>/AGENTS.md <project>/AGENTS.md
```

## Structure

```
├── global/                    # Agent-wide config
│   ├── AGENTS.md
│   ├── settings.json
│   ├── extensions/
│   └── skills/
└── projects/                  # Project-specific pi config
    └── <project-name>/
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
