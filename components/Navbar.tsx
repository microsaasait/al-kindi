import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../src/content';

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-shadow ${
        scrolled ? 'bg-ak-cream/95 backdrop-blur-md shadow-[0_2px_0_rgba(20,67,44,0.08)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Association Al Kindi, accueil">
          <img
            src="/media/logo-al-kindi.jpg"
            alt=""
            className="h-12 w-12 rounded-2xl object-cover border-2 border-ak-ink/10"
            width={48}
            height={48}
          />
          <span className="whitespace-nowrap text-[18px] font-extrabold tracking-tight text-ak-ink">Al Kindi</span>
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[15px] font-medium text-ak-text hover:text-ak-green transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-press whitespace-nowrap bg-ak-green border-ak-greenDark text-white text-[15px] font-bold px-5 py-3 rounded-2xl"
          >
            Nous contacter
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-ak-ink"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ak-cream border-t-2 border-ak-ink/10">
          <nav className="px-5 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-[16px] font-medium text-ak-text"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-press mt-2 text-center bg-ak-green border-ak-greenDark text-white text-[16px] font-bold px-6 py-3.5 rounded-2xl"
            >
              Nous contacter
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
