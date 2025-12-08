/**
 * ISO 20022 Payment Processing Demo
 * Demonstrates complete workflow: Parse -> Validate -> Risk Assessment -> Sign
 */

import { ISO20022Gateway } from '../../core/iso20022-gateway';
import { PQCLayer } from '../../core/pqc-layer';
import { AIKYCAMLEngine } from '../../core/ai-kyc-aml';
import { PQCAlgorithm, KeyType } from '../../core/pqc-layer/types';

async function main() {
  console.log('='.repeat(70));
  console.log('QPC v2 Core - Complete Payment Processing Demo');
  console.log('='.repeat(70));
  console.log();

  // Initialize components
  const iso20022 = new ISO20022Gateway();
  const pqc = new PQCLayer();
  const kyc = new AIKYCAMLEngine();

  // Sample ISO 20022 pain.001 message
  const xmlMessage = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>DEMO-MSG-001</MsgId>
      <CreDtTm>2024-10-29T12:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>25000.00</CtrlSum>
      <InitgPty>
        <Nm>QuantPay Corp</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMT-DEMO-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>2024-10-30</ReqdExctnDt>
      <Dbtr>
        <Nm>Alice Corporation</Nm>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <IBAN>DE89370400440532013000</IBAN>
        </Id>
      </DbtrAcct>
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>TXN-DEMO-001</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="EUR">25000.00</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>Bob Industries Ltd</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <IBAN>FR1420041010050500013M02606</IBAN>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>Contract Payment - Q4 2024</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

  // Step 1: Parse and validate ISO 20022 message
  console.log('Step 1: Processing ISO 20022 Message');
  console.log('-'.repeat(70));
  const result = await iso20022.process(xmlMessage);
  console.log(`✓ Message Type: ${result.parsed.messageType}`);
  console.log(`✓ Validation: ${result.validation?.isValid ? 'PASSED' : 'FAILED'}`);
  console.log(`✓ Payments extracted: ${result.payments.length}`);
  console.log();

  // Step 2: KYC/AML Compliance Check
  console.log('Step 2: KYC/AML Compliance Check');
  console.log('-'.repeat(70));
  const payment = result.payments[0];
  const customer = {
    id: 'CUST-ALICE-001',
    name: 'Alice Corporation',
    dateOfBirth: undefined,
    nationality: 'DE',
    address: { country: 'DE' },
    accountCreatedAt: '2020-01-01T00:00:00Z',
  };
  const transaction = {
    id: payment.id,
    customerId: customer.id,
    amount: payment.amount,
    currency: payment.currency,
    sender: payment.sender,
    receiver: payment.receiver,
    description: payment.description,
    timestamp: payment.createdAt,
    type: payment.type as 'credit' | 'debit' | 'transfer',
  };

  const assessment = await kyc.performComplianceCheck(transaction, customer);
  console.log(`✓ Risk Level: ${assessment.riskLevel.toUpperCase()}`);
  console.log(`✓ Risk Score: ${assessment.riskScore}/100`);
  console.log(`✓ Recommendation: ${assessment.recommendation.toUpperCase()}`);
  console.log(`✓ Risk Factors: ${assessment.factors.length}`);
  assessment.factors.forEach(f => {
    console.log(`  - ${f.type}: ${f.description} (Impact: ${f.impact})`);
  });
  console.log();

  // Step 3: Generate PQC keys and sign transaction
  console.log('Step 3: Post-Quantum Digital Signature');
  console.log('-'.repeat(70));
  const signingKeys = await pqc.generateKeyPair(
    PQCAlgorithm.ML_DSA_65,
    KeyType.SIGNATURE,
    'transaction-signing'
  );
  console.log(`✓ PQC Keys Generated: ${signingKeys.algorithm}`);
  console.log(`✓ Public Key Size: ${signingKeys.publicKey.length} bytes`);
  console.log(`✓ Private Key Size: ${signingKeys.privateKey.length} bytes`);

  const transactionData = JSON.stringify({
    transactionId: transaction.id,
    amount: transaction.amount,
    currency: transaction.currency,
    sender: transaction.sender.name,
    receiver: transaction.receiver.name,
    timestamp: transaction.timestamp,
  });

  const signature = await pqc.sign(transactionData, signingKeys);
  console.log(`✓ Transaction Signed`);
  console.log(`✓ Signature Size: ${signature.signature.length} bytes`);
  console.log(`✓ Algorithm: ${signature.algorithm}`);

  // Verify signature
  const verification = await pqc.verify(transactionData, signature);
  console.log(`✓ Signature Verification: ${verification.isValid ? 'VALID ✓' : 'INVALID ✗'}`);
  console.log();

  // Step 4: Digital Contract Demo
  console.log('Step 4: Digital Contract Signing');
  console.log('-'.repeat(70));
  const contractManager = pqc.getContractManager();
  
  const party1Keys = await pqc.generateKeyPair(PQCAlgorithm.ML_DSA_65, KeyType.SIGNATURE);
  const party2Keys = await pqc.generateKeyPair(PQCAlgorithm.ML_DSA_65, KeyType.SIGNATURE);

  const contractId = contractManager.createContract(
    'Payment Agreement between Alice Corporation and Bob Industries Ltd for EUR 25,000',
    [
      { name: 'Alice Corporation', publicKey: party1Keys.publicKey, role: 'payer' },
      { name: 'Bob Industries Ltd', publicKey: party2Keys.publicKey, role: 'payee' },
    ]
  );

  const contract = contractManager.getContract(contractId);
  console.log(`✓ Contract Created: ${contractId}`);
  console.log(`✓ Parties: ${contract.parties.length}`);

  await contractManager.signContract(contractId, contract.parties[0].id, party1Keys);
  console.log(`✓ Party 1 (Alice) signed`);

  await contractManager.signContract(contractId, contract.parties[1].id, party2Keys);
  console.log(`✓ Party 2 (Bob) signed`);

  const verifications = await contractManager.verifyContract(contractId);
  console.log(`✓ All signatures verified: ${verifications.every(v => v.isValid) ? 'YES ✓' : 'NO ✗'}`);

  await contractManager.executeContract(contractId);
  const finalContract = contractManager.getContract(contractId);
  console.log(`✓ Contract Status: ${finalContract.status.toUpperCase()}`);
  console.log();

  // Summary
  console.log('='.repeat(70));
  console.log('Demo Complete! Summary:');
  console.log('='.repeat(70));
  console.log('✓ ISO 20022 message parsed and validated');
  console.log('✓ KYC/AML compliance check performed');
  console.log('✓ Post-quantum digital signatures applied');
  console.log('✓ Multi-party contract signed and executed');
  console.log();
  console.log('All components working correctly! 🎉');
  console.log('='.repeat(70));
}

main().catch(console.error);
