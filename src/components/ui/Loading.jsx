import React from 'react'

const Loading = ({ message = "Cargando..." }) => {
  return (
    <div className="loading">
      <div className="loading__spinner"></div>
      <p className="loading__text">{message}</p>
    </div>
  )
}

export default Loading
