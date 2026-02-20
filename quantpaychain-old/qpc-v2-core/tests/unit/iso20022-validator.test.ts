
/**
 * Unit tests for ISO 20022 Validator
 */

import { ISO20022Validator } from '../../core/iso20022-gateway/validator';
import { ISO20022Parser } from '../../core/iso20022-gateway/parser';

describe('ISO20022Validator', () => {
  let validator: ISO20022Validator;
  let parser: ISO20022Parser;

  beforeEach(() => {
    validator = new ISO20022Validator();
    parser = new ISO20022Parser();
  });

  describe('validate', () => {
    it('should validate a correct pain.001 message', () => {
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

      const parsed = parser.parse(xmlMessage);
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect control sum mismatch', () => {
      const xmlMessage = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSG123</MsgId>
      <CreDtTm>2024-01-01T10:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>5000.00</CtrlSum>
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

      const parsed = parser.parse(xmlMessage);
      const result = validator.validate(parsed);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'CONTROL_SUM_MISMATCH')).toBe(true);
    });
  });
});
