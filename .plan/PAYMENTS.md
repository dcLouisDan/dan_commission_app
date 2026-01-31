# PAYMENTS: Xendit Integration & Webhooks

## Flow Overview
We will use the **Xendit Invoices API**.

1. **Create Invoice**: `POST https://api.xendit.co/v2/invoices`
2. **Handle Webhook**: Receive POST at `https://our-app.com/api/webhooks/xendit`

## Webhook Verification
Xendit sends a token in the HTTP headers to identify that the request is genuinely from them.

**Header Name:** `x-callback-token`

### Verification Logic (Next.js Edge Route)
We must store a `XENDIT_CALLBACK_TOKEN` in our `.env` variables (given by Xendit Dashboard).

```typescript
// app/api/webhooks/xendit/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge Runtime

export async function POST(req: Request) {
  const token = req.headers.get('x-callback-token');
  const XENDIT_TOKEN = process.env.XENDIT_CALLBACK_TOKEN;

  // 1. Verification
  if (token !== XENDIT_TOKEN) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  // 2. Parse Payload
  const data = await req.json();

  // 3. Process Logic (Update DB)
  // ... call Supabase to update status ...

  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
```

## Security Best Practices
1. **Consistency:** Ensure the token matches exactly.
2. **Idempotency:** Xendit might retry webhooks. Ensure processing logic handles duplicate events (e.g., check if Commission is already `PAID` before "paying" again).
3. **Logging:** Log every webhook attempt to `webhooks_log` table for debugging.

## Updating Supabase
Since we are using Edge Runtime, we should use the `supabase-js` client configured for Edge instructions (or simple REST calls) to:
1. Log the payload to `webhooks_log`.
2. Update the `commissions` table status based on `data.status` (e.g. 'PAID' or 'EXPIRED').
