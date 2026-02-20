/**
 * Ejemplos de uso del núcleo QPC v2
 * 
 * Este archivo contiene ejemplos prácticos de cómo usar cada módulo del núcleo.
 */

import {
  parseISO20022Message,
  transformToBlockchain,
  createPain001Message,
  generatePQCKeyPair,
  encryptPQC,
  decryptPQC,
  signPQC,
  verifyPQC,
  performKYCVerification,
  analyzeTransactionAML,
  checkSanctions,
  detectFraud,
} from '@/backend/src/qpc-v2-core';

// ============================================================================
// EJEMPLO 1: Procesar Mensaje ISO 20022
// ============================================================================

export async function example1_ProcessISO20022Message() {
  console.log('\n=== EJEMPLO 1: Procesar Mensaje ISO 20022 ===\n');
  
  // Crear un mensaje pain.001 (Customer Credit Transfer)
  const messageData = {
    numberOfTransactions: 1,
    controlSum: 1000.00,
    initiatingParty: {
      name: 'ABC Corporation',
    },
    paymentInformation: [
      {
        paymentInformationId: 'PMT-001',
        paymentMethod: 'TRF',
      },
    ],
  };
  
  // Crear mensaje XML
  const xml = createPain001Message(messageData);
  console.log('Mensaje XML creado:');
  console.log(xml.substring(0, 200) + '...\n');
  
  // Parsear mensaje
  const message = await parseISO20022Message(xml);
  console.log('Mensaje parseado:');
  console.log('- Tipo:', message.messageType);
  console.log('- ID:', message.messageId);
  console.log('- Fecha:', message.creationDateTime);
  
  // Transformar a formato blockchain
  const transformation = await transformToBlockchain(message);
  console.log('\nTransformación a blockchain:');
  console.log('- Total de transacciones:', transformation.blockchainData.transactions.length);
  console.log('- Metadata:', transformation.metadata);
}

// ============================================================================
// EJEMPLO 2: Encriptación Post-Cuántica
// ============================================================================

export async function example2_PQCEncryption() {
  console.log('\n=== EJEMPLO 2: Encriptación Post-Cuántica ===\n');
  
  // Generar par de claves
  console.log('Generando par de claves PQC...');
  const keyPair = await generatePQCKeyPair('kyber768');
  console.log('- Algoritmo:', keyPair.algorithm);
  console.log('- Tamaño de clave pública:', keyPair.publicKey.length);
  console.log('- Creada:', keyPair.createdAt);
  
  // Datos sensibles
  const sensitiveData = 'Información confidencial de la transacción';
  console.log('\nDatos originales:', sensitiveData);
  
  // Encriptar
  console.log('\nEncriptando...');
  const encrypted = await encryptPQC(sensitiveData, keyPair.publicKey);
  console.log('- Algoritmo:', encrypted.algorithm);
  console.log('- Ciphertext (primeros 50 chars):', encrypted.ciphertext.substring(0, 50) + '...');
  
  // Desencriptar
  console.log('\nDesencriptando...');
  const decrypted = await decryptPQC(encrypted, keyPair.privateKey);
  console.log('- Datos desencriptados:', decrypted.toString('utf-8'));
  console.log('- ✅ Match:', decrypted.toString('utf-8') === sensitiveData);
}

// ============================================================================
// EJEMPLO 3: Firma Digital Post-Cuántica
// ============================================================================

export async function example3_PQCSignature() {
  console.log('\n=== EJEMPLO 3: Firma Digital Post-Cuántica ===\n');
  
  // Generar par de claves para firma
  console.log('Generando par de claves para firma...');
  const keyPair = await generatePQCKeyPair('kyber768'); // En producción usar dilithium
  console.log('- Algoritmo:', keyPair.algorithm);
  
  // Datos a firmar
  const transactionData = {
    from: '0x1234...',
    to: '0x5678...',
    amount: 1000,
    timestamp: new Date().toISOString(),
  };
  
  const data = JSON.stringify(transactionData);
  console.log('\nDatos a firmar:', data);
  
  // Firmar
  console.log('\nFirmando...');
  const signature = await signPQC(data, keyPair.privateKey, 'dilithium3');
  console.log('- Algoritmo:', signature.algorithm);
  console.log('- Hash de datos:', signature.data);
  console.log('- Timestamp:', signature.timestamp);
  
  // Verificar firma
  console.log('\nVerificando firma...');
  signature.publicKey = keyPair.publicKey;
  const verification = await verifyPQC(data, signature, keyPair.publicKey);
  console.log('- ✅ Firma válida:', verification.valid);
  console.log('- Algoritmo:', verification.algorithm);
}

// ============================================================================
// EJEMPLO 4: Verificación KYC Completa
// ============================================================================

export async function example4_KYCVerification() {
  console.log('\n=== EJEMPLO 4: Verificación KYC Completa ===\n');
  
  // Datos del cliente
  const customer = {
    id: 'CUS-001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1985-01-15'),
    nationality: 'US',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
    occupation: 'Software Engineer',
    sourceOfFunds: 'Salary',
  };
  
  console.log('Cliente:', customer.firstName, customer.lastName);
  console.log('ID:', customer.id);
  
  // Realizar verificación KYC
  console.log('\nRealizando verificación KYC...');
  const kycResult = await performKYCVerification(customer);
  
  console.log('\nResultado:');
  console.log('- Status:', kycResult.status);
  console.log('- Risk Score:', kycResult.riskScore, '/100');
  console.log('- Risk Level:', kycResult.riskLevel);
  console.log('- Fecha:', kycResult.verificationDate);
  
  console.log('\nChecks realizados:');
  kycResult.checks.forEach((check, index) => {
    console.log(`  ${index + 1}. ${check.type}: ${check.status} (score: ${check.score})`);
  });
  
  // Verificar sanciones
  console.log('\nVerificando listas de sanciones...');
  const sanctionsResult = await checkSanctions(customer);
  console.log('- Status:', sanctionsResult.status);
  console.log('- Listas verificadas:', sanctionsResult.lists.join(', '));
  console.log('- Matches encontrados:', sanctionsResult.matches.length);
  
  // Detectar fraude
  console.log('\nDetectando posible fraude...');
  const fraudResult = await detectFraud(customer);
  console.log('- Es fraudulento:', fraudResult.isFraudulent);
  console.log('- Fraud Score:', fraudResult.fraudScore, '/100');
  console.log('- Indicadores:', fraudResult.indicators.length);
}

// ============================================================================
// EJEMPLO 5: Análisis AML de Transacciones
// ============================================================================

export async function example5_AMLAnalysis() {
  console.log('\n=== EJEMPLO 5: Análisis AML de Transacciones ===\n');
  
  // Transacción a analizar
  const transaction = {
    id: 'TXN-001',
    customerId: 'CUS-001',
    amount: 15000,
    currency: 'USD',
    type: 'withdrawal' as const,
    timestamp: new Date(),
    counterparty: {
      id: 'PARTY-002',
      name: 'External Company',
      country: 'US',
    },
    description: 'Business payment',
  };
  
  console.log('Transacción:');
  console.log('- ID:', transaction.id);
  console.log('- Monto:', transaction.currency, transaction.amount);
  console.log('- Tipo:', transaction.type);
  
  // Historial del cliente (simulado)
  const customerHistory = [
    {
      id: 'TXN-000',
      customerId: 'CUS-001',
      amount: 5000,
      currency: 'USD',
      type: 'deposit' as const,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'TXN-001-A',
      customerId: 'CUS-001',
      amount: 3000,
      currency: 'USD',
      type: 'transfer' as const,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];
  
  // Analizar transacción
  console.log('\nAnalizando transacción para AML...');
  const amlResult = await analyzeTransactionAML(transaction, customerHistory);
  
  console.log('\nResultado:');
  console.log('- Risk Score:', amlResult.riskScore, '/100');
  console.log('- Risk Level:', amlResult.riskLevel);
  console.log('- Sospechosa:', amlResult.suspicious);
  console.log('- Recomendación:', amlResult.recommendation);
  
  if (amlResult.alerts.length > 0) {
    console.log('\nAlertas generadas:');
    amlResult.alerts.forEach((alert, index) => {
      console.log(`  ${index + 1}. [${alert.severity}] ${alert.type}: ${alert.description}`);
    });
  }
  
  if (amlResult.patterns.length > 0) {
    console.log('\nPatrones detectados:');
    amlResult.patterns.forEach((pattern, index) => {
      console.log(`  ${index + 1}. ${pattern.type}: ${pattern.description}`);
      console.log(`     - Frecuencia: ${pattern.frequency}`);
      console.log(`     - Total: ${pattern.totalAmount}`);
    });
  }
}

// ============================================================================
// EJEMPLO 6: Flujo Completo de Pago Seguro
// ============================================================================

export async function example6_SecurePaymentFlow() {
  console.log('\n=== EJEMPLO 6: Flujo Completo de Pago Seguro ===\n');
  
  // 1. Verificar remitente (KYC)
  console.log('1. Verificando remitente...');
  const sender = {
    id: 'CUS-SENDER',
    firstName: 'Alice',
    lastName: 'Smith',
    dateOfBirth: new Date('1990-05-20'),
    nationality: 'US',
    email: 'alice@example.com',
  };
  
  const senderKYC = await performKYCVerification(sender);
  console.log('   - Status:', senderKYC.status);
  console.log('   - Risk Level:', senderKYC.riskLevel);
  
  if (senderKYC.status === 'rejected') {
    console.log('   ❌ KYC rechazado, no se puede proceder');
    return;
  }
  
  // 2. Crear mensaje ISO 20022
  console.log('\n2. Creando mensaje de pago ISO 20022...');
  const paymentData = {
    numberOfTransactions: 1,
    controlSum: 5000.00,
    initiatingParty: {
      name: `${sender.firstName} ${sender.lastName}`,
    },
    paymentInformation: [
      {
        paymentInformationId: 'PMT-SECURE-001',
        paymentMethod: 'TRF',
      },
    ],
  };
  
  const paymentXml = createPain001Message(paymentData);
  console.log('   ✅ Mensaje creado');
  
  // 3. Encriptar mensaje con PQC
  console.log('\n3. Encriptando mensaje con PQC...');
  const pqcKeys = await generatePQCKeyPair('kyber768');
  const encrypted = await encryptPQC(paymentXml, pqcKeys.publicKey);
  console.log('   ✅ Mensaje encriptado');
  
  // 4. Firmar mensaje
  console.log('\n4. Firmando mensaje...');
  const signature = await signPQC(paymentXml, pqcKeys.privateKey, 'dilithium3');
  console.log('   ✅ Mensaje firmado');
  
  // 5. Análisis AML
  console.log('\n5. Analizando transacción para AML...');
  const transaction = {
    id: 'TXN-SECURE-001',
    customerId: sender.id,
    amount: 5000,
    currency: 'USD',
    type: 'transfer' as const,
    timestamp: new Date(),
  };
  
  const amlResult = await analyzeTransactionAML(transaction);
  console.log('   - Risk Score:', amlResult.riskScore);
  console.log('   - Recomendación:', amlResult.recommendation);
  
  if (amlResult.recommendation === 'reject' || amlResult.recommendation === 'report') {
    console.log('   ❌ Transacción bloqueada por AML');
    return;
  }
  
  // 6. Transformar a blockchain
  console.log('\n6. Transformando a formato blockchain...');
  const message = await parseISO20022Message(paymentXml);
  const transformation = await transformToBlockchain(message);
  console.log('   ✅ Transformación completada');
  console.log('   - Transacciones:', transformation.blockchainData.transactions.length);
  
  console.log('\n✅ Flujo de pago seguro completado exitosamente');
  console.log('\nResumen:');
  console.log('- Remitente verificado: ✅');
  console.log('- Mensaje ISO 20022: ✅');
  console.log('- Encriptación PQC: ✅');
  console.log('- Firma digital: ✅');
  console.log('- Análisis AML: ✅');
  console.log('- Formato blockchain: ✅');
}

// ============================================================================
// EJECUTAR TODOS LOS EJEMPLOS
// ============================================================================

export async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          EJEMPLOS DEL NÚCLEO QPC V2                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  try {
    await example1_ProcessISO20022Message();
    await example2_PQCEncryption();
    await example3_PQCSignature();
    await example4_KYCVerification();
    await example5_AMLAnalysis();
    await example6_SecurePaymentFlow();
    
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║          ✅ TODOS LOS EJEMPLOS COMPLETADOS               ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Error ejecutando ejemplos:', error);
  }
}

// Uncomment to run all examples
// runAllExamples();
