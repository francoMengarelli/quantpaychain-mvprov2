
// ContractService - Contract generation and management

import { ContractType, ContractStatus } from '@prisma/client';
import prisma from '../utils/db';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import PQCService from './PQCService';

export class ContractService {
  /**
   * Generate contract for investment
   */
  async generateInvestmentContract(data: {
    investmentId: string;
    userId: string;
    propertyId: string;
  }): Promise<any> {
    try {
      // Get investment, property, and user details
      const investment = await prisma.investment.findUnique({
        where: { id: data.investmentId },
        include: {
          property: true,
          user: true,
          payment: true,
        },
      });

      if (!investment) {
        throw new NotFoundError('Investment');
      }

      if (investment.userId !== data.userId) {
        throw new ValidationError('Investment does not belong to user');
      }

      // Check if contract already exists
      const existingContract = await prisma.contract.findFirst({
        where: {
          userId: data.userId,
          propertyId: data.propertyId,
          investment: {
            id: data.investmentId,
          },
        },
      });

      if (existingContract) {
        logger.info('Contract already exists', { contractId: existingContract.id });
        return existingContract;
      }

      // Generate contract content
      const contractContent = this.generateContractHTML(investment);

      // Create contract
      const contract = await prisma.contract.create({
        data: {
          userId: data.userId,
          propertyId: data.propertyId,
          title: `Investment Agreement - ${investment.property.title}`,
          description: `Fractional ownership agreement for ${investment.tokensOwned} tokens`,
          type: ContractType.INVESTMENT_AGREEMENT,
          status: ContractStatus.DRAFT,
          content: contractContent,
          jurisdiction: investment.property.country,
          governingLaw: `Laws of ${investment.property.country}`,
          effectiveDate: new Date(),
        },
      });

      // Link contract to investment
      await prisma.investment.update({
        where: { id: data.investmentId },
        data: {
          contractId: contract.id,
        },
      });

      // Generate PQC signature (simulated)
      const pqcSignature = await PQCService.signContract(contract.id, contractContent);

      // Update contract with signature
      const signedContract = await prisma.contract.update({
        where: { id: contract.id },
        data: {
          pqcSignature: pqcSignature.signature,
          pqcPublicKey: pqcSignature.publicKey,
          pqcAlgorithm: pqcSignature.algorithm,
          status: ContractStatus.SIGNED,
          signedAt: new Date(),
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: data.userId,
          type: 'CONTRACT_READY',
          title: 'Contract Ready',
          message: `Your investment contract for ${investment.property.title} is ready to download.`,
          actionUrl: `/dashboard/contracts/${contract.id}`,
        },
      });

      logger.info('Contract generated', {
        contractId: contract.id,
        investmentId: data.investmentId,
      });

      return signedContract;
    } catch (error) {
      logger.error('Error generating contract', { error, data });
      throw error;
    }
  }

  /**
   * Generate contract HTML content
   */
  private generateContractHTML(investment: any): string {
    const property = investment.property;
    const user = investment.user;
    const payment = investment.payment;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Investment Agreement</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
          }
          h1 {
            color: #1a1a1a;
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          h2 {
            color: #2c3e50;
            font-size: 18px;
            margin-top: 30px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .parties {
            margin: 30px 0;
            background: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #3498db;
          }
          .terms {
            margin: 20px 0;
          }
          .term {
            margin: 15px 0;
            padding-left: 20px;
          }
          .signatures {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
          }
          .signature-block {
            width: 45%;
          }
          .signature-line {
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 10px;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .important {
            background: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Fractional Property Investment Agreement</h1>
          <p><strong>Contract ID:</strong> ${investment.id}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="parties">
          <h2>Parties</h2>
          <p><strong>Investor ("Buyer"):</strong></p>
          <p>${user.firstName} ${user.lastName || ''}<br>
          Email: ${user.email}<br>
          User ID: ${user.id}</p>

          <p style="margin-top: 20px;"><strong>Property Owner ("Seller"):</strong></p>
          <p>QuantPay Chain Platform<br>
          Property Token Issuer<br>
          Jurisdiction: ${property.country}</p>
        </div>

        <h2>Property Details</h2>
        <table>
          <tr>
            <th>Property</th>
            <td>${property.title}</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>${property.address}, ${property.city}, ${property.state}, ${property.country}</td>
          </tr>
          <tr>
            <th>Property Type</th>
            <td>${property.propertyType}</td>
          </tr>
          <tr>
            <th>Total Property Value</th>
            <td>$${property.totalValue.toLocaleString()}</td>
          </tr>
        </table>

        <h2>Investment Details</h2>
        <table>
          <tr>
            <th>Investment Amount</th>
            <td>$${investment.amount.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Tokens Purchased</th>
            <td>${investment.tokensOwned} tokens</td>
          </tr>
          <tr>
            <th>Ownership Percentage</th>
            <td>${investment.ownership.toFixed(4)}%</td>
          </tr>
          <tr>
            <th>Token Price</th>
            <td>$${property.tokenPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <th>Expected Annual Return</th>
            <td>${property.expectedReturn}%</td>
          </tr>
          <tr>
            <th>Investment Period</th>
            <td>${property.investmentPeriod} months</td>
          </tr>
          <tr>
            <th>Payment Method</th>
            <td>${payment?.method || 'N/A'}</td>
          </tr>
          <tr>
            <th>Payment Status</th>
            <td>${payment?.status || 'N/A'}</td>
          </tr>
        </table>

        <h2>Terms and Conditions</h2>
        
        <div class="term">
          <p><strong>1. Purchase and Sale</strong></p>
          <p>The Buyer agrees to purchase ${investment.tokensOwned} fractional tokens representing ${investment.ownership.toFixed(4)}% ownership interest in the Property for the total consideration of $${investment.amount.toLocaleString()}.</p>
        </div>

        <div class="term">
          <p><strong>2. Ownership Rights</strong></p>
          <p>The Buyer shall have the following rights:</p>
          <ul>
            <li>Proportional share of rental income and property appreciation</li>
            <li>Voting rights on major property decisions (proportional to ownership)</li>
            <li>Right to transfer tokens subject to platform terms</li>
            <li>Access to property performance reports and financial statements</li>
          </ul>
        </div>

        <div class="term">
          <p><strong>3. Returns and Distributions</strong></p>
          <p>The Buyer is entitled to receive:</p>
          <ul>
            <li>Expected annual return of ${property.expectedReturn}% on investment</li>
            <li>Rental yield of ${property.rentalYield || 0}% distributed quarterly</li>
            <li>Pro-rata share of property appreciation upon sale or exit</li>
          </ul>
        </div>

        <div class="term">
          <p><strong>4. Investment Period</strong></p>
          <p>The minimum investment period is ${property.investmentPeriod} months. Early exits may be subject to fees and market conditions.</p>
        </div>

        <div class="term">
          <p><strong>5. Management and Fees</strong></p>
          <p>The Property is managed by professional property managers. Management fees (2% annual) are deducted from rental income before distribution.</p>
        </div>

        <div class="term">
          <p><strong>6. Blockchain Recording</strong></p>
          <p>This investment is recorded on the blockchain for transparency and security. Transaction hash will be provided upon confirmation.</p>
        </div>

        <div class="term">
          <p><strong>7. Post-Quantum Cryptographic Signature</strong></p>
          <p>This contract is secured with post-quantum cryptographic signatures to ensure long-term security and authenticity.</p>
        </div>

        <div class="important">
          <p><strong>Risk Disclosure:</strong> Real estate investments involve risks including market fluctuations, property damage, vacancy, and liquidity constraints. Past performance does not guarantee future results. Investors should carefully consider their financial situation and consult advisors before investing.</p>
        </div>

        <div class="term">
          <p><strong>8. Governing Law</strong></p>
          <p>This Agreement shall be governed by and construed in accordance with the laws of ${property.country}.</p>
        </div>

        <div class="term">
          <p><strong>9. Entire Agreement</strong></p>
          <p>This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations and agreements.</p>
        </div>

        <div class="signatures">
          <div class="signature-block">
            <p><strong>Buyer</strong></p>
            <div class="signature-line">
              <p>${user.firstName} ${user.lastName || ''}</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
              <p style="font-size: 10px; color: #666;">Electronically signed via QuantPay Chain</p>
            </div>
          </div>

          <div class="signature-block">
            <p><strong>Seller</strong></p>
            <div class="signature-line">
              <p>QuantPay Chain Platform</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
              <p style="font-size: 10px; color: #666;">PQC Signature Applied</p>
            </div>
          </div>
        </div>

        <div class="footer">
          <p><strong>QuantPay Chain</strong> - Post-Quantum Secure Real Estate Tokenization Platform</p>
          <p>Contract generated on ${new Date().toISOString()}</p>
          <p style="margin-top: 10px; font-size: 10px;">
            This is a legally binding agreement. For questions or support, contact legal@quantpaychain.com
          </p>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Get contract by ID
   */
  async getContractById(contractId: string, userId?: string): Promise<any> {
    try {
      const contract = await prisma.contract.findUnique({
        where: { id: contractId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              firstName: true,
              lastName: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              country: true,
              images: true,
            },
          },
          investment: {
            include: {
              payment: true,
            },
          },
          signatures: true,
        },
      });

      if (!contract) {
        throw new NotFoundError('Contract');
      }

      if (userId && contract.userId !== userId) {
        throw new ValidationError('Not authorized to view this contract');
      }

      logger.info('Retrieved contract', { contractId, userId });

      return contract;
    } catch (error) {
      logger.error('Error getting contract', { error, contractId });
      throw error;
    }
  }

  /**
   * Get user contracts
   */
  async getUserContracts(userId: string): Promise<any[]> {
    try {
      const contracts = await prisma.contract.findMany({
        where: { userId },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              images: true,
            },
          },
          investment: {
            select: {
              amount: true,
              tokensOwned: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      logger.info(`Retrieved ${contracts.length} contracts for user ${userId}`);

      return contracts;
    } catch (error) {
      logger.error('Error getting user contracts', { error, userId });
      throw error;
    }
  }

  /**
   * Download contract as PDF (would use puppeteer or similar in production)
   */
  async generateContractPDF(contractId: string): Promise<string> {
    try {
      // This would generate actual PDF using puppeteer or similar
      // For MVP, we return the HTML content as a downloadable PDF link
      const contract = await this.getContractById(contractId);
      
      // In production, use puppeteer to generate PDF:
      // const browser = await puppeteer.launch();
      // const page = await browser.newPage();
      // await page.setContent(contract.content);
      // const pdf = await page.pdf({ format: 'A4' });
      // await browser.close();
      // Upload to S3/storage and return URL

      logger.info('Contract PDF generated (simulated)', { contractId });

      return `/api/contracts/${contractId}/pdf`; // PDF endpoint
    } catch (error) {
      logger.error('Error generating contract PDF', { error, contractId });
      throw error;
    }
  }
}

export default new ContractService();

