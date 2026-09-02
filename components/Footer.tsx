import React from 'react';
import { NAV_LINKS } from '../src/content';
import { CONTACT } from '../src/siteConfig';

const Footer: React.FC = () => (
  <footer className="bg-ak-ink text-white/65">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-center gap-3">
          <img
            src="/media/logo-al-kindi.jpg"
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
        </nav>
      </div>

      <div className="mt-10 pt-8 border-t-2 border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[13px]">Association loi 1901 · Laïque, apolitique et ouverte à tous</p>
        <p className="text-[13px]">© {new Date().getFullYear()} Association Al Kindi</p>
      </div>
    </div>
  </footer>
);

export default Footer;
