# `tough.zone SDK` [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Lint, build, test, publish](https://github.com/tough.solutions/tough.zone-sdk/actions/workflows/lint-build-test-publish.yml/badge.svg)](https://github.com/tough.solutions/tough.zone-sdk/actions/workflows/lint-build-test-publish.yml) [![npm (scoped)](https://img.shields.io/npm/v/@tough-solutions/tough.zone-sdk)](https://www.npmjs.com/package/@tough-solutions/tough.zone-sdk)

`tough.zone SDK` aims to make integration with `tough.zone` easy.

## Installation

```shell script
npm install @tough-solutions/tough.zone-sdk
```

## Usage

### Authorization

In order to work with the public API, you will need an API key for the instance you are managing.
After you obtained the API key, there are two ways to provide the API key to the SDK.

#### Using environment variables

When importing the SDK it will automatically initialize using `TZ_API_KEY` if it is set.

#### Using `ToughZone.Auth.init()`

If you prefer not to use environment variables as described above, you can manually initialize the SDK like so:

```typescript
import { ToughZone } from "@tough-solutions/tough.zone-sdk"

ToughZone.Auth.init(yourApiKeyHere);
```

`ToughZone.Auth.init()` overrides the API key that might be set using the environment variable.

### Managing tickets

#### Creating tickets

Creating `amount` tickets works like this:

```typescript
import { ToughZone } from "@tough-solutions/tough.zone-sdk"

ToughZone.Tickets.createTickets(amount);
```

The call will return a promise that resolves with a list of the UUIDs of the created tickets.

Users can then log in with their tickets when they navigate to `https://<yourToughZoneInstance>/ticket/<ticketUuid>`.

#### Deleting tickets

Deleting existing tickets works like this:

```typescript
import { ToughZone } from "@tough-solutions/tough.zone-sdk"

ToughZone.Tickets.deleteTickets(["ticketUuid1", "ticketUuid2"]);
```

The call will return a promise that resolves with `true` if at least one of the tickets was deleted successfully and with `false` if no ticket was deleted or the list was empty.

## Contributions

Contributions are very welcome! Please see [our contribution guide](CONTRIBUTING.md) for more information.
