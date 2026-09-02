import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Page inconnue. Un site statique ne peut pas renvoyer un vrai code 404, alors
 * on demande au moins aux moteurs de ne pas indexer l'adresse, au lieu de leur
 * servir l'accueil sous une URL qui n'existe pas.
 */
const Introuvable: React.FC = () => {
  useEffect(() => {
    const balise = document.createElement('meta');
    balise.name = 'robots';
    balise.content = 'noindex, follow';
    document.head.appendChild(balise);
    const titre = document.title;
    document.title = 'Page introuvable | Association Al Kindi';
    return () => {
      balise.remove();
      document.title = titre;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ak-paper px-6 text-center">
      <img
        src="/media/logo-mini.webp"
        alt=""
        width={128}
        height={128}
        className="h-20 w-20 rounded-2xl object-cover"
      />
      <p className="mt-8 text-[52px] font-extrabold leading-none text-ak-ink">404</p>
      <h1 className="mt-4 text-[24px] font-extrabold text-ak-ink">Cette page n’existe pas</h1>
      <p className="mt-3 max-w-sm text-[15px] leading-[1.7] text-ak-text">
        Le lien est peut-être incomplet, ou la page a changé d’adresse.
      </p>
      <Link
        to="/"
        className="btn-press mt-8 inline-flex items-center gap-2 rounded-2xl bg-ak-green border-ak-greenDark px-7 py-4 text-[16px] font-bold text-white"
      >
        <ArrowLeft size={17} strokeWidth={2.4} />
        Revenir à l’accueil
      </Link>
    </div>
  );
};

export default Introuvable;
