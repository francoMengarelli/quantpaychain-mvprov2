
/**
 * Integration tests for ISO 20022 Gateway workflow
 */

import { ISO20022Gateway } from '../../core/iso20022-gateway';
import { ISO20022MessageType } from '../../core/iso20022-gateway/types';

describe('ISO20022Gateway Integration', () => {
  let gateway: ISO20022Gateway;

  beforeEach(() => {
    gateway = new ISO20022Gateway();
  });

  describe('End-to-end message processing', () => {
    it('should parse, validate, and transform a pain.001 message', async () => {
      const xmlMessage = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG-2024-001</MsgId>
      <CreDtTm>2024-01-15T14:30:00Z</CreDtTm>
      <NbOfTxs>2</NbOfTxs>
      <CtrlSum>15000.00</CtrlSum>
      <InitgPty>
        <Nm>ABC Corporation</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-2024-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>2024-01-16</ReqdExctnDt>
      <Dbtr>
        <Nm>ABC Corporation</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>DE89370400440532013000</IBAN>
        </Id>
      </DbtrAcct>
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>TXN-001</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="EUR">10000.00</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>Supplier One Ltd</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>FR1420041010050500013M02606</IBAN>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>Invoice 2024-001</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>TXN-002</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="EUR">5000.00</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>Supplier Two GmbH</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>IT60X0542811101000000123456</IBAN>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>Invoice 2024-002</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

      // Process message
      const result = await gateway.process(xmlMessage, true);

      // Verify parsing
      expect(result.parsed.messageType).toBe(ISO20022MessageType.PAIN_001);
      expect(result.parsed.data).toHaveProperty('header');
      expect(result.parsed.data).toHaveProperty('paymentInstructions');

      // Verify validation
      expect(result.validation).toBeDefined();
      expect(result.validation?.isValid).toBe(true);

      // Verify transformation
      expect(result.payments).toHaveLength(2);
      expect(result.payments[0].amount).toBe(10000);
      expect(result.payments[1].amount).toBe(5000);
      expect(result.payments[0].currency).toBe('EUR');
    });

    it('should roundtrip: internal -> ISO20022 -> internal', async () => {
      const originalPayments = [
        {
          id: 'PAY-001',
          type: 'credit_transfer' as const,
          status: 'pending' as const,
          amount: 1000,
          currency: 'USD',
          sender: {
            name: 'John Doe',
            accountId: 'US1234567890',
          },
          receiver: {
            name: 'Jane Smith',
            accountId: 'US0987654321',
          },
          description: 'Test payment',
          createdAt: new Date().toISOString(),
          metadata: {
            messageId: 'MSG-TEST',
            messageType: 'test',
            originalFormat: 'internal' as const,
          },
        },
      ];

      // Convert to ISO 20022
      const iso20022Xml = gateway.toISO20022(originalPayments);
      expect(iso20022Xml).toContain('<?xml version');
      expect(iso20022Xml).toContain('CstmrCdtTrfInitn');

      // Parse back
      const parsed = gateway.parse(iso20022Xml);
      const paymentsBack = gateway.toInternal(parsed);

      // Verify roundtrip
      expect(paymentsBack[0].amount).toBe(originalPayments[0].amount);
      expect(paymentsBack[0].currency).toBe(originalPayments[0].currency);
    });
  });
});
