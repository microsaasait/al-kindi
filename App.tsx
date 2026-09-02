import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import Heritage from './components/Heritage';
import Method from './components/Method';
import Values from './components/Values';
import Volunteers from './components/Volunteers';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Pillars />
      <Heritage />
      <Method />
      <Values />
      <Volunteers />
      <Faq />
      <Contact />
    </main>
    <Footer />
  </>
);

export default App;
