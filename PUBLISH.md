### Prerequisites

1. Sign in at https://marketplace.visualstudio.com/manage and create a publisher with the ID bhavyajustchill.
2. Create an Azure DevOps Personal Access Token with the Marketplace → Manage scope.

### Publishing

The newer vsce saves the token on your machine, outside the project.
here, bhavyajustchill is id

```bash
npx --yes @vscode/vsce@latest login bhavyajustchill
```

# paste the token when prompted

```bash
npx --yes @vscode/vsce@latest publish
```

After that, publish works without the token for as long as it's valid.

# Publishing to Open VSX (one-time setup)

1. Create an Eclipse account: sign up at https://accounts.eclipse.org. Open VSX is run by the Eclipse Foundation. Put your GitHub username in the account profile.
2. Log in: go to https://open-vsx.org and log in with GitHub.
3. Sign the agreemen connect the Eclipseaccount and sign the Publisher Agreement.
4. Get a token: in your profile settings, go to Access Tokens →
   Generate New Token and copy it.
5. Create your namespace and publish. Run these in terminalt:

```bash
# Make your Open VSX token available to the commands in this terminal
$env:OVSX_PAT = "<your open-vsx token>"

# Create the namespace (one time only)
npx --yes ovsx create-namespace bhavyajustchill

# Publish the extension into that namespace
npx --yes ovsx publish
```

Each release from now on

Publish to both registries:

```bash
npx --yes @vscode/vsce@latest publish   # VS Code Marketplace
npx --yes ovsx publish                  # Open VSX
```

You can also build the .vsix once with npx --yes @vscode/vsce@latest package and upload that same file to both, so they're guaranteed to match. Then run npx --yes ovsx publish vscode-power-mode-reborn-1.1.0.vsix.
