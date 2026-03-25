require('dotenv').config();
const path = require('path');
const express = require('express');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 3000;

const requiredEnv = ['STRIPE_SECRET_KEY', 'BASE_URL'];
for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    console.warn(`Missing required environment variable: ${variable}`);
  }
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const priceMap = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
  scale: process.env.STRIPE_PRICE_SCALE,
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { plan } = req.body;

    if (!stripe) {
      return res.status(500).json({
        error:
          'Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.',
      });
    }

    if (!plan || !priceMap[plan]) {
      return res.status(400).json({ error: 'Invalid plan selection.' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceMap[plan],
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Micro SaaS site running at http://localhost:${port}`);
});
