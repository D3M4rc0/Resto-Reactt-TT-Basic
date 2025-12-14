import React from 'react'
import Modal from './Modal'

const TermsModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Términos de Servicio" size="large">
      <div className="modal-section">
        <h3>Reservas y Cancelaciones</h3>
        <ul>
          <li>Las reservas deben confirmarse con al menos 2 horas de anticipación</li>
          <li>Cancelaciones con menos de 1 hora de anticipación pueden generar cargos</li>
          <li>Nos reservamos el derecho de cancelar reservas en caso de fuerza mayor</li>
        </ul>
      </div>

      <div className="modal-section">
        <h3>Pedidos y Pagos</h3>
        <ul>
          <li>Los pedidos se confirman una vez procesado el pago</li>
          <li>Aceptamos efectivo, tarjetas de crédito/débito y transferencias</li>
          <li>Los precios incluyen IVA</li>
        </ul>
      </div>

      <div className="modal-section">
        <h3>Información de Precios</h3>
        <div className="price-notice">
          <p>
            <strong>💵 Todos los precios están expresados en Pesos Argentinos (ARS)</strong>
          </p>
          <ul>
            <li>Los precios en ARS son referencia</li>
            <li>Consulte el precio en Dólares al momento del pedido</li>
            <li>Se aplicará el tipo de cambio del día al realizar el pago</li>
            <li>Precios sujetos a disponibilidad de productos</li>
          </ul>
        </div>
      </div>

      <div className="modal-section">
        <h3>Política de Calidad</h3>
        <ul>
          <li>Utilizamos ingredientes frescos y de primera calidad</li>
          <li>Nos reservamos el derecho de modificar el menú según disponibilidad</li>
          <li>Atendemos solicitudes especiales de alimentación (consultar)</li>
        </ul>
      </div>

      <div className="modal-section">
        <h3>Responsabilidades del Cliente</h3>
        <ul>
          <li>Proporcionar información veraz para reservas</li>
          <li>Respetar el horario de la reserva confirmada</li>
          <li>Informar sobre alergias o restricciones alimentarias</li>
        </ul>
      </div>

      <div className="modal-contact">
        <p>
          Para consultas sobre términos de servicio: 
          <strong> terminos@lemarcgourmet.com</strong>
        </p>
        <p>
          <em>Última actualización: {new Date().toLocaleDateString('es-AR')}</em>
        </p>
      </div>
    </Modal>
  )
}

export default TermsModal