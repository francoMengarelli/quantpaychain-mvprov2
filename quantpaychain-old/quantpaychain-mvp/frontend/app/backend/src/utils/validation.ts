
// Validation utilities using Zod

import { z } from 'zod';

// Investment validation schema
export const investmentSchema = z.object({
  propertyId: z.string().cuid(),
  amount: z.number().positive().min(100),
  paymentMethod: z.enum(['STRIPE', 'CRYPTO_ETH', 'CRYPTO_USDC', 'CRYPTO_DAI', 'CRYPTO_BTC']),
});

// Property filter schema
export const propertyFilterSchema = z.object({
  propertyType: z.array(z.string()).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minReturn: z.number().positive().optional(),
  city: z.array(z.string()).optional(),
  country: z.array(z.string()).optional(),
  status: z.array(z.string()).optional(),
  search: z.string().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Contract generation schema
export const contractGenerationSchema = z.object({
  propertyId: z.string().cuid(),
  investmentId: z.string().cuid(),
  templateId: z.string().optional(),
  customData: z.record(z.string(), z.any()).optional(),
});

// User update schema
export const userUpdateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  image: z.string().url().optional(),
});

// Payment intent creation schema
export const paymentIntentSchema = z.object({
  investmentId: z.string().cuid(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  paymentMethod: z.enum(['STRIPE', 'CRYPTO_ETH', 'CRYPTO_USDC', 'CRYPTO_DAI']),
});

// AI audit request schema
export const aiAuditRequestSchema = z.object({
  contractId: z.string().cuid(),
  analysisType: z.enum(['full', 'quick', 'compliance']).default('full'),
});

// Helper function to validate data
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Validation failed: ${messages}`);
    }
    throw error;
  }
}

