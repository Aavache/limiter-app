<p align="center">
  <img width="600" height="300" src="img/limiter.png">
</p>

# Limiter PR Github App ✅

Having small PRs is desirable for more modularized feature development and ensuring a better review. If you feel identified with this feature for your own projects, this is your App. 

This App is a pull-request check suite subject to the number of:
- Line additions
- Line deletions
- Commits
- Changed files

This Github App is built with [Probot](https://github.com/probot/probot).


## Hosting the App

Currently, this app is NOT hosted at the moment, but your could run the server as

```sh
cd limiter-app/
# Install dependencies
npm install

# Run the bot
npm start
```

Make sure to update `limiter-app/.env`.

## Docker

```sh
# 1. Build container
docker build -t limiter-app .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> limiter-app
```

## Configure your repository

1. Add a `yaml` file in your repo at `.github/pr-limiter.yml`, with the following options, feel free to adjust the values to your specs:

```yaml
# Max number of added lines in PR, set to -1 to not apply any addition constraints
maxAdditions: 200
# Max number of deleted lines in PR, set to -1 to not apply any deletion constraints
maxDeletions: 14
# Max number of commits in PR, set to -1 to not apply any commit constraints
maxCommits: 250
# Max number of changed files in PR, set to -1 to not apply any file-related constra
maxChangedFiles: 15
# PRs with these labels will bypass all constraints
exemptLabels:
  - large_pr
# PRs names starting with the following strings will bypass all constraints
exemptPRPrefix:
  - big-feature
```

2. This app requires a few permissions to be installed, accept them to proceed.

## Contributing

If you have suggestions for how limiter-app could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2023 Aaron Valero
