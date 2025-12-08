
/**
 * ISO 20022 Message Types and Interfaces
 * Defines the structure for various ISO 20022 payment message types
 */

export enum ISO20022MessageType {
  PAIN_001 = 'pain.001', // Customer Credit Transfer Initiation
  PACS_008 = 'pacs.008', // Financial Institution Credit Transfer
  CAMT_053 = 'camt.053', // Bank to Customer Statement
  PAIN_002 = 'pain.002', // Payment Status Report
  CAMT_054 = 'camt.054', // Bank to Customer Debit/Credit Notification
}

export interface ISO20022Header {
  messageId: string;
  creationDateTime: string;
  numberOfTransactions?: string;
  controlSum?: number;
  initiatingParty?: Party;
}

export interface Party {
  name: string;
  identification?: string;
  postalAddress?: PostalAddress;
  contactDetails?: ContactDetails;
}

export interface PostalAddress {
  addressType?: string;
  department?: string;
  subDepartment?: string;
  streetName?: string;
  buildingNumber?: string;
  postCode?: string;
  townName?: string;
  country?: string;
}

export interface ContactDetails {
  name?: string;
  phoneNumber?: string;
  emailAddress?: string;
}

export interface Account {
  identification: string;
  currency?: string;
  name?: string;
}

export interface Amount {
  value: number;
  currency: string;
}

export interface PaymentInstruction {
  paymentInformationId: string;
  paymentMethod: string;
  batchBooking?: boolean;
  numberOfTransactions?: string;
  controlSum?: number;
  requestedExecutionDate?: string;
  debtor: Party;
  debtorAccount: Account;
  debtorAgent?: FinancialInstitution;
  creditTransactions: CreditTransferTransaction[];
}

export interface CreditTransferTransaction {
  paymentId: string;
  amount: Amount;
  creditor: Party;
  creditorAccount: Account;
  creditorAgent?: FinancialInstitution;
  remittanceInformation?: RemittanceInformation;
  purpose?: string;
}

export interface FinancialInstitution {
  bic?: string;
  name?: string;
  postalAddress?: PostalAddress;
  identification?: string;
}

export interface RemittanceInformation {
  unstructured?: string[];
  structured?: StructuredRemittanceInformation;
}

export interface StructuredRemittanceInformation {
  creditorReferenceInformation?: {
    type?: string;
    reference?: string;
  };
}

export interface AccountStatement {
  statementId: string;
  accountId: string;
  statementDate: string;
  openingBalance: Balance;
  closingBalance: Balance;
  entries: StatementEntry[];
}

export interface Balance {
  amount: Amount;
  date: string;
  creditDebitIndicator: 'CRDT' | 'DBIT';
}

export interface StatementEntry {
  entryReference?: string;
  amount: Amount;
  creditDebitIndicator: 'CRDT' | 'DBIT';
  status: string;
  bookingDate: string;
  valueDate?: string;
  bankTransactionCode?: string;
  additionalEntryInformation?: string;
  accountServicerReference?: string;
}

export interface PAIN001Message {
  header: ISO20022Header;
  paymentInstructions: PaymentInstruction[];
}

export interface PACS008Message {
  header: ISO20022Header;
  transactionInformation: CreditTransferTransaction;
  settlementInformation?: {
    settlementMethod: string;
    settlementAccount?: Account;
  };
}

export interface CAMT053Message {
  header: ISO20022Header;
  statement: AccountStatement;
}

export interface ParsedMessage {
  messageType: ISO20022MessageType;
  rawXml: string;
  data: PAIN001Message | PACS008Message | CAMT053Message;
  metadata: {
    parsedAt: string;
    version: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  path?: string;
  severity: 'error';
}

export interface ValidationWarning {
  code: string;
  message: string;
  path?: string;
  severity: 'warning';
}

export interface TransformationOptions {
  includeOptionalFields?: boolean;
  strictMode?: boolean;
  customMappings?: Record<string, string>;
}
