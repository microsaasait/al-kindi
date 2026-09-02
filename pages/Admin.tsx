import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Check,
  Download,
  Inbox,
  Loader2,
  LogOut,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import Wheel, { type WheelSegment } from '../components/Wheel';
import { PERSO } from '../src/personnages';
import {
  currentPeriod,
  downloadCsv,
  formatDate,
  periodLabel,
  supabase,
  supabaseReady,
  type Draw,
  type Message,
  type Participant,
} from '../src/supabase';

const KIND_LABEL: Record<Message['kind'], string> = {
  inscription: 'Inscription',
  benevolat: 'Bénévolat',
  autre: 'Autre',
};

const KIND_TONE: Record<Message['kind'], string> = {
  inscription: 'bg-ak-green/10 text-ak-green',
  benevolat: 'bg-ak-orange/10 text-ak-orange',
  autre: 'bg-ak-ink/8 text-ak-text',
};

const COLORS = ['#1E7A4B', '#F0B429', '#EE7B1C', '#14603A', '#6BBF59', '#B8860B'];

// Identifiant technique du compte de l'association. Ce n'est pas un secret :
// c'est un simple nom de compte, l'équivalent d'un login. Le code d'accès, lui,
// n'apparaît nulle part dans ce fichier : il est saisi par la personne et
// vérifié par le serveur d'authentification, jamais par le navigateur. Un code
// comparé ici serait lisible dans le JavaScript public par n'importe qui.
const ADMIN_ACCOUNT = 'admin@al-kindi.fr';

const Admin: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const [code, setCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [period, setPeriod] = useState(currentPeriod());
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageFilter, setMessageFilter] = useState<'tous' | Message['kind']>('tous');
  const [showHandled, setShowHandled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tirage en cours : on fait tourner la roue avant d'annoncer le résultat.
  const [drawing, setDrawing] = useState(false);
  const [pendingDraw, setPendingDraw] = useState<Draw | null>(null);
  const [wheelTarget, setWheelTarget] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Draw | null>(null);

  useEffect(() => {
    if (!supabaseReady) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [p, d, m] = await Promise.all([
      supabase.from('ak_participants').select('*').eq('period', period).order('created_at', { ascending: false }),
      supabase.from('ak_draws').select('*').order('drawn_at', { ascending: false }),
      supabase.from('ak_messages').select('*').order('created_at', { ascending: false }),
    ]);
    const firstError = p.error ?? d.error ?? m.error;
    if (firstError) setError(firstError.message);
    setParticipants((p.data as Participant[]) ?? []);
    setDraws((d.data as Draw[]) ?? []);
    setMessages((m.data as Message[]) ?? []);
    setLoading(false);
  }, [period]);

  useEffect(() => {
    if (signedIn) void load();
  }, [signedIn, load]);

  const drawOfPeriod = useMemo(() => draws.find((d) => d.period === period) ?? null, [draws, period]);

  const periods = useMemo(() => {
    const list = new Set<string>([currentPeriod(), ...draws.map((d) => d.period)]);
    const now = new Date();
    for (let i = 1; i <= 5; i += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      list.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return [...list].sort().reverse();
  }, [draws]);

  const segments: WheelSegment[] = useMemo(() => {
    if (participants.length === 0) return [{ label: 'Personne', color: '#B0B0B0' }];
    return participants.slice(0, 12).map((p, i) => ({ label: p.first_name, color: COLORS[i % COLORS.length] }));
  }, [participants]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email: ADMIN_ACCOUNT,
      password: code.trim(),
    });
    setAuthBusy(false);
    if (err) setAuthError('Code refusé.');
  };

  const runDraw = async () => {
    setError('');
    setDrawing(true);
    setRevealed(null);
    setWheelTarget(null);

    const { data, error: err } = await supabase.rpc('ak_draw_winner', { p_period: period });
    if (err || !data) {
      setDrawing(false);
      setError(err?.message ?? 'Le tirage a échoué.');
      return;
    }

    const draw = data as Draw;
    setPendingDraw(draw);

    // On aligne la roue sur le gagnant réellement tiré par la base.
    const idx = participants.findIndex((p) => p.id === draw.winner_id);
    const visible = Math.min(participants.length, 12);
    setWheelTarget(idx >= 0 && idx < visible ? idx : Math.floor(Math.random() * Math.max(visible, 1)));
  };

  const onWheelStop = () => {
    if (!pendingDraw) return;
    setRevealed(pendingDraw);
    setDrawing(false);
    confetti({
      particleCount: 200,
      spread: 110,
      origin: { y: 0.5 },
      colors: ['#1E7A4B', '#6BBF59', '#F0B429', '#EE7B1C'],
      disableForReducedMotion: true,
    });
    void load();
  };

  const toggleClaimed = async (draw: Draw) => {
    await supabase.from('ak_draws').update({ claimed: !draw.claimed }).eq('id', draw.id);
    void load();
  };

  const visibleMessages = useMemo(
    () =>
      messages.filter(
        (m) => (messageFilter === 'tous' || m.kind === messageFilter) && (showHandled || !m.handled)
      ),
    [messages, messageFilter, showHandled]
  );

  const pendingCount = useMemo(() => messages.filter((m) => !m.handled).length, [messages]);

  const toggleHandled = async (m: Message) => {
    await supabase.from('ak_messages').update({ handled: !m.handled }).eq('id', m.id);
    void load();
  };

  const removeMessage = async (id: string) => {
    await supabase.from('ak_messages').delete().eq('id', id);
    void load();
  };

  const exportMessages = () => {
    downloadCsv(
      `al-kindi-demandes-${new Date().toISOString().slice(0, 10)}.csv`,
      ['Date', 'Type', 'Nom', 'Contact', 'Moyen', 'Classe ou matières', 'Message', 'Traité'],
      visibleMessages.map((m) => [
        formatDate(m.created_at),
        KIND_LABEL[m.kind],
        m.name,
        m.contact,
        m.contact_kind === 'email' ? 'Email' : 'Téléphone',
        m.detail ?? '',
        m.message,
        m.handled ? 'Oui' : 'Non',
      ])
    );
  };

  const exportParticipants = () => {
    downloadCsv(
      `al-kindi-participants-${period}.csv`,
      ['Date', 'Prénom', 'Contact', 'Moyen', 'Classe', 'Score', 'Accord parental'],
      participants.map((p) => [
        formatDate(p.created_at),
        p.first_name,
        p.contact,
        p.contact_kind === 'email' ? 'Email' : 'Téléphone',
        p.school_level ?? '',
        `${p.score}/10`,
        p.parental_ok ? 'Oui' : 'Non',
      ])
    );
  };

  const removeParticipant = async (id: string) => {
    await supabase.from('ak_participants').delete().eq('id', id);
    void load();
  };

  if (!supabaseReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ak-cream px-6 text-center">
        <p className="max-w-md text-[15px] font-semibold text-ak-text">
          Le tirage n’est pas configuré : il manque les variables VITE_SUPABASE_URL et
          VITE_SUPABASE_PUBLISHABLE_KEY.
        </p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ak-cream">
        <Loader2 className="animate-spin text-ak-green" size={28} />
      </div>
    );
  }

  // --- Connexion -------------------------------------------------------------
  if (!signedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ak-cream px-5">
        <form onSubmit={signIn} className="ak-card w-full max-w-sm p-8">
          <img src="/media/logo-mini.webp" alt="" className="mx-auto h-16 w-16 rounded-2xl object-cover" />
          <h1 className="mt-5 text-center text-[22px] font-extrabold text-ak-ink">Espace association</h1>
          <p className="mt-2 text-center text-[14px] text-ak-text">
            Entrez le code de l’association pour accéder au tirage.
          </p>

          <label className="mt-7 block">
            <span className="text-[13px] font-bold uppercase tracking-wide text-ak-text">
              Code d’accès
            </span>
            <input
              className="ak-input mt-2 text-center tracking-[0.12em]"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              autoFocus
              required
            />
          </label>

          {authError && (
            <p className="mt-4 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={authBusy}
            className="btn-press mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ak-green border-ak-greenDark px-7 py-4 text-[16px] font-bold text-white disabled:opacity-60"
          >
            {authBusy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={17} strokeWidth={2.4} />}
            Entrer
          </button>
        </form>
      </div>
    );
  }

  // --- Dashboard -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-ak-cream pb-20">
      <header className="border-b-2 border-ak-ink/10 bg-ak-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <img src="/media/logo-mini.webp" alt="" className="h-11 w-11 rounded-2xl object-cover" />
            <div>
              <p className="text-[16px] font-extrabold text-ak-ink">Tirage du mois</p>
              <p className="text-[13px] text-ak-text">Espace association Al Kindi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ak-ink/12 bg-white px-4 py-2 text-[13px] font-bold text-ak-text hover:border-ak-ink/30"
          >
            <LogOut size={15} strokeWidth={2.2} />
            Quitter
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Barre de période */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-[14px] font-bold text-ak-text">
            <Calendar size={16} strokeWidth={2.2} />
            Mois
          </span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border-2 border-ak-ink/12 bg-white px-4 py-2.5 text-[14px] font-bold text-ak-ink"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {periodLabel(p)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-ak-ink/12 bg-white px-4 py-2.5 text-[14px] font-bold text-ak-text hover:border-ak-ink/30"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} strokeWidth={2.2} />
            Actualiser
          </button>
        </div>

        {error && (
          <p className="mt-5 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
            {error}
          </p>
        )}

        {/* Chiffres */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="ak-card p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ak-orange/10 text-ak-orange">
              <Inbox size={20} strokeWidth={2.2} />
            </span>
            <p className="mt-4 text-[32px] font-extrabold leading-none text-ak-ink">{pendingCount}</p>
            <p className="mt-1 text-[14px] text-ak-text">demandes à traiter</p>
          </div>
          <div className="ak-card p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ak-green/10 text-ak-green">
              <Users size={20} strokeWidth={2.2} />
            </span>
            <p className="mt-4 text-[32px] font-extrabold leading-none text-ak-ink">{participants.length}</p>
            <p className="mt-1 text-[14px] text-ak-text">participants ce mois</p>
          </div>
          <div className="ak-card p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ak-gold/20 text-[#B8860B]">
              <Trophy size={20} strokeWidth={2.2} />
            </span>
            <p className="mt-4 text-[18px] font-extrabold leading-tight text-ak-ink">
              {drawOfPeriod ? drawOfPeriod.winner_name : 'Pas encore tiré'}
            </p>
            <p className="mt-1 text-[14px] text-ak-text">gagnant du mois</p>
          </div>
          <div className="ak-card p-6">
            <img src={PERSO.trophee} alt="" width={192} height={192} loading="lazy" className="h-11 w-11" />
            <p className="mt-4 text-[18px] font-extrabold leading-tight text-ak-ink">{draws.length}</p>
            <p className="mt-1 text-[14px] text-ak-text">tirages réalisés</p>
          </div>
        </div>

        {/* Demandes reçues depuis le formulaire du site */}
        <section className="ak-card mt-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ak-ink/10 px-6 py-5">
            <div>
              <h2 className="text-[20px] font-extrabold text-ak-ink">Demandes reçues</h2>
              <p className="mt-1 text-[14px] text-ak-text">
                Tout ce qui est envoyé depuis le formulaire du site arrive ici.
              </p>
            </div>
            <button
              type="button"
              onClick={exportMessages}
              disabled={visibleMessages.length === 0}
              className="btn-press inline-flex items-center gap-2 rounded-2xl bg-ak-ink border-black/25 px-5 py-3 text-[14px] font-bold text-white disabled:opacity-40"
            >
              <Download size={16} strokeWidth={2.4} />
              Exporter en CSV
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b-2 border-ak-ink/10 px-6 py-4">
            {(['tous', 'inscription', 'benevolat', 'autre'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setMessageFilter(f)}
                className={`rounded-full border-2 px-4 py-2 text-[13px] font-bold transition-colors ${
                  messageFilter === f
                    ? 'bg-ak-green border-ak-green text-white'
                    : 'bg-white border-ak-ink/12 text-ak-text hover:border-ak-green/50'
                }`}
              >
                {f === 'tous' ? 'Toutes' : KIND_LABEL[f]}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-[13px] font-bold text-ak-text">
              <input
                type="checkbox"
                checked={showHandled}
                onChange={(e) => setShowHandled(e.target.checked)}
                className="h-4 w-4 accent-[#1E7A4B]"
              />
              Afficher les demandes traitées
            </label>
          </div>

          {visibleMessages.length === 0 ? (
            <p className="px-6 py-10 text-center text-[15px] text-ak-text">
              Aucune demande à afficher pour l’instant.
            </p>
          ) : (
            <ul className="divide-y divide-ak-ink/8">
              {visibleMessages.map((m) => (
                <li key={m.id} className={`px-6 py-5 ${m.handled ? 'opacity-60' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${KIND_TONE[m.kind]}`}>
                          {KIND_LABEL[m.kind]}
                        </span>
                        <span className="text-[16px] font-extrabold text-ak-ink">{m.name}</span>
                        {m.detail && (
                          <span className="rounded-full bg-ak-ink/8 px-2.5 py-0.5 text-[12px] font-bold text-ak-text">
                            {m.detail}
                          </span>
                        )}
                      </div>
                      <a
                        href={m.contact_kind === 'email' ? `mailto:${m.contact}` : `tel:${m.contact}`}
                        className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ak-text hover:text-ak-green"
                      >
                        {m.contact_kind === 'email' ? <Mail size={13} /> : <Phone size={13} />}
                        {m.contact}
                      </a>
                      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[1.65] text-ak-text">
                        {m.message}
                      </p>
                      <p className="mt-2 text-[12px] text-ak-text/60">{formatDate(m.created_at)}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleHandled(m)}
                        className={`rounded-xl border-2 px-3 py-2 text-[13px] font-bold ${
                          m.handled
                            ? 'bg-ak-green border-ak-green text-white'
                            : 'bg-white border-ak-ink/12 text-ak-text hover:border-ak-green/50'
                        }`}
                      >
                        <Check size={15} strokeWidth={2.6} className="inline" />
                        <span className="ml-1.5">{m.handled ? 'Traitée' : 'À traiter'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMessage(m.id)}
                        className="rounded-xl border-2 border-ak-ink/10 p-2 text-ak-text hover:border-red-300 hover:text-red-600"
                        aria-label={`Supprimer la demande de ${m.name}`}
                      >
                        <Trash2 size={16} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Roue de tirage */}
        <section className="ak-card mt-6 p-6 sm:p-8">
          <h2 className="text-[20px] font-extrabold text-ak-ink">Tirage de {periodLabel(period)}</h2>
          <p className="mt-2 text-[15px] leading-[1.7] text-ak-text">
            Le gagnant est tiré par la base de données, pas par le navigateur : la roue ne fait que montrer
            le résultat. Un seul tirage possible par mois.
          </p>

          <div className="mt-8 flex flex-col items-center">
            {(drawing || revealed || drawOfPeriod) && participants.length > 0 && (
              <Wheel segments={segments} target={wheelTarget} onFinish={onWheelStop} size={300} />
            )}

            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 w-full rounded-3xl border-2 border-ak-gold/50 bg-ak-gold/10 p-6 text-center"
                >
                  <img src={PERSO.fete} alt="" width={192} height={192} loading="lazy" className="mx-auto h-16 w-16" />
                  <p className="mt-3 text-[22px] font-extrabold text-ak-ink">{revealed.winner_name}</p>
                  <p className="mt-1 text-[15px] font-semibold text-ak-text">{revealed.winner_contact}</p>
                  <p className="mt-3 text-[14px] text-ak-text">
                    {revealed.entrants} participant{revealed.entrants > 1 ? 's' : ''} ce mois. Lot :{' '}
                    {revealed.prize}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!drawOfPeriod && !revealed && (
              <button
                type="button"
                onClick={runDraw}
                disabled={drawing || participants.length === 0}
                className="btn-press mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-ak-orange border-[#C4620F] px-8 py-4 text-[16px] font-extrabold text-white disabled:opacity-50"
              >
                {drawing ? <Loader2 size={18} className="animate-spin" /> : <Trophy size={18} strokeWidth={2.4} />}
                {participants.length === 0 ? 'Aucun participant' : 'Lancer le tirage du mois'}
              </button>
            )}

            {drawOfPeriod && !revealed && (
              <div className="mt-6 w-full rounded-3xl border-2 border-ak-green/40 bg-ak-green/8 p-6 text-center">
                <p className="text-[14px] font-bold uppercase tracking-wide text-ak-green">Déjà tiré</p>
                <p className="mt-2 text-[22px] font-extrabold text-ak-ink">{drawOfPeriod.winner_name}</p>
                <p className="mt-1 text-[15px] font-semibold text-ak-text">{drawOfPeriod.winner_contact}</p>
                <button
                  type="button"
                  onClick={() => toggleClaimed(drawOfPeriod)}
                  className={`btn-press mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-[14px] font-bold ${
                    drawOfPeriod.claimed
                      ? 'bg-ak-green border-ak-greenDark text-white'
                      : 'bg-white border-ak-ink/15 text-ak-ink'
                  }`}
                >
                  <Check size={16} strokeWidth={2.6} />
                  {drawOfPeriod.claimed ? 'Lot remis' : 'Marquer le lot comme remis'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Participants */}
        <section className="ak-card mt-6 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ak-ink/10 px-6 py-5">
            <div>
              <h2 className="text-[20px] font-extrabold text-ak-ink">
                Participants de {periodLabel(period)}
              </h2>
              <p className="mt-1 text-[14px] text-ak-text">
                Coordonnées d’élèves : à ne pas diffuser, et à effacer une fois le lot remis.
              </p>
            </div>
            <button
              type="button"
              onClick={exportParticipants}
              disabled={participants.length === 0}
              className="btn-press inline-flex items-center gap-2 rounded-2xl bg-ak-ink border-black/25 px-5 py-3 text-[14px] font-bold text-white disabled:opacity-40"
            >
              <Download size={16} strokeWidth={2.4} />
              Exporter en CSV
            </button>
          </div>

          {participants.length === 0 ? (
            <p className="px-6 py-10 text-center text-[15px] text-ak-text">
              Personne n’a encore décroché de ticket ce mois-ci.
            </p>
          ) : (
            <ul className="divide-y divide-ak-ink/8">
              {participants.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-bold text-ak-ink">
                      {p.first_name}
                      {p.school_level && (
                        <span className="ml-2 rounded-full bg-ak-ink/8 px-2.5 py-0.5 text-[12px] font-bold text-ak-text">
                          {p.school_level}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[14px] text-ak-text">
                      {p.contact_kind === 'email' ? <Mail size={13} /> : <Phone size={13} />}
                      {p.contact}
                    </p>
                  </div>
                  <span className="rounded-full bg-ak-green/10 px-3 py-1.5 text-[13px] font-bold text-ak-green">
                    {p.score}/10
                  </span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(p.id)}
                    className="rounded-xl border-2 border-ak-ink/10 p-2 text-ak-text hover:border-red-300 hover:text-red-600"
                    aria-label={`Supprimer ${p.first_name}`}
                  >
                    <Trash2 size={16} strokeWidth={2.2} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Historique */}
        {draws.length > 0 && (
          <section className="ak-card mt-6 overflow-hidden">
            <div className="border-b-2 border-ak-ink/10 px-6 py-5">
              <h2 className="text-[20px] font-extrabold text-ak-ink">Historique des tirages</h2>
            </div>
            <ul className="divide-y divide-ak-ink/8">
              {draws.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                  <span className="rounded-full bg-ak-ink/8 px-3 py-1.5 text-[13px] font-bold text-ak-text">
                    {periodLabel(d.period)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-ak-ink">{d.winner_name}</p>
                    <p className="text-[13px] text-ak-text">
                      {d.winner_contact} · {d.entrants} participant{d.entrants > 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleClaimed(d)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${
                      d.claimed ? 'bg-ak-green text-white' : 'bg-ak-gold/20 text-[#B8860B]'
                    }`}
                  >
                    {d.claimed ? 'Lot remis' : 'À remettre'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default Admin;
