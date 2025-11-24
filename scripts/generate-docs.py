#!/usr/bin/env python3
"""
Script to generate technical documentation PDFs for QuantPayChain
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
import os

def create_whitepaper():
    """Generate Platform Whitepaper PDF"""
    output_path = "/app/quantpaychain-clean/apps/web/public/docs/quantpaychain-whitepaper.pdf"
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='purple',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("QuantPayChain Platform", title_style))
    story.append(Paragraph("Technical Whitepaper", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    # Content
    content = [
        ("Executive Summary", """QuantPayChain is a next-generation blockchain platform designed for 
        Real World Asset (RWA) tokenization with post-quantum cryptographic security. The platform 
        enables secure, compliant, and efficient tokenization of physical and financial assets across 
        multiple blockchain networks."""),
        
        ("Technology Stack", """The platform leverages cutting-edge technologies including:
        - Next.js 14 for high-performance frontend
        - FastAPI for scalable backend services
        - Supabase (PostgreSQL) for robust data management
        - Post-quantum cryptography (NIST-approved algorithms)
        - Multi-chain support for interoperability"""),
        
        ("Key Features", """1. Multi-Chain Support: Seamless asset tokenization across multiple blockchains
        2. ISO 20022 Compliance: Full compliance with international financial messaging standards
        3. Post-Quantum Security: Future-proof cryptographic protection
        4. Real-Time Analytics: Advanced AI-powered dashboard and reporting
        5. Payment Integration: Secure payment processing with Stripe"""),
        
        ("Architecture", """The QuantPayChain architecture follows a modern microservices approach 
        with clear separation of concerns. The frontend provides an intuitive user interface, 
        while the backend handles complex tokenization logic, blockchain interactions, and 
        regulatory compliance checks."""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Created: {output_path}")

def create_security_doc():
    """Generate Post-Quantum Security PDF"""
    output_path = "/app/quantpaychain-clean/apps/web/public/docs/post-quantum-security.pdf"
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='blue',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("Post-Quantum Cryptography", title_style))
    story.append(Paragraph("Security Implementation Guide", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    content = [
        ("Overview", """QuantPayChain implements post-quantum cryptography to protect against 
        future quantum computing threats. Our implementation follows NIST-approved algorithms 
        ensuring long-term security for tokenized assets."""),
        
        ("Quantum Threat", """Quantum computers pose a significant threat to current cryptographic 
        systems. Algorithms like RSA and ECC, which secure most blockchain networks today, 
        could be broken by sufficiently powerful quantum computers."""),
        
        ("NIST-Approved Algorithms", """We implement the following NIST-approved post-quantum algorithms:
        - CRYSTALS-Kyber for key encapsulation
        - CRYSTALS-Dilithium for digital signatures
        - SPHINCS+ as backup signature scheme"""),
        
        ("Implementation", """Our post-quantum implementation includes:
        1. Hybrid cryptographic approach combining classical and post-quantum algorithms
        2. Secure key management system
        3. Regular security audits and updates
        4. Backward compatibility with existing systems"""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Created: {output_path}")

def create_iso_doc():
    """Generate ISO 20022 Compliance PDF"""
    output_path = "/app/quantpaychain-clean/apps/web/public/docs/iso20022-compliance.pdf"
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='green',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("ISO 20022 Compliance", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    content = [
        ("Introduction", """ISO 20022 is the international standard for financial messaging. 
        QuantPayChain fully implements this standard to ensure seamless integration with 
        traditional financial systems and regulatory compliance."""),
        
        ("Key Benefits", """1. Standardized messaging format
        2. Enhanced data quality and consistency
        3. Improved interoperability with banks and financial institutions
        4. Regulatory compliance across jurisdictions
        5. Support for complex financial transactions"""),
        
        ("Implementation", """Our platform supports all major ISO 20022 message types including:
        - Payment initiation and clearing
        - Securities settlement
        - Trade services and reporting
        - Account management"""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Created: {output_path}")

def create_api_doc():
    """Generate API Documentation PDF"""
    output_path = "/app/quantpaychain-clean/apps/web/public/docs/api-documentation.pdf"
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='orange',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("QuantPayChain API", title_style))
    story.append(Paragraph("Complete Developer Guide", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    content = [
        ("Getting Started", """The QuantPayChain API provides programmatic access to all 
        platform features. This RESTful API supports JSON format and uses standard HTTP methods."""),
        
        ("Authentication", """All API requests require authentication using JWT tokens. 
        Obtain your API key from the dashboard and include it in the Authorization header:
        Authorization: Bearer YOUR_API_KEY"""),
        
        ("Core Endpoints", """Asset Management:
        - POST /api/assets - Create new asset
        - GET /api/assets - List all assets
        - GET /api/assets/{id} - Get asset details
        
        Token Operations:
        - POST /api/tokens - Create token
        - GET /api/tokens/{id} - Get token info
        
        Transactions:
        - POST /api/transactions - Execute transaction
        - GET /api/transactions/{id} - Get transaction status"""),
        
        ("Rate Limits", """API rate limits are applied per API key:
        - Standard: 100 requests/minute
        - Premium: 1000 requests/minute
        - Enterprise: Custom limits"""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Created: {output_path}")

if __name__ == "__main__":
    # Ensure output directory exists
    os.makedirs("/app/quantpaychain-clean/apps/web/public/docs", exist_ok=True)
    
    print("Generating technical documentation PDFs...")
    create_whitepaper()
    create_security_doc()
    create_iso_doc()
    create_api_doc()
    print("\n✅ All documentation PDFs generated successfully!")
