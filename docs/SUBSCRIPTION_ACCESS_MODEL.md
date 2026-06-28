# Subscription Access Model

## Decision

Health Coach subscriptions are sold only through the website.

The mobile app is not a sales channel. It is only a client that checks whether the authenticated Supabase account has active access.

## Channel Boundaries

- Website: the only subscription sales channel.
- Supabase/backend: the single source of truth for subscription state and access.
- Mobile app: checks access only for the authenticated account.
- App Store and Google Play: distribution channels for downloading the app only.

The mobile app must not include:

- in-app purchases;
- external checkout links;
- checkout CTAs inside the app;
- a separate subscription-check page;
- payment-provider secrets or direct payment-provider calls.

Future access checks must be integrated into the existing `Войти в аккаунт` login/account flow. Do not create a new login route or a separate subscription-check route for this.

## Plans

| Plan | Price |
| --- | ---: |
| `monthly` | 3,000 RUB |
| `six_months` | 15,000 RUB |

## Entitlement Rule

Premium app access is controlled by an entitlement row:

```text
product = healthcoach_premium
active = true
active_until > now()
```

The app should treat access as inactive if any of these are false:

- no entitlement row exists for the user;
- `active` is not `true`;
- `active_until` is `null`;
- `active_until <= now()`.

## Backend Ownership

Subscription records, payment events, billing customer references, and entitlement updates are written by trusted backend/webhook code using server-side credentials.

Authenticated clients may read their own subscription and entitlement status, but they must not insert, update, or delete subscription status or entitlement records.
