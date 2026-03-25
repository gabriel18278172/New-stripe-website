# SignalDesk AI (Micro SaaS + Stripe)

A polished micro SaaS marketing website with a Stripe Checkout subscription flow.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Then replace the values in `.env` with your Stripe secret key and real Stripe `price_...` IDs.
3. Run locally:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Stripe setup

In your Stripe dashboard:
- Create **three recurring prices** (Starter, Pro, Scale).
- Copy each `price_...` ID into `.env` as:
  - `STRIPE_PRICE_STARTER`
  - `STRIPE_PRICE_PRO`
  - `STRIPE_PRICE_SCALE`

Use a test key (`sk_test_...`) for development and a live key (`sk_live_...`) in production.

## Scripts

- `npm run dev` — start server
- `npm run start` — start server
- `npm run check` — syntax check for server file
