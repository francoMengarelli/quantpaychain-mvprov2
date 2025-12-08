
/**
 * Unit tests for ISO 20022 Parser
 */

import { ISO20022Parser } from '../../core/iso20022-gateway/parser';
import { ISO20022MessageType } from '../../core/iso20022-gateway/types';

describe('ISO20022Parser', () => {
  let parser: ISO20022Parser;

  beforeEach(() => {
    parser = new ISO20022Parser();
  });

  describe('parse', () => {
    it('should parse a valid pain.001 message', () => {
      const xmlMessage = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG123</MsgId>
      <CreDtTm>2024-01-01T10:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>1000.00</CtrlSum>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT123</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <Dbtr>
        <Nm>John Doe</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>DE89370400440532013000</IBAN>
        </Id>
      </DbtrAcct>
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>TXN123</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="EUR">1000.00</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>Jane Smith</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>FR1420041010050500013M02606</IBAN>
          </Id>
        </CdtrAcct>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

      const result = parser.parse(xmlMessage);

      expect(result.messageType).toBe(ISO20022MessageType.PAIN_001);
      expect(result.data).toHaveProperty('header');
      expect(result.data).toHaveProperty('paymentInstructions');
      expect(result.metadata).toHaveProperty('parsedAt');
    });

    it('should throw error for invalid XML', () => {
      const invalidXml = 'not valid xml';

      expect(() => parser.parse(invalidXml)).toThrow();
    });

    it('should throw error for unknown message type', () => {
      const unknownMessage = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:unknown">
  <UnknownMessage>
    <Data>Test</Data>
  </UnknownMessage>
</Document>`;

      expect(() => parser.parse(unknownMessage)).toThrow();
    });
  });
});
