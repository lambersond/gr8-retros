# Local Dev

## Requirements

- [NPM](https://www.npmjs.com/)
- Node.js (v22+)
  - [nvm](https://github.com/nvm-sh/nvm) for managing node versions
- [Docker](https://www.docker.com/) or [Podman](https://podman.io/)

## Exeternal Serices

- [Google Auth](https://console.cloud.google.com/auth/clients)
  - You will need to create OAuth 2.0 credentials for your application and update your `.env` file with the client ID and client secret.
- [Ably Pub/Sub](https://ably.com/)
  - You will need to create an Ably account and get your API key to update your `.env` file.
  - It will need the following capabilities enabled:
    - `object publish`
    - `object subscribe`
    - `presence`
    - `publish`
    - `subscribe`

