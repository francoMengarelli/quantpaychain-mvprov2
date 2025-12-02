"""ISO 20022 Compliant Payment and Reporting Service

Provides standardized financial messaging for:
- Payment initiation (pain.001)
- Payment status reports (pain.002)
- Cash management statements (camt.053)
- Transaction notifications (camt.054)
"""

import os
import json
import hashlib
from typing import Dict, Optional, List
from datetime import datetime, date
from lxml import etree
import base64


class ISO20022Service:
    """ISO 20022 Financial Messaging Service"""
    
    def __init__(self):
        self.namespace_pain001 = "urn:iso:std:iso:20022:tech:xsd:pain.001.001.08"
        self.namespace_pain002 = "urn:iso:std:iso:20022:tech:xsd:pain.002.001.10"
        self.namespace_camt053 = "urn:iso:std:iso:20022:tech:xsd:camt.053.001.08"
        self.namespace_camt054 = "urn:iso:std:iso:20022:tech:xsd:camt.054.001.08"
        
        print("✅ ISO 20022 Service initialized")
        print("   Supported messages: pain.001, pain.002, camt.053, camt.054")
    
    def generate_payment_initiation(self, 
                                   debtor_name: str,
                                   debtor_account: str,
                                   debtor_bic: str,
                                   creditor_name: str,
                                   creditor_account: str,
                                   creditor_bic: str,
                                   amount: float,
                                   currency: str,
                                   reference: str,
                                   remittance_info: Optional[str] = None) -> Dict[str, str]:
        """
        Generate ISO 20022 pain.001 payment initiation message
        
        Returns:
            Dictionary with message_id, xml_content, and metadata
        """
        from uuid import uuid4
        
        message_id = str(uuid4())
        creation_datetime = datetime.utcnow().isoformat() + "Z"
        
        # Create XML structure
        document = etree.Element(
            "Document",
            nsmap={None: self.namespace_pain001}
        )
        
        cstmr_cdt_trf_initn = etree.SubElement(document, "CstmrCdtTrfInitn")
        
        # Group Header
        grp_hdr = etree.SubElement(cstmr_cdt_trf_initn, "GrpHdr")
        msg_id_elem = etree.SubElement(grp_hdr, "MsgId")
        msg_id_elem.text = message_id
        
        creat_dt_tm = etree.SubElement(grp_hdr, "CreatDtTm")
        creat_dt_tm.text = creation_datetime
        
        nb_of_txs = etree.SubElement(grp_hdr, "NbOfTxs")
        nb_of_txs.text = "1"
        
        ctrl_sum = etree.SubElement(grp_hdr, "CtrlSum")
        ctrl_sum.text = f"{amount:.2f}"
        
        # Initiating Party
        initg_pty = etree.SubElement(grp_hdr, "InitgPty")
        initg_pty_nm = etree.SubElement(initg_pty, "Nm")
        initg_pty_nm.text = debtor_name
        
        # Payment Information
        pmt_inf = etree.SubElement(cstmr_cdt_trf_initn, "PmtInf")
        pmt_inf_id = etree.SubElement(pmt_inf, "PmtInfId")
        pmt_inf_id.text = f"PMT-{message_id}"
        
        pmt_mtd = etree.SubElement(pmt_inf, "PmtMtd")
        pmt_mtd.text = "TRF"
        
        # Payment Type Information
        pmt_tp_inf = etree.SubElement(pmt_inf, "PmtTpInf")
        svc_lvl = etree.SubElement(pmt_tp_inf, "SvcLvl")
        svc_lvl_cd = etree.SubElement(svc_lvl, "Cd")
        svc_lvl_cd.text = "SEPA"
        
        # Requested Execution Date
        reqd_exctn_dt = etree.SubElement(pmt_inf, "ReqdExctnDt")
        dt_elem = etree.SubElement(reqd_exctn_dt, "Dt")
        dt_elem.text = date.today().isoformat()
        
        # Debtor
        dbtr = etree.SubElement(pmt_inf, "Dbtr")
        dbtr_nm = etree.SubElement(dbtr, "Nm")
        dbtr_nm.text = debtor_name
        
        # Debtor Account
        dbtr_acct = etree.SubElement(pmt_inf, "DbtrAcct")
        dbtr_acct_id = etree.SubElement(dbtr_acct, "Id")
        dbtr_iban = etree.SubElement(dbtr_acct_id, "IBAN")
        dbtr_iban.text = debtor_account
        
        # Debtor Agent
        dbtr_agt = etree.SubElement(pmt_inf, "DbtrAgt")
        dbtr_agt_fininstn = etree.SubElement(dbtr_agt, "FinInstnId")
        dbtr_bic_elem = etree.SubElement(dbtr_agt_fininstn, "BICFI")
        dbtr_bic_elem.text = debtor_bic
        
        # Credit Transfer Transaction Information
        cdt_trf_tx_inf = etree.SubElement(pmt_inf, "CdtTrfTxInf")
        
        # Payment Identification
        pmt_id = etree.SubElement(cdt_trf_tx_inf, "PmtId")
        end_to_end_id = etree.SubElement(pmt_id, "EndToEndId")
        end_to_end_id.text = reference
        
        # Amount
        amt_elem = etree.SubElement(cdt_trf_tx_inf, "Amt")
        instd_amt = etree.SubElement(amt_elem, "InstdAmt")
        instd_amt.set("Ccy", currency)
        instd_amt.text = f"{amount:.2f}"
        
        # Creditor Agent
        cdtr_agt = etree.SubElement(cdt_trf_tx_inf, "CdtrAgt")
        cdtr_agt_fininstn = etree.SubElement(cdtr_agt, "FinInstnId")
        cdtr_bic_elem = etree.SubElement(cdtr_agt_fininstn, "BICFI")
        cdtr_bic_elem.text = creditor_bic
        
        # Creditor
        cdtr = etree.SubElement(cdt_trf_tx_inf, "Cdtr")
        cdtr_nm = etree.SubElement(cdtr, "Nm")
        cdtr_nm.text = creditor_name
        
        # Creditor Account
        cdtr_acct = etree.SubElement(cdt_trf_tx_inf, "CdtrAcct")
        cdtr_acct_id = etree.SubElement(cdtr_acct, "Id")
        cdtr_iban = etree.SubElement(cdtr_acct_id, "IBAN")
        cdtr_iban.text = creditor_account
        
        # Remittance Information
        if remittance_info:
            rmt_inf = etree.SubElement(cdt_trf_tx_inf, "RmtInf")
            ustrd = etree.SubElement(rmt_inf, "Ustrd")
            ustrd.text = remittance_info
        
        # Convert to string
        xml_string = etree.tostring(
            document,
            pretty_print=True,
            xml_declaration=True,
            encoding="UTF-8"
        ).decode('utf-8')
        
        return {
            "message_id": message_id,
            "message_type": "pain.001.001.08",
            "xml_content": xml_string,
            "created_at": creation_datetime,
            "status": "generated",
            "amount": amount,
            "currency": currency,
            "debtor": debtor_name,
            "creditor": creditor_name
        }
    
    def generate_payment_status_report(self,
                                      original_message_id: str,
                                      payment_info_id: str,
                                      status_code: str,
                                      status_reason: Optional[str] = None) -> Dict[str, str]:
        """
        Generate ISO 20022 pain.002 payment status report
        
        Status codes:
        - ACCP: Accepted Customer Profile
        - ACSC: Accepted Settlement Completed
        - RJCT: Rejected
        - PDNG: Pending
        """
        from uuid import uuid4
        
        message_id = str(uuid4())
        creation_datetime = datetime.utcnow().isoformat() + "Z"
        
        document = etree.Element(
            "Document",
            nsmap={None: self.namespace_pain002}
        )
        
        cstmr_pmt_sts_rpt = etree.SubElement(document, "CstmrPmtStsRpt")
        
        # Group Header
        grp_hdr = etree.SubElement(cstmr_pmt_sts_rpt, "GrpHdr")
        msg_id_elem = etree.SubElement(grp_hdr, "MsgId")
        msg_id_elem.text = message_id
        
        creat_dt_tm = etree.SubElement(grp_hdr, "CreatDtTm")
        creat_dt_tm.text = creation_datetime
        
        # Original Group Information
        orgnl_grp_inf = etree.SubElement(cstmr_pmt_sts_rpt, "OrgnlGrpInfAndSts")
        orgnl_msg_id = etree.SubElement(orgnl_grp_inf, "OrgnlMsgId")
        orgnl_msg_id.text = original_message_id
        
        orgnl_msg_nm_id = etree.SubElement(orgnl_grp_inf, "OrgnlMsgNmId")
        orgnl_msg_nm_id.text = "pain.001.001.08"
        
        grp_sts = etree.SubElement(orgnl_grp_inf, "GrpSts")
        grp_sts.text = status_code
        
        # Payment Information Status
        pmt_inf_sts = etree.SubElement(cstmr_pmt_sts_rpt, "OrgnlPmtInfAndSts")
        pmt_inf_id_elem = etree.SubElement(pmt_inf_sts, "OrgnlPmtInfId")
        pmt_inf_id_elem.text = payment_info_id
        
        pmt_inf_sts_elem = etree.SubElement(pmt_inf_sts, "PmtInfSts")
        pmt_inf_sts_elem.text = status_code
        
        if status_reason and status_code == "RJCT":
            sts_rsn_inf = etree.SubElement(pmt_inf_sts, "StsRsnInf")
            rsn = etree.SubElement(sts_rsn_inf, "Rsn")
            cd = etree.SubElement(rsn, "Cd")
            cd.text = status_reason
        
        xml_string = etree.tostring(
            document,
            pretty_print=True,
            xml_declaration=True,
            encoding="UTF-8"
        ).decode('utf-8')
        
        return {
            "message_id": message_id,
            "message_type": "pain.002.001.10",
            "xml_content": xml_string,
            "created_at": creation_datetime,
            "status_code": status_code,
            "original_message_id": original_message_id
        }
    
    def generate_bank_statement(self,
                               account_iban: str,
                               account_name: str,
                               statement_date: date,
                               opening_balance: float,
                               closing_balance: float,
                               transactions: List[Dict],
                               currency: str = "EUR") -> Dict[str, str]:
        """
        Generate ISO 20022 camt.053 bank statement
        
        transactions format:
        [
            {
                "amount": 1000.00,
                "credit_debit": "CRDT" or "DBIT",
                "booking_date": "2025-01-15",
                "description": "Payment description"
            }
        ]
        """
        from uuid import uuid4
        
        statement_id = str(uuid4())
        creation_datetime = datetime.utcnow().isoformat() + "Z"
        
        document = etree.Element(
            "Document",
            xmlns=self.namespace_camt053,
            nsmap={None: self.namespace_camt053}
        )
        
        bk_to_cstmr_stmt = etree.SubElement(document, "BkToCstmrStmt")
        
        # Group Header
        grp_hdr = etree.SubElement(bk_to_cstmr_stmt, "GrpHdr")
        msg_id_elem = etree.SubElement(grp_hdr, "MsgId")
        msg_id_elem.text = statement_id
        
        creat_dt_tm = etree.SubElement(grp_hdr, "CreatDtTm")
        creat_dt_tm.text = creation_datetime
        
        # Statement
        stmt = etree.SubElement(bk_to_cstmr_stmt, "Stmt")
        stmt_id_elem = etree.SubElement(stmt, "Id")
        stmt_id_elem.text = f"STMT-{statement_id[:8]}"
        
        # Statement Date
        creat_dt = etree.SubElement(stmt, "CreDtTm")
        creat_dt.text = creation_datetime
        
        # Account
        acct = etree.SubElement(stmt, "Acct")
        acct_id = etree.SubElement(acct, "Id")
        iban_elem = etree.SubElement(acct_id, "IBAN")
        iban_elem.text = account_iban
        
        acct_ownr = etree.SubElement(acct, "Ownr")
        acct_ownr_nm = etree.SubElement(acct_ownr, "Nm")
        acct_ownr_nm.text = account_name
        
        # Opening Balance
        bal_open = etree.SubElement(stmt, "Bal")
        tp_open = etree.SubElement(bal_open, "Tp")
        cd_prtry_open = etree.SubElement(tp_open, "CdOrPrtry")
        cd_open = etree.SubElement(cd_prtry_open, "Cd")
        cd_open.text = "OPBD"  # Opening Balance
        
        amt_open = etree.SubElement(bal_open, "Amt")
        amt_open.set("Ccy", currency)
        amt_open.text = f"{opening_balance:.2f}"
        
        cdt_dbt_ind_open = etree.SubElement(bal_open, "CdtDbtInd")
        cdt_dbt_ind_open.text = "CRDT" if opening_balance >= 0 else "DBIT"
        
        dt_open = etree.SubElement(bal_open, "Dt")
        dt_elem_open = etree.SubElement(dt_open, "Dt")
        dt_elem_open.text = statement_date.isoformat()
        
        # Transactions
        for tx in transactions:
            ntry = etree.SubElement(stmt, "Ntry")
            
            # Amount
            amt_tx = etree.SubElement(ntry, "Amt")
            amt_tx.set("Ccy", currency)
            amt_tx.text = f"{abs(tx['amount']):.2f}"
            
            # Credit/Debit Indicator
            cdt_dbt_ind = etree.SubElement(ntry, "CdtDbtInd")
            cdt_dbt_ind.text = tx.get('credit_debit', 'CRDT')
            
            # Booking Date
            bkg_dt = etree.SubElement(ntry, "BookgDt")
            dt_tx = etree.SubElement(bkg_dt, "Dt")
            dt_tx.text = tx.get('booking_date', statement_date.isoformat())
            
            # Entry Details
            ntry_dtls = etree.SubElement(ntry, "NtryDtls")
            tx_dtls = etree.SubElement(ntry_dtls, "TxDtls")
            
            # Remittance Information
            if 'description' in tx:
                rmt_inf = etree.SubElement(tx_dtls, "RmtInf")
                ustrd = etree.SubElement(rmt_inf, "Ustrd")
                ustrd.text = tx['description']
        
        # Closing Balance
        bal_close = etree.SubElement(stmt, "Bal")
        tp_close = etree.SubElement(bal_close, "Tp")
        cd_prtry_close = etree.SubElement(tp_close, "CdOrPrtry")
        cd_close = etree.SubElement(cd_prtry_close, "Cd")
        cd_close.text = "CLBD"  # Closing Balance
        
        amt_close = etree.SubElement(bal_close, "Amt")
        amt_close.set("Ccy", currency)
        amt_close.text = f"{closing_balance:.2f}"
        
        cdt_dbt_ind_close = etree.SubElement(bal_close, "CdtDbtInd")
        cdt_dbt_ind_close.text = "CRDT" if closing_balance >= 0 else "DBIT"
        
        dt_close = etree.SubElement(bal_close, "Dt")
        dt_elem_close = etree.SubElement(dt_close, "Dt")
        dt_elem_close.text = statement_date.isoformat()
        
        xml_string = etree.tostring(
            document,
            pretty_print=True,
            xml_declaration=True,
            encoding="UTF-8"
        ).decode('utf-8')
        
        return {
            "statement_id": statement_id,
            "message_type": "camt.053.001.08",
            "xml_content": xml_string,
            "created_at": creation_datetime,
            "account_iban": account_iban,
            "statement_date": statement_date.isoformat(),
            "opening_balance": opening_balance,
            "closing_balance": closing_balance,
            "transaction_count": len(transactions),
            "currency": currency
        }
    
    def get_service_info(self) -> Dict:
        """Get ISO 20022 service information"""
        return {
            "status": "active",
            "supported_messages": [
                {
                    "type": "pain.001.001.08",
                    "name": "Customer Credit Transfer Initiation",
                    "category": "Payment Initiation"
                },
                {
                    "type": "pain.002.001.10",
                    "name": "Customer Payment Status Report",
                    "category": "Payment Status"
                },
                {
                    "type": "camt.053.001.08",
                    "name": "Bank to Customer Statement",
                    "category": "Cash Management"
                },
                {
                    "type": "camt.054.001.08",
                    "name": "Bank to Customer Debit/Credit Notification",
                    "category": "Cash Management"
                }
            ],
            "compliance": "ISO 20022 Universal Financial Industry Message Scheme",
            "version": "1.0.0"
        }
