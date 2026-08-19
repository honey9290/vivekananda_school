import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, Bus, Check, ChevronDown, ChevronRight, GraduationCap, Instagram, Mail, MapPin, Menu, Phone, Quote, Search, Send, User, UserRound, Volume2, VolumeX, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
const WALLPAPER_TILE = { width: 897, height: 1753 };
const WALLPAPER_ICONS = [
  { file: 'apple-svgrepo-com.svg', leftPct: 8, topPct: 4, widthPct: 6 },
  { file: 'books-svgrepo-com.svg', leftPct: 88, topPct: 9, widthPct: 6 },
  { file: 'cricket-svgrepo-com.svg', leftPct: 5, topPct: 14, widthPct: 6 },
  { file: 'cup-svgrepo-com.svg', leftPct: 92, topPct: 19, widthPct: 6 },
  { file: 'educate-svgrepo-com.svg', leftPct: 12, topPct: 24, widthPct: 5 },
  { file: 'elephant-svgrepo-com.svg', leftPct: 85, topPct: 29, widthPct: 7 },
  { file: 'giraffe-svgrepo-com.svg', leftPct: 10, topPct: 34, widthPct: 7 },
  { file: 'laptop-svgrepo-com.svg', leftPct: 90, topPct: 39, widthPct: 6 },
  { file: 'lion-svgrepo-com.svg', leftPct: 7, topPct: 44, widthPct: 6 },
  { file: 'paint-palette-palette-svgrepo-com.svg', leftPct: 86, topPct: 49, widthPct: 6 },
  { file: 'physical-education-svgrepo-com.svg', leftPct: 15, topPct: 54, widthPct: 5 },
  { file: 'rainbow-svgrepo-com.svg', leftPct: 94, topPct: 59, widthPct: 7 },
  { file: 'rocket-svgrepo-com.svg', leftPct: 6, topPct: 64, widthPct: 6 },
  { file: 'sleeping-svgrepo-com.svg', leftPct: 89, topPct: 69, widthPct: 5 },
  { file: 'star-svgrepo-com.svg', leftPct: 9, topPct: 74, widthPct: 5 },
  { file: 'sun-svgrepo-com.svg', leftPct: 91, topPct: 79, widthPct: 6 },
  { file: 'apple-svgrepo-com.svg', leftPct: 11, topPct: 84, widthPct: 6 },
  { file: 'books-svgrepo-com.svg', leftPct: 87, topPct: 89, widthPct: 6 },
  { file: 'cricket-svgrepo-com.svg', leftPct: 5, topPct: 94, widthPct: 6 },
  { file: 'cup-svgrepo-com.svg', leftPct: 93, topPct: 97, widthPct: 6 },
  { file: 'educate-svgrepo-com.svg', leftPct: 14, topPct: 99, widthPct: 5 },
] as const;

const CENTER_ICONS = [
  { file: 'earth-svgrepo-com.svg', leftPct: 40, topPct: 20, widthPct: 6 },
  { file: 'carrot-svgrepo-com.svg', leftPct: 60, topPct: 40, widthPct: 5 },
  { file: 'pineapple-svgrepo-com.svg', leftPct: 45, topPct: 65, widthPct: 5 },
  { file: 'bulb-svgrepo-com.svg', leftPct: 55, topPct: 85, widthPct: 6 },
] as const;

const ALL_TILE_ICONS = [...WALLPAPER_ICONS, ...CENTER_ICONS];

const FLOAT_VARIANTS = ['wallpaper-icon-float-a', 'wallpaper-icon-float-b', 'wallpaper-icon-float-c'];

function WallpaperTile() {
  return <div className="relative mx-auto w-[90%]" style={{ aspectRatio: `${WALLPAPER_TILE.width} / ${WALLPAPER_TILE.height}` }}>
    {ALL_TILE_ICONS.map((icon, index) => <div key={`${icon.file}-${icon.leftPct}-${icon.topPct}`} className="wallpaper-icon-depth absolute" style={{ left: `${icon.leftPct}%`, top: `${icon.topPct}%`, width: `${icon.widthPct}%` }}>
      <img src={`/wallpaper-icons/${icon.file}`} alt="" aria-hidden="true" className={`block w-full ${FLOAT_VARIANTS[index % FLOAT_VARIANTS.length]}`} style={{ animationDelay: `${((index * 1.3) % 12).toFixed(2)}s`, animationDuration: `${(14 + (index % 7) * 2.2).toFixed(2)}s` }} />
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
  ['Home', '#top'], ['About Us', '#about'], ['Faculty', '/faculty'], ['Results', '#results'], ['Facilities', '#media'],
  ['Gallery', '#gallery'], ['Blogs', '#blogs'], ['Contact Us', '#contact'],
] as const;
/* The header carries the six-item nav from the design; `navItems` above stays
   the fuller list the footer prints. */
const headerNavItems = [
  ['Home', '#top'], ['About Us', '#about'], ['Academics', '#results'], ['Faculty', '/faculty'],
  ['Facilities', '#media'], ['Gallery', '#gallery'],
] as const;

function useReveals() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Logo({ footer = false }: { footer?: boolean }) {
  return <a href="#top" className="flex shrink-0 items-center gap-3.5" data-testid="link-logo">
    <img src="/logo.jpeg" alt="Vivekananda Concept School logo" className="h-[64px] w-[64px] shrink-0 rounded-full object-cover sm:h-[82px] sm:w-[82px]" />
    <span className="leading-none">
      <b className={`block font-round text-[clamp(1.05rem,1.8vw,1.65rem)] font-extrabold tracking-[.045em] ${footer ? 'text-white' : 'text-[#123A5E]'}`}>VIVEKANANDA</b>
      <small className={`mt-[6px] block text-[clamp(.6rem,.85vw,.86rem)] font-semibold tracking-[.26em] sm:tracking-[.3em] ${footer ? 'text-white/70' : 'text-[#7C8B99]'}`}>CONCEPT SCHOOL</small>
    </span>
  </a>;
}

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const [location, navigate] = useLocation();
  /* A route of its own owns the highlight outright; on the home page the
     highlight follows whichever section link was last taken. */
  const [active, setActive] = useState(() => location === '/' ? '#top' : location);
  useEffect(() => { setActive(location === '/' ? '#top' : location); }, [location]);
  const go = (href: string) => {
    setOpen(false);
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
      <Logo />
      <nav className="hidden items-center gap-[clamp(1.1rem,2.6vw,2.6rem)] lg:flex" aria-label="Primary navigation">
        {headerNavItems.map(([label, href]) => {
          const on = active === href;
          return <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} aria-current={on ? 'page' : undefined} className={`relative whitespace-nowrap pb-[6px] text-[clamp(.9rem,1.05vw,1.06rem)] font-semibold transition-colors ${on ? 'text-[#1B7A3E]' : 'text-[#153B5B] hover:text-[#1B7A3E]'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
            {label}
            <span className={`absolute -bottom-[3px] left-0 h-[3px] rounded-full bg-[#1B7A3E] transition-all duration-300 ${on ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
          </a>;
        })}
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={onEnquire} className="hidden rounded-full border-2 border-[#123A5E] px-[clamp(1.3rem,2.1vw,2.1rem)] py-[11px] text-[clamp(.9rem,1.05vw,1.06rem)] font-semibold text-[#123A5E] transition hover:bg-[#123A5E] hover:text-white md:block" data-testid="button-header-enquiry">Enquire Now</button>
        <button onClick={() => setOpen(!open)} className="rounded-md p-2 text-[#153B5B] lg:hidden" aria-label="Toggle menu" data-testid="button-mobile-menu">{open ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
    </div>
    {open && <div className="border-t border-[#EFE7D7] bg-white px-5 py-3 lg:hidden"><nav>{headerNavItems.map(([label, href]) => <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} className="flex items-center justify-between border-b border-[#EFE7D7] py-3 text-[15px] font-semibold text-[#153B5B]" data-testid={`link-mobile-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}<ChevronRight size={15} /></a>)}</nav><a href="tel:+918500045678" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1B7A3E]" data-testid="link-mobile-phone"><Phone size={14} /> +91 85000 45678</a><button onClick={onEnquire} className="mt-3 w-full rounded-full bg-[#1B7A3E] py-3 text-sm font-bold text-white" data-testid="button-mobile-enquiry">Enquire Now</button></div>}
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

const HERO_SLIDES = [
  { src: '/making-lab.jpg', alt: 'Children building together in the activity room', position: '52% 48%' },
  { src: '/smartclass.jpeg', alt: 'A smart classroom lesson at Vivekananda Concept School', position: '50% 55%' },
  { src: '/campus-courtyard.jpg', alt: 'Students walking through the school courtyard', position: '50% 62%' },
  { src: '/athletics-field.jpg', alt: 'Students on the athletics field', position: '50% 50%' },
] as const;

function HeroPanel({ image, alt, caption }: { image: string; alt: string; caption: string }) {
  return <div className="relative min-h-[275px] overflow-hidden bg-[#F05D40] md:h-full">
    <img src={image} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-tr from-[#123A5E]/45 to-transparent" />
    <span className="absolute bottom-5 left-5 rounded bg-white/92 px-3 py-2 text-[13px] font-bold tracking-[.14em] text-[#2E6A9E]">{caption}</span>
  </div>;
}

function Hero() {
  return <section id="top" className="bg-white">
    <div className="grid min-h-[365px] md:h-[500px] md:grid-cols-3">
      <HeroPanel image="/campus-courtyard.jpg" alt="The Vivekananda Concept School campus" caption="A CAMPUS BUILT FOR CHILDREN" />
      <div className="relative flex items-center overflow-hidden bg-gradient-to-br from-[#D3E6F6] via-[#B9D8F0] to-[#9DC6E9] px-8 py-14">
        <span className="absolute -left-16 top-[-38px] h-[310px] w-[90px] rotate-[27deg] bg-white/45" />
        <span className="absolute -right-12 bottom-[-60px] h-[330px] w-[60px] rotate-[26deg] bg-[#7FB2DE]/45" />
        <div className="relative z-10 max-w-[480px] text-[#123A5E]">
          <p className="text-[13px] font-bold tracking-[.25em] text-[#2E6A9E]">WELCOME TO OUR SCHOOL</p>
          <b className="mt-4 block font-round text-[clamp(1.75rem,3.2vw,2.7rem)] font-extrabold leading-none tracking-[.03em]">VIVEKANANDA</b>
          <b className="mt-2.5 block text-[clamp(.72rem,1.25vw,.95rem)] font-semibold tracking-[.26em] text-[#5A7B99]">CONCEPT SCHOOL</b>
          <p className="mt-3 font-display text-[clamp(1.2rem,2vw,1.65rem)] italic">PULIVENDLA</p>
          <p className="mt-3 max-w-[315px] text-[16px] leading-6 text-[#3F5771]">A place where every child learns, grows and shines.</p>
        </div>
      </div>
      <HeroPanel image="/making-lab.jpg" alt="Vivekananda Concept School students building in the activity room" caption="HANDS-ON LEARNING" />
  </div>
  </section>;
}

/* Wherever the school is named as a heading it is set exactly as the header sets it:
   the crest, VIVEKANANDA in the header navy, CONCEPT SCHOOL in the header grey. */
function SchoolName({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const small = size === 'sm';
  return <span className="flex items-center gap-3">
    <img src="/logo.jpeg" alt="Vivekananda Concept School logo" className={`shrink-0 rounded-full object-cover ${small ? 'h-[58px] w-[58px]' : 'h-[74px] w-[74px]'}`} />
    <span className="leading-none">
      <b className={`block font-round font-extrabold tracking-[.045em] text-[#123A5E] ${small ? 'text-[clamp(1.15rem,2.4vw,1.5rem)]' : 'text-[clamp(1.45rem,2.9vw,2.1rem)]'}`}>VIVEKANANDA</b>
      <small className={`mt-[6px] block font-semibold tracking-[.26em] text-[#7C8B99] ${small ? 'text-[clamp(.6rem,1.1vw,.76rem)]' : 'text-[clamp(.68rem,1.3vw,.95rem)]'}`}>CONCEPT SCHOOL</small>
    </span>
  </span>;
}

function Heading({ title, accent }: { title?: string; accent?: string }) {
  return <div className="reveal flex flex-col items-center"><h2 className="section-heading text-center text-[clamp(1.85rem,3.3vw,2.5rem)]">{title}{title && ' '}{accent && <em>{accent}</em>}</h2><div className="ornament mt-2"><span className="ornament-mark">◆</span></div></div>;
}

function Intro() {
  return <section id="about" className="relative overflow-hidden py-5 md:py-7"><div className="absolute left-0 top-0 h-16 w-16 border-l-[3px] border-t-[3px] border-[#0F4C5C] opacity-70" /><div className="container-wide grid gap-7 md:grid-cols-[1fr_1fr] md:items-center">
    <div className="reveal"><h2><SchoolName /></h2><div className="ornament mt-2"><span className="ornament-mark">◆</span></div><p className="mt-5 max-w-[470px] text-[17px] leading-6 text-black">Igniting minds, shaping futures. Join us for academic excellence, character building, and holistic development. Our classrooms blend structured, CBSE-aligned learning with hands-on activities that turn curiosity into confidence, while dedicated teachers mentor every child from their very first day through each milestone that follows. From Pre-School through High-School, we build a foundation of strong values, critical thinking and real-world skills so every student leaves prepared to lead — in the classroom and far beyond it.</p></div>
    {/* The quote is set into the artwork rather than laid over it, so the alt
        text has to carry the whole line and the attribution — to a screen
        reader or a crawler this is otherwise a blank decorative panel. And no
        fixed aspect box here: the plate is 960×701, so forcing it into the 4/3
        frame the campus photograph used would crop a slice off each side and
        eat into the words. Letting it keep its own ratio means nothing of the
        quote is ever cut, whatever the column width. */}
    <div className="reveal relative mx-auto w-full max-w-[400px] overflow-hidden rounded-3xl border-[6px] border-white bg-white shadow-[0_10px_26px_rgba(31,40,56,.18)] ring-1 ring-[#1C2A37]/25"><img src="/swami-vivekananda-quote.jpg" alt="“Educate and raise the masses, and thus alone a nation is possible.” — Swami Vivekananda" className="block w-full rounded-2xl" data-testid="img-about" /></div>
  </div></section>;
}

type Programme = { name: string; image: string; copy: string };
const programmes: Programme[] = [
  { name: 'Pre-School', image: '/making-lab.jpg', copy: 'Children are introduced to learning through play, stories, creative expression, early numbers and joyful discovery.' },
  { name: 'Primary School', image: '/campus-courtyard.jpg', copy: 'Our curriculum helps children build confident foundations while learning to think, question and engage with the world.' },
  { name: 'Middle-School', image: '/athletics-field.jpg', copy: 'An inspiring environment enables a shift from rote methods to a course beyond textbooks, with ideas and experiences at the centre.' },
  { name: 'High-School', image: '/making-lab.jpg', copy: 'Experiential and student-centric learning prepares students for their next stage with focus, independence and purpose.' },
];
const resultImages = [
  { src: '/results-2.jpeg', caption: 'Town Toppers — SSC Results 2026' },
  { src: '/results-1.jpeg', caption: 'Our Achievers — SSC Results 2026' },
  { src: '/results-3.jpeg', caption: 'More Achievers — SSC Results 2026' },
];
function Results() {
  return <section id="results" className="relative py-6 md:py-9"><div className="container-wide"><Heading title="SSC" accent="RESULTS 2026" /><p className="reveal mx-auto mt-4 max-w-[620px] text-center text-[18px] leading-7 text-black">Best in standards, first in results — proud of every student who made this year's SSC results shine.</p><div className="mx-auto mt-8 grid max-w-[900px] grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">{resultImages.map((item, index) => <a key={item.src} href={item.src} target="_blank" rel="noreferrer" className="reveal school-card block overflow-hidden rounded border border-[#1F2838] bg-white shadow-[0_2px_5px_rgba(31,40,56,.18)]" data-testid={`card-result-${index + 1}`}><img src={item.src} alt={item.caption} className={`w-full object-cover object-center aspect-[1310/1222] ${index > 0 ? '' : 'sm:aspect-auto sm:h-auto'}`} /><p className="px-1 py-2 text-center text-[10px] font-semibold leading-[1.3] text-[#0F4C5C] sm:px-4 sm:py-4 sm:text-[18px] sm:leading-normal">{item.caption}</p></a>)}</div></div></section>;
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
  const [, navigate] = useLocation();
  return <section id="media" className="py-5 md:py-7"><div className="container-wide">
    <Heading accent="Facilities" />
    <div className="mx-auto mt-6 grid max-w-[760px] grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-10 sm:gap-y-8">
      {facilities.map(({ icon: Icon, image, contain, title, copy }, index) => <article key={title} className="reveal flex flex-col items-center text-center" data-testid={`card-facility-${index + 1}`}>
        <span className={`facility-circle grid h-16 w-16 place-items-center overflow-hidden rounded-full p-1 sm:h-24 sm:w-24 ${index % 2 === 0 ? 'text-[#0F4C5C]' : 'text-black'}`}>{image ? <img src={image} alt="" className={`h-full w-full rounded-full ${contain ? 'object-contain p-2' : 'object-cover'}`} /> : Icon ? <Icon size={40} /> : null}</span>
        <h3 className="mt-3 font-sans text-[14px] font-medium leading-[1.25] text-black sm:text-[19px] sm:leading-snug">{title}</h3>
        <p className="mt-1.5 max-w-[280px] text-[11.5px] leading-[1.4] text-black/75 sm:text-[13.5px] sm:leading-[1.5]">{copy}</p>
        {/* A real anchor so it can be opened in a new tab or read as a link,
            with the click intercepted for a client-side route. */}
        {index === 0 && <a href="/bus-routes" onClick={(event) => { event.preventDefault(); navigate('/bus-routes'); window.scrollTo({ top: 0 }); }} className="mt-3 text-[12px] font-semibold leading-[1.3] text-[#0F4C5C] underline decoration-dotted underline-offset-4 hover:text-black sm:text-[13px]" data-testid="link-bus-routes">Check if our bus comes to your area →</a>}
      </article>)}
    </div>
  </div></section>;
}

const gallery = ['/making-lab.jpg', '/campus-courtyard.jpg', '/athletics-field.jpg', '/campus-courtyard.jpg', '/making-lab.jpg', '/athletics-field.jpg'];
const galleryFrames = [
  { shape: 'g-shape-arch', colour: '#0F4C5C' },
  { shape: 'g-shape-arch', colour: '#1C2A37' },
  { shape: 'g-shape-arch', colour: '#E0A93B' },
  { shape: 'g-shape-arch', colour: '#2F7D6E' },
  { shape: 'g-shape-arch', colour: '#C2591B' },
  { shape: 'g-shape-arch', colour: '#5B3E96' },
] as const;
const faculty = [
  { role: 'Principal', copy: 'Leads the academic vision of the school and mentors both teachers and students.' },
  { role: 'Academic Coordinator', copy: 'Plans the CBSE-aligned curriculum and keeps every class on track through the year.' },
  { role: 'Science & Mathematics Faculty', copy: 'Builds conceptual strength with experiments, problem solving and exam preparation.' },
  { role: 'Languages & Humanities Faculty', copy: 'Develops reading, writing and expression in English, Hindi and Telugu.' },
] as const;
/* `heading` off when the page above already carries the title as its `h1` —
   otherwise the section repeats it and the page has two competing headings. */
function Faculty({ heading = true }: { heading?: boolean }) {
  return <section id="faculty" className="py-6 md:py-9"><div className="container-wide">{heading && <Heading title="Our" accent="Faculty" />}<p className="reveal mx-auto mt-4 max-w-[620px] text-center text-[17px] leading-6 text-black">Experienced teachers who know every child by name, and stay with them from the first lesson to the final board exam.</p><div className="mx-auto mt-8 grid max-w-[900px] gap-6 sm:grid-cols-2 lg:grid-cols-4">{faculty.map((member, index) => <article key={member.role} className="reveal school-card rounded-2xl border border-[#1C2A37]/20 bg-white/85 p-5 text-center shadow-[0_4px_12px_rgba(31,40,56,.12)]" data-testid={`card-faculty-${index + 1}`}><span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-[#1C2A37]/40 text-black"><GraduationCap size={34} /></span><h3 className="mt-4 font-sans text-[18px] font-semibold text-black">{member.role}</h3><p className="mt-2 text-[15px] leading-6 text-black/75">{member.copy}</p></article>)}</div></div></section>;
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

function Gallery() {
  return <section id="gallery" className="relative overflow-hidden py-5 md:py-7"><div className="absolute right-0 top-20 hero-dots h-24 w-16 opacity-60" /><div className="container-wide"><Heading title="PHOTO" accent="GALLERY" /><div className="mx-auto mt-7 grid max-w-[1120px] items-center gap-8 md:grid-cols-[210px_1fr]">
    <div className="reveal relative mx-auto w-full max-w-[210px] overflow-hidden rounded-2xl border-[5px] border-white bg-[#123A5E] shadow-[0_10px_26px_rgba(31,40,56,.2)]"><div className="relative aspect-[9/16] overflow-hidden rounded-xl"><StoryVideo /></div></div>
    <div className="grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-3">{gallery.map((src, index) => { const frame = galleryFrames[index % galleryFrames.length]; return <button key={`${src}-${index}`} className={`group relative block aspect-[1.5] w-full p-[6px] ${frame.shape}`} style={{ backgroundColor: frame.colour }} onClick={() => window.open(src, '_blank')} data-testid={`button-gallery-${index + 1}`}><span className={`relative block h-full w-full overflow-hidden bg-white ${frame.shape}`}><img src={src} alt={`School life gallery ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute inset-0 bg-[#0F4C5C]/0 transition-colors group-hover:bg-[#0F4C5C]/20" /></span></button>; })}</div>
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

function Footer({ onEnquire }: { onEnquire: () => void }) {
  return <footer id="contact" className="footer-texture relative overflow-hidden text-white"><div id="disclosure" className="container-wide py-5 md:py-7"><div className="grid gap-5 md:grid-cols-[1.25fr_.8fr_1.25fr]"><div><div className="text-center"><a href="#top" className="mx-auto flex w-max flex-col items-center gap-2 text-white" data-testid="link-logo-footer"><img src="/logo.jpeg" alt="Vivekananda Concept School logo" className="h-20 w-20 rounded-full border-[3px] border-white object-cover shadow" /><span className="block text-center leading-[1.15]"><b className="block text-[15px] tracking-[.06em]">VIVEKANANDA</b><small className="block text-[11px] tracking-[.18em]">CONCEPT SCHOOL</small><small className="block text-[11px] tracking-[.18em]">PULIVENDLA</small></span></a><small className="mt-2 block text-[11px] tracking-[.13em] text-white">LEARN • GROW • SHINE</small><p className="mx-auto mt-3 max-w-[260px] text-center text-[13px] leading-[1.4]">Vivekananda Concept School, Pulivendla, under the guidance of a dedicated team of educators.</p></div></div><div><h3 className="text-[15px] font-semibold">Helpful Links</h3><div className="mt-3 grid gap-1.5 text-[14px]">{navItems.slice(0, 8).map(([label, href]) => <a key={href} href={href} className="hover:text-[#FFFFFF]" data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}</div></div><div><h3 className="text-[15px] font-semibold">Address</h3><a href="tel:+918500045678" className="mt-3 flex items-center gap-2 text-[14px]" data-testid="link-phone-footer"><Phone size={14} /> +91 85000 45678 / 85004 95678</a><a href="https://www.google.com/maps/search/?api=1&query=3-4-55%2C+Guntha+Bazar+Rd%2C+near+Raja+Reddy+Hospital%2C+Pulivendla%2C+516390" target="_blank" rel="noreferrer" className="mt-2.5 flex gap-2 text-[14px] leading-[1.4] hover:text-[#FFFFFF]" data-testid="link-address-footer"><MapPin size={15} className="mt-0.5 shrink-0" /> 3-4-55, Guntha Bazar Rd, near Raja Reddy Hospital, Pulivendla, 516390</a><a href="mailto:hello@vivekanandaconcept.school" className="mt-2.5 flex items-center gap-2 text-[14px]" data-testid="link-email-footer"><Mail size={14} /> hello@vivekanandaconcept.school</a><a href="https://www.instagram.com/vcsplvd?igsh=MW00NW1xdWtoY2Q1Mw==" target="_blank" rel="noreferrer" className="mt-2.5 flex items-center gap-2 text-[14px] hover:text-[#FFFFFF]" data-testid="link-instagram-footer"><Instagram size={14} /> Instagram</a><button onClick={onEnquire} className="mt-4 rounded border border-white px-3 py-1.5 text-[12px] font-semibold hover:bg-white hover:text-[#0F4C5C]" data-testid="button-footer-enquiry">ADMISSION ENQUIRY</button></div></div><div className="mt-5 border-t border-white/30 pt-3 text-[12px]">© 2026 Vivekananda Concept School · Mandatory Disclosure</div></div></footer>;
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
          <img src="/logo.jpeg" alt="Vivekananda Concept School logo" className="mb-5 h-[94px] w-[94px] rounded-full object-cover shadow-[0_10px_24px_-12px_rgba(18,58,94,.6)]" />
          <b className="font-round text-[clamp(1.6rem,3.4vw,2.5rem)] font-extrabold leading-none tracking-[.045em] text-[#123A5E]">VIVEKANANDA</b>
          <small className="mt-2.5 block text-[clamp(.7rem,1.4vw,1rem)] font-semibold leading-none tracking-[.26em] text-[#7C8B99]">CONCEPT SCHOOL</small>
          <span className="mt-4 flex items-center gap-2">
            <span className="h-[2px] w-[62px] rounded-full bg-[#123A5E]" /><span className="h-[5px] w-[5px] rounded-full bg-[#123A5E]" /><span className="h-[2px] w-[62px] rounded-full bg-[#123A5E]" />
          </span>
          <blockquote className="mt-7 flex w-full max-w-[300px] flex-col items-center">
            <span className="flex w-full items-center gap-3">
              <span className="h-px flex-1 bg-[#123A5E]/40" /><Quote size={22} className="shrink-0 rotate-180 text-[#123A5E]" fill="currentColor" strokeWidth={0} /><span className="h-px flex-1 bg-[#123A5E]/40" />
            </span>
            <p className="mt-4 text-[13.5px] leading-[1.62] text-[#3F5771]">Knowledge can only be obtained in one way, the way of experience; there is no other way to know.</p>
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
function PageShell({ title, description, admissionsPopup: withPopup = false, children }: { title: string; description: string; admissionsPopup?: boolean; children: (onEnquire: () => void) => ReactNode }) {
  const [modal, setModal] = useState(false); const [admissionsPopup, setAdmissionsPopup] = useState(withPopup); useReveals();
  useEffect(() => { document.title = title; const set = (name: string, content: string) => { let meta = document.querySelector(`meta[name="${name}"]`); if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', name); document.head.appendChild(meta); } meta.setAttribute('content', content); }; set('description', description); }, [title, description]);
  const openEnquiry = () => setModal(true);
  return <div className="grain relative min-h-[100dvh] overflow-hidden bg-white">
    <div className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/background.jpeg')" }} aria-hidden="true" />
    <WallpaperLayer />
    <div className="relative z-10"><Header onEnquire={openEnquiry} />{children(openEnquiry)}<Footer onEnquire={openEnquiry} /></div>
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

function FacultyPage() {
  return <PageShell title="Our Faculty | Vivekananda Concept School" description="The teachers at Vivekananda Concept School, Pulivendla — experienced faculty across sciences, mathematics, languages and humanities who stay with every child from the first lesson to the final board exam.">
    {(onEnquire) => <>
      {/* Title only. The section below brings its own standfirst, so repeating
          one here would stack two paragraphs saying the same thing. */}
      <section className="pt-8 md:pt-12"><div className="container-wide flex flex-col items-center">
        <h1 className="section-heading text-center text-[clamp(2rem,3.6vw,2.8rem)]">Our <em>Faculty</em></h1>
        <div className="ornament mt-2"><span className="ornament-mark">◆</span></div>
      </div></section>
      <Faculty heading={false} />
      <Admissions onEnquire={onEnquire} />
    </>}
  </PageShell>;
}

function Home() {
  return <PageShell title="Vivekananda Concept School | Pulivendla" description="Vivekananda Concept School in Pulivendla offers thoughtful education from Pre-School through High-School." admissionsPopup>
    {/* Faculty lives on /faculty now, reached from the header. */}
    {(onEnquire) => <><Hero /><Intro /><Results /><Facilities /><Gallery /><Testimonials /><Admissions onEnquire={onEnquire} /></>}
  </PageShell>;
}
function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/faculty" component={FacultyPage} /><Route path="/bus-routes" component={BusRoutesPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;