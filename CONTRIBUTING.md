# Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to automatically determine version bumps and generate release notes.

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types and Version Bumps

### **Patch** Release (0.1.0 → 0.1.1)
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions/changes

### **Minor** Release (0.1.0 → 0.2.0)
- `feat:` - New features

### **Major** Release (0.1.0 → 1.0.0)
- Any commit with `!` after type/scope
- Any commit with `BREAKING CHANGE:` in footer

## Examples

### Patch Bump
```bash
git commit -m "fix: resolve connection error handling"
git commit -m "chore: update dependencies"
git commit -m "docs: improve installation instructions"
```

### Minor Bump
```bash
git commit -m "feat: add dark mode support"
git commit -m "feat(ui): implement new dashboard layout"
```

### Major Bump
```bash
git commit -m "feat!: redesign API structure"

# Or with footer
git commit -m "feat: change config format

BREAKING CHANGE: Configuration file format has changed from JSON to YAML"
```

## Full Examples

```bash
# Simple feature
git commit -m "feat: add TCP router support"

# Feature with scope
git commit -m "feat(api): add WebSocket support"

# Bug fix with description
git commit -m "fix: prevent race condition in data fetching"

# Breaking change
git commit -m "refactor!: change store initialization API"

# Detailed commit
git commit -m "feat: add real-time updates

- Implement WebSocket connection
- Add auto-refresh toggle
- Update UI to show live status

Closes #123"
```

## Automatic Release Process

When you push to `main`:
1. The workflow analyzes all commits since the last release
2. Determines version bump based on commit types:
   - Found breaking changes → **major** bump
   - Found features → **minor** bump  
   - Otherwise → **patch** bump
3. Updates `package.json` with new version
4. Creates git tag and GitHub release
5. Builds and publishes Docker images

## Manual Release

You can also trigger a release manually:
1. Go to **Actions** → **Release and Publish**
2. Click **Run workflow**
3. Version will be determined automatically from commits

## Tips

- Use clear, descriptive commit messages
- One logical change per commit
- Reference issues with `Closes #123` or `Fixes #456`
- Use scopes to categorize changes: `feat(api):`, `fix(ui):`, etc.
