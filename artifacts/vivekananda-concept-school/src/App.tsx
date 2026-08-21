import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, BookMarked, BookOpen, BookText, Bus, Calculator, Check, ChevronDown, ChevronRight, FlaskConical, Globe2, GraduationCap, Instagram, Mail, MapPin, Menu, Phone, Quote, Search, Send, User, UserRound, Volume2, VolumeX, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
const WALLPAPER_TILE = { width: 897, height: 1753 };
const WALLPAPER_ICONS = [
  { file: 'apple-svgrepo-com.svg', leftPct: 1.2, topPct: 3, widthPct: 6 },
  { file: 'books-svgrepo-com.svg', leftPct: 92.6, topPct: 7, widthPct: 6 },
  { file: 'cricket-svgrepo-com.svg', leftPct: 2.2, topPct: 12, widthPct: 6.4 },
  { file: 'cup-svgrepo-com.svg', leftPct: 93.4, topPct: 17, widthPct: 5.6 },
  { file: 'educate-svgrepo-com.svg', leftPct: 1, topPct: 22, widthPct: 5.6 },
  { file: 'earth-svgrepo-com.svg', leftPct: 92.8, topPct: 27, widthPct: 6 },
  { file: 'giraffe-svgrepo-com.svg', leftPct: 2.4, topPct: 32, widthPct: 6.8 },
  { file: 'laptop-svgrepo-com.svg', leftPct: 93, topPct: 37, widthPct: 6 },
  { file: 'lion-svgrepo-com.svg', leftPct: 1.1, topPct: 42, widthPct: 6 },
  { file: 'paint-palette-palette-svgrepo-com.svg', leftPct: 92.7, topPct: 47, widthPct: 6 },
  { file: 'physical-education-svgrepo-com.svg', leftPct: 2, topPct: 52, widthPct: 5.6 },
  { file: 'rainbow-svgrepo-com.svg', leftPct: 92.4, topPct: 57, widthPct: 6.8 },
  { file: 'rocket-svgrepo-com.svg', leftPct: 1.3, topPct: 62, widthPct: 6 },
  { file: 'sleeping-svgrepo-com.svg', leftPct: 93.2, topPct: 67, widthPct: 5.6 },
  { file: 'star-svgrepo-com.svg', leftPct: 1.9, topPct: 72, widthPct: 5.6 },
  { file: 'sun-svgrepo-com.svg', leftPct: 92.9, topPct: 77, widthPct: 6 },
  { file: 'elephant-svgrepo-com.svg', leftPct: 1, topPct: 82, widthPct: 6.8 },
  { file: 'carrot-svgrepo-com.svg', leftPct: 93.3, topPct: 86, widthPct: 5.6 },
  { file: 'pineapple-svgrepo-com.svg', leftPct: 2.1, topPct: 90, widthPct: 5.6 },
  { file: 'bulb-svgrepo-com.svg', leftPct: 92.8, topPct: 94, widthPct: 6 },
  { file: 'apple-svgrepo-com.svg', leftPct: 1.5, topPct: 97, widthPct: 5.6 },
  { file: 'books-svgrepo-com.svg', leftPct: 92.5, topPct: 99, widthPct: 6 },
] as const;

/* The wallpaper is margin decoration: every icon sits in one of the two
   narrow gutters so nothing ever drifts across the column of reading. */
const ALL_TILE_ICONS = WALLPAPER_ICONS;

const FLOAT_VARIANTS = ['wallpaper-icon-float-a', 'wallpaper-icon-float-b', 'wallpaper-icon-float-c'];

function WallpaperTile() {
  return <div className="relative mx-auto w-full" style={{ aspectRatio: `${WALLPAPER_TILE.width} / ${WALLPAPER_TILE.height}` }}>
    {ALL_TILE_ICONS.map((icon, index) => <div key={`${icon.file}-${icon.leftPct}-${icon.topPct}`} className="wallpaper-icon-depth absolute" style={{ left: `${icon.leftPct}%`, top: `${icon.topPct}%`, width: `${icon.widthPct}%` }}>
      <img src={`/wallpaper-icons/${icon.file}`} alt="" aria-hidden="true" className={`block w-full opacity-50 ${FLOAT_VARIANTS[index % FLOAT_VARIANTS.length]}`} style={{ animationDelay: `${((index * 1.3) % 12).toFixed(2)}s`, animationDuration: `${(14 + (index % 7) * 2.2).toFixed(2)}s` }} />
    </div>)}
  </div>;
}

function WallpaperLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<{ el: HTMLDivElement; cx: number; cy: number }[]>([]);
  useEffect(() => {
    const container = layerRef.current; if (!container) return;
    const REPEL_RADIUS = 130;
    const REPEL_STRENGTH = 42;
    let measureQueued = false;
    const measure = () => {
      measureQueued = false;
      iconsRef.current = Array.from(container.querySelectorAll<HTMLDivElement>('.wallpaper-icon-depth')).map((el) => {
        const r = el.getBoundingClientRect();
        return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
    };
    const queueMeasure = () => { if (!measureQueued) { measureQueued = true; requestAnimationFrame(measure); } };
    queueMeasure();
    let moveQueued = false;
    const onMove = (event: MouseEvent) => {
      if (moveQueued) return; moveQueued = true;
      requestAnimationFrame(() => {
        moveQueued = false;
        for (const { el, cx, cy } of iconsRef.current) {
          const dx = cx - event.clientX; const dy = cy - event.clientY;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const force = 1 - dist / REPEL_RADIUS;
            el.style.setProperty('--repel-x', `${((dx / dist) * REPEL_STRENGTH * force).toFixed(1)}px`);
            el.style.setProperty('--repel-y', `${((dy / dist) * REPEL_STRENGTH * force).toFixed(1)}px`);
          } else {
            el.style.setProperty('--repel-x', '0px');
            el.style.setProperty('--repel-y', '0px');
          }
        }
      });
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', queueMeasure);
    window.addEventListener('scroll', queueMeasure, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', queueMeasure);
      window.removeEventListener('scroll', queueMeasure);
    };
  }, []);
  return <div ref={layerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="flex flex-col">
      {Array.from({ length: 16 }, (_, index) => <WallpaperTile key={index} />)}
    </div>
  </div>;
}


const queryClient = new QueryClient();
/* `#…` scrolls to a section on the home page; `/…` is a route of its own. The
   nav treats the two differently, so they can sit in one list. */
const navItems = [
  ['Home', '/'], ['About Us', '#about'], ['Results', '#results'], ['Facilities', '#media'],
  ['Gallery', '/gallery'], ['Blogs', '#blogs'], ['Contact Us', '#contact'],
] as const;
/* The header carries the six-item nav from the design; `navItems` above stays
   the fuller list the footer prints. */
/* `Home` is a route rather than `#top`: from a branch page the anchor would
   only scroll that branch's own hero into view, where what is wanted is the
   way back to the group. Faculty is gone from here — it belongs to a branch
   now — and Gallery has a page of its own. */
const headerNavItems = [
  ['Home', '/'], ['About Us', '#about'], ['Results', '#results'],
  ['Facilities', '#media'], ['Gallery', '/gallery'],
] as const;

function useReveals(key?: string) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [key]);
}

/* `branchName` prints under the wordmark on a branch route, and `hideGroup`
   drops the GROUP OF SCHOOLS line there — that line belongs to the group's
   own pages, not to one school inside it. */
function Logo({ footer = false, branchName, shimmer = 0 }: { footer?: boolean; branchName?: string; shimmer?: number }) {
  return <a href="#top" className="flex shrink-0 items-center gap-3.5" data-testid="link-logo">
    <span className="relative block h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full sm:h-[82px] sm:w-[82px]">
      <img src="/logo.jpeg" alt="Sree Vivekananda Educational Society logo" className="h-full w-full object-cover" />
      {/* Keyed on the click count: a fresh element each click is what restarts
          the animation, since re-rendering the same node would not. */}
      {shimmer > 0 && <span key={shimmer} className="logo-shimmer" aria-hidden="true" />}
    </span>
    <span className="leading-none">
      <b className={`block font-round text-[clamp(.9rem,1.5vw,1.35rem)] font-extrabold tracking-[.045em] ${footer ? 'text-white' : 'text-[#123A5E]'}`}>SREE VIVEKANANDA</b>
      <small className={`mt-[6px] block text-[clamp(.55rem,.75vw,.75rem)] font-semibold tracking-[.15em] sm:tracking-[.2em] ${footer ? 'text-white/70' : 'text-[#7C8B99]'}`}>EDUCATIONAL SOCIETY</small>
      {branchName && <small className={`mt-[6px] block text-[clamp(.62rem,.9vw,.82rem)] font-semibold tracking-[.06em] ${footer ? 'text-white' : 'text-[#2E6A9E]'}`} data-testid="text-header-branch">{branchName}</small>}
    </span>
  </a>;
}

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const [branchesOpen, setBranchesOpen] = useState(false);
  /* Bumped on every nav click; the crest reads it as the cue to flash. */
  const [shimmer, setShimmer] = useState(0);
  const [location, navigate] = useLocation();
  /* A route of its own owns the highlight outright; on the home page the
     highlight follows whichever section link was last taken. */
  const [active, setActive] = useState(() => location);
  useEffect(() => { setActive(location); }, [location]);
  /* Read while rendering rather than at module load: `BRANCHES` is declared
     further down the file, so a top-level derivation would run too early. */
  const branchLinks = Object.entries(BRANCHES);
  const onBranch = location.startsWith('/branch/');
  /* Results and Facilities are home-page sections; from a branch the links
     would only bounce you back to the group site, so they are dropped there
     in favour of Faculty, which is a section that exists on branch pages and
     nowhere else. */
  const items: readonly (readonly [string, string])[] = onBranch
    ? headerNavItems.flatMap(([label, href]) => {
        if (href === '#results' || href === '#media') return [];
        if (href === '#about') return [[label, href], ['Faculty', '#faculty']];
        return [[label, href]];
      })
    : headerNavItems;
  const currentBranch = onBranch ? BRANCHES[location.slice('/branch/'.length)] : undefined;
  const go = (href: string) => {
    setOpen(false);
    setBranchesOpen(false);
    setShimmer((count) => count + 1);
    setActive(href);
    if (!href.startsWith('#')) { navigate(href); window.scrollTo({ top: 0 }); return; }
    const target = document.querySelector(href);
    if (target) { target.scrollIntoView({ behavior: 'smooth' }); return; }
    /* The section is on the home page and we are not on it — the anchor would
       otherwise do nothing at all from /faculty. Route home first, then
       scroll on the frame after the sections have mounted. */
    navigate('/');
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })));
  };
  return <header className="relative z-30 border-b border-[#EFE7D7] bg-white">
    <div className="container-hero flex min-h-[80px] items-center justify-between gap-4 sm:min-h-[104px] sm:gap-6">
      <Logo branchName={currentBranch?.streetName} shimmer={shimmer} />
      <nav className="hidden items-center gap-[clamp(.9rem,2.1vw,2.1rem)] lg:flex" aria-label="Primary navigation">
        {items.map(([label, href]) => {
          const on = active === href;
          return <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} aria-current={on ? 'page' : undefined} className={`relative whitespace-nowrap pb-[6px] text-[clamp(.9rem,1.05vw,1.06rem)] font-semibold transition-colors ${on ? 'text-[#1B7A3E]' : 'text-[#153B5B] hover:text-[#1B7A3E]'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
            {label}
            <span className={`absolute -bottom-[3px] left-0 h-[3px] rounded-full bg-[#1B7A3E] transition-all duration-300 ${on ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
          </a>;
        })}
        {/* The three branches are routes, not sections, so they hang off one
            menu rather than lengthening a nav that is already full. */}
        <div className="relative" onMouseEnter={() => setBranchesOpen(true)} onMouseLeave={() => setBranchesOpen(false)}>
          <button type="button" onClick={() => setBranchesOpen(!branchesOpen)} aria-expanded={branchesOpen} aria-haspopup="true" className={`relative flex items-center gap-1 whitespace-nowrap pb-[6px] text-[clamp(.9rem,1.05vw,1.06rem)] font-semibold transition-colors ${onBranch ? 'text-[#1B7A3E]' : 'text-[#153B5B] hover:text-[#1B7A3E]'}`} data-testid="button-nav-branches">
            Branches
            <ChevronDown size={14} className={`transition-transform duration-200 ${branchesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            <span className={`absolute -bottom-[3px] left-0 h-[3px] rounded-full bg-[#1B7A3E] transition-all duration-300 ${onBranch ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
          </button>
          {branchesOpen && <div className="absolute left-1/2 top-full z-40 w-[268px] -translate-x-1/2 rounded-xl border border-[#EFE7D7] bg-white p-1.5 shadow-[0_12px_28px_rgba(31,40,56,.18)]" role="menu">
            {branchLinks.map(([slug, info]) => <a key={slug} href={`/branch/${slug}`} onClick={(e) => { e.preventDefault(); go(`/branch/${slug}`); }} role="menuitem" className={`block rounded-lg px-3 py-2.5 text-left text-[14px] font-semibold transition-colors ${location === `/branch/${slug}` ? 'bg-[#EAF1F9] text-[#1B7A3E]' : 'text-[#153B5B] hover:bg-[#F2F7FC] hover:text-[#1B7A3E]'}`} data-testid={`link-nav-branch-${slug}`}>
              {info.streetName}
              <span className="mt-0.5 block text-[12px] font-medium text-[#7C8B99]">Pulivendla, Kadapa District</span>
            </a>)}
          </div>}
        </div>
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={onEnquire} className="hidden rounded-full border-2 border-[#123A5E] px-[clamp(1.3rem,2.1vw,2.1rem)] py-[11px] text-[clamp(.9rem,1.05vw,1.06rem)] font-semibold text-[#123A5E] transition hover:bg-[#123A5E] hover:text-white md:block" data-testid="button-header-enquiry">Enquire Now</button>
        <button onClick={() => setOpen(!open)} className="rounded-md p-2 text-[#153B5B] lg:hidden" aria-label="Toggle menu" data-testid="button-mobile-menu">{open ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
    </div>
    {open && <div className="border-t border-[#EFE7D7] bg-white px-5 py-3 lg:hidden">
      <nav>
        {items.map(([label, href]) => <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} className="flex items-center justify-between border-b border-[#EFE7D7] py-3 text-[15px] font-semibold text-[#153B5B]" data-testid={`link-mobile-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}<ChevronRight size={15} /></a>)}
        <div className="border-b border-[#EFE7D7] py-3">
          <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[#7C8B99]">Branches</p>
          {branchLinks.map(([slug, info]) => <a key={slug} href={`/branch/${slug}`} onClick={(e) => { e.preventDefault(); go(`/branch/${slug}`); }} className="flex items-center justify-between py-2 text-[15px] font-semibold text-[#153B5B]" data-testid={`link-mobile-branch-${slug}`}>{info.streetName}<ChevronRight size={15} /></a>)}
        </div>
      </nav>
      <a href="tel:+918500045678" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1B7A3E]" data-testid="link-mobile-phone"><Phone size={14} /> +91 85000 45678</a>
      <button onClick={onEnquire} className="mt-3 w-full rounded-full bg-[#1B7A3E] py-3 text-sm font-bold text-white" data-testid="button-mobile-enquiry">Enquire Now</button>
    </div>}
  </header>;
}

/* ---------------------------------------------------------------- hero art */

/* One blobby outline drawn in a 0–100 box, reused twice: as the clip that
   gives the photo its cloud shape, and as the dashed ring around it. */
const HERO_BLOB = 'M50 2.5 C64 0.5 76.5 6 82.5 14 C93.5 12.5 100 22 98.5 34 C100 46 96 56.5 91.5 63 C96 74 89 85.5 77.5 87.5 C71.5 96.5 57.5 99.5 47.5 95 C35.5 100 22.5 96 17.5 86.5 C6 85 0.5 74 4 64 C0.5 53 2.5 41 8.5 35 C5 20 15.5 8.5 27.5 11 C33.5 4 42 1.5 50 2.5 Z';

const LEAF_PATH = 'M3 30 C 18 6, 56 -4, 97 10 C 78 44, 34 56, 3 30 Z';

function Leaf({ className = '', style, color = '#4C9A3F' }: { className?: string; style?: CSSProperties; color?: string }) {
  return <svg viewBox="0 0 100 56" className={className} style={style} aria-hidden="true">
    <path d={LEAF_PATH} fill={color} />
    <path d="M6 30 C 34 24, 66 17, 95 11" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="2.4" strokeLinecap="round" />
  </svg>;
}

function Bloom({ className = '', style, petal = '#F0863A', core = '#F7C948', petals = 6 }: { className?: string; style?: CSSProperties; petal?: string; core?: string; petals?: number }) {
  return <svg viewBox="0 0 60 60" className={className} style={style} aria-hidden="true">
    {Array.from({ length: petals }, (_, i) => <ellipse key={i} cx="30" cy="13.5" rx="7.5" ry="12.5" fill={petal} transform={`rotate(${(360 / petals) * i} 30 30)`} />)}
    <circle cx="30" cy="30" r="7" fill={core} />
  </svg>;
}

/* Leaves fanned out of one corner. The numbers are percentages of the cluster
   box, so the whole bouquet scales with the hero rather than the viewport. */
const LEAF_CLUSTER = [
  { left: -8, top: 46, w: 62, rot: -32, color: '#3E8F3B' },
  { left: 2, top: 22, w: 52, rot: -66, color: '#57A84A' },
  { left: -4, top: 68, w: 54, rot: 8, color: '#2F7C33' },
  { left: 24, top: 8, w: 44, rot: -88, color: '#6BBB57' },
  { left: 30, top: 52, w: 50, rot: -18, color: '#4C9A3F' },
  { left: 18, top: 82, w: 46, rot: 24, color: '#3E8F3B' },
  { left: 48, top: 30, w: 38, rot: -52, color: '#7CC763' },
  { left: 52, top: 72, w: 40, rot: 4, color: '#57A84A' },
];

function Foliage({ side }: { side: 'left' | 'right' }) {
  return <div className={`pointer-events-none absolute hidden sm:block ${side === 'left' ? '-bottom-14 -left-8 h-[min(34vw,320px)] w-[min(24vw,280px)]' : '-bottom-20 -right-6 h-[min(28vw,260px)] w-[min(19vw,220px)] -scale-x-100'}`} aria-hidden="true">
    {LEAF_CLUSTER.map((leaf, i) => <Leaf key={i} className="absolute drop-shadow-[0_4px_6px_rgba(31,70,40,.08)]" color={leaf.color} style={{ left: `${leaf.left}%`, top: `${leaf.top}%`, width: `${leaf.w}%`, transform: `rotate(${leaf.rot}deg)` }} />)}
    <Bloom className="absolute" style={{ left: '58%', top: '14%', width: '15%' }} />
    <Bloom className="absolute" style={{ left: '6%', top: '8%', width: '11%' }} petal="#F5A623" core="#E8722F" petals={5} />
  </div>;
}

/* The doodles floating around the photo. Positions are percentages of the
   photo frame so they keep their relationship to it at any width. */
function HeroDoodles() {
  return <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
    <svg viewBox="0 0 64 44" className="doodle-float absolute hidden sm:block left-[-12%] top-[3%] w-[13%]">
      <path d="M62 2 L2 24 L24 30 Z" fill="#FFC94D" />
      <path d="M62 2 L24 30 L28 42 L37 33 Z" fill="#E2911C" />
      <path d="M62 2 L24 30 L37 33 Z" fill="#F5B02E" />
    </svg>
    <svg viewBox="0 0 90 80" className="absolute hidden sm:block left-[-8%] top-[16%] w-[16%]">
      <path d="M6 4 C 34 6, 56 20, 62 42 C 68 64, 50 76, 30 70" fill="none" stroke="#7FA8D4" strokeWidth="2.2" strokeDasharray="5 7" strokeLinecap="round" />
    </svg>
    <svg viewBox="0 0 64 84" className="doodle-drift absolute hidden sm:block left-[-14%] top-[40%] w-[11%]">
      <path d="M32 2 C48 2 60 15 60 29 C60 43 46 55 32 61 C18 55 4 43 4 29 C4 15 16 2 32 2 Z" fill="#F2B33D" />
      <path d="M32 2 C24 12 20 21 20 29 C20 41 26 53 32 61 C38 53 44 41 44 29 C44 21 40 12 32 2 Z" fill="#E86A4E" />
      <path d="M32 2 C36 13 38 21 38 29 C38 41 35 53 32 61 C29 53 26 41 26 29 C26 21 28 13 32 2 Z" fill="#3FA9A0" />
      <path d="M25 61 L39 61 L36 69 L28 69 Z" fill="none" stroke="#B5713A" strokeWidth="1.6" />
      <rect x="26" y="69" width="12" height="10" rx="2.5" fill="#B5713A" />
    </svg>
    <Bloom className="doodle-spin absolute hidden sm:block left-[-9%] top-[63%] w-[7%]" petal="#F0863A" core="#F7C948" />
    <Bloom className="doodle-float absolute left-[62%] top-[-8%] w-[6%]" petal="#F7C948" core="#E8A020" petals={7} />
    <svg viewBox="0 0 40 30" className="absolute left-[57%] top-[-3%] w-[8%]">
      <path d="M20 24 C 8 24, 4 12, 14 10 C 20 -2, 34 2, 34 12 C 40 16, 36 26, 26 24 Z" fill="#57A84A" opacity=".85" />
    </svg>
    <svg viewBox="0 0 120 62" className="doodle-drift absolute hidden sm:block right-[-6%] top-[-4%] w-[19%]">
      <g fill="#CBE2F7"><ellipse cx="34" cy="36" rx="25" ry="17" /><ellipse cx="63" cy="28" rx="29" ry="21" /><ellipse cx="92" cy="38" rx="21" ry="15" /><rect x="14" y="38" width="94" height="16" rx="8" /></g>
    </svg>
    <svg viewBox="0 0 48 40" className="doodle-float absolute hidden sm:block right-[-8%] top-[26%] w-[7%]">
      <g fill="#5B9BE0"><path d="M24 20 C14 4 2 6 4 16 C5 24 16 24 24 20 Z" /><path d="M24 20 C34 4 46 6 44 16 C43 24 32 24 24 20 Z" /><path d="M24 20 C16 30 8 34 8 27 C8 21 17 19 24 20 Z" /><path d="M24 20 C32 30 40 34 40 27 C40 21 31 19 24 20 Z" /></g>
      <rect x="23" y="9" width="2" height="23" rx="1" fill="#2E6FB5" />
    </svg>
    <Bloom className="doodle-spin absolute hidden sm:block bottom-[6%] right-[-10%] w-[8%]" petal="#F0863A" core="#F7C948" />
    <svg viewBox="0 0 24 24" className="absolute left-[46%] top-[-6%] w-[2.6%]"><path d="M12 2 V22 M2 12 H22" stroke="#7FA8D4" strokeWidth="2.6" strokeLinecap="round" /></svg>
    <svg viewBox="0 0 24 24" className="absolute right-[4%] top-[46%] w-[2.2%]"><path d="M12 2 V22 M2 12 H22" stroke="#F5B02E" strokeWidth="2.6" strokeLinecap="round" /></svg>
    <svg viewBox="0 0 40 40" className="absolute hidden sm:block left-[-3%] top-[30%] w-[4%]"><circle cx="8" cy="8" r="3" fill="#F5B02E" /><circle cx="24" cy="16" r="2.4" fill="#E8722F" /><circle cx="12" cy="28" r="2" fill="#57A84A" /></svg>
  </div>;
}

/* ------------------------------------------------------------------- hero */

/* The hero is one long band that creeps from left to right, and the blue
   brand panel rides in it like any other slide rather than sitting still
   between two moving ones. The whole run appears twice and the band travels
   exactly one run per cycle, so the duplicate is standing where the original
   stood when it resets and the circle never shows a join. */
const HERO_PHOTOS = [
  { src: '/hero-cbse-lead.png', alt: 'Students studying together — CBSE LEAD curriculum', caption: 'CBSE LEAD CURRICULUM' },
  { src: '/hero-our-values.jpg', alt: 'Our values — knowledge, discipline, values, innovation, leadership', caption: 'EMPOWERING MINDS, BUILDING CHARACTER' },
  { src: '/hero-learn-today.jpg', alt: 'Students writing in class', caption: 'LEARN TODAY, LEAD TOMORROW' },
  { src: '/hero-safe-journeys.jpg', alt: 'Students boarding the school bus', caption: 'SAFE JOURNEYS, BRIGHTER TOMORROWS' },
] as const;

function HeroBrand({ place, eyebrow, headingLevel }: { place: string; eyebrow: string; headingLevel: 'b' | 'h1' }) {
  const Title = headingLevel;
  return <div className="relative flex h-full items-center overflow-hidden bg-gradient-to-br from-[#D3E6F6] via-[#B9D8F0] to-[#9DC6E9] px-8 py-14">
    <span className="absolute -left-16 top-[-38px] h-[310px] w-[90px] rotate-[27deg] bg-white/45" />
    <span className="absolute -right-12 bottom-[-60px] h-[330px] w-[60px] rotate-[26deg] bg-[#7FB2DE]/45" />
    <div className="relative z-10 max-w-[480px] text-[#123A5E]">
      <p className="text-[13px] font-bold tracking-[.25em] text-[#2E6A9E]">{eyebrow}</p>
      <Title className="mt-4 block font-round text-[clamp(1.5rem,2.8vw,2.2rem)] font-extrabold leading-none tracking-[.03em]">SREE VIVEKANANDA</Title>
      <b className="mt-2.5 block text-[clamp(.72rem,1.1vw,.85rem)] font-semibold tracking-[.15em] text-[#5A7B99]">EDUCATIONAL SOCIETY</b>
      <p className="mt-3 font-display text-[clamp(1.2rem,2vw,1.65rem)] italic" data-testid="text-hero-place">{place}</p>
      <p className="mt-3 max-w-[315px] text-[15px] leading-6 font-semibold uppercase tracking-wide text-[#3F5771]">Inspiring growth, creating leader</p>
    </div>
  </div>;
}

/* `cover` rather than `contain`: the box is a fixed 1600:415 ratio, so each
   banner's height always fills it exactly — any width overflow (banners that
   aren't cut to that same ratio, like the CBSE one) is trimmed evenly from
   the sides rather than leaving a letterbox bar. */
function HeroPhoto({ photo }: { photo: (typeof HERO_PHOTOS)[number] }) {
  return <div className="relative h-full overflow-hidden bg-[#0F2A44]">
    <img src={photo.src} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
  </div>;
}

/* `place` and `eyebrow` are what a branch page changes; the crest and the
   school's own name are the same on all four. */
function Hero({ place = 'PULIVENDLA', eyebrow = 'WELCOME TO OUR SCHOOL', headingLevel = 'b' }: { place?: string; eyebrow?: string; headingLevel?: 'b' | 'h1' }) {
  /* The blue brand slide is gone from the scroller, but a branch page still
     needs its own `h1` — kept off-screen rather than dropped outright. */
  const Title = headingLevel;
  const slideCount = HERO_PHOTOS.length * 2;
  return <section id="top" className="overflow-hidden bg-white">
    <Title className="sr-only">{`Sree Vivekananda Educational Society — ${place}`}</Title>
    {/* Height tracks the banners' own 1600×415 ratio, capped at 600px. */}
    <div className="hero-track flex aspect-[1600/415] max-h-[540px]" style={{ '--slide-count': slideCount } as CSSProperties}>
      {[0, 1].map((copy) => <Fragment key={copy}>
        {HERO_PHOTOS.map((photo) => <div key={`${copy}-${photo.src}`} className="hero-slide shrink-0" aria-hidden={copy === 1 || undefined}>
          <HeroPhoto photo={photo} />
        </div>)}
      </Fragment>)}
    </div>
  </section>;
}

function Heading({ title, accent }: { title?: string; accent?: string }) {
  return <div className="reveal flex flex-col items-center"><h2 className="section-heading text-center text-[clamp(1.85rem,3.3vw,2.5rem)]">{title}{title && ' '}{accent && <em>{accent}</em>}</h2><div className="ornament mt-2"><span className="ornament-mark">◆</span></div></div>;
}

function Intro() {
  return <section id="about" className="relative overflow-hidden py-5 md:py-7"><div className="absolute left-0 top-0 h-16 w-16 border-l-[3px] border-t-[3px] border-[#0F4C5C] opacity-70" /><div className="container-wide grid gap-7 md:grid-cols-[1fr_1fr] md:items-center">
    <div className="reveal"><p className="max-w-[470px] text-[17px] leading-6 text-black"><span className="font-extrabold uppercase">I</span>gniting minds, shaping futures. Join us for academic excellence, character building, and holistic development. Our classrooms blend structured, CBSE-aligned learning with hands-on activities that turn curiosity into confidence, while dedicated teachers mentor every child from their very first day through each milestone that follows. From Pre-School through High-School, we build a foundation of strong values, critical thinking and real-world skills so every student leaves prepared to lead — in the classroom and far beyond it.</p></div>
    <div className="reveal relative mx-auto aspect-[1254/1030] w-full max-w-[460px] overflow-hidden rounded-3xl border-[6px] border-white bg-white shadow-[0_10px_26px_rgba(31,40,56,.18)] ring-1 ring-[#1C2A37]/25"><img src="/vivekananda.png" alt="Educate and raise the masses, and thus alone a nation is possible — Swami Vivekananda" className="h-full w-full rounded-2xl object-cover" data-testid="img-about" /></div>
  </div>
  <div className="container-wide mt-10 md:mt-14">
    <div className="reveal text-center mb-2">
      <h3 className="text-[20px] font-bold text-[#123A5E]">Branches in Pulivendla, Kadapa District, Andhra Pradesh</h3>
      <div className="ornament mt-2 flex justify-center"><span className="ornament-mark">◆</span></div>
      <p className="mt-3 text-[15px] text-[#3F5771] font-medium text-center">Sree Swamy Vivekananda School — Three Branches, One Vision</p>
    </div>
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
      <Link href="/branch/shivalayam-street" className="reveal flex flex-col items-center gap-3 cursor-pointer rounded-2xl p-4 transition hover:bg-white/70 hover:shadow-md group">
        <img src="/logo.jpeg" alt="School logo" className="h-16 w-16 rounded-full object-cover shadow group-hover:scale-105 transition-transform" />
        <div>
          <p className="font-bold text-[#0F4C5C] text-[16px]">SREE SWAMY VIVEKANANDA SCHOOL</p>
          <p className="mt-1 text-[15px]"><span className="font-bold text-[#123A5E] text-[17px]">Shivalayam Street</span>,<br /><span className="text-black/70">Pulivendla, Kadapa District,<br />Andhra Pradesh</span></p>
          <p className="mt-2 text-[13px] font-semibold text-[#2E6A9E] flex items-center justify-center gap-1">View Branch <ArrowRight size={13} /></p>
        </div>
      </Link>
      <Link href="/branch/brahmanapalli-road" className="reveal flex flex-col items-center gap-3 cursor-pointer rounded-2xl p-4 transition hover:bg-white/70 hover:shadow-md group">
        <img src="/logo.jpeg" alt="School logo" className="h-16 w-16 rounded-full object-cover shadow group-hover:scale-105 transition-transform" />
        <div>
          <p className="font-bold text-[#0F4C5C] text-[16px]">SREE SWAMY VIVEKANANDA SCHOOL</p>
          <p className="mt-1 text-[15px]"><span className="font-bold text-[#123A5E] text-[17px]">Brahmanapalli Road</span>,<br /><span className="text-black/70">Pulivendla, Kadapa District,<br />Andhra Pradesh</span></p>
          <p className="mt-2 text-[13px] font-semibold text-[#2E6A9E] flex items-center justify-center gap-1">View Branch <ArrowRight size={13} /></p>
        </div>
      </Link>
      <Link href="/branch/parnapalli-road" className="reveal flex flex-col items-center gap-3 cursor-pointer rounded-2xl p-4 transition hover:bg-white/70 hover:shadow-md group">
        <img src="/logo.jpeg" alt="School logo" className="h-16 w-16 rounded-full object-cover shadow group-hover:scale-105 transition-transform" />
        <div>
          <p className="font-bold text-[#0F4C5C] text-[16px]">SREE SWAMY VIVEKANANDA SCHOOL</p>
          <p className="mt-1 text-[15px]"><span className="font-bold text-[#123A5E] text-[17px]">Parnapalli Road</span>,<br /><span className="text-black/70">Pulivendla, Kadapa District,<br />Andhra Pradesh</span></p>
          <p className="mt-2 text-[13px] font-semibold text-[#2E6A9E] flex items-center justify-center gap-1">View Branch <ArrowRight size={13} /></p>
        </div>
      </Link>
    </div>
  </div>
  </section>;
}

type Programme = { name: string; image: string; copy: string };
const programmes: Programme[] = [
  { name: 'Pre-School', image: '/making-lab.jpg', copy: 'Children are introduced to learning through play, stories, creative expression, early numbers and joyful discovery.' },
  { name: 'Primary School', image: '/campus-courtyard.jpg', copy: 'Our curriculum helps children build confident foundations while learning to think, question and engage with the world.' },
  { name: 'Middle-School', image: '/athletics-field.jpg', copy: 'An inspiring environment enables a shift from rote methods to a course beyond textbooks, with ideas and experiences at the centre.' },
  { name: 'High-School', image: '/making-lab.jpg', copy: 'Experiential and student-centric learning prepares students for their next stage with focus, independence and purpose.' },
];
const resultImages = [
  { src: '/results-2.jpeg', caption: 'Town Toppers — SSC Results 2026', contain: true },
  { src: '/results-1.jpeg', caption: 'Our Achievers — SSC Results 2026' },
  { src: '/results-3.jpeg', caption: 'More Achievers — SSC Results 2026' },
];
/* A rectangular card rather than the round gallery orb: these are results
   posters with fine print (names, marks) that a circular crop would slice
   into, so the full rectangle is what stays legible. */
/* Fixed aspect ratio rather than each image's own natural size, so all three
   cards match. `contain` (rather than `cover`) is for the one poster — Town
   Toppers — that's noticeably more square than the 4:3 box, so cropping it
   to cover would cut its bottom row of names off; the others fit closely
   enough that `cover` reads as a clean fill. */
function ResultCard({ src, alt, caption, contain = false }: { src: string; alt: string; caption: string; contain?: boolean }) {
  return <figure className="flex flex-col items-center gap-4">
    <button type="button" onClick={() => window.open(src, '_blank')} className="group block aspect-[4/3] w-full overflow-hidden rounded-2xl border-[6px] border-white shadow-[0_10px_30px_rgba(31,40,56,.16)] ring-1 ring-[#1C2A37]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C]" data-testid="button-result-card">
      <img src={src} alt={alt} className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${contain ? 'object-contain' : 'object-cover object-top'}`} loading="lazy" />
    </button>
    <figcaption className="max-w-[260px] text-center text-[15px] font-semibold leading-6 text-[#0F4C5C] sm:text-[16px]">{caption}</figcaption>
  </figure>;
}

function Results() {
  return <section id="results" className="relative py-6 md:py-9"><div className="container-wide"><Heading title="SSC" accent="RESULTS 2026" /><p className="reveal mx-auto mt-4 max-w-[620px] text-center text-[18px] leading-7 text-black">Best in standards, first in results — proud of every student who made this year's SSC results shine.</p><div className="mx-auto mt-8 grid max-w-[1200px] grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-3">{resultImages.map((item, index) => <div key={item.src} className="reveal" data-testid={`card-result-${index + 1}`}><ResultCard src={item.src} alt={item.caption} caption={item.caption} contain={item.contain} /></div>)}</div></div></section>;
}

/* Each card shows either a line icon or a photograph in the same dashed circle,
   so pictures and icons can share the row without breaking its rhythm.
   `contain` for the ones that are logos rather than photographs: filling a
   circle crops a logo's edges off, where a photograph only loses background. */
const facilities: { icon?: typeof Bus; image?: string; contain?: boolean; title: string; copy: string }[] = [
  { image: '/schoolbus.jpeg', title: 'Safe & Convenient Transport', copy: 'Buses covering all major routes, with trained staff ensuring safe pickup and drop every day. Parents can rely on consistent timing and real attendance checks at every stop.' },
  { image: '/smartclass.jpeg', title: 'Smart Classrooms', copy: 'Interactive digital boards and audio-visual tools that make every lesson engaging and easy to grasp. Concepts come alive through visuals, simulations and collaborative activities.' },
  { image: '/cbse.jpeg', contain: true, title: 'CBSE Based LEAD Curriculum', copy: 'A structured, activity-based curriculum aligned with CBSE standards for strong conceptual learning. Regular assessments track progress and close gaps early.' },
  { image: '/iit.jpeg', contain: true, title: 'IIT-JEE and NEET Foundation', copy: 'Early foundation coaching that builds problem-solving skills for competitive exams from school itself. Experienced faculty blend board preparation with entrance-exam thinking.' },
];
const busRoutes = [
  { stop: 'Sivalayam Street', areas: ['Basireddy Palle', 'Boggudu Palle', 'Siddam Reddy Palle', 'Peddajuturu', 'Chinthalajuturu', 'Gollala Guduru', 'Pernapadu', 'Alavalapadu', 'Velamavari Palle', 'Besthavari Palle', 'Velpula', 'Vemula', 'Gondipalle', 'Kothapalle', 'V. Kothapalle', 'Tallapalle', 'Ganganapalle', 'Santha Kovvuru', 'Paluru', 'Agaduru', 'Inagaluru', 'Saidapuram', 'Krishnamgari Palle', 'R. Thummalapalle'] },
  { stop: 'Brahmanapalle Road', areas: ['Venkatapuram', 'E. Kothapalle', 'Chandragiri', 'Mallikarjunapuram', 'Erraballe', 'Nallapureddy Palle', 'Nallagondavari Palle', 'Ambakapalle', 'Murarichinthala', 'Brahmanapalle', 'Ippatla', 'Chinnakudala', 'Ramatlapalle', 'Gunakanapalle'] },
  { stop: 'Nagarigutta', areas: ['Ulimella', 'Erripalle', 'Putrayanapeta', 'Achavelli', 'Thimmapurampeta', 'Goturu', 'Nallacheruvupalle', 'Kondreddi Palle', 'Muthukuru', 'Narepalli', 'Moillacheruvu', 'Rami Reddy Palli', 'Peddarangapuram', 'Rayalapuram', 'Nakkalapalle', 'Dondlavagu', 'Balapanuru', 'Ankalammaguduru', 'Agraharam', 'Kasunuru', 'Maduru', 'Bojayapalle', 'Kovaramguttapalle', 'Lomada', 'Bhadrampalle', 'Thonduru', 'Lopatnuthala', 'Lingala', 'Bonala', 'Ankevaripalli', 'Kamasamudram', 'Kammavaripalle', 'Ramapuram', 'Intiobaiah Palli', 'Peddakudala', 'Akkulugari Palle', 'Thernampalle', 'Yerramreddy Palle', 'Chinna Rangapuram'] },
] as const;

/* Village names on this list are written every which way — `V.Kothapalle`,
   `R Thummalapalle`, `Rami Reddy Palli` against `Kondreddi Palle`. A parent
   typing their own village will not reproduce the punctuation or the spacing,
   so both sides are reduced to bare letters before they are compared and the
   match is a substring, which also lets a half-typed name find its village. */
const normaliseArea = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '');

function BusRoutes() {
  const [query, setQuery] = useState('');
  const needle = normaliseArea(query);
  /* Below two letters nearly everything matches, which reads as a broken
     search rather than a helpful one, so the list stays whole until then. */
  const searching = needle.length >= 2;
  const matches = searching
    ? busRoutes.map((route) => ({ stop: route.stop, hits: route.areas.filter((area) => normaliseArea(area).includes(needle)) })).filter((route) => route.hits.length > 0)
    : [];
  const found = matches.reduce((total, route) => total + route.hits.length, 0);

  return <div id="bus-routes" className="mx-auto max-w-[880px]">
    <div className="rounded-2xl border-2 border-dashed border-[#1C2A37]/35 bg-white/85 p-5 shadow-[0_4px_12px_rgba(31,40,56,.12)] sm:p-7">
      <p className="mx-auto max-w-[460px] text-center text-[15px] leading-6 text-black/75">Type your village or area below. If it is on one of our three routes, our bus can pick your child up and drop them home.</p>

      <div className="mx-auto mt-5 flex max-w-[420px] items-center gap-2 rounded-full border-2 border-[#1C2A37]/30 bg-white px-4 py-2.5 focus-within:border-[#0F4C5C]">
        <Search size={17} className="shrink-0 text-[#0F4C5C]" aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search your area…" aria-label="Search for your village or area" className="w-full bg-transparent text-[15px] text-black outline-none placeholder:text-black/45" data-testid="input-bus-area-search" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="shrink-0 rounded-full p-1 text-black/60 hover:text-[#0F4C5C]" data-testid="button-bus-search-clear"><X size={15} /></button>}
      </div>

      {searching && <p className={`mx-auto mt-4 max-w-[520px] rounded-xl px-4 py-3 text-center text-[15px] leading-6 ${found ? 'bg-[#0F4C5C]/10 text-[#0F4C5C]' : 'bg-[#1F2838]/8 text-black'}`} role="status" aria-live="polite" data-testid="text-bus-search-result">
        {found
          ? <><Check size={16} className="mr-1 inline align-[-2px]" aria-hidden="true" />Good news — our school bus reaches {found === 1 ? 'this area' : 'these areas'}. Board at the {matches.map((route) => route.stop).join(' or ')} route{matches.length > 1 ? 's' : ''}.</>
          : <>We do not have “{query.trim()}” on a route yet. Call us on <a href="tel:+918500045678" className="font-semibold underline">+91 85000 45678</a> and we will see what can be arranged.</>}
      </p>}

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {(searching ? matches : busRoutes.map((route) => ({ stop: route.stop, hits: route.areas }))).map((route) => <div key={route.stop} data-testid={`card-bus-route-${route.stop.toLowerCase().replaceAll(' ', '-')}`}>
          <h4 className="flex items-start gap-1.5 text-[15px] font-semibold leading-5 text-[#0F4C5C]"><Bus size={15} className="mt-0.5 shrink-0" aria-hidden="true" />Sree Swamy Vivekananda School, {route.stop}</h4>
          <ul className="mt-2 space-y-0.5 text-[14px] leading-5 text-black/80">
            {route.hits.map((area) => <li key={area}>{area}</li>)}
          </ul>
        </div>)}
      </div>
    </div>
  </div>;
}

function Facilities() {
  return <section id="media" className="py-5 md:py-7"><div className="container-wide">
    <Heading accent="Facilities" />
    <div className="mx-auto mt-8 grid max-w-[900px] grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-12">
      {/* Not a flex wrapper: `GalleryOrb`'s own figure needs to be a normal
          block box so its `w-full` button resolves against the full column
          width — inside a flex parent with `items-center` it would shrink to
          content instead and the orb would render tiny. */}
      {facilities.map(({ image, contain, title, copy }, index) => <div key={title} className="reveal text-center" data-testid={`card-facility-${index + 1}`}>
        <GalleryOrb src={image!} alt={title} colour={ORB_COLOURS[index % ORB_COLOURS.length]} spin={index * 47} contain={contain} />
        <h3 className="mt-4 font-sans text-[14px] font-medium leading-[1.25] text-black sm:text-[19px] sm:leading-snug">{title}</h3>
        <p className="mt-1.5 mx-auto max-w-[280px] text-[11.5px] leading-[1.4] text-black/75 sm:text-[13.5px] sm:leading-[1.5]">{copy}</p>
      </div>)}
    </div>
  </div></section>;
}

const gallery = ['/making-lab.jpg', '/campus-courtyard.jpg', '/athletics-field.jpg', '/smartclass.jpeg', '/schoolbus.jpeg', '/our-story-poster.jpg'];

/* One colour per orb, cycled. The ring is drawn on a 100-unit circle with
   `pathLength`, so the two arcs and the four dots that cap them are placed in
   percentages of the circumference rather than in pixels and hold their
   positions at any size. */
const ORB_COLOURS = ['#0F4C5C', '#C2591B', '#5B3E96', '#E0A93B', '#2F7D6E', '#1C2A37'] as const;
const ORB_CAPS = [
  { x: 93.68, y: 67.30 }, { x: 30.01, y: 92.52 }, { x: 6.32, y: 32.70 }, { x: 69.99, y: 7.48 },
] as const;

/* `spin` still sets each orb's starting angle so a row of them doesn't all
   begin in lockstep; the continuous rotation itself comes from the
   `orb-ring-spin` animation in index.css, alternating direction by parity so
   neighbouring rings don't turn the same way. */
function OrbRing({ colour, spin }: { colour: string; spin: number }) {
  return <div className="pointer-events-none absolute inset-0" style={{ transform: `rotate(${spin}deg)` }} aria-hidden="true">
    <svg viewBox="0 0 100 100" className={`h-full w-full orb-ring-spin ${spin % 2 === 0 ? 'orb-ring-spin-reverse' : ''}`}>
      <circle cx="50" cy="50" r="47" fill="none" stroke={colour} strokeWidth="1" strokeLinecap="round" strokeDasharray=".4 4.2" opacity=".75" />
      <circle cx="50" cy="50" r="47" fill="none" stroke={colour} strokeWidth="1.9" strokeLinecap="round" pathLength={100} strokeDasharray="26 24" strokeDashoffset="-6" />
      {ORB_CAPS.map((cap) => <circle key={`${cap.x}-${cap.y}`} cx={cap.x} cy={cap.y} r="2.3" fill={colour} />)}
    </svg>
  </div>;
}

function GalleryOrb({ src, alt, colour, spin, caption, contain = false }: { src: string; alt: string; colour: string; spin: number; caption?: string; contain?: boolean }) {
  return <figure className="flex flex-col items-center gap-4">
    <button type="button" onClick={() => window.open(src, '_blank')} className="group relative block aspect-square w-full max-w-[250px] rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C5C]" data-testid="button-gallery-orb">
      <span className="absolute inset-[6%] rounded-full bg-white shadow-[0_10px_30px_rgba(31,40,56,.16)]" />
      <span className="absolute inset-[11%] block overflow-hidden rounded-full">
        <img src={src} alt={alt} className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${contain ? 'object-contain p-4' : 'object-cover'}`} loading="lazy" />
      </span>
      <OrbRing colour={colour} spin={spin} />
    </button>
    {caption && <figcaption className="max-w-[260px] text-center text-[15px] font-semibold leading-6 text-[#0F4C5C] sm:text-[16px]">{caption}</figcaption>}
  </figure>;
}

function GalleryOrbs({ images, label, className = 'grid-cols-2 md:grid-cols-3' }: { images: readonly string[]; label: string; className?: string }) {
  return <div className={`grid gap-x-6 gap-y-9 ${className}`}>
    {images.map((src, index) => <GalleryOrb key={`${src}-${index}`} src={src} alt={`${label} ${index + 1}`} colour={ORB_COLOURS[index % ORB_COLOURS.length]} spin={index * 47} />)}
  </div>;
}

/* Placeholder roster - the layout is the point; swap the names, the years and
   the portraits for the real staff list. `photo` is optional and the card
   falls back to the teacher's initials, so a missing headshot never leaves a
   hole in the grid. */
const FACULTY: { name: string; rank: string; subject: string; years: string; tint: string; accent: string; icon: typeof BookText; photo?: string }[] = [
  { name: 'Smt. Anusha R.', rank: 'Senior Lecturer', subject: 'Telugu', years: '12+ yrs', tint: '#EDF7EE', accent: '#2E7D32', icon: BookText },
  { name: 'Ms. Kavya M.', rank: 'Lecturer', subject: 'Hindi', years: '8+ yrs', tint: '#FFF4EA', accent: '#E65100', icon: BookMarked },
  { name: 'Mr. Ramesh K.', rank: 'Lecturer', subject: 'English', years: '6+ yrs', tint: '#ECF3FC', accent: '#1565C0', icon: BookOpen },
  { name: 'Smt. Deepa T.', rank: 'Junior Lecturer', subject: 'Mathematics', years: '3+ yrs', tint: '#F6EEFA', accent: '#6A1B9A', icon: Calculator },
  { name: 'Mr. Suresh P.', rank: 'Lecturer', subject: 'Science', years: '5+ yrs', tint: '#E8F6F4', accent: '#00695C', icon: FlaskConical },
  { name: 'Ms. Lakshmi V.', rank: 'Lecturer', subject: 'Social Studies', years: '4+ yrs', tint: '#FDEEEB', accent: '#BF360C', icon: Globe2 },
];

/* `heading` off when the page above already carries the title as its `h1` -
   otherwise the section repeats it and the page has two competing headings.
   `branchOffset` rotates the starting member so the three branch pages,
   which otherwise share this exact roster, don't all show it in the same
   order — each page leads with a different teacher and icon. */
function Faculty({ heading = true, branchOffset = 0 }: { heading?: boolean; branchOffset?: number }) {
  const roster = [...FACULTY.slice(branchOffset % FACULTY.length), ...FACULTY.slice(0, branchOffset % FACULTY.length)];
  return <section id="faculty" className="py-16 md:py-24"><div className="container-wide">
    <div className="mb-14 text-center">
      {heading && <>
        <h2 className="section-heading text-[clamp(2.4rem,4.4vw,3.6rem)]"><em>Faculty</em></h2>
        <div className="ornament mt-3"><span className="ornament-mark">◆</span></div>
      </>}
      <p className="mt-4 text-[19px] text-[#3F5771]">Dedicated teachers across all subjects, guiding every student with care and expertise.</p>
    </div>
    {/* One row of six once there is room for it; just the portrait circle
        and the words beneath it, no card around them. */}
    <div className="grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 lg:grid-cols-6">
      {roster.map((member, index) => <article key={member.name} className="reveal flex flex-col items-center gap-5 text-center" data-testid={`card-faculty-${index + 1}`}>
        <span className="grid h-40 w-40 shrink-0 place-items-center overflow-hidden rounded-full ring-[6px] ring-white shadow-[0_6px_20px_rgba(31,40,56,.16)]" style={{ backgroundColor: `${member.accent}1F`, color: member.accent }}>
          {member.photo
            ? <img src={member.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
            : <member.icon size={58} strokeWidth={1.6} />}
        </span>
        <div>
          <h3 className="text-[20px] font-bold leading-tight" style={{ color: member.accent }}>{member.name}</h3>
          <p className="mt-2.5 text-[16px] leading-7 text-black/70">{member.rank}</p>
          <p className="text-[16px] leading-7 text-black/70">{member.subject}</p>
          <p className="text-[16px] leading-7 text-black/70">Experience: {member.years}</p>
        </div>
      </article>)}
    </div>
  </div></section>;
}

function StoryVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => { const video = videoRef.current; if (!video) return; video.muted = true; video.play().catch(() => undefined); }, []);
  /* The clip has to start muted — browsers refuse to autoplay a video with
     sound — so this is the only way to hear it. Reading and writing
     `video.muted` rather than driving it from state keeps the button honest if
     anything else changes it, and the tap that unmutes is itself the gesture
     that lets a blocked autoplay start, so the play() retry matters here. */
  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setMuted(next);
    if (!next) video.play().catch(() => undefined);
  };
  return <>
    <video ref={videoRef} src="/our-story.mp4" poster="/our-story-poster.jpg" autoPlay muted loop playsInline preload="auto" className="h-full w-full object-cover" data-testid="video-our-story" />
    <button type="button" onClick={toggleMuted} aria-label={muted ? 'Unmute video' : 'Mute video'} aria-pressed={!muted} className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-[#1F2838]/70 text-white shadow-md transition-colors hover:bg-[#1F2838]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white" data-testid="button-video-mute">
      {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
    </button>
  </>;
}

/* `heading` off when the page above already carries the title as its `h1`. */
function Gallery({ heading = true }: { heading?: boolean }) {
  return <section id="gallery" className="relative overflow-hidden py-5 md:py-7"><div className="absolute right-0 top-20 hero-dots h-24 w-16 opacity-60" /><div className="container-wide">{heading && <Heading title="PHOTO" accent="GALLERY" />}<div className="mx-auto mt-7 grid max-w-[1120px] items-center gap-8 md:grid-cols-[210px_1fr]">
    <div className="reveal relative mx-auto w-full max-w-[210px] overflow-hidden rounded-2xl border-[5px] border-white bg-[#123A5E] shadow-[0_10px_26px_rgba(31,40,56,.2)]"><div className="relative aspect-[9/16] overflow-hidden rounded-xl"><StoryVideo /></div></div>
    <GalleryOrbs images={gallery} label="School life gallery" />
  </div></div></section>;
}

function Testimonials() {
  const testimonials = [
    { quote: 'Kudos to the entire team of Vivekananda Concept School for running online classes without compromising on the quality during this pandemic. We are lucky to get the admission for our kids. Kids initially faced a lot of difficulties in coping up with the syllabus and they felt it was too much for them. Slowly, they got settled here and started liking the teaching style, syllabus, and contents. Teachers are helping them in understanding the subjects and also taking extra efforts in teaching Maths and Hindi by conducting extra classes.\n\nOverall, kids love the school and started socializing with the teachers and fellow students. They also helped my kids a lot in learning the missed lessons.', name: 'Murali Krishna' },
    { quote: 'The teachers at Vivekananda Concept School are very loving and nurturing while providing the guidance and structure my kids need. I have been impressed with the dedication of the staff. Truly impressed.', name: 'Sai Chandrika' },
  ];
  const [active, setActive] = useState(0); const [paused, setPaused] = useState(false); const testimonial = testimonials[active];
  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % testimonials.length), 7000);
    return () => window.clearInterval(timer);
  }, [paused, testimonials.length]);
  return <section id="blogs" className="py-5 md:py-7"><div className="container-wide"><Heading title="Parent Say" accent="About us" /><div className="relative mx-auto mt-6 max-w-[760px] px-7 text-center sm:px-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} aria-roledescription="carousel" aria-live="polite"><Quote className="absolute left-0 top-0 h-7 w-7 text-[#0F4C5C] sm:h-10 sm:w-10" fill="currentColor" /><Quote className="absolute right-0 top-0 h-7 w-7 rotate-180 text-[#0F4C5C] sm:h-10 sm:w-10" fill="currentColor" /><div key={active} className="testimonial-fade"><blockquote className="whitespace-pre-line text-[16px] leading-[1.55] text-black" data-testid="text-testimonial">{testimonial.quote}</blockquote><p className="mt-4 text-right text-[18px] font-semibold text-[#0F4C5C]" data-testid="text-testimonial-name">{testimonial.name}</p></div><div className="absolute -right-2 bottom-4 hidden h-20 w-14 rounded-[50%] bg-gradient-to-br from-[#0F4C5C] via-white to-[#1F2838] md:block" /></div></div></section>;
}

function Admissions({ onEnquire }: { onEnquire: () => void }) {
  return <section id="career" className="py-4 text-center"><button onClick={onEnquire} className="rounded-full border-2 border-[#0F4C5C] px-10 py-5 text-base font-semibold text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white" data-testid="button-admissions-enquiry">START YOUR ADMISSION ENQUIRY <ArrowRight className="ml-2 inline" size={20} /></button></section>;
}

/* `branchLabel`/`branchAddress` let a branch page swap in its own street
   address here instead of the head-office one — the map link is rebuilt
   from whichever address is showing, so it always points at the right pin. */
function Footer({ onEnquire, branchLabel, branchAddress }: { onEnquire: () => void; branchLabel?: string; branchAddress?: string }) {
  const address = branchAddress ?? '3-4-55, Guntha Bazar Rd, near Raja Reddy Hospital, Pulivendla, 516390';
  return <footer id="contact" className="footer-texture relative overflow-hidden text-white"><div id="disclosure" className="container-wide py-5 md:py-7"><div className="grid gap-5 md:grid-cols-[1.25fr_.8fr_1.25fr]"><div><div className="text-center"><a href="#top" className="mx-auto flex w-max flex-col items-center gap-2 text-white" data-testid="link-logo-footer"><img src="/logo.jpeg" alt="Sree Vivekananda Educational Society logo" className="h-20 w-20 rounded-full border-[3px] border-white object-cover shadow" /><span className="block text-center leading-[1.15]"><b className="block text-[15px] tracking-[.06em]">SREE VIVEKANANDA</b><small className="block text-[11px] tracking-[.18em]">EDUCATIONAL SOCIETY</small><small className="block text-[11px] tracking-[.18em]">PULIVENDLA</small></span></a><small className="mt-2 block text-[11px] tracking-[.13em] text-white uppercase">INSPIRING GROWTH, CREATING LEADER</small><p className="mx-auto mt-3 max-w-[260px] text-center text-[13px] leading-[1.4]">Sree Vivekananda Educational Society, Pulivendla, under the guidance of a dedicated team of educators.</p></div></div><div><h3 className="text-[15px] font-semibold">Helpful Links</h3><div className="mt-3 grid gap-1.5 text-[14px]">{navItems.slice(0, 8).map(([label, href]) => <a key={href} href={href} className="hover:text-[#FFFFFF]" data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}</div></div><div><h3 className="text-[15px] font-semibold">Address</h3>{branchLabel && <p className="mt-3 text-[13px] font-semibold text-white/90" data-testid="text-footer-branch-label">{branchLabel}</p>}<a href="tel:+918500045678" className="mt-3 flex items-center gap-2 text-[14px]" data-testid="link-phone-footer"><Phone size={14} /> +91 85000 45678 / 85004 95678</a><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="mt-2.5 flex gap-2 text-[14px] leading-[1.4] hover:text-[#FFFFFF]" data-testid="link-address-footer"><MapPin size={15} className="mt-0.5 shrink-0" /> {address}</a><a href="mailto:hello@vivekanandaconcept.school" className="mt-2.5 flex items-center gap-2 text-[14px]" data-testid="link-email-footer"><Mail size={14} /> hello@vivekanandaconcept.school</a><a href="https://www.instagram.com/vcsplvd?igsh=MW00NW1xdWtoY2Q1Mw==" target="_blank" rel="noreferrer" className="mt-2.5 flex items-center gap-2 text-[14px] hover:text-[#FFFFFF]" data-testid="link-instagram-footer"><Instagram size={14} /> Instagram</a><button onClick={onEnquire} className="mt-4 rounded border border-white px-3 py-1.5 text-[12px] font-semibold hover:bg-white hover:text-[#0F4C5C]" data-testid="button-footer-enquiry">ADMISSION ENQUIRY</button></div></div><div className="mt-5 border-t border-white/30 pt-3 text-[12px]">© 2026 Sree Vivekananda Educational Society · Mandatory Disclosure</div></div></footer>;
}

/* The dotted corner marks on the brand panel are decoration only, so they are drawn with a repeating
   gradient rather than four more image requests. */
function DotGrid({ className }: { className: string }) {
  return <span aria-hidden className={`pointer-events-none absolute ${className}`} style={{ backgroundImage: 'radial-gradient(#B7C4D4 1.5px, transparent 1.6px)', backgroundSize: '8px 8px' }} />;
}

const enquiryInputClass = 'w-full rounded-lg border border-[#DCE3EC] bg-white py-2 pl-10 pr-3 text-[13.5px] text-[#1F2838] outline-none transition placeholder:text-[#96A3B4] focus:border-[#123A5E] focus:ring-2 focus:ring-[#123A5E]/15';

function EnquiryField({ label, icon, error, children }: { label: string; icon: ReactNode; error?: string; children: ReactNode }) {
  return <label className="block">
    <span className="text-[12px] font-semibold text-[#123A5E]">{label}</span>
    <span className="relative mt-1 block">
      <span className="pointer-events-none absolute left-3 top-[10px] text-[#123A5E]/70">{icon}</span>
      {children}
    </span>
    {error && <span className="mt-1 block text-[12px] font-medium text-[#C0392B]">{error}</span>}
  </label>;
}

function EnquiryModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false); const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); const next: Record<string, string> = {}; if (!String(data.get('parentName')).trim()) next.parentName = 'Please tell us your name'; if (!String(data.get('studentName')).trim()) next.studentName = 'Please tell us the student’s name'; /* Spaces, dashes and a +91 are all normal ways to write a number down, so they are stripped before checking rather than rejected. What is left has to be a ten-digit Indian mobile — the admissions team calls back on this, so a landline or a short number is worth catching here. */ const phone = String(data.get('phone') ?? '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''); if (!/^[6-9]\d{9}$/.test(phone)) next.phone = 'Enter a 10-digit mobile number'; if (!String(data.get('childGrade'))) next.childGrade = 'Choose a grade'; if (Object.keys(next).length) { setErrors(next); return; } setErrors({}); setSent(true); };

  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#101A2B]/70 p-3 backdrop-blur-sm" role="dialog" aria-modal="true">
    <div className="relative flex max-h-[94dvh] w-full max-w-[880px] overflow-hidden rounded-[20px] bg-white text-[#123A5E] shadow-[0_30px_80px_-24px_rgba(11,26,48,.65)]">

      <aside className="relative hidden w-1/2 shrink-0 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#F7FAFD] via-[#F2F7FC] to-[#EAF1F9] p-8 md:flex">
        <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] w-full" aria-hidden>
          <path d="M0 118c78-46 150 22 226 4s118-62 174-38v176H0z" fill="#DDE8F5" opacity=".75" />
          <path d="M0 176c86-38 148 24 224 10s122-46 176-24v98H0z" fill="#F3DDE4" opacity=".7" />
          <path d="M0 214c92-30 150 18 226 6s116-32 174-14v54H0z" fill="#E3ECF7" opacity=".85" />
        </svg>
        <DotGrid className="left-7 top-7 h-[34px] w-[46px]" />
        <DotGrid className="bottom-9 right-8 h-[34px] w-[46px]" />
        <div className="relative z-10 flex w-full flex-col items-center text-center">
          <img src="/logo.jpeg" alt="Sree Vivekananda Educational Society logo" className="mb-5 h-[94px] w-[94px] rounded-full object-cover shadow-[0_10px_24px_-12px_rgba(18,58,94,.6)]" />
          <b className="font-round text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold leading-none tracking-[.045em] text-[#123A5E]">SREE VIVEKANANDA</b>
          <small className="mt-2.5 block text-[clamp(.6rem,1vw,.8rem)] font-semibold leading-none tracking-[.15em] text-[#7C8B99]">EDUCATIONAL SOCIETY</small>
          <span className="mt-4 flex items-center gap-2">
            <span className="h-[2px] w-[62px] rounded-full bg-[#123A5E]" /><span className="h-[5px] w-[5px] rounded-full bg-[#123A5E]" /><span className="h-[2px] w-[62px] rounded-full bg-[#123A5E]" />
          </span>
          <blockquote className="mt-7 flex w-full max-w-[300px] flex-col items-center">
            <span className="flex w-full items-center gap-3">
              <span className="h-px flex-1 bg-[#123A5E]/40" /><Quote size={22} className="shrink-0 rotate-180 text-[#123A5E]" fill="currentColor" strokeWidth={0} /><span className="h-px flex-1 bg-[#123A5E]/40" />
            </span>
            <p className="mt-4 text-[14px] uppercase font-bold tracking-wide text-[#3F5771]">Inspiring growth, creating leader</p>
            <Quote size={22} className="mt-4 text-[#123A5E]" fill="currentColor" strokeWidth={0} />
          </blockquote>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto p-5 sm:p-6">
        <DotGrid className="bottom-6 right-6 h-[26px] w-[38px]" />
        <button onClick={onClose} className="absolute right-5 top-5 z-10 rounded p-1 text-[#123A5E] transition hover:text-[#C0392B]" aria-label="Close enquiry" data-testid="button-close-enquiry"><X size={22} /></button>
        {sent ? <div className="grid flex-1 place-content-center py-10 text-center">
          <Check className="mx-auto rounded-full bg-[#123A5E] p-3 text-white" size={58} />
          <h2 className="mt-6 font-display text-4xl text-[#123A5E]">Thank you.</h2>
          <p className="mt-3 text-sm text-[#3F5771]">Our admissions team will call you within one school day.</p>
          <button onClick={onClose} className="mx-auto mt-6 rounded-lg bg-[#123A5E] px-6 py-3 text-xs font-bold tracking-[.12em] text-white transition hover:bg-[#0D2B46]" data-testid="button-success-close">BACK TO SCHOOL</button>
        </div> : <>
          <h2 className="pr-9 text-[21px] font-bold tracking-[.14em] text-[#123A5E]">ADMISSION ENQUIRY</h2>
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <EnquiryField label="Parent / guardian name" icon={<User size={17} />} error={errors.parentName}>
              <input name="parentName" placeholder="Enter full name" className={enquiryInputClass} data-testid="input-parent-name" />
            </EnquiryField>
            <EnquiryField label="Student name" icon={<UserRound size={17} />} error={errors.studentName}>
              <input name="studentName" placeholder="Enter student name" className={enquiryInputClass} data-testid="input-student-name" />
            </EnquiryField>
            <EnquiryField label="Phone number" icon={<Phone size={17} />} error={errors.phone}>
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" className={enquiryInputClass} data-testid="input-phone" />
            </EnquiryField>
            <EnquiryField label="Child’s grade" icon={<GraduationCap size={17} />} error={errors.childGrade}>
              <select name="childGrade" defaultValue="" className={`${enquiryInputClass} appearance-none pr-10`} data-testid="select-child-grade">
                <option value="" disabled>Select a grade</option>
                {programmes.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
              <ChevronDown size={17} className="pointer-events-none absolute right-3 top-[10px] text-[#123A5E]" />
            </EnquiryField>
            <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#123A5E] py-3.5 text-[12.5px] font-bold tracking-[.14em] text-white shadow-[0_12px_22px_-12px_rgba(18,58,94,.9)] transition hover:bg-[#0D2B46]" data-testid="button-submit-enquiry">SEND ENQUIRY <Send size={15} /></button>
            <div className="mt-5 text-center">
              <span className="text-[13.5px] text-[#3F5771]">Or call us at </span>
              <a href="tel:+918331003003" className="font-semibold text-[#123A5E]">+91 8331 003 003</a>
            </div>
          </form>
        </>}
      </div>
    </div>
  </div>;
}

function AdmissionsPopup({ onClose, onEnquire }: { onClose: () => void; onEnquire: () => void }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-[#1F2838]/70 p-4" role="dialog" aria-modal="true" onClick={onClose}>
    <div className="relative w-full max-w-[620px]" onClick={(event) => event.stopPropagation()}>
      <button onClick={onClose} className="absolute -right-2 -top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-[#0F4C5C] shadow-lg" aria-label="Close admissions popup" data-testid="button-close-admissions-popup"><X size={18} /></button>
      <img src="/admissions-popup.jpeg" alt="Admissions open at Vivekananda Concept School" className="w-full rounded-lg border-4 border-white shadow-2xl" data-testid="img-admissions-popup" />
      <button onClick={() => { onClose(); onEnquire(); }} className="mt-3 w-full rounded-full bg-[#0F4C5C] py-3 text-xs font-bold text-white" data-testid="button-admissions-popup-enquiry">START YOUR ADMISSION ENQUIRY</button>
    </div>
  </div>;
}

function CallFab({ onEnquire }: { onEnquire: () => void }) {
  /* The widget waits until the header has scrolled out of view. While the
     header is on screen its own enquiry button is right there, so the floating
     one is just another thing sitting over the hero. */
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(header);
    return () => observer.disconnect();
  }, []);
  /* Scaled back below sm. At the full size this stack is 170px wide and about
     155px tall — on a 360px handset that is half the width of the screen
     parked over the content, and it sat on top of the footer links. The inset
     also clears the iOS home indicator via the safe-area inset. */
  return <div className={`fixed bottom-3 right-3 z-40 flex flex-col items-center gap-1 transition-all duration-300 sm:bottom-7 sm:right-7 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'}`} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-hidden={!visible}>
    <button onClick={onEnquire} className="call-cloud relative block h-[56px] w-[124px] sm:h-[76px] sm:w-[170px]" aria-label="Start your admission enquiry" data-testid="button-call-cloud">
      <svg viewBox="0 0 200 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full drop-shadow-[0_4px_10px_rgba(31,40,56,.25)]" aria-hidden="true">
        <path d="M24 72 A20 20 0 0 1 30 33 A26 26 0 0 1 78 20 A24 24 0 0 1 124 24 A24 24 0 0 1 168 36 A19 19 0 0 1 176 72 L118 72 L106 93 L96 72 Z" fill="#FFFFFF" stroke="#1C2A37" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative flex h-full w-full flex-col items-center justify-center pb-2 text-[9px] font-bold leading-[1.2] tracking-[.09em] text-black sm:pb-3 sm:text-[12px]"><span>ADMISSION</span><span>ENQUIRY</span></span>
    </button>
    <button onClick={onEnquire} className="relative grid h-[56px] w-[56px] shrink-0 place-items-center rounded-full border-[4px] border-white bg-[#1C2A37] text-white shadow-[0_10px_24px_rgba(28,42,55,.45)] ring-2 ring-[#1C2A37] sm:h-[74px] sm:w-[74px] sm:border-[5px]" aria-label="Start your admission enquiry" data-testid="button-call-fab">
      <span className="call-fab-ripple" aria-hidden="true" />
      <span className="call-fab-ripple" style={{ animationDelay: '1.1s' }} aria-hidden="true" />
      {/* Sized in CSS rather than by lucide's `size`, so it can step with the
          button across the breakpoint. */}
      <Phone className="call-fab-icon relative h-6 w-6 sm:h-8 sm:w-8" fill="currentColor" />
    </button>
  </div>;
}

/* The page furniture every route shares — background, wallpaper, header,
   footer, call widget and the enquiry modal. Children come in as a function so
   a page can wire its own buttons to the same modal without the state having to
   be lifted any further or threaded through a context. */
/* Stamped the first time the poster is shown, so a returning visitor — or
   anyone moving between pages — is not handed it again. */
const ADMISSIONS_POPUP_KEY = 'vces.admissions-popup-seen';

function PageShell({ title, description, admissionsPopup: withPopup = false, footerBranchLabel, footerBranchAddress, children }: { title: string; description: string; admissionsPopup?: boolean; footerBranchLabel?: string; footerBranchAddress?: string; children: (onEnquire: () => void) => ReactNode }) {
  const [modal, setModal] = useState(false); const [admissionsPopup, setAdmissionsPopup] = useState(false);
  /* Keyed on the location so the page is rebuilt — and so comes up again —
     when one branch route replaces another, where the component itself would
     otherwise stay mounted and never replay. */
  const [location] = useLocation();
  useReveals(location);
  useEffect(() => {
    if (!withPopup) return;
    /* Private-mode browsers throw on `localStorage`; the poster is not worth
       a blank page, so a failure just means it is shown. */
    try {
      if (window.localStorage.getItem(ADMISSIONS_POPUP_KEY)) return;
      window.localStorage.setItem(ADMISSIONS_POPUP_KEY, '1');
    } catch { /* no storage — show it and move on */ }
    setAdmissionsPopup(true);
  }, [withPopup]);
  useEffect(() => { document.title = title; const set = (name: string, content: string) => { let meta = document.querySelector(`meta[name="${name}"]`); if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', name); document.head.appendChild(meta); } meta.setAttribute('content', content); }; set('description', description); }, [title, description]);
  const openEnquiry = () => setModal(true);
  return <div className="grain relative min-h-[100dvh] overflow-hidden bg-white">
    <div className="pointer-events-none absolute inset-0 z-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: "url('/background.jpeg')" }} aria-hidden="true" />
    <WallpaperLayer />
    <div key={location} className="page-reveal relative z-10"><Header onEnquire={openEnquiry} />{children(openEnquiry)}<Footer onEnquire={openEnquiry} branchLabel={footerBranchLabel} branchAddress={footerBranchAddress} /></div>
    <CallFab onEnquire={openEnquiry} />
    {modal && <EnquiryModal onClose={() => setModal(false)} />}{admissionsPopup && <AdmissionsPopup onClose={() => setAdmissionsPopup(false)} onEnquire={openEnquiry} />}
  </div>;
}

function BusRoutesPage() {
  return <PageShell title="Bus Routes & Area Search | Vivekananda Concept School" description="Search your village to see whether a Sree Swamy Vivekananda School bus reaches you — the full stop list for the Sivalayam Street, Brahmanapalle Road and Nagarigutta routes.">
    {(onEnquire) => <>
      <section className="pt-8 md:pt-12"><div className="container-wide flex flex-col items-center">
        <h1 className="section-heading text-center text-[clamp(2rem,3.6vw,2.8rem)]">Bus <em>Routes</em></h1>
        <div className="ornament mt-2"><span className="ornament-mark">◆</span></div>
      </div></section>
      <section className="py-7 md:py-9"><div className="container-wide"><BusRoutes /></div></section>
      <Admissions onEnquire={onEnquire} />
    </>}
  </PageShell>;
}

function GalleryPage() {
  return <PageShell title="Photo Gallery | Sree Vivekananda Educational Society" description="Photographs from Sree Vivekananda Educational Society, Pulivendla — the campus, the classrooms, the playing fields and the school buses.">
    {(onEnquire) => <>
      <section className="pt-8 md:pt-12"><div className="container-wide flex flex-col items-center">
        <h1 className="section-heading text-center text-[clamp(2rem,3.6vw,2.8rem)]">Photo <em>Gallery</em></h1>
        <div className="ornament mt-2"><span className="ornament-mark">◆</span></div>
      </div></section>
      <Gallery heading={false} />
      <Admissions onEnquire={onEnquire} />
    </>}
  </PageShell>;
}

function Home() {
  return <PageShell title="Vivekananda Concept School | Pulivendla" description="Vivekananda Concept School in Pulivendla offers thoughtful education from Pre-School through High-School." admissionsPopup>
    {/* Faculty lives on /faculty now, reached from the header. */}
    {/* Gallery has a page of its own now — the header link goes there. */}
    {(onEnquire) => <><Hero /><Intro /><Results /><Facilities /><Testimonials /><Admissions onEnquire={onEnquire} /></>}
  </PageShell>;
}

/* ─────────────────────────── BRANCH PAGE TEMPLATE ─────────────────────────── */
type BranchInfo = { title: string; streetName: string; fullAddress: string; description: string; about: readonly string[]; quote: string; gallery: readonly string[] };

function BranchGallery({ streetName, images }: { streetName: string; images: readonly string[] }) {
  return (
    <section className="py-8 md:py-12">
      <div className="container-wide">
        <div className="text-center">
          <h2 className="section-heading text-[clamp(1.6rem,2.8vw,2.2rem)]">Photo <em>Gallery</em></h2>
          <div className="ornament mt-2"><span className="ornament-mark">◆</span></div>
          <p className="mt-3 text-[15px] text-[#3F5771]">A look at life on our {streetName} campus.</p>
        </div>
        <div className="mt-9">
          <GalleryOrbs images={images} label={`${streetName} branch gallery`} className="grid-cols-2 md:grid-cols-4" />
        </div>
      </div>
    </section>
  );
}

function BranchPageTemplate({ branch, branchOffset = 0 }: { branch: BranchInfo; branchOffset?: number }) {
  return (
    <PageShell
      title={`${branch.streetName} Branch | Sree Vivekananda Educational Society`}
      description={branch.description}
      footerBranchLabel={`Sree Swamy Vivekananda School — ${branch.streetName}`}
      footerBranchAddress={branch.fullAddress}
    >
      {(onEnquire) => <>
        {/* The same hero the home page runs, scrolling photographs and all,
            with the branch standing in for the town. */}
        <Hero place={branch.streetName} eyebrow="SREE SWAMY VIVEKANANDA SCHOOL" headingLevel="h1" />
        {/* `#about` in the header finds this before it thinks about routing
            home, so About Us lands on the branch you are actually reading. */}
        <section id="about" className="py-8 md:py-11">
          <div className="container-wide">
            <Heading title="About" accent="Us" />
            <div className="mt-7 grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
              <div className="reveal">
                {branch.about.map((paragraph, index) => <p key={paragraph.slice(0, 40)} className={`text-[15px] leading-7 text-black/75 ${index > 0 ? 'mt-4' : ''}`}>{paragraph}</p>)}
              </div>
              {/* The gallery's orb, with words where the photograph goes. The
                  inset is a percentage so the text box scales with the circle
                  and the longest of the three quotes keeps its corners inside
                  the curve. */}
              <figure className="reveal relative mx-auto aspect-square w-full max-w-[400px]">
                <span className="absolute inset-[6%] rounded-full bg-white shadow-[0_10px_30px_rgba(31,40,56,.16)]" />
                <OrbRing colour="#0F4C5C" spin={0} />
                <div className="absolute inset-[15%] flex flex-col items-center justify-center gap-3 text-center">
                  <Quote className="h-6 w-6 shrink-0 text-[#0F4C5C]" fill="currentColor" aria-hidden="true" />
                  <blockquote className="font-display text-[clamp(.85rem,1.3vw,1.05rem)] italic leading-7 text-[#123A5E]" data-testid="text-branch-quote">{branch.quote}</blockquote>
                  <figcaption className="text-[13px] font-semibold text-[#0F4C5C]">— Swami Vivekananda</figcaption>
                </div>
              </figure>
            </div>
          </div>
        </section>
        <Faculty branchOffset={branchOffset} />
        <BranchGallery streetName={branch.streetName} images={branch.gallery} />
        <Admissions onEnquire={onEnquire} />
      </>}
    </PageShell>
  );
}

/* Each branch shows the same photographs in its own order, so the three
   gallery pages do not scroll past as one repeated grid. */
const BRANCH_PHOTOS = ['/campus-courtyard.jpg', '/making-lab.jpg', '/smartclass.jpeg', '/athletics-field.jpg', '/schoolbus.jpeg', '/our-story-poster.jpg'] as const;

const BRANCHES: Record<string, BranchInfo> = {
  'shivalayam-street': {
    title: 'Shivalayam Street Branch',
    streetName: 'Shivalayam Street',
    fullAddress: 'Shivalayam Street, Pulivendla, Kadapa District, Andhra Pradesh – 516390',
    description: 'Our flagship branch on Shivalayam Street brings CBSE-aligned education from Pre-School through High-School to the heart of Pulivendla, with experienced faculty and a nurturing environment.',
    about: [
      'Set in the heart of Pulivendla, the Shivalayam Street campus is where the school began, and it still sets the pace for the branches that followed. Classes run the whole way from Pre-School to High-School, so a child who joins us at three can sit their board exams without ever having to change schools.',
      'Teaching follows the CBSE-aligned LEAD curriculum, with smart classrooms and activity-based lessons that turn a concept into something a child has actually done rather than only read about. From the middle years, foundation coaching for IIT-JEE and NEET runs alongside board preparation, and assessments through the year mean a gap is closed when it appears rather than discovered the week before an exam.',
    ],
    quote: 'The power of concentration is the only key to the treasure-house of knowledge.',
    gallery: BRANCH_PHOTOS,
  },
  'brahmanapalli-road': {
    title: 'Brahmanapalli Road Branch',
    streetName: 'Brahmanapalli Road',
    fullAddress: 'Brahmanapalli Road, Pulivendla, Kadapa District, Andhra Pradesh – 516390',
    description: 'The Brahmanapalli Road branch offers a calm and focused learning environment, serving families across the Brahmanapalli area with dedicated teachers and holistic education.',
    about: [
      'The Brahmanapalli Road campus opened to bring the same standard of teaching within reach of families on that side of Pulivendla, and it has kept the unhurried feel of a school where everyone knows everyone. Teachers stay with a class long enough to know each child by name and by temperament — who needs drawing out, who needs slowing down, and who has quietly stopped following.',
      'The curriculum, the smart classrooms, the assessment pattern and the IIT-JEE and NEET foundation work are the same as at every branch of the society, so a family moving between our campuses finds their child picking up exactly where they left off. Progress is shared with parents honestly and early, not saved up for a report at the end of the year.',
    ],
    quote: 'To me the very essence of education is concentration of mind, not the collecting of facts.',
    gallery: [...BRANCH_PHOTOS.slice(2), ...BRANCH_PHOTOS.slice(0, 2)],
  },
  'parnapalli-road': {
    title: 'Parnapalli Road Branch',
    streetName: 'Parnapalli Road',
    fullAddress: 'Parnapalli Road, Pulivendla, Kadapa District, Andhra Pradesh – 516390',
    description: 'The Parnapalli Road branch extends our mission of inspiring growth to the Parnapalli area, offering the same high standards of CBSE education and character development.',
    about: [
      'The Parnapalli Road campus carries our work out to the Parnapalli side of town, so that a good school is a short journey rather than a long one for the families living there. The building was laid out for the way children actually learn: room to move between activities, space for reading and for making things, and classrooms fitted with the same digital boards and audio-visual tools used across the society.',
      'Lessons follow the CBSE-aligned LEAD curriculum from Pre-School through High-School, with early foundation coaching for IIT-JEE and NEET for students who want it. Character is taught as deliberately as the subjects are — punctuality, honesty, looking after younger children and finishing what you start are expected here every day.',
    ],
    quote: 'Education is not the amount of information that is put into your brain and runs riot there, undigested, all your life.',
    gallery: [...BRANCH_PHOTOS.slice(4), ...BRANCH_PHOTOS.slice(0, 4)],
  },
};

function BranchPage({ params }: { params: { slug: string } }) {
  const info = BRANCHES[params.slug];
  if (!info) return <NotFound />;
  return <BranchPageTemplate branch={info} branchOffset={Object.keys(BRANCHES).indexOf(params.slug)} />;
}

/* A second of crest on white before each page — on first arrival and again on
   every route change, which is what the header links are. Keyed on the
   location so the timer restarts per navigation; the fade lives in the
   animation and finishes exactly as the element is unmounted. */
function LoadingSplash() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 1000);
    return () => window.clearTimeout(timer);
  }, [location]);
  if (!visible) return null;
  return <div className="loading-splash fixed inset-0 z-[100] grid place-items-center bg-white" role="status" aria-live="polite" data-testid="loading-splash">
    <span className="relative block h-[124px] w-[124px] overflow-hidden rounded-full shadow-[0_10px_30px_rgba(31,40,56,.14)] sm:h-[156px] sm:w-[156px]">
      <img src="/logo.jpeg" alt="" className="h-full w-full object-cover" />
      <span className="logo-shimmer logo-shimmer-loop" aria-hidden="true" />
    </span>
    <span className="sr-only">Loading</span>
  </div>;
}

function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/gallery" component={GalleryPage} /><Route path="/bus-routes" component={BusRoutesPage} /><Route path="/branch/:slug" component={BranchPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><LoadingSplash /><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;