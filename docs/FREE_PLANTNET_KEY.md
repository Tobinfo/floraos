# Free Pl@ntNet Key Setup

Use this path when a free or development gardenin deployment should avoid spending a shared hosted API key.

## User Steps

1. Open gardenin.
2. Open `Data`.
3. Select `Get free key` to open the Pl@ntNet developer portal.
4. Create or sign in to a Pl@ntNet developer account.
5. Generate a private API key from the Pl@ntNet developer dashboard.
6. Return to gardenin.
7. Paste the key under `Pl@ntNet API key`.
8. Select `Save key`.
9. Run `Scan` again.

## Deployment Setting

Set this on the hosted service when every free user must provide their own key:

```text
PLANT_ID_PROVIDER=plantnet
REQUIRE_USER_PLANTNET_API_KEY=true
```

Leave `PLANTNET_API_KEY` unset if gardenin should not use a shared hosted key at all.

## Product Note

This is reasonable for early testers, hobbyists, and self-directed free users. It is not ideal for polished consumer onboarding because it adds friction before the first successful scan.

The app should redirect users to the Pl@ntNet portal instead of embedding signup or collecting Pl@ntNet credentials. Users create the key on Pl@ntNet's domain, then paste only the API key into gardenin.

Sources:

- Pl@ntNet API developer portal: `https://my.plantnet.org/`
- Pl@ntNet API docs: `https://docs.plantnet.org/en/reference/api-plantnet/`
