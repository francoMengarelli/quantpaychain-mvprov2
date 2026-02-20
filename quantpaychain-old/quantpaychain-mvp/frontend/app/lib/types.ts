// QuantPay Chain Types

export type DocumentStatus = 'DRAFT' | 'PENDING_SIGNATURES' | 'PARTIAL_SIGNATURES' | 'FULLY_SIGNED' | 'EXPIRED' | 'REVOKED' | 'FAILED'
export type SignatureType = 'SIMPLE' | 'EIP712' | 'MULTISIG'
export type SubscriptionPlan = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE'
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'PAST_DUE'

export interface Document {
  id: string
  title: string
  description?: string
  ipfsHash: string
  documentHash: string
  contractAddress?: string
  blockchainTxHash?: string
  blockNumber?: bigint
  registeredAt?: Date
  mimeType: string
  fileSize: bigint
  originalFilename: string
  status: DocumentStatus
  isMultiSig: boolean
  requiredSignatures: number
  expiresAt?: Date
  creatorId: string
  createdAt: Date
  updatedAt: Date
}

export interface DocumentFormData {
  title: string
  description?: string
  file: File
  signers: string[]
  isMultiSig?: boolean
  requiredSignatures?: number
  expiresAt?: Date
}

export interface DocumentSigner {
  id: string
  documentId: string
  userId?: string
  walletAddress: string
  email?: string
  name?: string
  isRequired: boolean
  order: number
  addedAt: Date
}

export interface DocumentSignature {
  id: string
  documentId: string
  signerId: string
  walletAddress: string
  signature: string
  signatureType: SignatureType
  ipfsHash: string
  blockchainTxHash?: string
  blockNumber?: bigint
  signedAt: Date
  isValid: boolean
  revokedAt?: Date
}

export interface User {
  id: string
  name?: string
  email?: string
  emailVerified?: Date
  image?: string
  walletAddress?: string
  plan: string
  contractsUsed: number
  resetDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  contractsLimit: number
  contractsUsed: number
  resetDate: Date
  startDate: Date
  endDate?: Date
  stripeCustomerId?: string
  stripePriceId?: string
  createdAt: Date
  updatedAt: Date
}

export interface PlanFeatures {
  name: string
  price: number
  period: string
  contractsLimit: number
  features: string[]
  popular?: boolean
  buttonText: string
  stripePriceId?: string
}

export const PLANS: Record<SubscriptionPlan, PlanFeatures> = {
  FREE: {
    name: 'Free',
    price: 0,
    period: '/month',
    contractsLimit: 3,
    features: ['3 documents/month', 'Basic blockchain verification', 'IPFS storage', 'Email support'],
    popular: false,
    buttonText: 'Get Started Free',
  },
  STARTER: {
    name: 'Starter',
    price: 99,
    period: '/month', 
    contractsLimit: 50,
    features: ['50 documents/month', 'Advanced verification', 'Custom templates', 'Priority support', 'API access'],
    popular: true,
    buttonText: 'Start Free Trial',
    stripePriceId: 'price_starter_monthly',
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 299,
    period: '/month',
    contractsLimit: 500, 
    features: ['500 documents/month', 'White-label solution', 'Advanced analytics', '24/7 support', 'Custom integrations', 'SLA guarantee'],
    popular: false,
    buttonText: 'Contact Sales',
    stripePriceId: 'price_professional_monthly',
  },
  BUSINESS: {
    name: 'Business',
    price: 999,
    period: '/month',
    contractsLimit: 2000,
    features: ['2000 documents/month', 'Enterprise features', 'Custom deployment', 'Dedicated support'],
    popular: false,
    buttonText: 'Contact Sales',
    stripePriceId: 'price_business_monthly',
  },
  ENTERPRISE: {
    name: 'Enterprise', 
    price: 0, // Custom pricing
    period: '/custom',
    contractsLimit: -1, // unlimited
    features: ['Unlimited documents', 'Custom everything', 'White-glove onboarding'],
    popular: false,
    buttonText: 'Contact Sales',
  },
}

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface IPFSUploadResult {
  hash: string
  size: number
  timestamp: Date
}

export interface ContractCallResult {
  transactionHash: string
  blockNumber: number
  gasUsed: string
  status: 'success' | 'failed'
}