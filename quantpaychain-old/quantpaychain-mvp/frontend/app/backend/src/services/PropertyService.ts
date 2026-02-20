
// PropertyService - Business logic for property management

import { PrismaClient, PropertyStatus, PropertyType, Prisma } from '@prisma/client';
import prisma from '../utils/db';
import { PropertyFilters, PaginationParams, PaginatedResponse } from '../types';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export class PropertyService {
  /**
   * Get all properties with optional filtering and pagination
   */
  async getProperties(
    filters?: PropertyFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 20;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.PropertyWhereInput = {};

      if (filters?.propertyType && filters.propertyType.length > 0) {
        where.propertyType = { in: filters.propertyType as PropertyType[] };
      }

      if (filters?.status && filters.status.length > 0) {
        where.status = { in: filters.status as PropertyStatus[] };
      }

      if (filters?.minPrice || filters?.maxPrice) {
        where.totalValue = {};
        if (filters.minPrice) {
          where.totalValue.gte = filters.minPrice;
        }
        if (filters.maxPrice) {
          where.totalValue.lte = filters.maxPrice;
        }
      }

      if (filters?.minReturn) {
        where.expectedReturn = { gte: filters.minReturn };
      }

      if (filters?.city && filters.city.length > 0) {
        where.city = { in: filters.city };
      }

      if (filters?.country && filters.country.length > 0) {
        where.country = { in: filters.country };
      }

      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { address: { contains: filters.search, mode: 'insensitive' } },
          { city: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Get total count
      const total = await prisma.property.count({ where });

      // Get properties
      const properties = await prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: pagination?.sortBy
          ? { [pagination.sortBy]: pagination.sortOrder || 'desc' }
          : { createdAt: 'desc' },
        include: {
          investments: {
            select: {
              amount: true,
              tokensOwned: true,
              status: true,
            },
          },
          _count: {
            select: {
              investments: true,
            },
          },
        },
      });

      // Calculate funding progress
      const propertiesWithProgress = properties.map((property) => ({
        ...property,
        fundingProgress: property.targetAmount.toNumber() > 0
          ? (property.raisedAmount.toNumber() / property.targetAmount.toNumber()) * 100
          : 0,
        investorCount: property._count.investments,
      }));

      logger.info(`Retrieved ${properties.length} properties`, { filters, pagination });

      return {
        items: propertiesWithProgress,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error('Error getting properties', { error, filters });
      throw error;
    }
  }

  /**
   * Get property by ID with detailed information
   */
  async getPropertyById(id: string): Promise<any> {
    try {
      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          investments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  firstName: true,
                  lastName: true,
                },
              },
              payment: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          contracts: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              investments: true,
            },
          },
        },
      });

      if (!property) {
        throw new NotFoundError('Property');
      }

      // Calculate additional metrics
      const fundingProgress = property.targetAmount.toNumber() > 0
        ? (property.raisedAmount.toNumber() / property.targetAmount.toNumber()) * 100
        : 0;

      const confirmedInvestments = property.investments.filter(
        (inv) => inv.status === 'CONFIRMED'
      );

      const totalInvestors = new Set(confirmedInvestments.map((inv) => inv.userId)).size;

      logger.info(`Retrieved property ${id}`);

      return {
        ...property,
        fundingProgress,
        investorCount: totalInvestors,
        metrics: {
          totalInvestments: confirmedInvestments.length,
          averageInvestment: confirmedInvestments.length > 0
            ? confirmedInvestments.reduce((sum, inv) => sum + inv.amount.toNumber(), 0) /
              confirmedInvestments.length
            : 0,
        },
      };
    } catch (error) {
      logger.error('Error getting property by ID', { error, id });
      throw error;
    }
  }

  /**
   * Get featured/trending properties
   */
  async getFeaturedProperties(limit: number = 6): Promise<any[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          status: {
            in: [PropertyStatus.FUNDING, PropertyStatus.ACTIVE],
          },
        },
        take: limit,
        orderBy: [
          { raisedAmount: 'desc' },
          { expectedReturn: 'desc' },
        ],
        include: {
          _count: {
            select: {
              investments: true,
            },
          },
        },
      });

      logger.info(`Retrieved ${properties.length} featured properties`);

      return properties.map((property) => ({
        ...property,
        fundingProgress: property.targetAmount.toNumber() > 0
          ? (property.raisedAmount.toNumber() / property.targetAmount.toNumber()) * 100
          : 0,
        investorCount: property._count.investments,
      }));
    } catch (error) {
      logger.error('Error getting featured properties', { error });
      throw error;
    }
  }

  /**
   * Get property statistics
   */
  async getPropertyStats(propertyId: string): Promise<any> {
    try {
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
          investments: {
            where: { status: 'CONFIRMED' },
          },
        },
      });

      if (!property) {
        throw new NotFoundError('Property');
      }

      const totalInvested = property.investments.reduce(
        (sum, inv) => sum + inv.amount.toNumber(),
        0
      );

      const uniqueInvestors = new Set(property.investments.map((inv) => inv.userId)).size;

      const averageInvestment = property.investments.length > 0
        ? totalInvested / property.investments.length
        : 0;

      return {
        totalValue: property.totalValue.toNumber(),
        totalInvested,
        fundingProgress: property.targetAmount.toNumber() > 0
          ? (totalInvested / property.targetAmount.toNumber()) * 100
          : 0,
        totalInvestors: uniqueInvestors,
        totalInvestments: property.investments.length,
        averageInvestment,
        tokensRemaining: property.availableTokens,
        tokenPrice: property.tokenPrice.toNumber(),
      };
    } catch (error) {
      logger.error('Error getting property stats', { error, propertyId });
      throw error;
    }
  }

  /**
   * Calculate investment projections
   */
  calculateInvestmentProjection(
    property: any,
    investmentAmount: number
  ): any {
    const tokenPrice = property.tokenPrice.toNumber();
    const tokensReceived = Math.floor(investmentAmount / tokenPrice);
    const totalValue = property.totalValue.toNumber();
    const ownershipPercentage = (tokensReceived * tokenPrice) / totalValue * 100;
    const expectedAnnualReturn = property.expectedReturn.toNumber();
    const rentalYield = property.rentalYield?.toNumber() || 0;

    // Calculate projected returns
    const estimatedAnnualReturn = investmentAmount * (expectedAnnualReturn / 100);
    const estimatedMonthlyReturn = estimatedAnnualReturn / 12;
    const rentalIncome = investmentAmount * (rentalYield / 100);

    // Project value over investment period
    const investmentPeriodYears = property.investmentPeriod / 12;
    const compoundedReturn = investmentAmount * Math.pow(
      1 + expectedAnnualReturn / 100,
      investmentPeriodYears
    );

    return {
      investmentAmount,
      tokensReceived,
      ownershipPercentage: parseFloat(ownershipPercentage.toFixed(6)),
      estimatedMonthlyReturn: parseFloat(estimatedMonthlyReturn.toFixed(2)),
      estimatedAnnualReturn: parseFloat(estimatedAnnualReturn.toFixed(2)),
      estimatedRentalIncome: parseFloat(rentalIncome.toFixed(2)),
      projectedValue: parseFloat(compoundedReturn.toFixed(2)),
      totalReturn: parseFloat((compoundedReturn - investmentAmount).toFixed(2)),
      roi: parseFloat(((compoundedReturn - investmentAmount) / investmentAmount * 100).toFixed(2)),
      investmentPeriod: property.investmentPeriod,
    };
  }

  /**
   * Search properties
   */
  async searchProperties(query: string, limit: number = 10): Promise<any[]> {
    try {
      const properties = await prisma.property.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
          ],
          status: {
            in: [PropertyStatus.FUNDING, PropertyStatus.ACTIVE],
          },
        },
        take: limit,
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          propertyType: true,
          totalValue: true,
          expectedReturn: true,
          images: true,
        },
      });

      logger.info(`Search found ${properties.length} properties`, { query });

      return properties;
    } catch (error) {
      logger.error('Error searching properties', { error, query });
      throw error;
    }
  }
}

export default new PropertyService();

