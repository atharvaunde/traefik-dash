# Branch Protection Configuration

This repository uses GitHub branch protection rules and automated workflows to ensure code quality.

## Branch Strategy

### `main` - Production Branch
- Protected branch
- Requires pull request reviews
- Requires status checks to pass
- GitHub Copilot review is **mandatory**
- No direct pushes allowed

### `development` / `develop` / `dev` - Development Branch
- Active development branch
- Pushes trigger validation checks
- PRs to main automatically trigger Copilot review

## Setting Up Branch Protection

To enable the full protection workflow, configure these settings in GitHub:

### 1. Navigate to Repository Settings
Go to: **Settings** → **Branches** → **Branch protection rules** → **Add rule**

### 2. Configure `main` Branch Protection

**Branch name pattern:** `main`

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: 1 (or more)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Required status checks:**
    - `GitHub Copilot Code Review`
    - `Lint and Build Check`
    
- ✅ **Require conversation resolution before merging**

- ✅ **Do not allow bypassing the above settings**

- ✅ **Restrict who can push to matching branches**
  - Add only: Repository administrators, CI/CD service accounts

### 3. Configure `development` Branch Protection (Optional but Recommended)

**Branch name pattern:** `development`

#### Recommended Settings:
- ✅ **Require status checks to pass before merging**
  - **Required status checks:**
    - `Validate Development Changes`
    - `Lint and Build Check`

## Workflow Overview

### 1. Development Push (`development.yml`)
**Triggers:** Push to `development`, `develop`, or `dev` branches

**Actions:**
- Runs linter
- Builds application
- Checks if PR to main exists
- Provides instructions if no PR exists

### 2. Pull Request Review (`pr-review.yml`)
**Triggers:** PR opened/updated targeting `main` branch

**Actions:**
- ✅ **GitHub Copilot Code Review** (REQUIRED)
  - Automatic code analysis
  - Security vulnerability detection
  - Best practices verification
  - Code quality assessment
  
- ✅ **Lint and Build Check** (REQUIRED)
  - ESLint validation
  - Next.js build verification

### 3. Release (`release.yml`)
**Triggers:** Push to `main` (after PR merge)

**Actions:**
- Automatic version bump (based on commits)
- Create git tag and GitHub release
- Build and push Docker images

## Workflow for Contributors

1. **Make changes in `development` branch:**
   ```bash
   git checkout development
   git pull origin development
   # Make your changes
   git commit -m "feat: add new feature"
   git push origin development
   ```

2. **Create Pull Request to `main`:**
   - GitHub Copilot will automatically review
   - Build checks will run
   - Address any issues found

3. **Wait for required checks:**
   - ✅ GitHub Copilot Code Review
   - ✅ Lint and Build Check
   - ✅ Manual review (if required)

4. **Merge to `main`:**
   - Only after all checks pass
   - Release workflow triggers automatically
   - Version bumps, tags, and Docker images created

## Copilot Review Requirements

The **GitHub Copilot Code Review** is a **mandatory** status check that must pass before merging PRs into `main`.

### What Copilot Reviews:
- Code quality and best practices
- Security vulnerabilities
- Performance issues
- Potential bugs
- Code style consistency
- Documentation completeness

### If Copilot Flags Issues:
1. Review the feedback in PR comments
2. Address critical and high-priority issues
3. Push fixes to the PR branch
4. Copilot will re-review automatically

## Manual Override (Administrators Only)

Repository administrators can bypass protection rules in emergency situations, but this should be avoided.

## Status Check Badge

Add to your README.md:

```markdown
[![PR Review](https://github.com/atharvaunde/traefik-dash/actions/workflows/pr-review.yml/badge.svg)](https://github.com/atharvaunde/traefik-dash/actions/workflows/pr-review.yml)
[![Development](https://github.com/atharvaunde/traefik-dash/actions/workflows/development.yml/badge.svg)](https://github.com/atharvaunde/traefik-dash/actions/workflows/development.yml)
```

## Troubleshooting

### Copilot review not running
- Ensure GitHub Copilot is enabled for the repository
- Check that the workflow file has correct permissions
- Verify the PR is targeting the `main` branch

### Build check failing
- Review build logs in Actions tab
- Ensure all dependencies are properly declared
- Fix linting errors locally before pushing

### Can't merge PR
- Verify all required status checks passed
- Ensure PR has required approvals
- Check that branch is up to date with main
