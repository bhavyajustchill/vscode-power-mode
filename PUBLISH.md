# Publishing

- VS Code Marketplace publisher: `BhavyaJustChilll` (this is `"publisher"` in `package.json`).
- Open VSX namespace: `bhavyajustchill` (no extra l).

Releases go out through GitHub Actions (`.github/workflows/publish.yml`). The workflow packages the extension for the Marketplace. For Open VSX it repackages with `"publisher"` set to `bhavyajustchill`, because Open VSX takes the namespace from that field. The two packages differ only in the publisher.

## One-time setup

### VS Code Marketplace (Trusted Publishing, no token)

1. Go to https://marketplace.visualstudio.com/manage/publishers/BhavyaJustChilll.
2. Open **Trusted Publishing** → **Create** and fill in:
   - Policy name: `GitHub release workflow`
   - Repository owner: `bhavyajustchill`
   - Repository: `vscode-power-mode`
   - Workflow: `publish.yml`
   - Environment: leave empty

### Open VSX

The `bhavyajustchill` namespace already exists and is verified.

1. At https://open-vsx.org, go to your profile → Access Tokens and copy a token (or generate a new one).
2. In the GitHub repo, go to Settings → Secrets and variables → Actions and add a secret named `OVSX_PAT` with the token.
   If the secret isn't set, the workflow skips Open VSX.

## Each release

1. Bump `"version"` in `package.json` (e.g. `1.1.0` → `1.1.1`) and commit.
2. Tag the commit with the same version and push the tag:

   ```bash
   git tag v1.1.1
   git push origin v1.1.1
   ```

The workflow fails if the tag doesn't match the version in `package.json`. The built .vsix is also uploaded as a workflow artifact named `vsix`.

You can also start the workflow by hand from the Actions tab (**Publish** → **Run workflow**). That only shows up once the workflow file is on the default branch (`master`).

## Publishing manually (fallback)

```bash
# VS Code Marketplace (needs `vsce login BhavyaJustChilll` first)
npx --yes @vscode/vsce@4 package --no-dependencies
npx --yes @vscode/vsce@4 publish --packagePath vscode-power-mode-reborn-<version>.vsix

# Open VSX: temporarily switch the publisher, package, publish, then revert
npm pkg set publisher=bhavyajustchill
npx --yes @vscode/vsce@4 package --no-dependencies --out openvsx.vsix
npx --yes ovsx publish openvsx.vsix --pat <your open-vsx token>
npm pkg set publisher=BhavyaJustChilll
```

`vsce login` uses an Azure DevOps PAT (organization: All accessible organizations, scope: Marketplace → Manage). Global PATs are retired on December 1, 2026, so after that, publish through the workflow.
