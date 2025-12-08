import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PQCLayer } from '../../.../packages/qpc-core/core/pqc-layer';
import { ISO20022Gateway } from '../../../packages/qpc-core/core/iso20022-gateway';
import { AIKYCAMLEngine } from '../../../packages/qpc-core/core/ai-kyc-aml';
import { createLogger, format, transports } from 'winston';

const app = express();
const PORT = process.env.QPC_SERVICE_PORT || 3001;

// Logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize QPC Core modules
const pqcLayer = new PQCLayer();
const iso20022Gateway = new ISO20022Gateway();
const kycAmlEngine = new AIKYCAMLEngine();

logger.info('QPC Core modules initialized');

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    service: 'qpc-service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ========== PQC Endpoints ==========

app.post('/pqc/generate-keypair', async (req: Request, res: Response) => {
  try {
    const { algorithm, keyType, purpose } = req.body;
    logger.info('Generating PQC keypair', { algorithm, keyType, purpose });
    
    const keyPair = await pqcLayer.generateKeyPair(algorithm, keyType, purpose);
    
    res.json({
      success: true,
      data: keyPair
    });
  } catch (error: any) {
    logger.error('PQC keypair generation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/pqc/sign', async (req: Request, res: Response) => {
  try {
    const { message, keyPair } = req.body;
    logger.info('Signing message with PQC');
    
    const signature = await pqcLayer.sign(message, keyPair);
    
    res.json({
      success: true,
      data: signature
    });
  } catch (error: any) {
    logger.error('PQC signing failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/pqc/verify', async (req: Request, res: Response) => {
  try {
    const { message, signatureResult } = req.body;
    logger.info('Verifying PQC signature');
    
    const verification = await pqcLayer.verify(message, signatureResult);
    
    res.json({
      success: true,
      data: verification
    });
  } catch (error: any) {
    logger.error('PQC verification failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/pqc/encrypt', async (req: Request, res: Response) => {
  try {
    const { plaintext, recipientPublicKey } = req.body;
    logger.info('Encrypting data with PQC');
    
    // Convert base64 to Uint8Array if needed
    const publicKeyBytes = Buffer.from(recipientPublicKey, 'base64');
    const result = await pqcLayer.encrypt(plaintext, publicKeyBytes);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    logger.error('PQC encryption failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== ISO 20022 Endpoints ==========

app.post('/iso20022/parse', async (req: Request, res: Response) => {
  try {
    const { xmlString } = req.body;
    logger.info('Parsing ISO 20022 message');
    
    const parsed = iso20022Gateway.parse(xmlString);
    
    res.json({
      success: true,
      data: parsed
    });
  } catch (error: any) {
    logger.error('ISO 20022 parsing failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/iso20022/validate', async (req: Request, res: Response) => {
  try {
    const { parsedMessage } = req.body;
    logger.info('Validating ISO 20022 message');
    
    const validation = iso20022Gateway.validate(parsedMessage);
    
    res.json({
      success: true,
      data: validation
    });
  } catch (error: any) {
    logger.error('ISO 20022 validation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/iso20022/to-internal', async (req: Request, res: Response) => {
  try {
    const { parsedMessage, options } = req.body;
    logger.info('Transforming ISO 20022 to internal format');
    
    const internal = iso20022Gateway.toInternal(parsedMessage, options);
    
    res.json({
      success: true,
      data: internal
    });
  } catch (error: any) {
    logger.error('ISO 20022 transformation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/iso20022/to-iso', async (req: Request, res: Response) => {
  try {
    const { payments, messageType, options } = req.body;
    logger.info('Transforming internal to ISO 20022');
    
    const xml = iso20022Gateway.toISO20022(payments, messageType, options);
    
    res.json({
      success: true,
      data: { xml }
    });
  } catch (error: any) {
    logger.error('ISO 20022 generation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/iso20022/process', async (req: Request, res: Response) => {
  try {
    const { xmlString, validateMessage, transformOptions } = req.body;
    logger.info('Processing ISO 20022 message end-to-end');
    
    const result = await iso20022Gateway.process(
      xmlString,
      validateMessage !== false,
      transformOptions
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    logger.error('ISO 20022 processing failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== KYC/AML Endpoints ==========

app.post('/kyc-aml/compliance-check', async (req: Request, res: Response) => {
  try {
    const { transaction, customer, transactionHistory } = req.body;
    logger.info('Performing compliance check', { transactionId: transaction.id });
    
    const assessment = await kycAmlEngine.performComplianceCheck(
      transaction,
      customer,
      transactionHistory
    );
    
    res.json({
      success: true,
      data: assessment
    });
  } catch (error: any) {
    logger.error('Compliance check failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/kyc-aml/verify-document', async (req: Request, res: Response) => {
  try {
    const { request, customer } = req.body;
    logger.info('Verifying document', { customerId: request.customerId });
    
    const result = await kycAmlEngine.verifyDocument(request, customer);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    logger.error('Document verification failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/kyc-aml/generate-report', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;
    logger.info('Generating compliance report', { startDate, endDate });
    
    const report = kycAmlEngine.generateComplianceReport(startDate, endDate);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error: any) {
    logger.error('Report generation failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/kyc-aml/summary', (req: Request, res: Response) => {
  try {
    logger.info('Getting compliance summary');
    
    const summary = kycAmlEngine.getComplianceSummary();
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    logger.error('Summary retrieval failed', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 QPC Service running on port ${PORT}`);
  logger.info('Available endpoints:');
  logger.info('  - POST /pqc/generate-keypair');
  logger.info('  - POST /pqc/sign');
  logger.info('  - POST /pqc/verify');
  logger.info('  - POST /pqc/encrypt');
  logger.info('  - POST /iso20022/parse');
  logger.info('  - POST /iso20022/validate');
  logger.info('  - POST /iso20022/to-internal');
  logger.info('  - POST /iso20022/to-iso');
  logger.info('  - POST /iso20022/process');
  logger.info('  - POST /kyc-aml/compliance-check');
  logger.info('  - POST /kyc-aml/verify-document');
  logger.info('  - POST /kyc-aml/generate-report');
  logger.info('  - GET  /kyc-aml/summary');
});

export default app;
