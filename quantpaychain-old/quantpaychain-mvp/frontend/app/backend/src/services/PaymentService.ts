
// PaymentService - Real Stripe integration + Crypto simulation

import Stripe from 'stripe';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import prisma from '../utils/db';
import { NotFoundError, PaymentError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import InvestmentService from './InvestmentService';

// Initialize Stripe (will be null if no key provided)
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

export class PaymentService {
  /**
   * Create Stripe Payment Intent (REAL implementation)
   */
  async createStripePaymentIntent(data: {
    userId: string;
    investmentId: string;
    amount: number;
    currency?: string;
  }): Promise<any> {
    try {
      if (!stripe) {
        throw new PaymentError('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
      }

      const currency = data.currency || 'USD';

      // Get investment and user details
      const investment = await prisma.investment.findUnique({
        where: { id: data.investmentId },
        include: {
          property: true,
          user: true,
        },
      });

      if (!investment) {
        throw new NotFoundError('Investment');
      }

      if (investment.userId !== data.userId) {
        throw new ValidationError('Investment does not belong to user');
      }

      // Create Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          userId: data.userId,
          investmentId: data.investmentId,
          propertyId: investment.propertyId,
          propertyTitle: investment.property.title,
        },
        description: `Investment in ${investment.property.title}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: data.userId,
          amount: data.amount,
          currency: currency,
          method: PaymentMethod.STRIPE,
          status: PaymentStatus.PENDING,
          stripePaymentIntentId: paymentIntent.id,
          stripeClientSecret: paymentIntent.client_secret,
          description: `Investment in ${investment.property.title}`,
          metadata: {
            investmentId: data.investmentId,
            propertyId: investment.propertyId,
          },
        },
      });

      // Link payment to investment
      await prisma.investment.update({
        where: { id: data.investmentId },
        data: {
          paymentId: payment.id,
        },
      });

      logger.info('Stripe payment intent created', {
        paymentId: payment.id,
        paymentIntentId: paymentIntent.id,
        amount: data.amount,
      });

      return {
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: data.amount,
        currency: currency,
      };
    } catch (error) {
      logger.error('Error creating Stripe payment intent', { error, data });
      if (error instanceof Stripe.errors.StripeError) {
        throw new PaymentError(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Confirm Stripe payment (called by webhook or manual confirmation)
   */
  async confirmStripePayment(paymentIntentId: string): Promise<any> {
    try {
      if (!stripe) {
        throw new PaymentError('Stripe is not configured');
      }

      // Get payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new PaymentError(`Payment status is ${paymentIntent.status}`);
      }

      // Find payment in database
      const payment = await prisma.payment.findUnique({
        where: { stripePaymentIntentId: paymentIntentId },
        include: {
          investment: true,
        },
      });

      if (!payment) {
        throw new NotFoundError('Payment');
      }

      if (payment.status === PaymentStatus.COMPLETED) {
        logger.warn('Payment already completed', { paymentIntentId });
        return payment;
      }

      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      // Confirm investment if linked
      if (payment.investment) {
        await InvestmentService.confirmInvestment(
          payment.investment.id,
          payment.id
        );
      }

      // Create notification
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          type: 'PAYMENT_RECEIVED',
          title: 'Payment Successful',
          message: `Your payment of $${payment.amount.toFixed(2)} has been processed successfully.`,
          actionUrl: '/dashboard/investments',
        },
      });

      logger.info('Stripe payment confirmed', {
        paymentId: payment.id,
        paymentIntentId,
        amount: payment.amount.toNumber(),
      });

      return updatedPayment;
    } catch (error) {
      logger.error('Error confirming Stripe payment', { error, paymentIntentId });
      throw error;
    }
  }

  /**
   * Create crypto payment request (SIMULATED for MVP)
   */
  async createCryptoPaymentRequest(data: {
    userId: string;
    investmentId: string;
    amount: number;
    currency: 'ETH' | 'USDC' | 'DAI' | 'BTC';
  }): Promise<any> {
    try {
      // Get investment details
      const investment = await prisma.investment.findUnique({
        where: { id: data.investmentId },
        include: {
          property: true,
        },
      });

      if (!investment) {
        throw new NotFoundError('Investment');
      }

      // Generate simulated wallet address (in production, this would be real)
      const walletAddress = this.generateMockWalletAddress(data.currency);

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: data.userId,
          amount: data.amount,
          currency: data.currency,
          method: `CRYPTO_${data.currency}` as PaymentMethod,
          status: PaymentStatus.PENDING,
          cryptoAddress: walletAddress,
          cryptoNetwork: this.getCryptoNetwork(data.currency),
          description: `Crypto investment in ${investment.property.title}`,
          metadata: {
            investmentId: data.investmentId,
            propertyId: investment.propertyId,
            simulated: true,
          },
        },
      });

      // Link payment to investment
      await prisma.investment.update({
        where: { id: data.investmentId },
        data: {
          paymentId: payment.id,
        },
      });

      logger.info('Crypto payment request created (simulated)', {
        paymentId: payment.id,
        currency: data.currency,
        amount: data.amount,
      });

      return {
        paymentId: payment.id,
        walletAddress,
        amount: data.amount,
        currency: data.currency,
        network: this.getCryptoNetwork(data.currency),
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`,
        expiresIn: 3600, // 1 hour
      };
    } catch (error) {
      logger.error('Error creating crypto payment request', { error, data });
      throw error;
    }
  }

  /**
   * Simulate crypto payment confirmation
   */
  async simulateCryptoPayment(paymentId: string, txHash: string): Promise<any> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          investment: true,
        },
      });

      if (!payment) {
        throw new NotFoundError('Payment');
      }

      if (payment.status === PaymentStatus.COMPLETED) {
        logger.warn('Payment already completed', { paymentId });
        return payment;
      }

      // Update payment with tx hash
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.COMPLETED,
          cryptoTxHash: txHash,
          completedAt: new Date(),
        },
      });

      // Confirm investment
      if (payment.investment) {
        await InvestmentService.confirmInvestment(
          payment.investment.id,
          payment.id
        );
      }

      // Create notification
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          type: 'PAYMENT_RECEIVED',
          title: 'Crypto Payment Confirmed',
          message: `Your ${payment.currency} payment has been confirmed on the blockchain.`,
          actionUrl: '/dashboard/investments',
        },
      });

      logger.info('Crypto payment confirmed (simulated)', {
        paymentId,
        txHash,
        amount: payment.amount.toNumber(),
      });

      return updatedPayment;
    } catch (error) {
      logger.error('Error simulating crypto payment', { error, paymentId, txHash });
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string, userId?: string): Promise<any> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          investment: {
            include: {
              property: {
                select: {
                  id: true,
                  title: true,
                  city: true,
                  images: true,
                },
              },
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundError('Payment');
      }

      if (userId && payment.userId !== userId) {
        throw new ValidationError('Not authorized to view this payment');
      }

      logger.info('Retrieved payment', { paymentId, userId });

      return payment;
    } catch (error) {
      logger.error('Error getting payment', { error, paymentId });
      throw error;
    }
  }

  /**
   * Get user payments
   */
  async getUserPayments(userId: string): Promise<any[]> {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId },
        include: {
          investment: {
            include: {
              property: {
                select: {
                  id: true,
                  title: true,
                  city: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info(`Retrieved ${payments.length} payments for user ${userId}`);

      return payments;
    } catch (error) {
      logger.error('Error getting user payments', { error, userId });
      throw error;
    }
  }

  /**
   * Helper: Generate mock wallet address
   */
  private generateMockWalletAddress(currency: string): string {
    const prefixes: Record<string, string> = {
      ETH: '0x',
      USDC: '0x',
      DAI: '0x',
      BTC: '1',
    };

    const prefix = prefixes[currency] || '0x';
    const length = currency === 'BTC' ? 34 : 40;
    const chars = '0123456789abcdef';
    
    let address = prefix;
    for (let i = prefix.length; i < length; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }

    return address;
  }

  /**
   * Helper: Get crypto network
   */
  private getCryptoNetwork(currency: string): string {
    const networks: Record<string, string> = {
      ETH: 'ethereum',
      USDC: 'ethereum',
      DAI: 'ethereum',
      BTC: 'bitcoin',
    };

    return networks[currency] || 'ethereum';
  }

  /**
   * Handle Stripe webhook events
   */
  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.confirmStripePayment(paymentIntent.id);
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          await this.handleFailedPayment(failedPayment.id);
          break;

        default:
          logger.info('Unhandled Stripe webhook event', { type: event.type });
      }
    } catch (error) {
      logger.error('Error handling Stripe webhook', { error, eventType: event.type });
      throw error;
    }
  }

  /**
   * Handle failed payment
   */
  private async handleFailedPayment(paymentIntentId: string): Promise<void> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { stripePaymentIntentId: paymentIntentId },
      });

      if (!payment) {
        logger.warn('Payment not found for failed payment intent', { paymentIntentId });
        return;
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
        },
      });

      // Notify user
      await prisma.notification.create({
        data: {
          userId: payment.userId,
          type: 'SYSTEM_ALERT',
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again or contact support.',
          actionUrl: '/dashboard/payments',
        },
      });

      logger.info('Payment marked as failed', { paymentId: payment.id });
    } catch (error) {
      logger.error('Error handling failed payment', { error, paymentIntentId });
      throw error;
    }
  }
}

export default new PaymentService();

