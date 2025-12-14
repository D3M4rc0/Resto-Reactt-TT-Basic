import React from 'react'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__video-container">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/src/assets/images/placeholder-2.webp"
        >
          <source src="src\assets\videos\banner-video.mp4" type="video/webm" />
          Tu navegador no soporta el elemento video.
        </video>
        <div className="hero__overlay"></div>
      </div>

      <div className="hero__content">
        <div className="container">
          <div className="hero__text">
            <h1 className="hero__title">
              Experiencia Gastronómica
              <span className="hero__title-accent"> Excepcional</span>
            </h1>
            <p className="hero__description">
              Descubre los sabores más exquisitos en un ambiente de lujo y elegancia. 
              Donde cada plato es una obra de arte y cada momento una experiencia única.
            </p>
            
            <div className="hero__actions">
              <button className="btn btn-primary hero__btn hero__btn--primary">
                Ver Menú Completo
              </button>
              <button className="btn btn-outline hero__btn hero__btn--secondary">
                Reservar Mesa
              </button>
            </div>

            <div className="hero__features">
              <div className="hero__feature">
                <span className="hero__feature-icon">⭐</span>
                <span>Calidad Premium</span>
              </div>
              <div className="hero__feature">
                <span className="hero__feature-icon">👨‍🍳</span>
                <span>Chefs Expertos</span>
              </div>
              <div className="hero__feature">
                <span className="hero__feature-icon">🚚</span>
                <span>Delivery Rápido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
