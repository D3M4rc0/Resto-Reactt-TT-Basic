import React from 'react'
import Modal from './Modal'

const PrivacyModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Política de Privacidad" size="large">
      <div className="modal-section">
        <h3>Información que Recopilamos</h3>
        <p>
          En Le Marc Gourmet, recopilamos información personal que usted nos proporciona 
          voluntariamente al realizar reservas, pedidos o contactarnos. Esto incluye:
        </p>
        <ul>
          <li>Nombre y apellido</li>
          <li>Dirección de correo electrónico</li>
          <li>Número de teléfono</li>
          <li>Preferencias alimentarias</li>
          <li>Información de reservas y pedidos</li>
        </ul>
      </div>

      <div className="modal-section">
        <h3>Uso de la Información</h3>
        <p>
          Utilizamos su información para:
        </p>
        <ul>
          <li>Procesar sus reservas y pedidos</li>
          <li>Enviar confirmaciones y recordatorios</li>
          <li>Mejorar nuestros servicios y experiencia del cliente</li>
          <li>Comunicar ofertas especiales (solo con su consentimiento)</li>
        </ul>
      </div>

      <div className="modal-section">
        <h3>Protección de Datos</h3>
        <p>
          Implementamos medidas de seguridad para proteger su información personal 
          contra accesos no autorizados, alteración, divulgación o destrucción.
        </p>
      </div>

      <div className="modal-section">
        <h3>Sus Derechos</h3>
        <p>
          Usted tiene derecho a:
        </p>
        <ul>
          <li>Acceder a su información personal</li>
          <li>Rectificar datos inexactos</li>
          <li>Solicitar la eliminación de sus datos</li>
          <li>Oponerse al procesamiento de sus datos</li>
        </ul>
      </div>

      <div className="modal-notice">
        <p>
          <strong>💰 Aviso Importante:</strong> Todos los precios están expresados en 
          <strong> Pesos Argentinos (ARS)</strong>. Consulte el precio equivalente 
          en <strong>Dolares Estadounidenses (USD)</strong> al momento de realizar su pedido, 
          sujeto al tipo de cambio del día.
        </p>
      </div>

      <div className="modal-contact">
        <p>
          Para consultas sobre privacidad: 
          <strong> privacidad@lemarcgourmet.com</strong>
        </p>
        <p>
          <em>Última actualización: {new Date().toLocaleDateString('es-AR')}</em>
        </p>
      </div>
    </Modal>
  )
}

export default PrivacyModal