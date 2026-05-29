# pi-config

Manage portable pi config across machines.

## Location

`~/repos/pi-config`

## Structure

```
~/repos/pi-config/
├── global/           # ~/.pi/agent/ symlinks (AGENTS.md, settings.json, extensions, skills)
└── projects/         # per-project .pi/ symlinks
    └── <name>/       # settings.json, skills, AGENTS.md
```

## Commands

When the user asks to manage pi config, use these commands:

### Status

Check current symlink state:

```bash
echo "=== Global ==="
for item in AGENTS.md settings.json extensions skills; do
  path="$HOME/.pi/agent/$item"
  if [ -L "$path" ]; then echo "  $item → symlink"; elif [ -e "$path" ]; then echo "  $item → local (not linked)"; else echo "  $item → missing"; fi
done

echo "=== Projects ==="
for project in "$HOME"/repos/pi-config/projects/*/; do
  name=$(basename "$project")
  root="$HOME/Documents/repos/workspace/vialink/$name"
  if [ -L "$root/.pi/settings.json" ]; then echo "  $name → linked"; else echo "  $name → not linked"; fi
done
```

### Add a project

Copy project's `.pi/` config into the repo and symlink back:

```bash
PROJECT="<project-root>"   # e.g. ~/Documents/repos/workspace/vialink/MyProject
NAME="<name>"              # e.g. MyProject
REPO="$HOME/repos/pi-config/projects/$NAME"
PROJECT_PI="$PROJECT/.pi"

mkdir -p "$REPO"

# Copy existing config files (if they exist)
[ -f "$PROJECT_PI/settings.json" ] && cp "$PROJECT_PI/settings.json" "$REPO/"
[ -d "$PROJECT_PI/skills" ] && cp -a "$PROJECT_PI/skills" "$REPO/"

# Handle AGENTS.md at project root (pi reads it from there, not from .pi/)
if [ -f "$PROJECT/AGENTS.md" ]; then
  cp "$PROJECT/AGENTS.md" "$REPO/"
fi

# Replace originals with symlinks
[ -f "$PROJECT_PI/settings.json" ] && rm "$PROJECT_PI/settings.json" && ln -sf "$REPO/settings.json" "$PROJECT_PI/settings.json"
[ -d "$PROJECT_PI/skills" ] && rm -rf "$PROJECT_PI/skills" && ln -sf "$REPO/skills" "$PROJECT_PI/skills"
[ -f "$REPO/AGENTS.md" ] && rm "$PROJECT/AGENTS.md" && ln -sf "$REPO/AGENTS.md" "$PROJECT/AGENTS.md"
```

Then commit:

```bash
cd ~/repos/pi-config && git add -A && git commit -m "add project: $NAME" && git push
```

### Remove a project

```bash
NAME="<name>"
PROJECT="<project-root>"

# Restore local files from symlinks
for item in "$PROJECT/.pi/settings.json" "$PROJECT/.pi/skills" "$PROJECT/AGENTS.md"; do
  if [ -L "$item" ]; then
    target=$(readlink "$item")
    rm "$item"
    if [ -d "$target" ]; then cp -a "$target" "$item"; else cp "$target" "$item"; fi
  fi
done

# Remove from repo
rm -rf "$HOME/repos/pi-config/projects/$NAME"
cd ~/repos/pi-config && git add -A && git commit -m "remove project: $NAME" && git push
```

### Sync changes

After installing new skills, editing config, etc:

```bash
cd ~/repos/pi-config && git add -A && git status
```

Review, then commit and push.

## Notes

- `auth.json` and `sessions/` are never synced (machine-local)
- AGENTS.md at project root must stay symlinked there — pi reads it from the project root, not from `.pi/`
- Skills in `~/.agents/skills/` are copied directly (not symlinked) into the repo
