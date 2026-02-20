
// InvestmentService - Business logic for investment management

import { PrismaClient, InvestmentStatus } from '@prisma/client';
import prisma from '../utils/db';
import { NotFoundError, ValidationError, AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class InvestmentService {
  /**
   * Create a new investment
   */
  async createInvestment(data: {
    userId: string;
    propertyId: string;
    amount: number;
    paymentMethod: string;
  }): Promise<any> {
    try {
      // Get property details
      const property = await prisma.property.findUnique({
        where: { id: data.propertyId },
      });

      if (!property) {
        throw new NotFoundError('Property');
      }

      // Validate investment amount
      if (data.amount < property.minimumInvestment.toNumber()) {
        throw new ValidationError(
          `Minimum investment is $${property.minimumInvestment.toNumber()}`
        );
      }

      // Calculate tokens
      const tokenPrice = property.tokenPrice.toNumber();
      const tokensOwned = Math.floor(data.amount / tokenPrice);

      if (tokensOwned > property.availableTokens) {
        throw new ValidationError('Insufficient tokens available');
      }

      // Calculate ownership percentage
      const ownership = (tokensOwned * tokenPrice) / property.totalValue.toNumber() * 100;

      // Create investment in transaction
      const investment = await prisma.$transaction(async (tx) => {
        // Create investment
        const newInvestment = await tx.investment.create({
          data: {
            userId: data.userId,
            propertyId: data.propertyId,
            amount: data.amount,
            tokensOwned,
            ownership,
            status: InvestmentStatus.PENDING,
          },
          include: {
            property: {
              select: {
                title: true,
                city: true,
                country: true,
                images: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        });

        // Update property available tokens (will be finalized on payment confirmation)
        // Not updating here to avoid race conditions

        logger.info('Investment created', {
          investmentId: newInvestment.id,
          userId: data.userId,
          propertyId: data.propertyId,
          amount: data.amount,
        });

        return newInvestment;
      });

      return investment;
    } catch (error) {
      logger.error('Error creating investment', { error, data });
      throw error;
    }
  }

  /**
   * Confirm investment after successful payment
   */
  async confirmInvestment(investmentId: string, paymentId: string): Promise<any> {
    try {
      const investment = await prisma.$transaction(async (tx) => {
        // Get investment
        const inv = await tx.investment.findUnique({
          where: { id: investmentId },
          include: {
            property: true,
          },
        });

        if (!inv) {
          throw new NotFoundError('Investment');
        }

        if (inv.status === InvestmentStatus.CONFIRMED) {
          logger.warn('Investment already confirmed', { investmentId });
          return inv;
        }

        // Update property tokens and raised amount
        await tx.property.update({
          where: { id: inv.propertyId },
          data: {
            availableTokens: { decrement: inv.tokensOwned },
            raisedAmount: { increment: inv.amount },
          },
        });

        // Update investment
        const updatedInvestment = await tx.investment.update({
          where: { id: investmentId },
          data: {
            status: InvestmentStatus.CONFIRMED,
            confirmedAt: new Date(),
            paymentId,
          },
          include: {
            property: true,
            user: true,
            payment: true,
          },
        });

        // Create notification
        await tx.notification.create({
          data: {
            userId: inv.userId,
            type: 'INVESTMENT_CONFIRMED',
            title: 'Investment Confirmed!',
            message: `Your investment of $${inv.amount.toFixed(2)} in ${inv.property.title} has been confirmed. You now own ${inv.tokensOwned} tokens.`,
            actionUrl: `/dashboard/investments/${investmentId}`,
          },
        });

        // Log usage
        await tx.usageLog.create({
          data: {
            userId: inv.userId,
            action: 'investment_confirmed',
            metadata: {
              investmentId,
              propertyId: inv.propertyId,
              amount: inv.amount.toNumber(),
            },
          },
        });

        logger.info('Investment confirmed', {
          investmentId,
          paymentId,
          amount: inv.amount.toNumber(),
        });

        return updatedInvestment;
      });

      return investment;
    } catch (error) {
      logger.error('Error confirming investment', { error, investmentId, paymentId });
      throw error;
    }
  }

  /**
   * Get user investments
   */
  async getUserInvestments(userId: string): Promise<any[]> {
    try {
      const investments = await prisma.investment.findMany({
        where: { userId },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              country: true,
              propertyType: true,
              images: true,
              expectedReturn: true,
              rentalYield: true,
              status: true,
            },
          },
          payment: {
            select: {
              amount: true,
              currency: true,
              method: true,
              status: true,
              completedAt: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info(`Retrieved ${investments.length} investments for user ${userId}`);

      return investments;
    } catch (error) {
      logger.error('Error getting user investments', { error, userId });
      throw error;
    }
  }

  /**
   * Get investment by ID
   */
  async getInvestmentById(id: string, userId?: string): Promise<any> {
    try {
      const investment = await prisma.investment.findUnique({
        where: { id },
        include: {
          property: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              firstName: true,
              lastName: true,
            },
          },
          payment: true,
          contract: {
            select: {
              id: true,
              title: true,
              status: true,
              pdfUrl: true,
              createdAt: true,
            },
          },
        },
      });

      if (!investment) {
        throw new NotFoundError('Investment');
      }

      // If userId provided, verify ownership
      if (userId && investment.userId !== userId) {
        throw new AppError('Not authorized to view this investment', 403);
      }

      logger.info('Retrieved investment', { id, userId });

      return investment;
    } catch (error) {
      logger.error('Error getting investment by ID', { error, id });
      throw error;
    }
  }

  /**
   * Get investment statistics for a user
   */
  async getUserInvestmentStats(userId: string): Promise<any> {
    try {
      const investments = await prisma.investment.findMany({
        where: {
          userId,
          status: InvestmentStatus.CONFIRMED,
        },
        include: {
          property: {
            select: {
              expectedReturn: true,
              rentalYield: true,
            },
          },
        },
      });

      const totalInvested = investments.reduce(
        (sum, inv) => sum + inv.amount.toNumber(),
        0
      );

      const totalTokens = investments.reduce((sum, inv) => sum + inv.tokensOwned, 0);

      const totalProperties = new Set(investments.map((inv) => inv.propertyId)).size;

      // Calculate weighted average expected return
      const weightedReturn = investments.reduce(
        (sum, inv) => sum + inv.amount.toNumber() * inv.property.expectedReturn.toNumber(),
        0
      ) / (totalInvested || 1);

      // Calculate estimated annual returns
      const estimatedAnnualReturn = totalInvested * (weightedReturn / 100);

      return {
        totalInvestments: investments.length,
        totalInvested,
        totalTokens,
        totalProperties,
        averageInvestment: investments.length > 0 ? totalInvested / investments.length : 0,
        weightedAverageReturn: parseFloat(weightedReturn.toFixed(2)),
        estimatedAnnualReturn: parseFloat(estimatedAnnualReturn.toFixed(2)),
        estimatedMonthlyReturn: parseFloat((estimatedAnnualReturn / 12).toFixed(2)),
      };
    } catch (error) {
      logger.error('Error getting user investment stats', { error, userId });
      throw error;
    }
  }

  /**
   * Cancel pending investment
   */
  async cancelInvestment(investmentId: string, userId: string): Promise<any> {
    try {
      const investment = await prisma.investment.findUnique({
        where: { id: investmentId },
      });

      if (!investment) {
        throw new NotFoundError('Investment');
      }

      if (investment.userId !== userId) {
        throw new AppError('Not authorized to cancel this investment', 403);
      }

      if (investment.status !== InvestmentStatus.PENDING) {
        throw new ValidationError('Can only cancel pending investments');
      }

      const cancelledInvestment = await prisma.investment.update({
        where: { id: investmentId },
        data: {
          status: InvestmentStatus.CANCELLED,
        },
      });

      logger.info('Investment cancelled', { investmentId, userId });

      return cancelledInvestment;
    } catch (error) {
      logger.error('Error cancelling investment', { error, investmentId, userId });
      throw error;
    }
  }
}

export default new InvestmentService();

