import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../src/content';
import { CONTACT } from '../src/siteConfig';

const Footer: React.FC = () => (
  <footer className="bg-ak-ink text-white/65">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-center gap-3">
          <img
            src="/media/logo-mini.webp"
            alt=""
            className="h-14 w-14 rounded-2xl object-cover"
            width={56}
            height={56}
            loading="lazy"
          />
          <div>
            <p className="text-[18px] font-extrabold text-white">Association Al Kindi</p>
            <p className="text-[14px]">Entraide, soutien et réussite · {CONTACT.city}</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-7 gap-y-3">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-[14px] font-medium hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="text-[14px] font-medium hover:text-white transition-colors">
            Contact
          </a>
          <Link to="/confidentialite" className="text-[14px] font-medium hover:text-white transition-colors">
            Données et mentions légales
          </Link>
        </nav>
      </div>

      <p className="mt-10 rounded-2xl bg-white/5 px-5 py-4 text-[13px] leading-[1.6]">
        Jeu du mois : participation gratuite et sans obligation, ouverte à partir de 8 bonnes réponses sur
        10, un ticket par personne et par mois, accord des parents obligatoire. Le tirage a lieu en fin de
        mois et le gagnant reçoit 20 € de crédit sur la plateforme de son choix. Les coordonnées servent
        uniquement à prévenir le gagnant et sont effacées après la remise du lot.{' '}
        <Link to="/confidentialite" className="underline hover:text-white">
          Détail des données et de vos droits
        </Link>
        .
      </p>

      <div className="mt-8 pt-8 border-t-2 border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[13px]">Association loi 1901 · Laïque, apolitique et ouverte à tous</p>
        <p className="text-[13px]">© {new Date().getFullYear()} Association Al Kindi</p>
      </div>
    </div>
  </footer>
);

export default Footer;
