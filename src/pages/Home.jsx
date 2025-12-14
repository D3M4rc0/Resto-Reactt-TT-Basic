import React from 'react'
import Hero from '../components/sections/Hero'
import Specialties from '../components/sections/Specialties'
import Offers from '../components/sections/Offers'
import MenuSection from '../components/sections/MenuSection'
import ReviewsSection from '../components/sections/ReviewsSection'
import Contact from '../components/sections/Contact'

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <section id="especialidades">
        <Specialties />
      </section>
      <section id="ofertas">
        <Offers />
      </section>
      <MenuSection />
      <ReviewsSection />
      <section id="contacto">
        <Contact />
      </section>
    </div>
  )
}

export default Home