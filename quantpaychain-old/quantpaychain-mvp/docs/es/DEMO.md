
# Guía de Uso de la Demo - QuantPayChain MVP

## Introducción

Esta guía te ayudará a explorar todas las funcionalidades de la demo de QuantPayChain MVP. La demo está diseñada para mostrar las capacidades del sistema sin necesidad de conectar una wallet real o realizar transacciones en blockchain.

## Acceso a la Demo

### URL de Producción
```
https://quantpaychain-mvp.vercel.app
```

### Desarrollo Local
```bash
cd frontend
npm install
npm run dev
# Visitar http://localhost:3000
```

## Características de la Demo

### Modo Simulado
- ✅ No requiere MetaMask
- ✅ No requiere fondos de testnet
- ✅ Transacciones instantáneas simuladas
- ✅ Datos de ejemplo precargados
- ✅ Totalmente funcional para demostración

## Navegación Principal

### 1. Página de Inicio (Home)

#### Secciones Principales
- **Hero Section**: Introducción al proyecto
- **Características**: Tarjetas con funcionalidades clave
- **Estadísticas**: Métricas del sistema
- **Call to Action**: Botones para explorar

#### Elementos Interactivos
```
┌─────────────────────────────────────┐
│  QuantPayChain MVP                  │
│  Pagos Descentralizados + PQC       │
│                                      │
│  [Explorar Demo] [Ver Documentación]│
└─────────────────────────────────────┘
```

### 2. Dashboard

#### Vista General
El dashboard muestra un resumen de la actividad del usuario:

```
┌──────────────────────────────────────────┐
│  Dashboard                                │
├──────────────────────────────────────────┤
│  Balance: 1000 QPC                       │
│  Pagos Activos: 3                        │
│  Disputas: 1                             │
│                                           │
│  [Crear Pago] [Ver Historial]           │
└──────────────────────────────────────────┘
```

#### Métricas Disponibles
- **Balance Total**: Tokens QPC disponibles
- **Pagos Pendientes**: Pagos en escrow
- **Pagos Completados**: Historial de transacciones
- **Disputas Activas**: Casos en resolución

### 3. Crear Pago

#### Formulario de Pago
```
┌──────────────────────────────────────────┐
│  Crear Nuevo Pago                        │
├──────────────────────────────────────────┤
│  Receptor: [0x742d35Cc6634C0532925a3b8] │
│  Monto: [100] QPC                        │
│  Descripción: [Pago por servicios]      │
│                                           │
│  [Crear Pago]                            │
└──────────────────────────────────────────┘
```

#### Pasos para Crear un Pago
1. **Ingresar Dirección del Receptor**
   - Formato: Dirección Ethereum válida (0x...)
   - Validación automática de formato

2. **Especificar Monto**
   - Mínimo: 1 QPC
   - Máximo: Balance disponible
   - Validación en tiempo real

3. **Agregar Descripción**
   - Opcional pero recomendado
   - Máximo 200 caracteres
   - Ayuda en el tracking

4. **Confirmar Transacción**
   - Revisar detalles
   - Click en "Crear Pago"
   - Confirmación instantánea en modo demo

#### Resultado
```
✅ Pago creado exitosamente
ID: #12345
Estado: PENDING
Fondos bloqueados en escrow
```

### 4. Gestión de Pagos

#### Lista de Pagos
```
┌──────────────────────────────────────────────────────┐
│  Mis Pagos                                            │
├──────────────────────────────────────────────────────┤
│  #12345 | 100 QPC | PENDING    | [Completar] [Disputar]│
│  #12344 | 50 QPC  | COMPLETED  | [Ver Detalles]       │
│  #12343 | 75 QPC  | DISPUTED   | [Ver Disputa]        │
└──────────────────────────────────────────────────────┘
```

#### Acciones Disponibles

##### Completar Pago
- **Quién**: Solo el pagador
- **Cuándo**: Estado PENDING
- **Efecto**: Libera fondos al receptor
- **Simulación**: Instantánea

##### Solicitar Reembolso
- **Quién**: Solo el receptor
- **Cuándo**: Estado PENDING
- **Efecto**: Devuelve fondos al pagador
- **Simulación**: Instantánea

##### Iniciar Disputa
- **Quién**: Pagador o receptor
- **Cuándo**: Estado PENDING
- **Efecto**: Bloquea pago y abre caso
- **Simulación**: Crea disputa simulada

### 5. Sistema de Disputas

#### Vista de Disputa
```
┌──────────────────────────────────────────────────────┐
│  Disputa #001                                         │
├──────────────────────────────────────────────────────┤
│  Pago: #12345                                         │
│  Iniciador: 0x742d... (Pagador)                      │
│  Razón: Servicio no entregado                        │
│  Estado: VOTING                                       │
│                                                        │
│  Votos a favor del pagador: 3                        │
│  Votos a favor del receptor: 1                       │
│                                                        │
│  [Enviar Evidencia] [Ver Historial]                 │
└──────────────────────────────────────────────────────┘
```

#### Proceso de Resolución

##### 1. Apertura de Disputa
```
Pagador/Receptor → Iniciar Disputa
                 ↓
          Proporcionar Razón
                 ↓
          Estado: OPEN
```

##### 2. Presentación de Evidencias
```
Partes Involucradas → Enviar Evidencia
                    ↓
              Documentos/Enlaces
                    ↓
              Visible para Árbitros
```

##### 3. Votación
```
Árbitros → Revisar Evidencias
         ↓
    Emitir Voto
         ↓
    Estado: VOTING
```

##### 4. Resolución
```
Sistema → Contar Votos
        ↓
   Determinar Ganador
        ↓
   Liberar/Reembolsar Fondos
        ↓
   Estado: RESOLVED
```

### 6. Gobernanza

#### Crear Propuesta
```
┌──────────────────────────────────────────────────────┐
│  Nueva Propuesta                                      │
├──────────────────────────────────────────────────────┤
│  Título: [Reducir fee de transacción]               │
│  Descripción:                                         │
│  [Propongo reducir el fee del 2% al 1.5%            │
│   para incentivar más transacciones...]              │
│                                                        │
│  Acciones:                                            │
│  - Contrato: PaymentProcessor                        │
│  - Función: setFeePercentage                         │
│  - Parámetros: 150 (1.5%)                           │
│                                                        │
│  [Crear Propuesta]                                   │
└──────────────────────────────────────────────────────┘
```

#### Votar en Propuestas
```
┌──────────────────────────────────────────────────────┐
│  Propuesta #005                                       │
├──────────────────────────────────────────────────────┤
│  Reducir fee de transacción                          │
│  Propuesto por: 0x742d...                           │
│  Estado: ACTIVE                                       │
│                                                        │
│  Votos a favor: 1,250,000 QPC (62%)                 │
│  Votos en contra: 750,000 QPC (38%)                 │
│                                                        │
│  Tu poder de voto: 10,000 QPC                        │
│                                                        │
│  [Votar A Favor] [Votar En Contra]                  │
└──────────────────────────────────────────────────────┘
```

## Internacionalización

### Cambio de Idioma

#### Selector de Idioma
```
┌─────────────────┐
│  🌐 ES ▼        │
├─────────────────┤
│  ✓ Español      │
│    English      │
└─────────────────┘
```

#### Idiomas Disponibles
- **Español (ES)**: Idioma por defecto
- **English (EN)**: Traducción completa

#### Persistencia
- Preferencia guardada en localStorage
- Se mantiene entre sesiones
- Cambio instantáneo sin recarga

## Características Avanzadas

### 1. Búsqueda y Filtros

#### Filtrar Pagos
```
┌──────────────────────────────────────────┐
│  Filtros                                  │
├──────────────────────────────────────────┤
│  Estado: [Todos ▼]                       │
│  Fecha: [Último mes ▼]                   │
│  Monto: [Cualquiera ▼]                   │
│                                           │
│  [Aplicar] [Limpiar]                     │
└──────────────────────────────────────────┘
```

#### Búsqueda
```
┌──────────────────────────────────────────┐
│  🔍 Buscar por ID, dirección o descripción│
└──────────────────────────────────────────┘
```

### 2. Notificaciones

#### Tipos de Notificaciones
- ✅ **Éxito**: Operación completada
- ℹ️ **Info**: Información general
- ⚠️ **Advertencia**: Acción requiere atención
- ❌ **Error**: Operación fallida

#### Ejemplo
```
┌──────────────────────────────────────────┐
│  ✅ Pago completado exitosamente         │
│  ID: #12345 | Monto: 100 QPC            │
│  [Ver Detalles] [✕]                     │
└──────────────────────────────────────────┘
```

### 3. Historial de Transacciones

#### Vista de Historial
```
┌──────────────────────────────────────────────────────┐
│  Historial de Transacciones                          │
├──────────────────────────────────────────────────────┤
│  Fecha       | Tipo      | Monto  | Estado           │
├──────────────────────────────────────────────────────┤
│  09/10/2025  | Pago      | 100    | Completado       │
│  08/10/2025  | Reembolso | 50     | Completado       │
│  07/10/2025  | Pago      | 75     | Disputado        │
└──────────────────────────────────────────────────────┘
```

#### Exportar Datos
```
[Exportar CSV] [Exportar PDF]
```

## Responsive Design

### Vistas por Dispositivo

#### Desktop (>1024px)
- Layout de 3 columnas
- Sidebar de navegación
- Gráficos expandidos

#### Tablet (768px - 1024px)
- Layout de 2 columnas
- Menú hamburguesa
- Gráficos adaptados

#### Mobile (<768px)
- Layout de 1 columna
- Navegación bottom bar
- Gráficos simplificados

## Datos de Ejemplo

### Usuarios Simulados
```javascript
const demoUsers = [
  {
    address: "0x742d35Cc6634C0532925a3b844BC454e4438f44e",
    name: "Alice",
    balance: 1000
  },
  {
    address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    name: "Bob",
    balance: 500
  }
];
```

### Pagos Precargados
```javascript
const demoPagos = [
  {
    id: 12345,
    payer: "0x742d...",
    payee: "0x5B38...",
    amount: 100,
    status: "PENDING",
    description: "Pago por servicios"
  }
];
```

## Troubleshooting

### Problemas Comunes

#### La demo no carga
```
Solución:
1. Verificar conexión a internet
2. Limpiar caché del navegador
3. Probar en modo incógnito
4. Verificar que JavaScript esté habilitado
```

#### Cambio de idioma no funciona
```
Solución:
1. Verificar localStorage del navegador
2. Limpiar cookies y caché
3. Recargar la página
```

#### Botones no responden
```
Solución:
1. Verificar consola del navegador (F12)
2. Reportar error con screenshot
3. Probar en otro navegador
```

## Mejores Prácticas

### Para Demostraciones
1. **Preparación**
   - Familiarizarse con todas las funciones
   - Tener escenarios de uso preparados
   - Verificar que todo funciona antes de presentar

2. **Durante la Demo**
   - Explicar el contexto de cada acción
   - Mostrar diferentes flujos de usuario
   - Destacar características de seguridad

3. **Preguntas Frecuentes**
   - ¿Cómo se integra con blockchain real?
   - ¿Qué pasa con la criptografía post-cuántica?
   - ¿Cuándo estará en producción?

## Próximos Pasos

### Después de la Demo
1. **Explorar Documentación**
   - [README.md](./README.md)
   - [CONTRACTS.md](./CONTRACTS.md)
   - [SECURITY-PQC.md](../SECURITY-PQC.md)

2. **Probar con Testnet**
   - Conectar MetaMask
   - Obtener ETH de Sepolia
   - Realizar transacciones reales

3. **Contribuir**
   - Reportar bugs
   - Sugerir mejoras
   - Contribuir código

## Contacto

Para preguntas sobre la demo:
- **GitHub Issues**: [Reportar problema](https://github.com/francoMengarelli/quantpaychain-mvp/issues)
- **Documentación**: Ver carpeta `/docs`

---

**Última actualización**: Octubre 2025
**Versión de la Demo**: 1.0.0
