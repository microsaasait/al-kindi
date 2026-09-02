import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pillars from './components/Pillars';
import Heritage from './components/Heritage';
import Method from './components/Method';
import Quiz from './components/Quiz';
import Values from './components/Values';
import Volunteers from './components/Volunteers';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './pages/Admin';

const Home: React.FC = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Pillars />
      <Heritage />
      <Method />
      <Quiz />
      <Values />
      <Volunteers />
      <Faq />
      <Contact />
    </main>
    <Footer />
  </>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default App;
