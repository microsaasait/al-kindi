import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CONTACT } from '../src/siteConfig';

const Bloc: React.FC<{ titre: string; children: React.ReactNode }> = ({ titre, children }) => (
  <section className="mt-10">
    <h2 className="text-[22px] font-extrabold text-ak-ink">{titre}</h2>
    <div className="mt-3 space-y-3 text-[15px] leading-[1.75] text-ak-text">{children}</div>
  </section>
);

/**
 * Mentions légales et informations sur les données personnelles.
 * Le site recueille des coordonnées de mineurs pour le jeu : cette page est
 * une obligation, pas une décoration.
 */
const Confidentialite: React.FC = () => (
  <div className="min-h-screen bg-ak-paper">
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[14px] font-bold text-ak-text hover:text-ak-green"
      >
        <ArrowLeft size={16} strokeWidth={2.4} />
        Retour au site
      </Link>

      <h1 className="mt-8 text-[32px] sm:text-[40px] font-extrabold leading-[1.14] tracking-[-0.02em] text-ak-ink">
        Vos données et vos droits
      </h1>
      <p className="mt-4 text-[16px] leading-[1.7] text-ak-text">
        L’association Al Kindi recueille le minimum nécessaire pour vous répondre. Rien n’est vendu, rien n’est transmis à un tiers, et aucun traceur publicitaire
        n’est déposé sur votre appareil.
      </p>

      <Bloc titre="Qui est responsable">
        <p>
          Association Al Kindi, association loi 1901 établie à {CONTACT.city}. Pour toute question sur
          vos données, écrivez à l’association depuis le formulaire du site en choisissant « Autre
          demande ».
        </p>
      </Bloc>

      <Bloc titre="Ce que nous recueillons, et pourquoi">
        <p>
          <strong>Quand vous envoyez une demande</strong> (inscription, bénévolat, autre) : votre nom,
          le moyen de contact que vous avez choisi, la classe ou les matières concernées, et votre
          message. Ces informations servent uniquement à vous répondre.
        </p>
        <p>
          Nous ne demandons ni date de naissance, ni adresse postale, ni aucune donnée sensible. Le site
          n’utilise ni cookie publicitaire, ni outil de mesure d’audience.
        </p>
      </Bloc>

      <Bloc titre="Les mineurs">
        <p>
          Le mini-jeu s’adresse à des élèves. Il ne demande aucune information : on joue sans rien saisir
          et rien n’est enregistré. Un parent peut à tout moment demander la
          suppression des informations de son enfant : elle est effectuée sans délai et sans justification
          à fournir.
        </p>
      </Bloc>

      <Bloc titre="Combien de temps nous les gardons">
        <p>
          Les demandes envoyées par le formulaire sont conservées le temps du
          suivi de la demande, puis supprimées.
        </p>
      </Bloc>

      <Bloc titre="Qui peut les consulter">
        <p>
          Seuls les responsables de l’association, au moyen d’un code d’accès. Les données sont hébergées
          chez Supabase, au sein de l’Union européenne (Irlande), et le site est hébergé par Vercel. Le
          site public n’a techniquement pas le droit de relire ce qui a été envoyé : il peut seulement
          transmettre votre message.
        </p>
      </Bloc>

      <Bloc titre="Vos droits">
        <p>
          Vous pouvez demander à consulter, corriger ou effacer vos informations, ou vous opposer à leur
          utilisation. Une demande est traitée sous un mois. En cas de désaccord persistant, vous pouvez
          saisir la CNIL, l’autorité française de protection des données.
        </p>
      </Bloc>

      <Bloc titre="Le mini-jeu">
        <p>
          Le mini-jeu est gratuit et sert uniquement à s’entraîner. Il n’y a rien à gagner et aucune
          information n’est demandée ni enregistrée.
        </p>
      </Bloc>

      <p className="mt-12 text-[13px] text-ak-text/60">Dernière mise à jour : octobre 2026.</p>
    </div>
  </div>
);

export default Confidentialite;
