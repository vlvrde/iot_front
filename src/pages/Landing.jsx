import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import InfoSection from '../components/landing/InfoSection'
import Services from '../components/landing/Services'
import HowItWorks from '../components/landing/HowItWorks'
import WhyUs from '../components/landing/WhyUs'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <InfoSection />
      <Services />
      <HowItWorks />
      <WhyUs />
      <Footer />
    </>
  )
}