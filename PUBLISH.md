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
