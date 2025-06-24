# Noteprism

A modern note-taking application with automatic organization features.

## Trial and Subscription System

Noteprism implements a freemium model with the following plans:

- **Trial**: New users automatically get a 7-day free trial with full features
- **Paid**: Users with an active Stripe subscription
- **Free**: Users with expired trials or canceled subscriptions

### How it works

1. **Trial Activation**: When a user creates an account, they are automatically placed on a 7-day trial
2. **Subscription Verification**: The system only verifies subscription status with Stripe during login/connect events
3. **Optimization**: To minimize API calls, subscription status is only verified with Stripe if the last verification was more than 31 days ago

### Technical Implementation

- Subscription status is checked in the middleware (`app/middleware/subscription-checker.ts`)
- The middleware only runs on login/connect endpoints and dashboard access
- Trial expiration is calculated based on account creation time
- The system stores verification timestamps to minimize Stripe API calls

## Development

### Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=your_database_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## License

MIT 