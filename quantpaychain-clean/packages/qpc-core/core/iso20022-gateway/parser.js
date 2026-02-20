"use strict";
/**
 * ISO 20022 XML Parser
 * Parses ISO 20022 XML messages into structured TypeScript objects
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISO20022Parser = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const types_1 = require("./types");
const errors_1 = require("./errors");
class ISO20022Parser {
    constructor() {
        this.xmlParser = new fast_xml_parser_1.XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            textNodeName: '#text',
            parseAttributeValue: true,
            trimValues: true,
        });
    }
    /**
     * Parse an ISO 20022 XML message
     * @param xmlString - The XML string to parse
     * @returns ParsedMessage object
     */
    parse(xmlString) {
        try {
            const parsedXml = this.xmlParser.parse(xmlString);
            const messageType = this.detectMessageType(parsedXml);
            let data;
            switch (messageType) {
                case types_1.ISO20022MessageType.PAIN_001:
                    data = this.parsePAIN001(parsedXml);
                    break;
                case types_1.ISO20022MessageType.PACS_008:
                    data = this.parsePACS008(parsedXml);
                    break;
                case types_1.ISO20022MessageType.CAMT_053:
                    data = this.parseCAMT053(parsedXml);
                    break;
                default:
                    throw new errors_1.ISO20022ParserError(`Unsupported message type: ${messageType}`);
            }
            return {
                messageType,
                rawXml: xmlString,
                data,
                metadata: {
                    parsedAt: new Date().toISOString(),
                    version: '1.0.0',
                },
            };
        }
        catch (error) {
            if (error instanceof errors_1.ISO20022ParserError) {
                throw error;
            }
            throw new errors_1.ISO20022ParserError(`Failed to parse XML: ${error.message}`);
        }
    }
    /**
     * Detect the message type from parsed XML
     */
    detectMessageType(parsedXml) {
        const document = parsedXml.Document || parsedXml.document;
        if (!document) {
            throw new errors_1.ISO20022ParserError('Invalid ISO 20022 message: Missing Document element');
        }
        if (document.CstmrCdtTrfInitn)
            return types_1.ISO20022MessageType.PAIN_001;
        if (document.FIToFICstmrCdtTrf)
            return types_1.ISO20022MessageType.PACS_008;
        if (document.BkToCstmrStmt)
            return types_1.ISO20022MessageType.CAMT_053;
        throw new errors_1.ISO20022ParserError('Unknown ISO 20022 message type');
    }
    /**
     * Parse pain.001 - Customer Credit Transfer Initiation
     */
    parsePAIN001(parsedXml) {
        const doc = parsedXml.Document.CstmrCdtTrfInitn;
        const grpHdr = doc.GrpHdr;
        const header = {
            messageId: grpHdr.MsgId,
            creationDateTime: grpHdr.CreDtTm,
            numberOfTransactions: grpHdr.NbOfTxs,
            controlSum: grpHdr.CtrlSum,
            initiatingParty: grpHdr.InitgPty ? this.parseParty(grpHdr.InitgPty) : undefined,
        };
        const paymentInstructions = [];
        const pmtInfs = Array.isArray(doc.PmtInf) ? doc.PmtInf : [doc.PmtInf];
        for (const pmtInf of pmtInfs) {
            const creditTransactions = [];
            const cdtTrfTxInfs = Array.isArray(pmtInf.CdtTrfTxInf)
                ? pmtInf.CdtTrfTxInf
                : [pmtInf.CdtTrfTxInf];
            for (const tx of cdtTrfTxInfs) {
                creditTransactions.push({
                    paymentId: tx.PmtId?.EndToEndId || tx.PmtId?.InstrId,
                    amount: {
                        value: parseFloat(tx.Amt.InstdAmt['#text'] || tx.Amt.InstdAmt),
                        currency: tx.Amt.InstdAmt['@_Ccy'] || 'USD',
                    },
                    creditor: this.parseParty(tx.Cdtr),
                    creditorAccount: {
                        identification: tx.CdtrAcct.Id.IBAN || tx.CdtrAcct.Id.Othr?.Id,
                        currency: tx.CdtrAcct.Ccy,
                    },
                    creditorAgent: tx.CdtrAgt ? this.parseFinancialInstitution(tx.CdtrAgt.FinInstnId) : undefined,
                    remittanceInformation: tx.RmtInf
                        ? {
                            unstructured: Array.isArray(tx.RmtInf.Ustrd)
                                ? tx.RmtInf.Ustrd
                                : [tx.RmtInf.Ustrd],
                        }
                        : undefined,
                    purpose: tx.Purp?.Cd,
                });
            }
            paymentInstructions.push({
                paymentInformationId: pmtInf.PmtInfId,
                paymentMethod: pmtInf.PmtMtd,
                batchBooking: pmtInf.BtchBookg,
                numberOfTransactions: pmtInf.NbOfTxs,
                controlSum: pmtInf.CtrlSum,
                requestedExecutionDate: pmtInf.ReqdExctnDt,
                debtor: this.parseParty(pmtInf.Dbtr),
                debtorAccount: {
                    identification: pmtInf.DbtrAcct.Id.IBAN || pmtInf.DbtrAcct.Id.Othr?.Id,
                    currency: pmtInf.DbtrAcct.Ccy,
                },
                debtorAgent: pmtInf.DbtrAgt ? this.parseFinancialInstitution(pmtInf.DbtrAgt.FinInstnId) : undefined,
                creditTransactions,
            });
        }
        return {
            header,
            paymentInstructions,
        };
    }
    /**
     * Parse pacs.008 - Financial Institution Credit Transfer
     */
    parsePACS008(parsedXml) {
        const doc = parsedXml.Document.FIToFICstmrCdtTrf;
        const grpHdr = doc.GrpHdr;
        const cdtTrfTxInf = doc.CdtTrfTxInf;
        const header = {
            messageId: grpHdr.MsgId,
            creationDateTime: grpHdr.CreDtTm,
            numberOfTransactions: grpHdr.NbOfTxs,
            settlementInformation: grpHdr.SttlmInf,
        };
        const transactionInformation = {
            paymentId: cdtTrfTxInf.PmtId?.EndToEndId || cdtTrfTxInf.PmtId?.TxId,
            amount: {
                value: parseFloat(cdtTrfTxInf.InstdAmt['#text'] || cdtTrfTxInf.InstdAmt),
                currency: cdtTrfTxInf.InstdAmt['@_Ccy'] || 'USD',
            },
            creditor: this.parseParty(cdtTrfTxInf.Cdtr),
            creditorAccount: {
                identification: cdtTrfTxInf.CdtrAcct.Id.IBAN || cdtTrfTxInf.CdtrAcct.Id.Othr?.Id,
            },
            creditorAgent: cdtTrfTxInf.CdtrAgt
                ? this.parseFinancialInstitution(cdtTrfTxInf.CdtrAgt.FinInstnId)
                : undefined,
            remittanceInformation: cdtTrfTxInf.RmtInf
                ? {
                    unstructured: Array.isArray(cdtTrfTxInf.RmtInf.Ustrd)
                        ? cdtTrfTxInf.RmtInf.Ustrd
                        : [cdtTrfTxInf.RmtInf.Ustrd],
                }
                : undefined,
        };
        return {
            header,
            transactionInformation,
            settlementInformation: doc.SttlmInf
                ? {
                    settlementMethod: doc.SttlmInf.SttlmMtd,
                    settlementAccount: doc.SttlmInf.SttlmAcct
                        ? {
                            identification: doc.SttlmInf.SttlmAcct.Id.IBAN || doc.SttlmInf.SttlmAcct.Id.Othr?.Id,
                        }
                        : undefined,
                }
                : undefined,
        };
    }
    /**
     * Parse camt.053 - Bank to Customer Statement
     */
    parseCAMT053(parsedXml) {
        const doc = parsedXml.Document.BkToCstmrStmt;
        const grpHdr = doc.GrpHdr;
        const stmt = doc.Stmt;
        const header = {
            messageId: grpHdr.MsgId,
            creationDateTime: grpHdr.CreDtTm,
        };
        const entries = [];
        if (stmt.Ntry) {
            const ntries = Array.isArray(stmt.Ntry) ? stmt.Ntry : [stmt.Ntry];
            for (const entry of ntries) {
                entries.push({
                    entryReference: entry.NtryRef,
                    amount: {
                        value: parseFloat(entry.Amt['#text'] || entry.Amt),
                        currency: entry.Amt['@_Ccy'] || 'USD',
                    },
                    creditDebitIndicator: entry.CdtDbtInd,
                    status: entry.Sts,
                    bookingDate: entry.BookgDt?.Dt,
                    valueDate: entry.ValDt?.Dt,
                    bankTransactionCode: entry.BkTxCd?.Prtry?.Cd,
                    additionalEntryInformation: entry.AddtlNtryInf,
                    accountServicerReference: entry.AcctSvcrRef,
                });
            }
        }
        const statement = {
            statementId: stmt.Id,
            accountId: stmt.Acct.Id.IBAN || stmt.Acct.Id.Othr?.Id,
            statementDate: stmt.CreDtTm,
            openingBalance: {
                amount: {
                    value: parseFloat(stmt.Bal[0].Amt['#text'] || stmt.Bal[0].Amt),
                    currency: stmt.Bal[0].Amt['@_Ccy'] || 'USD',
                },
                date: stmt.Bal[0].Dt.Dt,
                creditDebitIndicator: stmt.Bal[0].CdtDbtInd,
            },
            closingBalance: {
                amount: {
                    value: parseFloat(stmt.Bal[1].Amt['#text'] || stmt.Bal[1].Amt),
                    currency: stmt.Bal[1].Amt['@_Ccy'] || 'USD',
                },
                date: stmt.Bal[1].Dt.Dt,
                creditDebitIndicator: stmt.Bal[1].CdtDbtInd,
            },
            entries,
        };
        return {
            header,
            statement,
        };
    }
    /**
     * Parse Party information
     */
    parseParty(partyXml) {
        return {
            name: partyXml.Nm,
            identification: partyXml.Id?.OrgId?.Othr?.Id || partyXml.Id?.PrvtId?.Othr?.Id,
            postalAddress: partyXml.PstlAdr
                ? {
                    addressType: partyXml.PstlAdr.AdrTp,
                    streetName: partyXml.PstlAdr.StrtNm,
                    buildingNumber: partyXml.PstlAdr.BldgNb,
                    postCode: partyXml.PstlAdr.PstCd,
                    townName: partyXml.PstlAdr.TwnNm,
                    country: partyXml.PstlAdr.Ctry,
                }
                : undefined,
        };
    }
    /**
     * Parse Financial Institution information
     */
    parseFinancialInstitution(finInstnXml) {
        return {
            bic: finInstnXml.BIC || finInstnXml.BICFI,
            name: finInstnXml.Nm,
            identification: finInstnXml.ClrSysMmbId?.MmbId,
        };
    }
}
exports.ISO20022Parser = ISO20022Parser;
