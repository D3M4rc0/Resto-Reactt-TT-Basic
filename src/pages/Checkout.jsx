import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  formatPrice, 
  calculateCartTotals, 
  validateEmail, 
  validatePhone, 
  formatPhoneInput,
  validateName,
  validateAddress,
  validateCity,
  validatePostalCode,
  validateCreditCard,
  validateExpirationDate,
  validateCVV,
  sanitizeText
} from '../utils/apiHelpers';

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    telefono: '',
    tipoEntrega: 'envio',
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    metodoPago: 'mercado_pago',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTitular: '',
    observaciones: ''
  });

  // ⭐ AGREGAR ESTO JUSTO DESPUÉS
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        telefono: user.telefono || '',
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        direccion: user.direccion || '',
        ciudad: user.ciudad || ''
      }));
    }
  }, [user]);
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [realTimeErrors, setRealTimeErrors] = useState({});
  const [orderData, setOrderData] = useState({ 
    items: [], 
    totals: { subtotal: 0, iva: 0, total: 0 } 
  });
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  const { subtotal, iva, total, itemsCount } = calculateCartTotals(items);

  useEffect(() => {
    if (items.length > 0) {
      const totals = calculateCartTotals(items);
      setOrderData({
        items: [...items],
        totals: totals
      });
    }
  }, [items]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    switch (name) {
      case 'telefono':
        processedValue = formatPhoneInput(value);
        setRealTimeErrors(prev => ({
          ...prev,
          telefono: processedValue && !validatePhone(processedValue) 
            ? 'Teléfono inválido (9-13 dígitos, formato: +5493411234567)' 
            : ''
        }));
        break;
        
      case 'email':
        setRealTimeErrors(prev => ({
          ...prev,
          email: processedValue && !validateEmail(processedValue) 
            ? 'Email inválido' 
            : ''
        }));
        break;
        
      case 'nombre':
      case 'apellido':
        setRealTimeErrors(prev => ({
          ...prev,
          [name]: processedValue && !validateName(processedValue) 
            ? 'Solo letras y espacios (2-50 caracteres)' 
            : ''
        }));
        break;
        
      case 'direccion':
        setRealTimeErrors(prev => ({
          ...prev,
          direccion: processedValue && !validateAddress(processedValue) 
            ? 'Dirección inválida (5-100 caracteres)' 
            : ''
        }));
        break;
        
      case 'ciudad':
        setRealTimeErrors(prev => ({
          ...prev,
          ciudad: processedValue && !validateCity(processedValue) 
            ? 'Ciudad inválida (2-50 caracteres)' 
            : ''
        }));
        break;
        
      case 'codigoPostal':
        setRealTimeErrors(prev => ({
          ...prev,
          codigoPostal: processedValue && !validatePostalCode(processedValue) 
            ? 'Código postal inválido' 
            : ''
        }));
        break;
        
      case 'numeroTarjeta':
        processedValue = value.replace(/\D/g, '').substring(0, 16);
        if (processedValue.length > 0) {
          processedValue = processedValue.match(/.{1,4}/g)?.join(' ') || processedValue;
        }
        setRealTimeErrors(prev => ({
          ...prev,
          numeroTarjeta: processedValue && !validateCreditCard(processedValue.replace(/\s/g, '')) 
            ? 'Número de tarjeta inválido' 
            : ''
        }));
        break;
        
      case 'fechaExpiracion':
        processedValue = value.replace(/\D/g, '').substring(0, 4);
        if (processedValue.length >= 2) {
          processedValue = processedValue.substring(0, 2) + '/' + processedValue.substring(2);
        }
        setRealTimeErrors(prev => ({
          ...prev,
          fechaExpiracion: processedValue && !validateExpirationDate(processedValue) 
            ? 'Fecha inválida o expirada' 
            : ''
        }));
        break;
        
      case 'cvv':
        processedValue = value.replace(/\D/g, '').substring(0, 4);
        setRealTimeErrors(prev => ({
          ...prev,
          cvv: processedValue && !validateCVV(processedValue) 
            ? 'CVV inválido' 
            : ''
        }));
        break;
        
      case 'nombreTitular':
        setRealTimeErrors(prev => ({
          ...prev,
          nombreTitular: processedValue && !validateName(processedValue) 
            ? 'Nombre inválido' 
            : ''
        }));
        break;
        
      case 'observaciones':
        processedValue = sanitizeText(value);
        break;
        
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.telefono || !validatePhone(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido';
    }

    if (!formData.nombre || !validateName(formData.nombre)) {
      newErrors.nombre = 'Nombre requerido';
    }
    if (!formData.apellido || !validateName(formData.apellido)) {
      newErrors.apellido = 'Apellido requerido';
    }

    if (formData.tipoEntrega === 'envio') {
      if (!formData.direccion || !validateAddress(formData.direccion)) {
        newErrors.direccion = 'Dirección requerida';
      }
      if (!formData.ciudad || !validateCity(formData.ciudad)) {
        newErrors.ciudad = 'Ciudad requerida';
      }
      if (!formData.codigoPostal || !validatePostalCode(formData.codigoPostal)) {
        newErrors.codigoPostal = 'Código postal requerido';
      }
    }

    if (formData.metodoPago === 'tarjeta') {
      if (!formData.numeroTarjeta || !validateCreditCard(formData.numeroTarjeta.replace(/\s/g, ''))) {
        newErrors.numeroTarjeta = 'Número de tarjeta inválido';
      }
      if (!formData.fechaExpiracion || !validateExpirationDate(formData.fechaExpiracion)) {
        newErrors.fechaExpiracion = 'Fecha inválida o expirada';
      }
      if (!formData.cvv || !validateCVV(formData.cvv)) {
        newErrors.cvv = 'CVV inválido';
      }
      if (!formData.nombreTitular || !validateName(formData.nombreTitular)) {
        newErrors.nombreTitular = 'Nombre del titular requerido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrderId = 'ORD-' + Date.now();
      setOrderId(newOrderId);
      
      const finalTotals = calculateCartTotals(items);
      setOrderData({
        items: [...items],
        totals: finalTotals
      });
      
      setOrderSuccess(true);
      clearCart();
      
      console.log('Pedido procesado:', {
        orderId: newOrderId,
        user: user?.id || 'guest',
        items: items,
        total: finalTotals.total,
        tipoEntrega: formData.tipoEntrega,
        formData: {
          ...formData,
          observaciones: sanitizeText(formData.observaciones)
        }
      });

    } catch (error) {
      console.error('Error procesando pedido:', error);
      setErrors({ submit: 'Error procesando el pedido. Intenta nuevamente.' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleWhatsAppRedirect = () => {
    const tipoEntregaText = formData.tipoEntrega === 'envio' ? 'Envío a domicilio' : 'Retiro en local';
    const direccionText = formData.tipoEntrega === 'envio' ? 
      `\n📍 Dirección: ${formData.direccion}, ${formData.ciudad}` : 
      '\n📍 Retiro en local';
    
    // Agregar observaciones solo si el usuario escribió algo
    const observacionesText = formData.observaciones && formData.observaciones.trim() !== '' 
      ? `\n📝 Observaciones: ${formData.observaciones}` 
      : '';
    
    // Crear el mensaje completo
    const itemsList = orderData.items.map(item => 
      `• ${item.nombre} x${item.quantity} - ${formatPrice(item.precio * item.quantity)}`
    ).join('\n');
    
    const message = `Hola! Tengo un pedido:\n\n${itemsList}\n${direccionText}\n📞 Contacto: ${formData.telefono}\n💰 Total: ${formatPrice(orderData.totals.total)}\n📦 Tipo: ${tipoEntregaText}\n🎫 Pedido: ${orderId}${observacionesText}`;
    
    console.log('Mensaje WhatsApp:', message); // Para verificar en consola
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappWindow = window.open(`https://wa.me/5493411234567?text=${encodedMessage}`, '_blank');
    
    setWhatsappSent(true);
    
    if (whatsappWindow) {
      const checkWindow = setInterval(() => {
        if (whatsappWindow.closed) {
          clearInterval(checkWindow);
          setWhatsappSent(true);
        }
      }, 1000);
    }
  };

  const handleShowPrintOptions = () => {
    setShowPrintOptions(true);
  };

  const handlePrintReceipt = () => {
    // Crear estilos para impresión
    const printStyles = `
      <style>
        @media print {
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            max-width: 300px;
            margin: 0 auto;
            font-size: 14px;
            line-height: 1.4;
          }
          .receipt { 
            border: 2px solid #000; 
            padding: 20px; 
          }
          h2 { 
            text-align: center; 
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: bold;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .flex { display: flex; justify-content: space-between; }
          .border-top { border-top: 2px solid #333; }
          .border-bottom { border-bottom: 2px solid #333; }
          .margin-top { margin-top: 15px; }
          .margin-bottom { margin-bottom: 15px; }
          .padding-top { padding-top: 10px; }
          .padding-bottom { padding-bottom: 10px; }
          .small { font-size: 12px; }
          .smaller { font-size: 11px; }
          .dashed { border-bottom: 1px dashed #333; }
          .dotted { border-bottom: 1px dotted #ccc; }
        }
      </style>
    `;

    // Obtener el contenido del recibo
    const printContent = document.getElementById('order-receipt').innerHTML;

    // Crear un iframe oculto para imprimir
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante - Le Marc Gourmet</title>
          ${printStyles}
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Esperar a que se cargue el contenido
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        
        // Detectar cuándo se cierra el diálogo de impresión
        const checkPrintDialog = () => {
          // Eliminar el iframe después de un tiempo
          setTimeout(() => {
            document.body.removeChild(iframe);
            // Redirigir al menú después de imprimir o cancelar
            navigate('/menu');
          }, 500);
        };

        // Escuchar eventos de impresión
        iframe.contentWindow.onafterprint = checkPrintDialog;
        
        // Fallback: redirigir después de 2 segundos si no se detecta el evento
        setTimeout(checkPrintDialog, 2000);
      }, 250);
    };
  };

  const handleCancelPrint = () => {
    setShowPrintOptions(false);
    navigate('/menu');
  };
  
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <h1>Carrito Vacío</h1>
            <p>No hay productos en tu carrito para procesar.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/menu')}
            >
              Ir al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    if (showPrintOptions) {
      return (
        <div className="checkout-page">
          <div className="container">
            <div className="order-success">
              <div className="order-success__icon">🖨️</div>
              <h1 className="order-success__title">Imprimir Comprobante</h1>
              <p>¿Deseas imprimir tu comprobante de pedido?</p>
              
              <div id="order-receipt" style={{ display: 'block' }}>
                <div className="receipt">
                  <h2>Le Marc Gourmet</h2>
                  
                  <p className="center small">
                    <strong>Orden:</strong> {orderId}
                  </p>
                  <p className="center small margin-bottom">
                    {new Date().toLocaleString('es-AR')}
                  </p>
                  
                  <div className="dashed padding-bottom margin-bottom">
                    <p className="bold">
                      {formData.tipoEntrega === 'envio' ? '🚚 Envío a domicilio' : '🏪 Retiro en local'}
                    </p>
                    <p className="small">
                      <strong>Cliente:</strong> {formData.nombre} {formData.apellido}
                    </p>
                    <p className="small">
                      <strong>Tel:</strong> {formData.telefono}
                    </p>
                    {formData.tipoEntrega === 'envio' && (
                      <p className="small">
                        <strong>Dirección:</strong> {formData.direccion}, {formData.ciudad}
                      </p>
                    )}
                  </div>
                  
                  <div className="margin-bottom">
                    <h3 className="center bold">DETALLE DEL PEDIDO</h3>
                    
                    {orderData.items.map((item, index) => (
                      <div key={item.id} className={index === orderData.items.length - 1 ? '' : 'dotted padding-bottom margin-bottom'}>
                        <div className="flex margin-bottom">
                          <span className="bold small">{item.nombre}</span>
                        </div>
                        <div className="flex smaller">
                          <span>{item.quantity} x {formatPrice(item.precio)}</span>
                          <span className="bold">{formatPrice(item.precio * item.quantity)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-top border-bottom padding-top padding-bottom margin-top margin-bottom">
                    <div className="flex margin-bottom">
                      <span>Subtotal:</span>
                      <span>{formatPrice(orderData.totals.subtotal)}</span>
                    </div>
                    <div className="flex margin-bottom">
                      <span>IVA (21%):</span>
                      <span>{formatPrice(orderData.totals.iva)}</span>
                    </div>
                    <div className="flex bold" style={{fontSize: '16px'}}>
                      <span>TOTAL:</span>
                      <span>{formatPrice(orderData.totals.total)}</span>
                    </div>
                  </div>
                  
                  <div className="center smaller margin-top">
                    <p>
                      <strong>Método de pago:</strong> {formData.metodoPago}
                    </p>
                    <p>
                      <strong>Tiempo estimado:</strong> {formData.tipoEntrega === 'envio' ? '30-45 min' : '15-20 min'}
                    </p>
                    {formData.observaciones && (
                      <p style={{fontStyle: 'italic'}}>
                        <strong>Observaciones:</strong> {formData.observaciones}
                      </p>
                    )}
                    <p className="bold margin-top">
                      ¡Gracias por su compra!
                    </p>
                    <p style={{fontSize: '10px'}}>
                      Le Marc Gourmet - Comida gourmet de calidad
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-success__actions">
                <button 
                  className="btn btn-primary"
                  onClick={handlePrintReceipt}
                >
                  🖨️ Sí, Imprimir
                </button>
                
                <button 
                  className="btn btn-outline"
                  onClick={handleCancelPrint}
                >
                  No Imprimir, Volver al Menú
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="order-success__icon">✅</div>
            <h1 className="order-success__title">¡Pedido Confirmado!</h1>
            <p className="order-success__id">Número de pedido: <strong>{orderId}</strong></p>
            <p className="order-success__type">
              Tipo de entrega: <strong>{formData.tipoEntrega === 'envio' ? 'Envío a domicilio' : 'Retiro en local'}</strong>
            </p>
            
            <div className="order-success__details">
              <h3>Resumen del Pedido:</h3>
              <div className="order-items">
                {orderData.items.map(item => (
                  <div key={item.id} className="order-item">
                    <span>{item.nombre} x{item.quantity}</span>
                    <span className="order-item-price">{formatPrice(item.precio * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal:</span>
                  <span className="breakdown-price">{formatPrice(orderData.totals.subtotal)}</span>
                </div>
                <div className="breakdown-row">
                  <span>IVA (21%):</span>
                  <span className="breakdown-price">{formatPrice(orderData.totals.iva)}</span>
                </div>
                <div className="breakdown-row breakdown-total">
                  <span>Total:</span>
                  <span className="breakdown-total-price">{formatPrice(orderData.totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="order-success__actions">
              <button 
                className="btn btn-primary"
                onClick={handleWhatsAppRedirect}
              >
                📱 {whatsappSent ? 'WhatsApp Enviado' : 'Enviar por WhatsApp'}
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/menu')}
              >
                Seguir Comprando
              </button>
              
              <button 
                className={`btn ${whatsappSent ? 'btn-primary' : 'btn-outline'}`}
                onClick={handleShowPrintOptions}
                disabled={!whatsappSent}
                title={!whatsappSent ? "Primero envía tu pedido por WhatsApp" : ""}
              >
                🖨️ Imprimir Comprobante
              </button>
            </div>

            {!whatsappSent && (
              <div className="order-success__tip">
                <p>💡 <strong>Recomendación:</strong> Envía primero tu pedido por WhatsApp y luego imprime el comprobante.</p>
              </div>
            )}

            <div className="order-success__info">
              <p>📞 Te contactaremos para confirmar tu pedido</p>
              <p>⏰ Tiempo estimado: {formData.tipoEntrega === 'envio' ? '30-45 minutos' : '15-20 minutos'}</p>
              {formData.tipoEntrega === 'retiro' && (
                <p>📍 Retiras en: Av. Principal 1234, Local 5</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-page__header">
          <h1>Finalizar Compra</h1>
          <p>Completa tus datos para procesar el pedido</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <section className="checkout-section">
                <h2>Tipo de Entrega</h2>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="tipoEntrega"
                      value="envio"
                      checked={formData.tipoEntrega === 'envio'}
                      onChange={handleInputChange}
                    />
                    <span>🚚 Envío a domicilio</span>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="tipoEntrega"
                      value="retiro"
                      checked={formData.tipoEntrega === 'retiro'}
                      onChange={handleInputChange}
                    />
                    <span>🏪 Retiro en local</span>
                  </label>
                </div>
              </section>

              <section className="checkout-section">
                <h2>Información de Contacto</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {(errors.email || realTimeErrors.email) && (
                      <span className="error-text">{errors.email || realTimeErrors.email}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Teléfono *</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={errors.telefono ? 'error' : ''}
                      placeholder="+5493411234567"
                    />
                    {(errors.telefono || realTimeErrors.telefono) && (
                      <span className="error-text">{errors.telefono || realTimeErrors.telefono}</span>
                    )}
                  </div>
                </div>
              </section>

              <section className="checkout-section">
                <h2>Información Personal</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={errors.nombre ? 'error' : ''}
                    />
                    {(errors.nombre || realTimeErrors.nombre) && (
                      <span className="error-text">{errors.nombre || realTimeErrors.nombre}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Apellido *</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className={errors.apellido ? 'error' : ''}
                    />
                    {(errors.apellido || realTimeErrors.apellido) && (
                      <span className="error-text">{errors.apellido || realTimeErrors.apellido}</span>
                    )}
                  </div>
                </div>
              </section>

              {formData.tipoEntrega === 'envio' && (
                <section className="checkout-section">
                  <h2>Dirección de Envío</h2>
                  <div className="form-group">
                    <label>Dirección *</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className={errors.direccion ? 'error' : ''}
                      placeholder="Calle, número, piso, departamento"
                    />
                    {(errors.direccion || realTimeErrors.direccion) && (
                      <span className="error-text">{errors.direccion || realTimeErrors.direccion}</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Ciudad *</label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        className={errors.ciudad ? 'error' : ''}
                      />
                      {(errors.ciudad || realTimeErrors.ciudad) && (
                        <span className="error-text">{errors.ciudad || realTimeErrors.ciudad}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Código Postal *</label>
                      <input
                        type="text"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                        className={errors.codigoPostal ? 'error' : ''}
                      />
                      {(errors.codigoPostal || realTimeErrors.codigoPostal) && (
                        <span className="error-text">{errors.codigoPostal || realTimeErrors.codigoPostal}</span>
                      )}
                    </div>
                  </div>
                </section>
              )}

              <section className="checkout-section">
                <h2>Método de Pago</h2>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="mercado_pago"
                      checked={formData.metodoPago === 'mercado_pago'}
                      onChange={handleInputChange}
                    />
                    <span>Mercado Pago</span>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={formData.metodoPago === 'tarjeta'}
                      onChange={handleInputChange}
                    />
                    <span>Tarjeta de Crédito/Débito</span>
                  </label>
                  
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={formData.metodoPago === 'efectivo'}
                      onChange={handleInputChange}
                    />
                    <span>Efectivo</span>
                  </label>
                </div>

                {formData.metodoPago === 'tarjeta' && (
                  <div className="card-form">
                    <div className="form-group">
                      <label>Número de Tarjeta *</label>
                      <input
                        type="text"
                        name="numeroTarjeta"
                        value={formData.numeroTarjeta}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className={errors.numeroTarjeta ? 'error' : ''}
                      />
                      {(errors.numeroTarjeta || realTimeErrors.numeroTarjeta) && (
                        <span className="error-text">{errors.numeroTarjeta || realTimeErrors.numeroTarjeta}</span>
                      )}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Fecha Expiración *</label>
                        <input
                          type="text"
                          name="fechaExpiracion"
                          value={formData.fechaExpiracion}
                          onChange={handleInputChange}
                          placeholder="MM/AA"
                          className={errors.fechaExpiracion ? 'error' : ''}
                        />
                        {(errors.fechaExpiracion || realTimeErrors.fechaExpiracion) && (
                          <span className="error-text">{errors.fechaExpiracion || realTimeErrors.fechaExpiracion}</span>
                        )}
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className={errors.cvv ? 'error' : ''}
                        />
                        {(errors.cvv || realTimeErrors.cvv) && (
                          <span className="error-text">{errors.cvv || realTimeErrors.cvv}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Nombre del Titular *</label>
                      <input
                        type="text"
                        name="nombreTitular"
                        value={formData.nombreTitular}
                        onChange={handleInputChange}
                        className={errors.nombreTitular ? 'error' : ''}
                      />
                      {(errors.nombreTitular || realTimeErrors.nombreTitular) && (
                        <span className="error-text">{errors.nombreTitular || realTimeErrors.nombreTitular}</span>
                      )}
                    </div>
                  </div>
                )}
              </section>

              <section className="checkout-section">
                <h2>Observaciones</h2>
                <div className="form-group">
                  <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    placeholder="Instrucciones especiales para la entrega, alergias, etc."
                    rows="4"
                  />
                </div>
              </section>

              {errors.submit && (
                <div className="error-message">
                  {errors.submit}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary checkout-submit"
                disabled={isProcessing || Object.keys(realTimeErrors).some(key => realTimeErrors[key])}
              >
                {isProcessing ? 'Procesando...' : `Confirmar Pedido - ${formatPrice(total)}`}
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <div className="order-summary-checkout">
              <h3>Resumen del Pedido</h3>
              
              <div className="order-items-checkout">
                {items.map(item => (
                  <div key={item.id} className="order-item-checkout">
                    <div className="order-item__image">
                      <img 
                        src={item.imagen_url || '/src/assets/images/placeholder-2.webp'} 
                        alt={item.nombre}
                      />
                    </div>
                    <div className="order-item__details">
                      <h4>{item.nombre}</h4>
                      <p>Cantidad: {item.quantity}</p>
                    </div>
                    <div className="order-item__price">
                      {formatPrice(item.precio * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals-checkout">
                <div className="order-total-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="order-total-row">
                  <span>Envío:</span>
                  <span className="free-shipping">Gratis</span>
                </div>
                <div className="order-total-row">
                  <span>IVA (21%):</span>
                  <span>{formatPrice(iva)}</span>
                </div>
                <div className="order-total-row order-total-row--main">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="checkout-benefits">
                <h4>✅ Beneficios incluidos:</h4>
                <ul>
                  <li>Envío gratis</li>
                  <li>Pago seguro</li>
                  <li>Soporte 24/7</li>
                  <li>Garantía de satisfacción</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;