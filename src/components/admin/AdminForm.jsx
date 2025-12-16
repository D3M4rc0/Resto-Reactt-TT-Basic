import React, { useState, useEffect } from 'react';
import './../../styles/pages/_admin-dashboard.scss';

const AdminForm = ({ 
  fields = [], 
  initialData = {}, 
  onSubmit, 
  onCancel,
  showActions = true,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  title = 'Formulario',
  loading = false
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false); ///// Estado para errores de imagen

  ///// Inicializar formData con valores iniciales
  useEffect(() => {
    const initialFormData = {};
    fields.forEach(field => {
      ///// No inicializamos campos de tipo imagePreview
      if (field.type !== 'imagePreview') {
        initialFormData[field.name] = initialData[field.name] || field.defaultValue || '';
      }
    });
    setFormData(initialFormData);
  }, [fields, initialData]);

  ///// Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    ///// Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    ///// Si cambia la URL de la imagen, limpiar error de imagen
    if (name === 'imagen_url') {
      setImageError(false);
    }
  };

  ///// Manejar cambios en selects
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  ///// Manejar error de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };

  ///// Manejar carga exitosa de imagen
  const handleImageLoad = () => {
    setImageError(false);
  };

  ///// Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      const value = formData[field.name];
      
      ///// Saltar validación para campos de tipo imagePreview
      if (field.type === 'imagePreview') return;
      
      ///// Validación de requerido
      if (field.required && !value && value !== false && value !== 0) {
        newErrors[field.name] = `${field.label} es requerido`;
      }
      
      ///// Validación de email
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.name] = 'Email inválido';
      }
      
      ///// Validación de número mínimo
      if (field.type === 'number' && field.min !== undefined && value < field.min) {
        newErrors[field.name] = `Mínimo ${field.min}`;
      }
      
      ///// Validación de número máximo
      if (field.type === 'number' && field.max !== undefined && value > field.max) {
        newErrors[field.name] = `Máximo ${field.max}`;
      }
      
      ///// Validación de longitud mínima
      if (field.minLength && value && value.length < field.minLength) {
        newErrors[field.name] = `Mínimo ${field.minLength} caracteres`;
      }
      
      ///// Validación de longitud máxima
      if (field.maxLength && value && value.length > field.maxLength) {
        newErrors[field.name] = `Máximo ${field.maxLength} caracteres`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  ///// Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      ///// Preparar datos según el tipo de campo
      const processedData = { ...formData };
      
      fields.forEach(field => {
        ///// Saltar campos de tipo imagePreview
        if (field.type === 'imagePreview') return;
        
        ///// Convertir números
        if (field.type === 'number' && processedData[field.name]) {
          processedData[field.name] = parseFloat(processedData[field.name]);
        }
        
        ///// Convertir booleanos
        if (field.type === 'checkbox') {
          processedData[field.name] = Boolean(processedData[field.name]);
        }
      });
      
      onSubmit(processedData);
    }
  };

  ///// Renderizar campo según tipo
	const renderField = (field) => {
	  console.log('🔍 Renderizando campo:', field.name, 'tipo:', field.type); ///// AÑADE ESTO
	  
	  if (field.type === 'imagePreview') {
		///// Campo especial para vista previa de imagen
		const imageUrl = formData[field.sourceField] || '';
		
		return (
		  <div 
			className="form-group half-width" 
			key={field.name}
			style={{
			  gridColumn: '2', ///// FORZAR columna derecha
			  gridRow: '6',    ///// FORZAR fila 6 (misma que checkbox)
			  marginTop: '24px', ///// Para alinearse con checkbox
			  height: '150px'
			}}
		  >
			{/* Label vacío pero oculto */}
			<label style={{display: 'none'}}>{field.label}</label>
			<div className="image-preview-container" style={{height: '100%'}}>
			  {imageUrl ? (
				<div className="image-preview-wrapper" style={{height: '100%'}}>
				  <img
					src={imageUrl}
					alt="Vista previa"
					className="image-preview"
					style={{
					  maxWidth: '100%',
					  maxHeight: '130px',
					  display: 'block',
					  margin: '0 auto'
					}}
					onError={(e) => {
					  e.target.style.display = 'none';
					  const wrapper = e.target.parentElement;
					  wrapper.innerHTML = `
						<div style="text-align: center; padding: 20px; color: #666;">
						  <div style="font-size: 24px; margin-bottom: 8px;">❌</div>
						  <p style="font-size: 12px;">No se pudo cargar la imagen</p>
						</div>
					  `;
					}}
				  />
				</div>
			  ) : (
				<div className="image-preview-placeholder" style={{height: '100%'}}>
				  <div className="placeholder-icon">🖼️</div>
				  <p>Ingresa una URL de imagen arriba para ver la vista previa</p>
				</div>
			  )}
			</div>
		  </div>
		);
	  }
  
    
    const value = formData[field.name] || '';
    const error = errors[field.name];
    
    switch (field.type) {
      case 'textarea':
        return (
          <div className={`form-group ${field.fullWidth ? 'full-width' : 'half-width'}`} key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder || `Ingresa ${field.label.toLowerCase()}`}
              rows={field.rows || 4}
              disabled={field.disabled || loading}
              className={error ? 'error' : ''}
            />
            {field.helpText && <small className="help-text">{field.helpText}</small>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      
      case 'select':
        return (
          <div className={`form-group ${field.fullWidth ? 'full-width' : 'half-width'}`} key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={value}
              onChange={(e) => handleSelectChange(field.name, e.target.value)}
              disabled={field.disabled || loading}
              className={error ? 'error' : ''}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && <small className="help-text">{field.helpText}</small>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className={`form-group ${field.fullWidth ? 'full-width' : 'half-width'} checkbox-group`} key={field.name}>
            <label>
              <input
                type="checkbox"
                name={field.name}
                checked={!!value}
                onChange={handleChange}
                disabled={field.disabled || loading}
              />
              <span className="checkbox-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </span>
            </label>
            {field.helpText && <small className="help-text">{field.helpText}</small>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      
      case 'file':
        return (
          <div className={`form-group ${field.fullWidth ? 'full-width' : 'half-width'}`} key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="file"
              id={field.name}
              name={field.name}
              onChange={handleChange}
              accept={field.accept || 'image/*'}
              disabled={field.disabled || loading}
              className={error ? 'error' : ''}
            />
            {field.helpText && <small className="help-text">{field.helpText}</small>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );
      
      default:
        return (
          <div className={`form-group ${field.fullWidth ? 'full-width' : 'half-width'}`} key={field.name}>
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type || 'text'}
              id={field.name}
              name={field.name}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder || `Ingresa ${field.label.toLowerCase()}`}
              min={field.min}
              max={field.max}
              minLength={field.minLength}
              maxLength={field.maxLength}
              step={field.step}
              disabled={field.disabled || loading}
              className={error ? 'error' : ''}
            />
            {field.helpText && <small className="help-text">{field.helpText}</small>}
            {error && <div className="error-message">{error}</div>}
          </div>
        );
    }
  };

	return (
	  <div className="admin-form">
		{title && ( ///// Solo muestra si hay título
		  <div className="form-header">
			<h3>{title}</h3>
		  </div>
		)}
		
		<form onSubmit={handleSubmit}>
		  <div className="form-grid">
			{fields.map(field => renderField(field))}
		  </div>
		  
		  {/* 👇 SOLO muestra botones si showActions es true */}
		  {showActions && (
			<div className="form-actions">
			  <button
				type="button"
				onClick={onCancel}
				className="btn-cancel"
				disabled={loading}
			  >
				{cancelLabel}
			  </button>
			  
			  <button
				type="submit"
				className="btn-submit"
				disabled={loading}
			  >
				{loading ? (
				  <>
					<span className="loading-spinner"></span>
					Guardando...
				  </>
				) : (
				  submitLabel
				)}
			  </button>
			</div>
		  )}
		</form>
	  </div>
	);
};

export default AdminForm;