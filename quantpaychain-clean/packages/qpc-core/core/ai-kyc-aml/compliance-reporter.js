"use strict";
/**
 * Compliance Reporter
 * Generates compliance reports and statistics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReporter = void 0;
const uuid_1 = require("uuid");
const types_1 = require("./types");
const errors_1 = require("./errors");
class ComplianceReporter {
    constructor() {
        this.assessments = [];
        this.transactions = [];
    }
    /**
     * Record a risk assessment
     * @param assessment - Risk assessment to record
     */
    recordAssessment(assessment) {
        this.assessments.push(assessment);
    }
    /**
     * Record a transaction
     * @param transaction - Transaction to record
     */
    recordTransaction(transaction) {
        this.transactions.push(transaction);
    }
    /**
     * Generate compliance report for a period
     * @param startDate - Start date (ISO string)
     * @param endDate - End date (ISO string)
     * @returns ComplianceReport
     */
    generateReport(startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Filter assessments for the period
            const periodAssessments = this.assessments.filter(a => {
                const assessedDate = new Date(a.assessedAt);
                return assessedDate >= start && assessedDate <= end;
            });
            // Calculate statistics
            const totalTransactions = periodAssessments.length;
            const flaggedTransactions = periodAssessments.filter(a => a.recommendation === types_1.TransactionStatus.FLAGGED ||
                a.recommendation === types_1.TransactionStatus.PENDING_REVIEW).length;
            const approvedTransactions = periodAssessments.filter(a => a.recommendation === types_1.TransactionStatus.APPROVED).length;
            const rejectedTransactions = periodAssessments.filter(a => a.recommendation === types_1.TransactionStatus.REJECTED).length;
            const averageRiskScore = totalTransactions > 0
                ? Math.round(periodAssessments.reduce((sum, a) => sum + a.riskScore, 0) / totalTransactions)
                : 0;
            // Count sanction matches
            const sanctionMatches = periodAssessments.filter(a => a.flags.some(f => f.type === 'sanctions')).length;
            // Aggregate top risk factors
            const factorCounts = {};
            for (const assessment of periodAssessments) {
                for (const factor of assessment.factors) {
                    factorCounts[factor.type] = (factorCounts[factor.type] || 0) + 1;
                }
            }
            const topRiskFactors = Object.entries(factorCounts)
                .map(([factor, count]) => ({ factor, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
            return {
                id: (0, uuid_1.v4)(),
                period: {
                    startDate,
                    endDate,
                },
                statistics: {
                    totalTransactions,
                    flaggedTransactions,
                    approvedTransactions,
                    rejectedTransactions,
                    averageRiskScore,
                },
                topRiskFactors,
                sanctionMatches,
                generatedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            throw new errors_1.ComplianceReportError(`Report generation failed: ${error.message}`);
        }
    }
    /**
     * Get compliance summary
     * @returns Summary statistics
     */
    getComplianceSummary() {
        const totalAssessments = this.assessments.length;
        const highRiskCount = this.assessments.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length;
        const mediumRiskCount = this.assessments.filter(a => a.riskLevel === 'medium').length;
        const lowRiskCount = this.assessments.filter(a => a.riskLevel === 'low').length;
        const averageRiskScore = totalAssessments > 0
            ? Math.round(this.assessments.reduce((sum, a) => sum + a.riskScore, 0) / totalAssessments)
            : 0;
        return {
            totalAssessments,
            highRiskCount,
            mediumRiskCount,
            lowRiskCount,
            averageRiskScore,
        };
    }
    /**
     * Export report as JSON
     * @param report - Report to export
     * @returns JSON string
     */
    exportReportJSON(report) {
        return JSON.stringify(report, null, 2);
    }
    /**
     * Export report as CSV
     * @param report - Report to export
     * @returns CSV string
     */
    exportReportCSV(report) {
        const lines = [];
        // Header
        lines.push('Metric,Value');
        // Statistics
        lines.push(`Total Transactions,${report.statistics.totalTransactions}`);
        lines.push(`Flagged Transactions,${report.statistics.flaggedTransactions}`);
        lines.push(`Approved Transactions,${report.statistics.approvedTransactions}`);
        lines.push(`Rejected Transactions,${report.statistics.rejectedTransactions}`);
        lines.push(`Average Risk Score,${report.statistics.averageRiskScore}`);
        lines.push(`Sanction Matches,${report.sanctionMatches}`);
        lines.push(''); // Empty line
        lines.push('Top Risk Factors');
        lines.push('Factor,Count');
        for (const factor of report.topRiskFactors) {
            lines.push(`${factor.factor},${factor.count}`);
        }
        return lines.join('\n');
    }
    /**
     * Clear recorded data
     */
    clearData() {
        this.assessments = [];
        this.transactions = [];
    }
    /**
     * Get assessment count
     */
    getAssessmentCount() {
        return this.assessments.length;
    }
}
exports.ComplianceReporter = ComplianceReporter;
