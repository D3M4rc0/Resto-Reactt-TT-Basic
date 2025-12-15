import React from 'react'
import { Star, ChefHat, Truck } from 'lucide-react'
import bannerVideo from '/src/assets/videos/banner-video.mp4'
import posterImg from '/src/assets/images/restaurant-menu-1.jpg'

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
          poster={posterImg}
        >
          <source src={bannerVideo} type="video/mp4" />
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
                <Star className="hero__feature-icon" />
                <span>Calidad Premium</span>
              </div>
              <div className="hero__feature">
                <ChefHat className="hero__feature-icon" />
                <span>Chefs Expertos</span>
              </div>
              <div className="hero__feature">
                <Truck className="hero__feature-icon" />
                <span>Delivery Rápido</span>
              </div>
            </div>
            
            <div className="hero__divider"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero