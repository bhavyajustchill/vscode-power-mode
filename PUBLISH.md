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
