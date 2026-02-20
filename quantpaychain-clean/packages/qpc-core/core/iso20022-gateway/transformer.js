"use strict";
/**
 * ISO 20022 Message Transformer
 * Transforms between ISO 20022 format and internal application format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISO20022Transformer = void 0;
const uuid_1 = require("uuid");
const types_1 = require("./types");
const errors_1 = require("./errors");
class ISO20022Transformer {
    /**
     * Transform ISO 20022 message to internal format
     * @param message - Parsed ISO 20022 message
     * @param options - Transformation options
     * @returns Array of internal payment objects
     */
    toInternal(message, options = {}) {
        switch (message.messageType) {
            case types_1.ISO20022MessageType.PAIN_001:
                return this.pain001ToInternal(message.data, message, options);
            case types_1.ISO20022MessageType.PACS_008:
                return this.pacs008ToInternal(message.data, message, options);
            case types_1.ISO20022MessageType.CAMT_053:
                return this.camt053ToInternal(message.data, message, options);
            default:
                throw new errors_1.ISO20022TransformationError(`Unsupported message type for transformation: ${message.messageType}`);
        }
    }
    /**
     * Transform internal format to ISO 20022 XML
     * @param payments - Array of internal payment objects
     * @param messageType - Target ISO 20022 message type
     * @param options - Transformation options
     * @returns ISO 20022 XML string
     */
    toISO20022(payments, messageType = types_1.ISO20022MessageType.PAIN_001, options = {}) {
        switch (messageType) {
            case types_1.ISO20022MessageType.PAIN_001:
                return this.internalToPAIN001(payments, options);
            case types_1.ISO20022MessageType.PACS_008:
                return this.internalToPACS008(payments[0], options);
            default:
                throw new errors_1.ISO20022TransformationError(`Unsupported message type for transformation: ${messageType}`);
        }
    }
    /**
     * Transform PAIN.001 to internal format
     */
    pain001ToInternal(message, parsedMessage, options) {
        const payments = [];
        for (const pmtInf of message.paymentInstructions) {
            for (const tx of pmtInf.creditTransactions) {
                payments.push({
                    id: (0, uuid_1.v4)(),
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
    pacs008ToInternal(message, parsedMessage, options) {
        const tx = message.transactionInformation;
        return [
            {
                id: (0, uuid_1.v4)(),
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
    camt053ToInternal(message, parsedMessage, options) {
        const payments = [];
        for (const entry of message.statement.entries) {
            payments.push({
                id: (0, uuid_1.v4)(),
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
    internalToPAIN001(payments, options) {
        const messageId = (0, uuid_1.v4)();
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
      <PmtInfId>PMT-${(0, uuid_1.v4)()}</PmtInfId>
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
    internalToPACS008(payment, options) {
        const messageId = (0, uuid_1.v4)();
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
        <EndToEndId>${payment.reference || (0, uuid_1.v4)()}</EndToEndId>
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
exports.ISO20022Transformer = ISO20022Transformer;
