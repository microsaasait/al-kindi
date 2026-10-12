// ⚠️  FICHIER GÉNÉRÉ — ne pas éditer ici.
// Source : K-BIR-X-AIT-SaaS/tracker/analytics.ts · régénérer avec `node tracker/sync.mjs`

// ─────────────────────────────────────────────────────────────────────────────
// K-BIR Analytics — tracker universel (Firestore REST, zéro dépendance)
//
// SOURCE DE VÉRITÉ : K-BIR-X-AIT-SaaS/tracker/analytics.ts
// Ne jamais éditer la copie d'un site directement — modifier ce fichier puis
// relancer `node tracker/sync.mjs` qui régénère les copies (SITE_ID injecté).
//
// Ce qu'on collecte :
//   • collection `analytics`       — une visite = une page vue (durée, scroll…)
//   • collection `analyticsEvents` — un événement = vue / survol / clic / achat
//
// Marquage des CTA (fait à la main sur chaque site) :
//   <a data-track="reserve" data-track-label="Hero — Réserver">Réserver</a>
//   data-track       → nom court de l'action (reserve, call, menu, order…)
//   data-track-label → libellé lisible dans le dashboard (optionnel)
//   data-track-goal  → "conversion" si ce clic est l'objectif final du site
//
// Capté automatiquement sans marquage :
//   • RÉSERVATIONS — tout lien ou bouton dont le texte dit « Réserver / Book »
//     ou qui pointe vers une plateforme de résa (Zenchef, TheFork, SevenRooms…)
//     reçoit `data-track="reserve"` à la volée : vues, survols, clics et CTR
//     comme un CTA marqué à la main, avec la plateforme et la section.
//   • l'interaction avec un widget de réservation en iframe (`reserve_widget`)
//   • liens tel:, mailto:, WhatsApp, itinéraire, livraison, liens sortants
//   • les sections de page vues (`section_view`), un numéro ou un e-mail copié
//   • tout clic sur un élément interactif (autocapture, actif par défaut)
//
// Un élément peut être exclu de la captation avec data-track-ignore, ce qui
// couvre aussi ses descendants (utile sur un champ de recherche ou un formulaire
// qui contiendrait des données personnelles).
// ─────────────────────────────────────────────────────────────────────────────

const PROJECT = "k-bir-tools";
// Clé Firebase Web : publiable par design (protégée par les règles Firestore).
const API_KEY = "AIzaSyAGnYBsx5w4kz-Z3RUgG3CK7Df04GE9E8U";
const DOCS = `projects/${PROJECT}/databases/(default)/documents`;
const BASE = `https://firestore.googleapis.com/v1/${DOCS}`;
const COMMIT = `https://firestore.googleapis.com/v1/${DOCS}:commit?key=${API_KEY}`;

const SITE_ID = "al-kindi";
const NS = "alkindi"; // préfixe des clés localStorage / sessionStorage

// Garde-fous de volume : un site animé ou une boucle de rendu ne doit jamais
// pouvoir transformer le tracker en robinet d'écritures Firestore.
const MAX_EVENTS_PER_PAGE = 200;
const BATCH_SIZE = 15;
const BATCH_DELAY_MS = 3000;
const MAX_QUEUED_BEFORE_CONSENT = 60;

export interface AnalyticsOptions {
  /**
   * Attendre un appel explicite à `setConsent(true)` avant d'écrire quoi que ce
   * soit. Les événements sont mis en file d'attente en mémoire et partent d'un
   * coup si le consentement arrive, sont jetés s'il est refusé.
   * Les sites sans bandeau cookies laissent cette option à false.
   */
  requireConsent?: boolean;
  /** Enregistrer tout clic sur un élément interactif, sans marquage préalable. Actif par défaut. */
  autocapture?: boolean;
  /** Mesurer LCP / CLS / INP et les envoyer en fin de visite. Actif par défaut. */
  webVitals?: boolean;
  /** Autoriser le tracking en local (mise au point, tunnels de dev). */
  allowLocalhost?: boolean;
}

let _opts: Required<AnalyticsOptions> = {
  requireConsent: false,
  autocapture: true,
  webVitals: true,
  allowLocalhost: false,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getVisitorId(): { id: string; isNew: boolean } {
  try {
    const KEY = `${NS}_vid`;
    const stored = localStorage.getItem(KEY);
    if (stored) return { id: stored, isNew: false };
    const id = uid();
    localStorage.setItem(KEY, id);
    return { id, isNew: true };
  } catch {
    return { id: uid(), isNew: true }; // navigation privée / stockage bloqué
  }
}

function getSessionId(): string {
  try {
    const KEY = `${NS}_sid`;
    let id = sessionStorage.getItem(KEY);
    if (!id) { id = uid(); sessionStorage.setItem(KEY, id); }
    return id;
  } catch {
    return fallbackSession();
  }
}

// Généré à la première demande, JAMAIS au chargement du module : ce fichier est
// aussi importé côté serveur, et l'exécution SSR d'Hydrogen se fait dans un
// Worker Cloudflare (Oxygen) qui interdit toute valeur aléatoire, tout timer et
// toute I/O dans le scope global. Un `const x = uid()` ici fait échouer le
// déploiement entier, pas seulement le tracker.
let _fallbackSessionId = "";

function fallbackSession(): string {
  if (!_fallbackSessionId) _fallbackSessionId = uid();
  return _fallbackSessionId;
}

function getDevice(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/Firefox/i.test(ua)) return "Firefox";
  if (/Edg/i.test(ua)) return "Edge";
  if (/OPR|Opera/i.test(ua)) return "Opera";
  if (/Chrome/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return "Other";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Other";
}

// ── Attribution ──────────────────────────────────────────────────────────────
// Ce que « d'où vient ce visiteur » veut dire, dans l'ordre de fiabilité :
//   1. les UTM posés sur le lien              → la vérité déclarée
//   2. l'identifiant de clic publicitaire     → prouve que c'est du payant
//   3. le referrer                            → à défaut, on devine

const SEARCH_ENGINES = /google|bing|duckduckgo|yahoo|ecosia|qwant|brave|baidu|yandex/i;
const SOCIAL_NETWORKS =
  /facebook|instagram|tiktok|youtube|linkedin|twitter|^t\.co$|x\.com|pinterest|snapchat|reddit|whatsapp|messenger|threads/i;
// Un identifiant de clic dans l'URL est la preuve la plus solide de payant :
// il est posé par la régie elle-même, contrairement aux UTM qu'on oublie.
const CLICK_IDS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "ttclid", "twclid", "li_fat_id", "epik"];

export interface Attribution {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  clickId: string;      // valeur brute (tronquée)
  clickIdType: string;  // gclid, fbclid, ttclid…
  channel: string;      // paid_search | paid_social | organic_search | social | email | referral | direct
  referrerHost: string;
  landingPage: string;
}

const EMPTY_ATTRIBUTION: Attribution = {
  utmSource: "", utmMedium: "", utmCampaign: "", utmTerm: "", utmContent: "",
  clickId: "", clickIdType: "", channel: "direct", referrerHost: "", landingPage: "",
};

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Déduit le canal d'acquisition à partir des UTM, du clickId et du referrer. */
function deriveChannel(a: Omit<Attribution, "channel">): string {
  const medium = a.utmMedium.toLowerCase();
  const source = a.utmSource.toLowerCase();
  const paidMedium = /^(cpc|ppc|paid|paidsearch|paid_search|paidsocial|paid_social|cpm|display|retargeting)$/.test(medium);

  if (a.clickIdType === "gclid" || a.clickIdType === "gbraid" || a.clickIdType === "wbraid" || a.clickIdType === "msclkid") {
    return "paid_search";
  }
  if (a.clickIdType === "fbclid" || a.clickIdType === "ttclid" || a.clickIdType === "twclid" || a.clickIdType === "li_fat_id") {
    return "paid_social";
  }
  if (medium === "email" || medium === "newsletter" || source === "klaviyo" || source === "mailchimp") return "email";
  if (medium === "sms") return "sms";
  if (medium === "affiliate" || medium === "affiliation") return "affiliate";
  if (paidMedium) return SOCIAL_NETWORKS.test(source) ? "paid_social" : "paid_search";
  if (medium === "social" || (source && SOCIAL_NETWORKS.test(source))) return "social";
  if (source && SEARCH_ENGINES.test(source)) return "organic_search";
  if (a.utmSource || a.utmCampaign) return "campaign";

  if (a.referrerHost) {
    if (SEARCH_ENGINES.test(a.referrerHost)) return "organic_search";
    if (SOCIAL_NETWORKS.test(a.referrerHost)) return "social";
    return "referral";
  }
  return "direct";
}

/** Lit l'attribution de l'URL courante. */
function readAttribution(): Attribution {
  const p = new URLSearchParams(location.search);
  let clickId = "";
  let clickIdType = "";
  for (const key of CLICK_IDS) {
    const v = p.get(key);
    if (v) { clickId = v.slice(0, 120); clickIdType = key; break; }
  }
  const referrerHost = hostOf(document.referrer);
  // Un referrer interne n'est pas une source : c'est de la navigation.
  const external = referrerHost && referrerHost !== location.hostname.replace(/^www\./, "") ? referrerHost : "";

  const partial = {
    utmSource: (p.get("utm_source") ?? "").slice(0, 80),
    utmMedium: (p.get("utm_medium") ?? "").slice(0, 80),
    utmCampaign: (p.get("utm_campaign") ?? "").slice(0, 120),
    utmTerm: (p.get("utm_term") ?? "").slice(0, 120),
    utmContent: (p.get("utm_content") ?? "").slice(0, 120),
    clickId,
    clickIdType,
    referrerHost: external,
    landingPage: location.pathname.slice(0, 200),
  };
  return { ...partial, channel: deriveChannel(partial) };
}

/**
 * Attribution de la session : figée à la première page vue, pour ne pas
 * réattribuer un visiteur à « direct » dès qu'il change de page.
 */
function getSource(): Attribution {
  try {
    const KEY = `${NS}_src`;
    const fresh = readAttribution();
    const hasSignal = fresh.utmSource || fresh.clickId || fresh.referrerHost || fresh.utmCampaign;

    const saved = sessionStorage.getItem(KEY);
    if (saved && !hasSignal) return { ...EMPTY_ATTRIBUTION, ...(JSON.parse(saved) as Partial<Attribution>) };
    // Un nouveau signal en cours de session (retour depuis une pub) écrase
    // l'ancien : c'est le dernier contact qui a ramené le visiteur.
    if (hasSignal) sessionStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    return EMPTY_ATTRIBUTION;
  }
}

/** Premier contact du visiteur, tous appareils confondus — jamais écrasé. */
function getFirstTouch(current: Attribution): { channel: string; source: string; campaign: string; date: string } {
  const fallback = {
    channel: current.channel,
    source: current.utmSource || current.referrerHost || "direct",
    campaign: current.utmCampaign,
    date: new Date().toISOString(),
  };
  try {
    const KEY = `${NS}_ft`;
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved) as typeof fallback;
    localStorage.setItem(KEY, JSON.stringify(fallback));
    return fallback;
  } catch {
    return fallback;
  }
}

// ── Encodage Firestore ───────────────────────────────────────────────────────

function toFs(v: unknown): Record<string, unknown> {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") {
    // Les prix ne survivraient pas à un arrondi : on garde un double dès qu'il
    // y a des décimales, un entier sinon (le dashboard lit les deux).
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFs) } };
  if (v && typeof v === "object") {
    const f: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) f[k] = toFs(val);
    return { mapValue: { fields: f } };
  }
  return { nullValue: null };
}

function doc(fields: Record<string, unknown>) {
  const f: Record<string, Record<string, unknown>> = {};
  for (const [k, val] of Object.entries(fields)) f[k] = toFs(val);
  return { fields: f };
}

function post(collection: string, fields: Record<string, unknown>): Promise<string | null> {
  return fetch(`${BASE}/${collection}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc(fields)),
    keepalive: true,
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => (d as { name?: string } | null)?.name ?? null)
    .catch(() => null); // jamais bloquer le site
}

function label(el: Element): string {
  const explicit = el.getAttribute("data-track-label");
  if (explicit) return explicit.slice(0, 80);
  const text = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
  return (text || el.tagName.toLowerCase()).slice(0, 80);
}

// ── État ──────────────────────────────────────────────────────────────────────

let _path: string | null = null; // chemin Firestore de la visite en cours
let _t0 = 0;                     // horodatage du chargement de la page
let _page = "";                  // page suivie actuellement
let _maxScroll = 0;              // profondeur de scroll max (%) sur cette page
let _visitor = { id: "", isNew: false };
let _started = false;
let _clicks = 0;                 // clics CTA sur cette page vue
let _eventsThisPage = 0;         // garde-fou anti-emballement
let _activeMs = 0;               // temps onglet visible, hors arrière-plan
let _lastActiveAt = 0;
let _pageIndex = 0;               // rang de la page dans la session (1 = arrivée)

// Déduplication : un CTA n'envoie qu'une vue et qu'un survol par session.
const _seenView = new Set<string>();
const _seenHover = new Set<string>();

// ── Consentement ──────────────────────────────────────────────────────────────

type Consent = "pending" | "granted" | "denied";
let _consent: Consent = "granted";
let _queue: Array<{ collection: string; fields: Record<string, unknown> }> = [];

/**
 * Autorise ou refuse la collecte. À brancher sur le bandeau cookies du site
 * (sur Shopify : l'API customerPrivacy). Sans appel, et si `requireConsent`
 * n'est pas activé, la collecte démarre immédiatement.
 */
export function setConsent(granted: boolean): void {
  if (_consent === (granted ? "granted" : "denied")) return;
  _consent = granted ? "granted" : "denied";
  if (!granted) { _queue = []; return; }
  const pending = _queue;
  _queue = [];
  for (const item of pending) enqueue(item.collection, item.fields);
  flushEvents();
  // La visite en cours n'a pas pu être créée sans consentement : on la crée
  // maintenant, sinon les événements arrivent sans page vue correspondante.
  if (_started && !_path) void createVisit(_page || location.pathname);
}

// ── File d'envoi ──────────────────────────────────────────────────────────────
// Les événements partent par lots : un clic ne doit pas coûter une requête
// réseau, sinon une page riche en interactions rame sur mobile.

let _batch: Array<{ collection: string; fields: Record<string, unknown> }> = [];
let _batchTimer: number | undefined;

function enqueue(collection: string, fields: Record<string, unknown>): void {
  if (_consent === "denied") return;
  if (_consent === "pending") {
    if (_queue.length < MAX_QUEUED_BEFORE_CONSENT) _queue.push({ collection, fields });
    return;
  }
  _batch.push({ collection, fields });
  if (_batch.length >= BATCH_SIZE) { flushEvents(); return; }
  if (_batchTimer === undefined) {
    _batchTimer = window.setTimeout(flushEvents, BATCH_DELAY_MS);
  }
}

function flushEvents(): void {
  if (_batchTimer !== undefined) { clearTimeout(_batchTimer); _batchTimer = undefined; }
  if (_batch.length === 0) return;
  const writes = _batch.map((item) => ({
    update: { name: `${DOCS}/${item.collection}/${uid()}`, ...doc(item.fields) },
  }));
  _batch = [];
  fetch(COMMIT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ writes }),
    keepalive: true, // survit à la fermeture de l'onglet
  }).catch(() => { /* silencieux */ });
}

// ── Visites ───────────────────────────────────────────────────────────────────

async function createVisit(page: string) {
  _t0 = Date.now();
  _lastActiveAt = Date.now();
  _activeMs = 0;
  _page = page;
  _maxScroll = 0;
  _clicks = 0;
  _eventsThisPage = 0;
  _pageIndex++;

  if (_consent !== "granted") { _path = null; return; }

  const src = getSource();
  const ft = getFirstTouch(src);
  _path = await post("analytics", {
    siteId: SITE_ID,
    visitorId: _visitor.id,
    sessionId: getSessionId(),
    isNewVisitor: _visitor.isNew,
    page,
    referrer: document.referrer || "",
    device: getDevice(),
    browser: getBrowser(),
    os: getOS(),
    language: navigator.language.split("-")[0],
    screenWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    timestamp: new Date().toISOString(),
    duration: 0,
    maxScroll: 0,
    ctaClicks: 0,
    activeTime: 0,
    firstTouchChannel: ft.channel,
    firstTouchSource: ft.source,
    firstTouchCampaign: ft.campaign,
    ...src,
  });
}

/** Écrit la durée, le scroll max et le temps actif sur la visite en cours. */
function flushVisit() {
  flushEvents();
  if (!_path || !_t0) return;
  const duration = Math.round((Date.now() - _t0) / 1000);
  if (duration < 2 && _maxScroll === 0 && _clicks === 0) return;

  const activeTime = Math.round(activeMsNow() / 1000);
  const mask = ["duration", "maxScroll", "ctaClicks", "activeTime"]
    .map((f) => `updateMask.fieldPaths=${f}`)
    .join("&");
  fetch(`https://firestore.googleapis.com/v1/${_path}?${mask}&key=${API_KEY}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc({ duration, maxScroll: _maxScroll, ctaClicks: _clicks, activeTime })),
    keepalive: true,
  }).catch(() => { /* silencieux */ });
}

/** Temps réellement passé onglet au premier plan. */
function activeMsNow(): number {
  if (document.visibilityState === "visible" && _lastActiveAt) {
    return _activeMs + (Date.now() - _lastActiveAt);
  }
  return _activeMs;
}

// ── Événements ────────────────────────────────────────────────────────────────

export interface EventOptions {
  label?: string;
  href?: string;
  goal?: boolean;
  value?: number;
  /** Champs libres : produit, sélecteur CSS, section de page, panier… */
  extra?: Record<string, unknown>;
}

/**
 * Envoie un événement. Utilisable à la main depuis n'importe quel composant :
 *   trackEvent("cta_click", "reserve", { label: "Bandeau flottant" })
 */
export function trackEvent(type: string, name: string, opts: EventOptions = {}): void {
  if (typeof window === "undefined" || !_started) return;
  if (_eventsThisPage >= MAX_EVENTS_PER_PAGE) return;
  _eventsThisPage++;

  enqueue("analyticsEvents", {
    siteId: SITE_ID,
    visitorId: _visitor.id,
    sessionId: getSessionId(),
    isNewVisitor: _visitor.isNew,
    type,
    name: name.slice(0, 110), // les règles Firestore refusent au-delà de 120
    label: (opts.label ?? name).slice(0, 120),
    href: (opts.href ?? "").slice(0, 300),
    page: _page || location.pathname,
    device: getDevice(),
    timestamp: new Date().toISOString(),
    isGoal: opts.goal === true,
    value: opts.value ?? 0,
    secondsOnPage: Math.round((Date.now() - _t0) / 1000),
    ...(opts.extra ?? {}),
  });
}

export interface CommerceItem {
  productId?: string;
  variantId?: string;
  title?: string;
  variantTitle?: string;
  vendor?: string;
  price?: number;
  quantity?: number;
}

/**
 * Événement e-commerce. `name` suit la nomenclature Shopify/Hydrogen :
 * product_viewed, collection_viewed, search_submitted, product_added_to_cart,
 * cart_viewed, checkout_started…
 */
export function trackCommerce(
  name: string,
  payload: { value?: number; currency?: string; items?: CommerceItem[]; goal?: boolean; label?: string; extra?: Record<string, unknown> } = {},
): void {
  const items = (payload.items ?? []).slice(0, 20).map((it) => ({
    productId: String(it.productId ?? "").slice(0, 60),
    variantId: String(it.variantId ?? "").slice(0, 60),
    title: String(it.title ?? "").slice(0, 100),
    variantTitle: String(it.variantTitle ?? "").slice(0, 60),
    vendor: String(it.vendor ?? "").slice(0, 60),
    price: Number(it.price ?? 0),
    quantity: Math.round(Number(it.quantity ?? 1)),
  }));
  trackEvent("commerce", name, {
    label: payload.label ?? name,
    goal: payload.goal === true,
    value: payload.value ?? 0,
    extra: {
      currency: payload.currency ?? "EUR",
      itemCount: items.reduce((n, it) => n + (it.quantity || 0), 0),
      items,
      ...(payload.extra ?? {}),
    },
  });
}

/**
 * Identifiants à rattacher à une commande pour rapprocher un achat de la
 * session qui l'a produite (attributs de panier Shopify, champ caché de
 * formulaire…). Sans ça, une vente ne peut pas être attribuée à sa source.
 */
export function getTrackingIds(): { visitorId: string; sessionId: string; attribution: Attribution } {
  return {
    visitorId: _visitor.id || getVisitorId().id,
    sessionId: getSessionId(),
    attribution: typeof window === "undefined" ? EMPTY_ATTRIBUTION : getSource(),
  };
}

// ── Réservations ──────────────────────────────────────────────────────────────
// Le cœur du suivi des sites restaurant : chaque intention de réserver doit
// être comptée, que le bouton ait été marqué à la main ou non.

/** Plateformes de réservation, reconnues à l'hôte du lien ou de l'iframe. */
const BOOKING_PROVIDERS: Array<[RegExp, string]> = [
  [/zenchef/i, "zenchef"],
  [/thefork|lafourchette/i, "thefork"],
  [/sevenrooms/i, "sevenrooms"],
  [/opentable/i, "opentable"],
  [/resy\.com/i, "resy"],
  [/guestonline/i, "guestonline"],
  [/covermanager/i, "covermanager"],
  [/tablebooker/i, "tablebooker"],
  [/formitable/i, "formitable"],
  [/resengo/i, "resengo"],
  [/quandoo/i, "quandoo"],
  [/bookatable/i, "bookatable"],
  [/mozrest/i, "mozrest"],
  [/planity/i, "planity"],
  [/calendly/i, "calendly"],
  [/reserve\.google|google\.[a-z.]+\/maps\/reserve/i, "google_reserve"],
  [/bookings?\.|\/booking|\/reservation|\/reserver|\/reserve(?:r)?(?:[/?#]|$)/i, "site"],
];

/** Plateformes de commande / livraison. */
const ORDER_PROVIDERS: Array<[RegExp, string]> = [
  [/ubereats|uber\.com\/.*eats/i, "ubereats"],
  [/deliveroo/i, "deliveroo"],
  [/just-?eat/i, "justeat"],
  [/glovo/i, "glovo"],
  [/delicity/i, "delicity"],
  [/sunday|sundayapp/i, "sunday"],
];

const RESERVE_TEXT = /\b(r[ée]serv\w*|book(ing)?|book a table)\b/i;

function providerOf(href: string, table: Array<[RegExp, string]>): string {
  if (!href) return "";
  for (const [re, name] of table) if (re.test(href)) return name;
  return "";
}

/** Nom d'action d'un élément non marqué, ou null si ce n'est pas une action clé. */
function intentOf(el: Element): { name: string; provider: string } | null {
  const href = el.getAttribute("href") ?? "";
  const text = label(el);
  if (href.startsWith("tel:")) return { name: "call", provider: "phone" };
  if (href.startsWith("sms:")) return { name: "sms", provider: "sms" };
  if (href.startsWith("mailto:")) return { name: "email", provider: "email" };
  if (/wa\.me|whatsapp\.com|api\.whatsapp/i.test(href)) return { name: "whatsapp", provider: "whatsapp" };
  const order = providerOf(href, ORDER_PROVIDERS);
  if (order) return { name: "order", provider: order };
  const booking = /^https?:|^\//i.test(href) ? providerOf(href, BOOKING_PROVIDERS) : "";
  if (booking) return { name: "reserve", provider: booking };
  if (RESERVE_TEXT.test(text) && !/r[ée]servation(s)? (ferm|complet)/i.test(text)) {
    return { name: "reserve", provider: href.startsWith("#") || !href ? "on_page" : (hostOf(href) || "site") };
  }
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.apple\.com|waze\.com/i.test(href)) {
    return { name: "directions", provider: "maps" };
  }
  return null;
}

/** Les actions qui sont l'objectif d'un site vitrine. */
const GOAL_NAMES = new Set(["reserve", "call", "order", "quote", "privatisation", "whatsapp", "sms", "signup", "events"]);

function isGoalName(name: string): boolean {
  return GOAL_NAMES.has(name);
}

const CANDIDATES = 'a[href],button,[role="button"],input[type="submit"],input[type="button"]';

/**
 * Pose `data-track` sur les actions clés non marquées, pour qu'elles aient
 * vues, survols et CTR comme les autres. Un marquage manuel n'est jamais écrasé.
 */
const _intentChecked = new WeakSet<Element>();

function markIfIntent(el: Element): boolean {
  if (_intentChecked.has(el)) return el.hasAttribute("data-track");
  _intentChecked.add(el);
  if (el.hasAttribute("data-track") || el.closest("[data-track]") || isIgnored(el)) return false;
  const intent = intentOf(el);
  if (!intent) return false;
  el.setAttribute("data-track", intent.name);
  el.setAttribute("data-track-auto", intent.provider);
  return true;
}

function autoMark(): void {
  // Chaque élément n'est examiné qu'une fois : sur un site animé, ce scan
  // repasse à chaque frame qui modifie le DOM.
  document.querySelectorAll(CANDIDATES).forEach((el) => { markIfIntent(el); });
}

/** Infos supplémentaires d'un clic sur une action marquée. */
function actionExtra(el: Element): Record<string, unknown> {
  const href = el.getAttribute("href") ?? "";
  const name = el.getAttribute("data-track") || "";
  let provider = el.getAttribute("data-track-auto") || "";
  if (!provider && name === "reserve") provider = providerOf(href, BOOKING_PROVIDERS) || (href.startsWith("#") || !href ? "on_page" : hostOf(href) || "site");
  if (!provider && name === "order") provider = providerOf(href, ORDER_PROVIDERS);
  const rect = el.getBoundingClientRect();
  const docH = document.documentElement.scrollHeight || 1;
  return {
    selector: cssPath(el),
    section: sectionOf(el),
    provider,
    autoMarked: el.hasAttribute("data-track-auto"),
    // Position verticale du bouton dans la page (0 = haut, 100 = bas) : distingue
    // le bouton du hero de celui du pied de page quand ils ont le même libellé.
    pagePosition: Math.round(((rect.top + (window.scrollY || 0)) / docH) * 100),
    scrollAtClick: _maxScroll,
    pageIndex: _pageIndex,
  };
}

// Widget de réservation en iframe : on ne voit pas ce qui s'y passe, mais on
// sait quand le visiteur clique dedans — la fenêtre perd le focus au profit de
// l'iframe. C'est l'étape entre « clic sur Réserver » et la réservation.
const _widgetSeen = new Set<string>();

function onWindowBlur(): void {
  window.setTimeout(() => {
    const el = document.activeElement;
    if (!el || el.tagName !== "IFRAME") return;
    const src = (el as HTMLIFrameElement).src || "";
    const host = hostOf(src);
    const booking = providerOf(src, BOOKING_PROVIDERS);
    const key = host || "iframe";
    if (_widgetSeen.has(key)) return;
    _widgetSeen.add(key);
    trackEvent(booking ? "reserve_widget" : "iframe_interaction", booking ? "reserve" : "iframe", {
      label: booking ? `Widget ${booking}` : host || "iframe",
      href: src.split("?")[0],
      extra: { provider: booking || host, section: sectionOf(el) },
    });
  }, 0);
}

// Sections vues : quelle part du site est réellement lue, et à partir de
// quelle section les visiteurs décrochent avant de réserver.
let _sectionIo: IntersectionObserver | null = null;
const _sectionsObserved = new WeakSet<Element>();
const _sectionsSeen = new Set<string>();
const MAX_SECTIONS_PER_PAGE = 30;

function sectionKey(el: Element): string {
  return (el.getAttribute("data-section") || el.getAttribute("id") || el.getAttribute("aria-label") || "").slice(0, 60);
}

function scanSections(): void {
  if (!_sectionIo) return;
  document.querySelectorAll("[data-section],section[id],section[aria-label],footer").forEach((el) => {
    if (_sectionsObserved.has(el)) return;
    _sectionsObserved.add(el);
    _sectionIo!.observe(el);
  });
}

function onSectionSeen(entries: IntersectionObserverEntry[]): void {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const el = entry.target;
    const name = sectionKey(el) || el.tagName.toLowerCase();
    const k = `${_page}|${name}`;
    if (_sectionsSeen.has(k)) continue;
    if ([..._sectionsSeen].filter((x) => x.startsWith(`${_page}|`)).length >= MAX_SECTIONS_PER_PAGE) continue;
    _sectionsSeen.add(k);
    trackEvent("section_view", name, { label: name, extra: { section: name } });
  }
}

// Un numéro ou une adresse copiés valent presque un appel : on les compte.
function onCopy(): void {
  const sel = (window.getSelection?.()?.toString() || "").trim();
  if (!sel || sel.length > 80) return;
  if (/(?:\+?\d[\s.-]?){9,}/.test(sel)) trackEvent("copy", "copy_phone", { label: "Numéro copié", goal: true });
  else if (/@[\w-]+\./.test(sel)) trackEvent("copy", "copy_email", { label: "E-mail copié" });
  else if (/\d{5}|rue|avenue|bd|boulevard|place|chemin/i.test(sel)) trackEvent("copy", "copy_address", { label: "Adresse copiée" });
}

/** Classe un lien non marqué : appel, mail, ou sortie vers un site externe. */
function autoKind(a: HTMLAnchorElement): { name: string; type: string } | null {
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return { name: "call", type: "cta_click" };
  if (href.startsWith("mailto:")) return { name: "email", type: "cta_click" };
  if (/^https?:/i.test(href)) {
    try {
      if (new URL(href).hostname !== location.hostname) return { name: "outbound", type: "outbound" };
    } catch { /* href malformé */ }
  }
  return null;
}

// ── Autocapture ───────────────────────────────────────────────────────────────

const INTERACTIVE = 'a,button,[role="button"],[role="tab"],[role="menuitem"],input[type="submit"],input[type="button"],select,summary,label[for]';

/**
 * Chemin CSS court et stable, pour retrouver l'élément dans le code.
 * On s'arrête à 4 niveaux : au-delà, la chaîne devient illisible sans être
 * plus discriminante.
 */
function cssPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  for (let depth = 0; node && depth < 4; depth++) {
    if (node.id) { parts.unshift(`#${node.id}`); break; }
    let part = node.tagName.toLowerCase();
    // Les classes utilitaires (Tailwind) sont du bruit : on garde les classes
    // porteuses de sens, qui contiennent un tiret ou décrivent un composant.
    const cls = (node.getAttribute("class") || "")
      .split(/\s+/)
      .filter((c) => c.length > 2 && c.length < 24 && !/^(flex|grid|block|p|m|w|h|text|bg|border|gap|rounded)[-\d]/.test(c))
      .slice(0, 2);
    if (cls.length) part += `.${cls.join(".")}`;
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(">").slice(0, 160);
}

/** Zone de la page où se trouve l'élément : hero, footer, nav… */
function sectionOf(el: Element): string {
  const holder = el.closest("[data-section],section,header,footer,nav,aside,dialog,form");
  if (!holder) return "";
  return (
    holder.getAttribute("data-section") ||
    holder.getAttribute("id") ||
    holder.getAttribute("aria-label") ||
    holder.tagName.toLowerCase()
  ).slice(0, 60);
}

function isIgnored(el: Element): boolean {
  return !!el.closest("[data-track-ignore]");
}

/**
 * Nom court et stable d'un élément autocapté, pour le regroupement.
 * Les accents sont dépliés AVANT le filtrage : sinon « protéinées » devient
 * « prot_in_es » et deux libellés proches cessent de se regrouper.
 */
function autoName(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const words = label(el)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 6); // au-delà, c'est une phrase, pas un nom d'action
  const text = words.join("_");
  return (text ? `${tag}_${text}` : tag).slice(0, 60);
}

// Rage click : trois clics au même endroit en moins d'une seconde. C'est le
// signal le plus fiable d'un élément qui a l'air cliquable mais ne répond pas.
let _rageCount = 0;
let _rageAt = 0;
let _rageX = 0;
let _rageY = 0;

function detectRage(e: MouseEvent, el: Element): void {
  const now = Date.now();
  const near = Math.abs(e.clientX - _rageX) < 30 && Math.abs(e.clientY - _rageY) < 30;
  if (near && now - _rageAt < 1000) {
    _rageCount++;
    if (_rageCount === 3) {
      trackEvent("rage_click", autoName(el), {
        label: label(el),
        extra: { selector: cssPath(el), section: sectionOf(el) },
      });
    }
  } else {
    _rageCount = 1;
  }
  _rageAt = now;
  _rageX = e.clientX;
  _rageY = e.clientY;
}

function onClick(e: Event) {
  const target = e.target as Element | null;
  if (!target?.closest) return;
  if (isIgnored(target)) return;

  // Un bouton apparu entre deux scans n'est pas encore marqué : on le classe
  // au moment du clic pour ne perdre aucune réservation.
  const candidate = target.closest(CANDIDATES);
  if (candidate && !target.closest("[data-track]")) markIfIntent(candidate);

  const marked = target.closest("[data-track]") as HTMLElement | null;
  if (marked) {
    const name = marked.getAttribute("data-track") || "cta";
    _clicks++;
    detectRage(e as MouseEvent, marked);
    const goalAttr = marked.getAttribute("data-track-goal");
    trackEvent("cta_click", name, {
      label: label(marked),
      href: marked.getAttribute("href") ?? "",
      // Un « reserve », « call », « order »… est un objectif même si personne
      // n'a pensé à poser data-track-goal ; data-track-goal="none" l'en retire.
      goal: goalAttr === "conversion" || (goalAttr !== "none" && isGoalName(name)),
      extra: actionExtra(marked),
    });
    return;
  }

  const a = target.closest("a") as HTMLAnchorElement | null;
  const kind = a ? autoKind(a) : null;
  if (a && kind) {
    if (kind.type === "cta_click") _clicks++;
    detectRage(e as MouseEvent, a);
    trackEvent(kind.type, kind.name, {
      label: label(a),
      href: a.getAttribute("href") ?? "",
      goal: kind.name === "call", // un appel est toujours une conversion
      extra: { selector: cssPath(a), section: sectionOf(a) },
    });
    return;
  }

  if (!_opts.autocapture) return;
  const el = target.closest(INTERACTIVE) as HTMLElement | null;
  if (!el) return;
  detectRage(e as MouseEvent, el);
  trackEvent("click", autoName(el), {
    label: label(el),
    href: el.getAttribute("href") ?? "",
    extra: {
      selector: cssPath(el),
      section: sectionOf(el),
      tag: el.tagName.toLowerCase(),
      testId: (el.getAttribute("data-testid") || "").slice(0, 60),
    },
  });
}

// Survol : ≥ 400 ms sur un CTA = intérêt réel, pas un passage de souris.
let _hoverTimer: number | undefined;

function onOver(e: Event) {
  const el = (e.target as Element | null)?.closest?.("[data-track]") as HTMLElement | null;
  if (!el) return;
  const key = `${el.getAttribute("data-track")}|${label(el)}`;
  if (_seenHover.has(key)) return;
  clearTimeout(_hoverTimer);
  _hoverTimer = window.setTimeout(() => {
    _seenHover.add(key);
    trackEvent("cta_hover", el.getAttribute("data-track") || "cta", { label: label(el) });
  }, 400);
}

function onOut() {
  clearTimeout(_hoverTimer);
}

// Vue d'un CTA : il est apparu à l'écran (dénominateur du taux de clic).
let _io: IntersectionObserver | null = null;
const _observed = new WeakSet<Element>();
let _scanQueued = false;

// Groupé sur une frame : les sites animés (framer-motion & co) déclenchent des
// centaines de mutations par seconde, on ne relance pas un querySelectorAll
// pour chacune.
function scanCtas() {
  if (!_io || _scanQueued) return;
  _scanQueued = true;
  requestAnimationFrame(() => {
    _scanQueued = false;
    if (!_io) return;
    autoMark();
    scanSections();
    document.querySelectorAll("[data-track]").forEach((el) => {
      if (_observed.has(el)) return;
      _observed.add(el);
      _io!.observe(el);
    });
  });
}

let _scrollQueued = false;

function onScroll() {
  if (_scrollQueued) return; // une mesure par frame : lire scrollHeight force un reflow
  _scrollQueued = true;
  requestAnimationFrame(() => {
    _scrollQueued = false;
    const h = document.documentElement;
    const total = h.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const pct = Math.min(100, Math.round(((window.scrollY || h.scrollTop) / total) * 100));
    if (pct > _maxScroll) _maxScroll = pct;
  });
}

function onSubmit(e: Event) {
  const form = e.target as HTMLElement | null;
  if (!form || isIgnored(form)) return;
  const name = form.getAttribute("data-track") || form.getAttribute("name") || "form";
  trackEvent("form_submit", name, { label: label(form), goal: true });
}

// ── Web Vitals ────────────────────────────────────────────────────────────────
// Mesure sans librairie : suffisant pour suivre une tendance et repérer une
// régression après un déploiement. Ce ne sont pas les chiffres officiels du
// CrUX, qui sont mesurés sur le terrain par Chrome.

const _vitals: { lcp: number; cls: number; inp: number } = { lcp: 0, cls: 0, inp: 0 };
let _vitalsSent = false;

function observeVitals(): void {
  if (!("PerformanceObserver" in window)) return;
  const safe = (type: string, cb: (list: PerformanceObserverEntryList) => void, opts?: PerformanceObserverInit) => {
    try {
      new PerformanceObserver(cb).observe({ type, buffered: true, ...(opts ?? {}) } as PerformanceObserverInit);
    } catch { /* type non supporté (Safari, Firefox) */ }
  };

  safe("largest-contentful-paint", (list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1] as PerformanceEntry | undefined;
    if (last) _vitals.lcp = Math.round(last.startTime);
  });

  safe("layout-shift", (list) => {
    for (const entry of list.getEntries() as unknown as Array<{ value: number; hadRecentInput: boolean }>) {
      if (!entry.hadRecentInput) _vitals.cls += entry.value;
    }
  });

  safe("event", (list) => {
    for (const entry of list.getEntries()) {
      const d = Math.round(entry.duration);
      if (d > _vitals.inp) _vitals.inp = d;
    }
  }, { durationThreshold: 40 } as PerformanceObserverInit);
}

function sendVitals(): void {
  if (_vitalsSent || !_opts.webVitals) return;
  if (!_vitals.lcp && !_vitals.cls && !_vitals.inp) return;
  _vitalsSent = true;
  trackEvent("web_vital", "page_performance", {
    label: _page || location.pathname,
    extra: {
      lcp: _vitals.lcp,
      cls: Math.round(_vitals.cls * 1000) / 1000,
      inp: _vitals.inp,
      connection: (navigator as unknown as { connection?: { effectiveType?: string } }).connection?.effectiveType ?? "",
    },
  });
}

// ── API publique ──────────────────────────────────────────────────────────────

export function initAnalytics(options: AnalyticsOptions = {}): void {
  if (typeof window === "undefined" || _started) return;
  _opts = {
    requireConsent: options.requireConsent === true,
    autocapture: options.autocapture !== false,
    webVitals: options.webVitals !== false,
    allowLocalhost: options.allowLocalhost === true,
  };
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (isLocal && !_opts.allowLocalhost) return;

  _started = true;
  _consent = _opts.requireConsent ? "pending" : "granted";
  _visitor = getVisitorId();

  if (_opts.webVitals) observeVitals();

  createVisit(location.pathname);

  if ("IntersectionObserver" in window) {
    _io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          const key = `${el.getAttribute("data-track")}|${label(el)}`;
          if (_seenView.has(key)) continue;
          _seenView.add(key);
          trackEvent("cta_view", el.getAttribute("data-track") || "cta", { label: label(el) });
        }
      },
      { threshold: 0.5 },
    );
    _sectionIo = new IntersectionObserver(onSectionSeen, { threshold: 0.35 });
    scanCtas();
    // Les CTA arrivent souvent après coup (rendu React, lazy loading).
    new MutationObserver(() => scanCtas()).observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("click", onClick, true);
  document.addEventListener("pointerover", onOver, true);
  document.addEventListener("pointerout", onOut, true);
  document.addEventListener("submit", onSubmit, true);
  document.addEventListener("copy", onCopy, true);
  window.addEventListener("blur", onWindowBlur);
  window.addEventListener("scroll", onScroll, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      _activeMs = activeMsNow();
      _lastActiveAt = 0;
      sendVitals();
      flushVisit();
    } else {
      _lastActiveAt = Date.now();
    }
  });
  window.addEventListener("pagehide", () => { sendVitals(); flushVisit(); });
}

/** Appelé à chaque changement de route SPA. */
export async function trackPageView(path: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (!_started) { initAnalytics(_opts); return; }
  if (path === _page) return;

  sendVitals();
  _vitalsSent = false; // chaque page a ses propres mesures
  flushVisit();      // ferme la visite précédente
  await createVisit(path);
  scanCtas();
}
