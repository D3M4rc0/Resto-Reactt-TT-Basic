import React from 'react'

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Carlos Martínez",
      role: "Chef Ejecutivo",
      image: "/src/assets/images/chef1.jpg",
      description: "Con más de 15 años de experiencia en gastronomía internacional."
    },
    {
      id: 2,
      name: "Ana Rodríguez",
      role: "Pastelera Principal",
      image: "/src/assets/images/chef2.jpg",
      description: "Especialista en repostería francesa y creativa."
    },
    {
      id: 3,
      name: "Miguel Sánchez",
      role: "Sommelier",
      image: "/src/assets/images/chef3.jpg",
      description: "Experto en maridajes y selección de vinos premium."
    }
  ]

  const values = [
    {
      icon: "⭐",
      title: "Calidad Premium",
      description: "Utilizamos solo los ingredientes más frescos y de la más alta calidad."
    },
    {
      icon: "👨‍🍳",
      title: "Expertise Culinario",
      description: "Nuestro equipo de chefs tiene experiencia internacional y pasión por la cocina."
    },
    {
      icon: "💎",
      title: "Excelencia en Servicio",
      description: "Cada cliente recibe una atención personalizada y excepcional."
    },
    {
      icon: "🌱",
      title: "Sostenibilidad",
      description: "Trabajamos con productores locales y prácticas sostenibles."
    }
  ]

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__content">
            <h1 className="about-hero__title">Sobre Restó Elegante</h1>
            <p className="about-hero__subtitle">
              Donde la tradición se encuentra con la innovación en cada plato
            </p>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="about-story">
        <div className="container">
          <div className="about-story__content">
            <div className="about-story__text">
              <h2 className="about-story__title">Nuestra Historia</h2>
              <p className="about-story__description">
                Fundado en 2010, Restó Elegante nació del sueño de crear un espacio donde 
                la excelencia culinaria se combine con una experiencia gastronómica memorable. 
                Lo que comenzó como un pequeño local familiar se ha convertido en un referente 
                de la alta cocina en la ciudad.
              </p>
              <p className="about-story__description">
                Nuestra filosofía se basa en tres pilares fundamentales: ingredientes de 
                primera calidad, técnicas culinarias innovadoras y un servicio impecable 
                que hace que cada visita sea única.
              </p>
              
              <div className="about-story__stats">
                <div className="about-story__stat">
                  <span className="about-story__stat-number">13+</span>
                  <span className="about-story__stat-label">Años de Experiencia</span>
                </div>
                <div className="about-story__stat">
                  <span className="about-story__stat-number">50+</span>
                  <span className="about-story__stat-label">Platos Exclusivos</span>
                </div>
                <div className="about-story__stat">
                  <span className="about-story__stat-number">10k+</span>
                  <span className="about-story__stat-label">Clientes Satisfechos</span>
                </div>
              </div>
            </div>
            
            <div className="about-story__image">
              <img 
                src="/src/assets/images/restaurant-interior.jpg" 
                alt="Interior del restaurante"
                onError={(e) => {
                  e.target.src = '/src/assets/images/placeholder-2.webp'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="about-values">
        <div className="container">
          <h2 className="about-values__title">Nuestros Valores</h2>
          <div className="about-values__grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-card__icon">{value.icon}</div>
                <h3 className="value-card__title">{value.title}</h3>
                <p className="value-card__description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="about-team">
        <div className="container">
          <h2 className="about-team__title">Conoce a Nuestro Equipo</h2>
          <p className="about-team__subtitle">
            Profesionales apasionados que hacen posible la magia en cada plato
          </p>
          
          <div className="about-team__grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-card__image">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.target.src = '/src/assets/images/placeholder-2.webp'
                    }}
                  />
                </div>
                <div className="team-card__content">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__role">{member.role}</p>
                  <p className="team-card__description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta__content">
            <h2 className="about-cta__title">¿Listo para una experiencia única?</h2>
            <p className="about-cta__description">
              Reserva tu mesa hoy y descubre por qué somos el restaurante preferido 
              de los amantes de la buena comida.
            </p>
            <div className="about-cta__actions">
              <button className="btn btn-primary">Reservar Mesa</button>
              <button className="btn btn-outline">Ver Menú</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
