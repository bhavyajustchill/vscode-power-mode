# Publishing

| Registry | Publisher | Name | Extension ID |
| --- | --- | --- | --- |
| VS Code Marketplace | `BhavyaJustChilll` | `power-mode-reborn` | `BhavyaJustChilll.power-mode-reborn` |
| Open VSX | `bhavyajustchill` | `vscode-power-mode-reborn` | `bhavyajustchill.vscode-power-mode-reborn` |

`package.json` holds the Marketplace values. The Marketplace name differs because `vscode-power-mode-reborn` is reserved there by a stuck extension under the old `bhavyajustchill` publisher, and names must be unique across the whole Marketplace. The same stuck extension holds the display name "VS Code Power Mode Reborn", so the extension is called "Power Mode Reborn for VS Code" (on both registries).

Releases go out through GitHub Actions (`.github/workflows/publish.yml`), using Trusted Publishing on both registries, so no tokens are stored in GitHub. The workflow packages the extension for the Marketplace. For Open VSX it repackages with `"publisher"` and `"name"` set to the Open VSX values, because Open VSX takes the extension ID from those fields. Otherwise the two packages are identical.

## One-time setup

### VS Code Marketplace (Trusted Publishing, no token)

1. Go to https://marketplace.visualstudio.com/manage/publishers/BhavyaJustChilll.
2. Open **Trusted Publishing** → **Create** and fill in:
   - Policy name: `GitHub release workflow`
   - Repository owner: `bhavyajustchill`
   - Repository: `vscode-power-mode`
   - Workflow: `publish.yml`
   - Environment: leave empty

### Open VSX (Trusted Publishing, no token)

The `bhavyajustchill` namespace already exists and is verified. On https://open-vsx.org, register a trusted publisher for it:

- Namespace: `bhavyajustchill`
- Publisher: GitHub
- Extension: `vscode-power-mode-reborn`
- Organization or user name: `bhavyajustchill`
- Repository name: `vscode-power-mode`
- Workflow filename: `publish.yml`
- Environment name: leave empty

## Each release

Add the new version's entry to the changelog in `README.md` first, so it ships in the package. Then:

```bash
git add -A
git commit -m "Describe your changes"
npm version patch -m "Release %s"
git push origin reborn --follow-tags
```

- `npm version patch` bumps the version (e.g. `1.1.1` → `1.1.2`), commits it as "Release 1.1.2", and creates the tag `v1.1.2`. It refuses to run if there are uncommitted changes.
- Use `minor` (`1.1.x` → `1.2.0`), `major` (`1.x` → `2.0.0`), or an exact version (`npm version 1.3.0 -m "Release %s"`) instead of `patch` as needed.
- `--follow-tags` pushes the branch and the new tag together. The tag push is what starts publishing. If you forgot it, push the tag on its own: `git push origin v1.1.2`.

Watch the run at https://github.com/bhavyajustchill/vscode-power-mode/actions. If only one registry failed, fix the cause and press **Re-run jobs**; the registry that already has the version is skipped.

The workflow fails if the tag doesn't match the version in `package.json`. The built .vsix is also uploaded as a workflow artifact named `vsix`.

You can also start the workflow by hand from the Actions tab (**Publish** → **Run workflow**). That only shows up once the workflow file is on the default branch (`master`).

## Publishing manually (fallback)

```bash
# VS Code Marketplace (needs `vsce login BhavyaJustChilll` first)
npx --yes @vscode/vsce@4 package --no-dependencies
npx --yes @vscode/vsce@4 publish --packagePath power-mode-reborn-<version>.vsix

# Open VSX: temporarily switch publisher and name, package, publish, then revert
npm pkg set publisher=bhavyajustchill name=vscode-power-mode-reborn
npx --yes @vscode/vsce@4 package --no-dependencies --out openvsx.vsix
npx --yes ovsx publish openvsx.vsix --pat <your open-vsx token>
npm pkg set publisher=BhavyaJustChilll name=power-mode-reborn
```

`vsce login` uses an Azure DevOps PAT (organization: All accessible organizations, scope: Marketplace → Manage). Global PATs are retired on December 1, 2026, so after that, publish through the workflow.
