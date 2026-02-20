
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    common: {
      // Navigation
      dashboard: "Dashboard",
      home: "Home",
      features: "Features",
      pricing: "Pricing",
      contact: "Contact",
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      
      // General
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      download: "Download",
      upload: "Upload",
      back: "Back",
      next: "Next",
      previous: "Previous",
      
      // Document actions
      signDocument: "Sign Document",
      uploadDocument: "Upload Document",
      createDocument: "Create Document",
      viewDocument: "View Document",
      documentSigned: "Document Signed",
      documentPending: "Pending Signature",
      documentRejected: "Rejected",
      documentExpired: "Expired",
      
      // Wallet
      connectWallet: "Connect Wallet",
      disconnectWallet: "Disconnect Wallet",
      walletConnected: "Wallet Connected",
      walletNotConnected: "Wallet Not Connected",
      
      // Plans
      free: "Free",
      starter: "Starter", 
      professional: "Professional",
      upgrade: "Upgrade",
      currentPlan: "Current Plan",
      choosePlan: "Choose Plan",
      
      // Time
      today: "Today",
      yesterday: "Yesterday",
      thisWeek: "This Week",
      thisMonth: "This Month",
      
      // Status
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      completed: "Completed",
      failed: "Failed"
    },
    home: {
      title: "The Future of Digital Signatures",
      subtitle: "Secure, decentralized document signing powered by blockchain technology and IPFS storage",
      getStartedFree: "Get Started Free",
      learnMore: "Learn More",
      trustedBy: "Trusted by",
      
      // Features section
      featuresTitle: "Why Choose QuantPay Chain?",
      featuresSubtitle: "Advanced Web3 technology meets enterprise-grade security",
      
      feature1Title: "Blockchain-Secured Signing",
      feature1Desc: "Every signature is cryptographically verified and recorded on the blockchain for immutable proof",
      
      feature2Title: "IPFS Decentralized Storage",
      feature2Desc: "Documents stored across decentralized network ensuring permanent accessibility and censorship resistance",
      
      feature3Title: "MetaMask Integration", 
      feature3Desc: "Seamless Web3 authentication with your favorite crypto wallet - no passwords needed",
      
      feature4Title: "Smart Contract Verification",
      feature4Desc: "Automated verification through smart contracts ensures document integrity and authenticity",
      
      feature5Title: "Multi-Signature Workflows",
      feature5Desc: "Complex approval processes with multiple signers and conditional logic built right in",
      
      feature6Title: "Enterprise Security",
      feature6Desc: "Bank-grade security with end-to-end encryption and compliance ready features",
      
      // Pricing section
      pricingTitle: "Simple, Transparent Pricing",
      pricingSubtitle: "Start free and scale as you grow",
      
      freeFeatures: ["3 documents/month", "Basic blockchain verification", "IPFS storage", "Email support"],
      starterFeatures: ["50 documents/month", "Advanced verification", "Custom templates", "Priority support", "API access"],
      proFeatures: ["500 documents/month", "White-label solution", "Advanced analytics", "24/7 support", "Custom integrations"]
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome back",
      recentDocuments: "Recent Documents",
      pendingSignatures: "Pending Signatures", 
      usage: "Usage",
      settings: "Settings",
      
      // Stats
      totalDocuments: "Total Documents",
      documentsThisMonth: "This Month",
      pendingCount: "Pending",
      completedCount: "Completed",
      
      // Document upload
      uploadTitle: "Upload New Document",
      uploadSubtitle: "Drag and drop or click to select files",
      uploadButton: "Upload Document",
      uploadSuccess: "Document uploaded successfully",
      uploadError: "Failed to upload document",
      
      // Document list
      noDocuments: "No documents found",
      createFirstDocument: "Create your first document",
      documentTitle: "Document Title",
      status: "Status",
      createdAt: "Created",
      signers: "Signers",
      actions: "Actions",
      
      // Usage tracking
      documentsUsed: "Documents Used",
      documentsRemaining: "Remaining",
      planLimitReached: "Plan limit reached",
      upgradePrompt: "Upgrade your plan to continue",
      
      // Freemium limits
      freeDocumentsRemaining: "{{count}} free documents remaining this month",
      upgradeToUnlock: "Upgrade to unlock unlimited documents"
    },
    auth: {
      signInTitle: "Sign In to Your Account",
      signUpTitle: "Create Your Account", 
      signInSubtitle: "Welcome back! Please sign in to continue",
      signUpSubtitle: "Join QuantPay Chain and start signing documents securely",
      
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      
      signInButton: "Sign In",
      signUpButton: "Sign Up",
      signInWithWallet: "Sign in with MetaMask",
      
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      
      signInError: "Failed to sign in",
      signUpError: "Failed to create account",
      signUpSuccess: "Account created successfully"
    }
  },
  es: {
    common: {
      // Navegación
      dashboard: "Panel",
      home: "Inicio",
      features: "Características",
      pricing: "Precios",
      contact: "Contacto",
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
      signOut: "Cerrar Sesión",
      
      // General
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      view: "Ver",
      download: "Descargar",
      upload: "Subir",
      back: "Volver",
      next: "Siguiente",
      previous: "Anterior",
      
      // Acciones de documento
      signDocument: "Firmar Documento",
      uploadDocument: "Subir Documento",
      createDocument: "Crear Documento",
      viewDocument: "Ver Documento",
      documentSigned: "Documento Firmado",
      documentPending: "Firma Pendiente",
      documentRejected: "Rechazado",
      documentExpired: "Expirado",
      
      // Cartera
      connectWallet: "Conectar Cartera",
      disconnectWallet: "Desconectar Cartera",
      walletConnected: "Cartera Conectada",
      walletNotConnected: "Cartera No Conectada",
      
      // Planes
      free: "Gratuito",
      starter: "Básico", 
      professional: "Profesional",
      upgrade: "Actualizar",
      currentPlan: "Plan Actual",
      choosePlan: "Elegir Plan",
      
      // Tiempo
      today: "Hoy",
      yesterday: "Ayer",
      thisWeek: "Esta Semana",
      thisMonth: "Este Mes",
      
      // Estado
      active: "Activo",
      inactive: "Inactivo",
      pending: "Pendiente",
      completed: "Completado",
      failed: "Fallido"
    },
    home: {
      title: "El Futuro de las Firmas Digitales",
      subtitle: "Firma de documentos segura y descentralizada impulsada por tecnología blockchain y almacenamiento IPFS",
      getStartedFree: "Comenzar Gratis",
      learnMore: "Saber Más",
      trustedBy: "Confiado por",
      
      // Sección de características
      featuresTitle: "¿Por qué Elegir QuantPay Chain?",
      featuresSubtitle: "Tecnología Web3 avanzada se encuentra con seguridad de nivel empresarial",
      
      feature1Title: "Firma Asegurada por Blockchain",
      feature1Desc: "Cada firma es verificada criptográficamente y registrada en blockchain para prueba inmutable",
      
      feature2Title: "Almacenamiento Descentralizado IPFS",
      feature2Desc: "Documentos almacenados en red descentralizada asegurando accesibilidad permanente y resistencia a censura",
      
      feature3Title: "Integración MetaMask", 
      feature3Desc: "Autenticación Web3 fluida con tu cartera crypto favorita - no se necesitan contraseñas",
      
      feature4Title: "Verificación por Contrato Inteligente",
      feature4Desc: "Verificación automatizada a través de contratos inteligentes asegura integridad y autenticidad del documento",
      
      feature5Title: "Flujos Multi-Firma",
      feature5Desc: "Procesos de aprobación complejos con múltiples firmantes y lógica condicional incorporada",
      
      feature6Title: "Seguridad Empresarial",
      feature6Desc: "Seguridad de nivel bancario con cifrado de extremo a extremo y características listas para cumplimiento",
      
      // Sección de precios
      pricingTitle: "Precios Simples y Transparentes",
      pricingSubtitle: "Comienza gratis y escala mientras creces",
      
      freeFeatures: ["3 documentos/mes", "Verificación blockchain básica", "Almacenamiento IPFS", "Soporte por email"],
      starterFeatures: ["50 documentos/mes", "Verificación avanzada", "Plantillas personalizadas", "Soporte prioritario", "Acceso API"],
      proFeatures: ["500 documentos/mes", "Solución marca blanca", "Análisis avanzado", "Soporte 24/7", "Integraciones personalizadas"]
    },
    dashboard: {
      title: "Panel",
      welcome: "Bienvenido de nuevo",
      recentDocuments: "Documentos Recientes",
      pendingSignatures: "Firmas Pendientes",
      usage: "Uso",
      settings: "Configuraciones",
      
      // Estadísticas
      totalDocuments: "Total de Documentos",
      documentsThisMonth: "Este Mes",
      pendingCount: "Pendientes",
      completedCount: "Completados",
      
      // Subida de documento
      uploadTitle: "Subir Nuevo Documento",
      uploadSubtitle: "Arrastra y suelta o haz clic para seleccionar archivos",
      uploadButton: "Subir Documento",
      uploadSuccess: "Documento subido exitosamente",
      uploadError: "Error al subir documento",
      
      // Lista de documentos
      noDocuments: "No se encontraron documentos",
      createFirstDocument: "Crea tu primer documento",
      documentTitle: "Título del Documento",
      status: "Estado",
      createdAt: "Creado",
      signers: "Firmantes",
      actions: "Acciones",
      
      // Seguimiento de uso
      documentsUsed: "Documentos Usados",
      documentsRemaining: "Restantes",
      planLimitReached: "Límite del plan alcanzado",
      upgradePrompt: "Actualiza tu plan para continuar",
      
      // Límites freemium
      freeDocumentsRemaining: "{{count}} documentos gratuitos restantes este mes",
      upgradeToUnlock: "Actualizar para desbloquear documentos ilimitados"
    },
    auth: {
      signInTitle: "Iniciar Sesión en Tu Cuenta",
      signUpTitle: "Crear Tu Cuenta", 
      signInSubtitle: "¡Bienvenido de nuevo! Por favor inicia sesión para continuar",
      signUpSubtitle: "Únete a QuantPay Chain y comienza a firmar documentos de forma segura",
      
      email: "Email",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      firstName: "Nombre",
      lastName: "Apellido",
      
      signInButton: "Iniciar Sesión",
      signUpButton: "Registrarse",
      signInWithWallet: "Iniciar sesión con MetaMask",
      
      noAccount: "¿No tienes cuenta?",
      hasAccount: "¿Ya tienes cuenta?",
      
      signInError: "Error al iniciar sesión",
      signUpError: "Error al crear cuenta",
      signUpSuccess: "Cuenta creada exitosamente"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', // Idioma inicial por defecto
    debug: false,
    
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
