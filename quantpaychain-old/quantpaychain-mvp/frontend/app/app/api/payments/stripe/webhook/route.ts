
// API Route: POST /api/payments/stripe/webhook - Stripe webhook handler

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import PaymentService from '@/backend/src/services/PaymentService';
import { logger } from '@/backend/src/utils/logger';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logger.error('Webhook signature verification failed', { error: err });
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    await PaymentService.handleStripeWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Error in POST /api/payments/stripe/webhook', { error });
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

