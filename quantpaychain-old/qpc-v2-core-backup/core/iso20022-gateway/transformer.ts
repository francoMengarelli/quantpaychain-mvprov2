
/**
 * ISO 20022 Message Transformer
 * Transforms between ISO 20022 format and internal application format
 */

import { v4 as uuidv4 } from 'uuid';
import {
  ParsedMessage,
  PAIN001Message,
  PACS008Message,
  CAMT053Message,
  ISO20022MessageType,
  TransformationOptions,
} from './types';
import { ISO20022TransformationError } from './errors';

/**
 * Internal payment format used by the application
 */
export interface InternalPayment {
  id: string;
  type: 'credit_transfer' | 'debit_transfer' | 'statement';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  currency: string;
  sender: {
    name: string;
    accountId: string;
    bankId?: string;
  };
  receiver: {
    name: string;
    accountId: string;
    bankId?: string;
  };
  description?: string;
  reference?: string;
  executionDate?: string;
  createdAt: string;
  metadata: {
    messageId: string;
    messageType: string;
    originalFormat: 'iso20022';
  };
}

export class ISO20022Transformer {
  /**
   * Transform ISO 20022 message to internal format
   * @param message - Parsed ISO 20022 message
   * @param options - Transformation options
   * @returns Array of internal payment objects
   */
  public toInternal(
    message: ParsedMessage,
    options: TransformationOptions = {}
  ): InternalPayment[] {
    switch (message.messageType) {
      case ISO20022MessageType.PAIN_001:
        return this.pain001ToInternal(message.data as PAIN001Message, message, options);
      case ISO20022MessageType.PACS_008:
        return this.pacs008ToInternal(message.data as PACS008Message, message, options);
      case ISO20022MessageType.CAMT_053:
        return this.camt053ToInternal(message.data as CAMT053Message, message, options);
      default:
        throw new ISO20022TransformationError(
          `Unsupported message type for transformation: ${message.messageType}`
        );
    }
  }

  /**
   * Transform internal format to ISO 20022 XML
   * @param payments - Array of internal payment objects
   * @param messageType - Target ISO 20022 message type
   * @param options - Transformation options
   * @returns ISO 20022 XML string
   */
  public toISO20022(
    payments: InternalPayment[],
    messageType: ISO20022MessageType = ISO20022MessageType.PAIN_001,
    options: TransformationOptions = {}
  ): string {
    switch (messageType) {
      case ISO20022MessageType.PAIN_001:
        return this.internalToPAIN001(payments, options);
      case ISO20022MessageType.PACS_008:
        return this.internalToPACS008(payments[0], options);
      default:
        throw new ISO20022TransformationError(
          `Unsupported message type for transformation: ${messageType}`
        );
    }
  }

  /**
   * Transform PAIN.001 to internal format
   */
  private pain001ToInternal(
    message: PAIN001Message,
    parsedMessage: ParsedMessage,
    options: TransformationOptions
  ): InternalPayment[] {
    const payments: InternalPayment[] = [];

    for (const pmtInf of message.paymentInstructions) {
      for (const tx of pmtInf.creditTransactions) {
        payments.push({
          id: uuidv4(),
          type: 'credit_transfer',
          status: 'pending',
          amount: tx.amount.value,
          currency: tx.amount.currency,
          sender: {
            name: pmtInf.debtor.name,
            accountId: pmtInf.debtorAccount.identification,
            bankId: pmtInf.debtorAgent?.bic,
          },
          receiver: {
            name: tx.creditor.name,
            accountId: tx.creditorAccount.identification,
            bankId: tx.creditorAgent?.bic,
          },
          description: tx.remittanceInformation?.unstructured?.[0],
          reference: tx.paymentId,
          executionDate: pmtInf.requestedExecutionDate,
          createdAt: message.header.creationDateTime,
          metadata: {
            messageId: message.header.messageId,
            messageType: parsedMessage.messageType,
            originalFormat: 'iso20022',
          },
        });
      }
    }

    return payments;
  }

  /**
   * Transform PACS.008 to internal format
   */
  private pacs008ToInternal(
    message: PACS008Message,
    parsedMessage: ParsedMessage,
    options: TransformationOptions
  ): InternalPayment[] {
    const tx = message.transactionInformation;
    
    return [
      {
        id: uuidv4(),
        type: 'credit_transfer',
        status: 'processing',
        amount: tx.amount.value,
        currency: tx.amount.currency,
        sender: {
          name: '', // Not available in PACS.008
          accountId: '',
          bankId: '',
        },
        receiver: {
          name: tx.creditor.name,
          accountId: tx.creditorAccount.identification,
          bankId: tx.creditorAgent?.bic,
        },
        description: tx.remittanceInformation?.unstructured?.[0],
        reference: tx.paymentId,
        createdAt: message.header.creationDateTime,
        metadata: {
          messageId: message.header.messageId,
          messageType: parsedMessage.messageType,
          originalFormat: 'iso20022',
        },
      },
    ];
  }

  /**
   * Transform CAMT.053 to internal format
   */
  private camt053ToInternal(
    message: CAMT053Message,
    parsedMessage: ParsedMessage,
    options: TransformationOptions
  ): InternalPayment[] {
    const payments: InternalPayment[] = [];

    for (const entry of message.statement.entries) {
      payments.push({
        id: uuidv4(),
        type: entry.creditDebitIndicator === 'CRDT' ? 'credit_transfer' : 'debit_transfer',
        status: 'completed',
        amount: entry.amount.value,
        currency: entry.amount.currency,
        sender: {
          name: '',
          accountId: entry.creditDebitIndicator === 'DBIT' ? message.statement.accountId : '',
        },
        receiver: {
          name: '',
          accountId: entry.creditDebitIndicator === 'CRDT' ? message.statement.accountId : '',
        },
        description: entry.additionalEntryInformation,
        reference: entry.entryReference,
        executionDate: entry.valueDate || entry.bookingDate,
        createdAt: message.header.creationDateTime,
        metadata: {
          messageId: message.header.messageId,
          messageType: parsedMessage.messageType,
          originalFormat: 'iso20022',
        },
      });
    }

    return payments;
  }

  /**
   * Transform internal format to PAIN.001 XML
   */
  private internalToPAIN001(
    payments: InternalPayment[],
    options: TransformationOptions
  ): string {
    const messageId = uuidv4();
    const creationDateTime = new Date().toISOString();
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    // Build XML (simplified version)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>${messageId}</MsgId>
      <CreDtTm>${creationDateTime}</CreDtTm>
      <NbOfTxs>${payments.length}</NbOfTxs>
      <CtrlSum>${totalAmount.toFixed(2)}</CtrlSum>
      <InitgPty>
        <Nm>${payments[0]?.sender.name || 'Unknown'}</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-${uuidv4()}</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <NbOfTxs>${payments.length}</NbOfTxs>
      <CtrlSum>${totalAmount.toFixed(2)}</CtrlSum>
      <ReqdExctnDt>${payments[0]?.executionDate || new Date().toISOString().split('T')[0]}</ReqdExctnDt>
      <Dbtr>
        <Nm>${payments[0]?.sender.name}</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>${payments[0]?.sender.accountId}</IBAN>
        </Id>
      </DbtrAcct>
      ${payments.map((p, idx) => `
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>${p.reference || `TXN-${idx + 1}`}</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="${p.currency}">${p.amount.toFixed(2)}</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>${p.receiver.name}</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>${p.receiver.accountId}</IBAN>
          </Id>
        </CdtrAcct>
        ${p.description ? `<RmtInf><Ustrd>${p.description}</Ustrd></RmtInf>` : ''}
      </CdtTrfTxInf>`).join('')}
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

    return xml;
  }

  /**
   * Transform internal format to PACS.008 XML
   */
  private internalToPACS008(
    payment: InternalPayment,
    options: TransformationOptions
  ): string {
    const messageId = uuidv4();
    const creationDateTime = new Date().toISOString();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.02">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${messageId}</MsgId>
      <CreDtTm>${creationDateTime}</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <EndToEndId>${payment.reference || uuidv4()}</EndToEndId>
      </PmtId>
      <InstdAmt Ccy="${payment.currency}">${payment.amount.toFixed(2)}</InstdAmt>
      <Cdtr>
        <Nm>${payment.receiver.name}</Nm>
      </Cdtr>
      <CdtrAcct>
        <Id>
          <IBAN>${payment.receiver.accountId}</IBAN>
        </Id>
      </CdtrAcct>
      ${payment.description ? `<RmtInf><Ustrd>${payment.description}</Ustrd></RmtInf>` : ''}
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`;

    return xml;
  }
}
