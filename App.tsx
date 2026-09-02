import React, { Suspense, lazy } from 'react';
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

// Le tableau de bord et la page légale ne concernent pas le visiteur qui arrive
// sur l'accueil : ils sont chargés seulement quand on va sur leur adresse.
const Admin = lazy(() => import('./pages/Admin'));
const Confidentialite = lazy(() => import('./pages/Confidentialite'));
const Introuvable = lazy(() => import('./pages/Introuvable'));

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

const Attente: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-ak-cream">
    <span className="h-8 w-8 animate-spin rounded-full border-4 border-ak-green/25 border-t-ak-green" />
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<Attente />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="*" element={<Introuvable />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
