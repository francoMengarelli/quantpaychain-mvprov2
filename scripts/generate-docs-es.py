#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar documentación técnica en español para QuantPayChain
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

def create_whitepaper():
    """Generar Whitepaper de la Plataforma en PDF"""
    output_path = "/app/quantpaychain-clean/apps/web/public/docs/quantpaychain-whitepaper.pdf"
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    # Título
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='purple',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    story.append(Paragraph("Plataforma QuantPayChain", title_style))
    story.append(Paragraph("Whitepaper Técnico", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    # Contenido
    content = [
        ("Resumen Ejecutivo", """QuantPayChain es una plataforma blockchain de próxima generación diseñada para 
        la tokenización de Activos del Mundo Real (RWA) con seguridad criptográfica post-cuántica. La plataforma 
        permite la tokenización segura, compatible y eficiente de activos físicos y financieros a través de 
        múltiples redes blockchain."""),
        
        ("Pila Tecnológica", """La plataforma aprovecha tecnologías de vanguardia incluyendo:
        - Next.js 14 para frontend de alto rendimiento
        - FastAPI para servicios backend escalables
        - Supabase (PostgreSQL) para gestión robusta de datos
        - Criptografía post-cuántica (algoritmos aprobados por NIST)
        - Soporte multi-cadena para interoperabilidad"""),
        
        ("Características Principales", """1. Soporte Multi-Cadena: Tokenización perfecta de activos a través de múltiples blockchains
        2. Cumplimiento ISO 20022: Cumplimiento total con estándares internacionales de mensajería financiera
        3. Seguridad Post-Cuántica: Protección criptográfica a prueba de futuro
        4. Analítica en Tiempo Real: Panel de control avanzado con IA y reportes
        5. Integración de Pagos: Procesamiento seguro de pagos con Stripe"""),
        
        ("Arquitectura", """La arquitectura de QuantPayChain sigue un enfoque moderno de microservicios 
        con clara separación de responsabilidades. El frontend proporciona una interfaz de usuario intuitiva, 
        mientras que el backend maneja lógica compleja de tokenización, interacciones con blockchain y 
        verificaciones de cumplimiento regulatorio."""),
        
        ("Seguridad", """La seguridad es fundamental en QuantPayChain. Implementamos:
        - Algoritmos criptográficos post-cuánticos aprobados por NIST
        - Auditorías de seguridad regulares
        - Autenticación multi-factor
        - Cifrado de extremo a extremo
        - Almacenamiento seguro de claves privadas"""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Creado: {output_path}")

def create_security_doc():
    """Generar documento de Seguridad Post-Cuántica en PDF"""
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
    
    story.append(Paragraph("Criptografía Post-Cuántica", title_style))
    story.append(Paragraph("Guía de Implementación de Seguridad", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    content = [
        ("Descripción General", """QuantPayChain implementa criptografía post-cuántica para proteger contra 
        futuras amenazas de computación cuántica. Nuestra implementación sigue algoritmos aprobados por NIST 
        asegurando seguridad a largo plazo para activos tokenizados."""),
        
        ("Amenaza Cuántica", """Las computadoras cuánticas representan una amenaza significativa para los sistemas 
        criptográficos actuales. Algoritmos como RSA y ECC, que aseguran la mayoría de las redes blockchain hoy, 
        podrían ser quebrados por computadoras cuánticas suficientemente potentes."""),
        
        ("Algoritmos Aprobados por NIST", """Implementamos los siguientes algoritmos post-cuánticos aprobados por NIST:
        - CRYSTALS-Kyber para encapsulación de claves
        - CRYSTALS-Dilithium para firmas digitales
        - SPHINCS+ como esquema de firma de respaldo"""),
        
        ("Implementación", """Nuestra implementación post-cuántica incluye:
        1. Enfoque criptográfico híbrido combinando algoritmos clásicos y post-cuánticos
        2. Sistema de gestión segura de claves
        3. Auditorías de seguridad y actualizaciones regulares
        4. Compatibilidad retroactiva con sistemas existentes"""),
        
        ("Beneficios", """La seguridad post-cuántica proporciona:
        - Protección contra ataques cuánticos futuros
        - Cumplimiento con estándares de seguridad emergentes
        - Confianza a largo plazo para inversores institucionales
        - Liderazgo en innovación tecnológica"""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Creado: {output_path}")

def create_iso_doc():
    """Generar documento de Cumplimiento ISO 20022 en PDF"""
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
    
    story.append(Paragraph("Cumplimiento ISO 20022", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    content = [
        ("Introducción", """ISO 20022 es el estándar internacional para mensajería financiera. 
        QuantPayChain implementa completamente este estándar para asegurar integración sin problemas con 
        sistemas financieros tradicionales y cumplimiento regulatorio."""),
        
        ("Beneficios Clave", """1. Formato de mensajería estandarizado
        2. Calidad y consistencia de datos mejorada
        3. Interoperabilidad mejorada con bancos e instituciones financieras
        4. Cumplimiento regulatorio a través de jurisdicciones
        5. Soporte para transacciones financieras complejas"""),
        
        ("Implementación", """Nuestra plataforma soporta todos los tipos principales de mensajes ISO 20022 incluyendo:
        - Iniciación y compensación de pagos
        - Liquidación de valores
        - Servicios comerciales y reportes
        - Gestión de cuentas"""),
        
        ("Casos de Uso", """El cumplimiento ISO 20022 permite:
        - Pagos transfronterizos eficientes
        - Integración con sistemas bancarios legacy
        - Reportes regulatorios automatizados
        - Mensajería financiera corporativa
        - Procesos de tesorería empresarial"""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Creado: {output_path}")

def create_api_doc():
    """Generar Documentación de API en PDF"""
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
    
    story.append(Paragraph("API de QuantPayChain", title_style))
    story.append(Paragraph("Guía Completa para Desarrolladores", title_style))
    story.append(Spacer(1, 0.5*inch))
    
    content = [
        ("Primeros Pasos", """La API de QuantPayChain proporciona acceso programático a todas las 
        características de la plataforma. Esta API RESTful soporta formato JSON y usa métodos HTTP estándar."""),
        
        ("Autenticación", """Todas las peticiones API requieren autenticación usando tokens JWT. 
        Obtenga su clave API desde el panel de control e inclúyala en el encabezado de Autorización:
        Authorization: Bearer TU_CLAVE_API"""),
        
        ("Endpoints Principales", """Gestión de Activos:
        - POST /api/assets - Crear nuevo activo
        - GET /api/assets - Listar todos los activos
        - GET /api/assets/{id} - Obtener detalles del activo
        
        Operaciones con Tokens:
        - POST /api/tokens - Crear token
        - GET /api/tokens/{id} - Obtener información del token
        
        Transacciones:
        - POST /api/transactions - Ejecutar transacción
        - GET /api/transactions/{id} - Obtener estado de transacción"""),
        
        ("Límites de Tasa", """Los límites de tasa de API se aplican por clave API:
        - Estándar: 100 peticiones/minuto
        - Premium: 1000 peticiones/minuto
        - Empresarial: Límites personalizados"""),
        
        ("Manejo de Errores", """La API retorna códigos de estado HTTP estándar:
        - 200: Éxito
        - 400: Petición incorrecta
        - 401: No autorizado
        - 404: No encontrado
        - 500: Error del servidor
        
        Los errores incluyen mensajes descriptivos para facilitar la depuración."""),
    ]
    
    for heading, text in content:
        story.append(Paragraph(heading, styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph(text, styles['BodyText']))
        story.append(Spacer(1, 0.3*inch))
    
    doc.build(story)
    print(f"✓ Creado: {output_path}")

if __name__ == "__main__":
    # Asegurar que el directorio de salida existe
    os.makedirs("/app/quantpaychain-clean/apps/web/public/docs", exist_ok=True)
    
    print("Generando documentación técnica en español...")
    create_whitepaper()
    create_security_doc()
    create_iso_doc()
    create_api_doc()
    print("\n✅ Todos los PDFs de documentación generados exitosamente en español!")
