import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, Bus, Check, ChevronRight, GraduationCap, Instagram, Mail, MapPin, Menu, Phone, Quote, Search, Send, Volume2, VolumeX, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
const WALLPAPER_TILE = { width: 897, height: 1753 };
const WALLPAPER_ICONS = [
  { file: 'icon-01.png', leftPct: 91.304, topPct: 3.137, widthPct: 3.122 },
  { file: 'icon-02.png', leftPct: 6.243, topPct: 3.195, widthPct: 2.787 },
  { file: 'icon-03.png', leftPct: 26.756, topPct: 3.48, widthPct: 6.466 },
  { file: 'icon-04.png', leftPct: 5.463, topPct: 5.077, widthPct: 7.246 },
  { file: 'icon-05.png', leftPct: 86.065, topPct: 5.419, widthPct: 8.807 },
  { file: 'icon-06.png', leftPct: 1.895, topPct: 12.265, widthPct: 12.932 },
  { file: 'icon-07.png', leftPct: 93.2, topPct: 14.375, widthPct: 3.456 },
  { file: 'icon-08.png', leftPct: 91.639, topPct: 20.251, widthPct: 5.351 },
  { file: 'icon-09.png', leftPct: 94.649, topPct: 26.868, widthPct: 2.899 },
  { file: 'icon-11.png', leftPct: 87.737, topPct: 34.17, widthPct: 11.371 },
  { file: 'icon-12.png', leftPct: 3.456, topPct: 40.103, widthPct: 3.79 },
  { file: 'icon-13.png', leftPct: 93.2, topPct: 48.431, widthPct: 3.122 },
  { file: 'icon-14.png', leftPct: 3.233, topPct: 50.086, widthPct: 6.577 },
  { file: 'icon-15.png', leftPct: 89.967, topPct: 51.169, widthPct: 8.25 },
  { file: 'icon-16.png', leftPct: 4.236, topPct: 57.616, widthPct: 2.787 },
  { file: 'icon-18.png', leftPct: 89.855, topPct: 63.149, widthPct: 9.142 },
  { file: 'icon-19.png', leftPct: 3.01, topPct: 63.206, widthPct: 6.243 },
  { file: 'icon-20.png', leftPct: 3.233, topPct: 73.36, widthPct: 7.692 },
  { file: 'icon-21.png', leftPct: 3.902, topPct: 84.598, widthPct: 3.456 },
  { file: 'icon-23.png', leftPct: 87.402, topPct: 90.873, widthPct: 7.135 },
  { file: 'icon-24.png', leftPct: 5.24, topPct: 90.987, widthPct: 8.361 },
] as const;

const CENTER_ICONS = [
  { file: 'icon-01.png', leftPct: 38, topPct: 16, widthPct: 3.6 },
  { file: 'icon-07.png', leftPct: 58, topPct: 28, widthPct: 3.6 },
  { file: 'icon-09.png', leftPct: 44, topPct: 42, widthPct: 3.2 },
  { file: 'icon-13.png', leftPct: 62, topPct: 55, widthPct: 3.6 },
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
const headerNavItems = navItems.filter(([label]) => label !== 'Blogs' && label !== 'Contact Us');

function useReveals() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Logo({ footer = false }: { footer?: boolean }) {
  return <a href="#top" className={`flex items-center gap-3 ${footer ? 'text-white' : 'text-[#1C2A37]'}`} data-testid="link-logo">
    <img src="/logo.jpeg" alt="Vivekananda Concept School logo" className="h-16 w-16 shrink-0 rounded-full object-cover" />
    <span className="leading-[.9]"><b className="block text-[22px] tracking-[.06em]">VIVEKANANDA</b><small className={`text-[15px] tracking-[.18em] ${footer ? 'text-[#FFFFFF]' : 'text-[#1C2A37]'}`}>CONCEPT SCHOOL</small></span>
    <span className={`hidden h-10 w-px sm:block ${footer ? 'bg-white/40' : 'bg-[#1C2A37]/30'}`} aria-hidden="true" />
    <span className="hidden text-[15px] font-bold tracking-[.18em] sm:block">PULIVENDLA</span>
  </a>;
}

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const go = (href: string) => {
    setOpen(false);
    if (!href.startsWith('#')) { navigate(href); window.scrollTo({ top: 0 }); return; }
    const target = document.querySelector(href);
    if (target) { target.scrollIntoView({ behavior: 'smooth' }); return; }
    /* The section is on the home page and we are not on it — the anchor would
       otherwise do nothing at all from /facilities. Route home first, then
       scroll on the frame after the sections have mounted. */
    navigate('/');
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })));
  };
  return <header className="relative z-30 bg-white">
    <div className="container-wide">
      <div className="flex min-h-[82px] items-center justify-between gap-4">
        <Logo />
        <div className="hidden items-center gap-6 md:flex">
          <a href="tel:+918500045678" className="flex items-center gap-2 text-[15px] text-[#1F2838]" data-testid="link-header-phone"><Phone size={13} className="text-[#8E140E]" /> +91 85000 45678 / 85004 95678</a>
          <button onClick={onEnquire} className="rounded-full border border-[#8E140E] px-5 py-2 text-[15px] font-semibold text-[#8E140E] hover:bg-[#8E140E] hover:text-white" data-testid="button-header-enquiry">ADMISSION ENQUIRY</button>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-sm p-2 text-[#8E140E] md:hidden" aria-label="Toggle menu" data-testid="button-mobile-menu">{open ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      <div className="hidden border-t border-[#1F2838] md:block">
        <nav className="flex min-h-[53px] items-center justify-between gap-2" aria-label="Primary navigation">
          {headerNavItems.map(([label, href]) => <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} className="nav-link whitespace-nowrap py-2 text-[14px] font-medium text-[#1F2838] hover:text-[#8E140E]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}
        </nav>
      </div>
    </div>
    {open && <div className="border-t border-[#1F2838] bg-[#FFFFFF] px-5 py-3 md:hidden"><nav>{headerNavItems.map(([label, href]) => <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} className="flex items-center justify-between border-b border-[#1F2838] py-3 text-sm font-semibold text-[#1F2838]" data-testid={`link-mobile-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}<ChevronRight size={15} /></a>)}</nav><a href="tel:+918500045678" className="mt-4 flex items-center gap-2 text-sm text-[#8E140E]" data-testid="link-mobile-phone"><Phone size={14} /> +91 85000 45678</a><button onClick={onEnquire} className="mt-3 w-full rounded-full bg-[#8E140E] py-3 text-xs font-bold text-white" data-testid="button-mobile-enquiry">ADMISSION ENQUIRY</button></div>}
  </header>;
}

function Hero() {
  return <section id="top" className="bg-white">
    <div className="grid min-h-[365px] md:h-[550px] md:grid-cols-3">
      <div className="relative min-h-[190px] overflow-hidden bg-[#1F2838] sm:min-h-[275px] md:h-full">
        <img src="/campus-courtyard.jpg" alt="Vivekananda Concept School campus" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1F2838]/30 to-transparent" />
        <div className="absolute bottom-4 left-5 rounded bg-white/90 px-3 py-2 text-[13px] font-bold tracking-[.14em] text-[#8E140E]">A CAMPUS BUILT FOR CHILDREN</div>
      </div>
      <div className="hero-pattern relative flex items-center overflow-hidden px-6 py-10 sm:px-8 sm:py-12">
        <div className="absolute -left-16 top-[-38px] h-[310px] w-[90px] rotate-[27deg] bg-[#8E140E]" />
        <div className="absolute -right-12 bottom-[-60px] h-[330px] w-[60px] rotate-[26deg] bg-[#8E140E]" />
        <div className="relative z-10 max-w-[480px] text-white">
          <p className="text-[14px] font-bold tracking-[.25em] text-[#FFFFFF]">WELCOME TO OUR SCHOOL</p>
          <h1 className="mt-4 font-sans text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.08]">Vivekananda Concept School</h1>
          <p className="mt-3 font-display text-[clamp(1.4rem,2.2vw,1.9rem)] italic text-[#FFFFFF]">PULIVENDLA</p>
          <p className="mt-3 max-w-[315px] text-[17px] leading-6 text-white/85">A place where every child learns, grows and shines.</p>
        </div>
      </div>
      <div className="relative min-h-[190px] overflow-hidden bg-[#1F2838] sm:min-h-[275px] md:h-full">
        <img src="/making-lab.jpg" alt="Vivekananda Concept School students" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1F2838]/30 to-transparent" />
        <div className="absolute bottom-4 left-5 rounded bg-white/90 px-3 py-2 text-[13px] font-bold tracking-[.14em] text-[#8E140E]">HANDS-ON LEARNING</div>
      </div>
    </div>
    <div className="relative h-8 overflow-hidden bg-white"><div className="absolute left-0 top-0 h-8 w-24 bg-[#8E140E]" style={{ clipPath: 'polygon(0 0, 100% 0, 71% 50%, 100% 100%, 0 100%, 27% 50%)' }} /><div className="hero-dots absolute right-0 top-0 h-8 w-24 opacity-50" /></div>
  </section>;
}

function Heading({ title, accent }: { title: string; accent?: string }) {
  return <div className="reveal flex flex-col items-center"><h2 className="section-heading text-center text-[clamp(1.85rem,3.3vw,2.5rem)]">{title} {accent && <em>{accent}</em>}</h2><div className="ornament mt-2"><span className="ornament-mark">◆</span></div></div>;
}

function Intro() {
  return <section id="about" className="relative overflow-hidden py-5 md:py-7"><div className="absolute left-0 top-0 h-16 w-16 border-l-[3px] border-t-[3px] border-[#8E140E] opacity-70" /><div className="container-wide grid gap-7 md:grid-cols-[1fr_1fr] md:items-center">
    <div className="reveal"><h2 className="font-sans text-[clamp(1.9rem,3.3vw,2.5rem)] font-semibold leading-tight tracking-[.04em] text-[#1C2A37]">Welcome to Vivekananda Concept School</h2><div className="ornament mt-2"><span className="ornament-mark">◆</span></div><p className="mt-5 max-w-[470px] text-[17px] leading-6 text-[#1F2838]">Welcome to Vivekananda Concept School! Igniting minds, shaping futures. Join us for academic excellence, character building, and holistic development. Our classrooms blend structured, CBSE-aligned learning with hands-on activities that turn curiosity into confidence, while dedicated teachers mentor every child from their very first day through each milestone that follows. From Pre-School through High-School, we build a foundation of strong values, critical thinking and real-world skills so every student leaves prepared to lead — in the classroom and far beyond it.</p></div>
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
  return <section id="results" className="relative py-6 md:py-9"><div className="container-wide"><Heading title="SSC" accent="RESULTS 2026" /><p className="reveal mx-auto mt-4 max-w-[620px] text-center text-[18px] leading-7 text-[#1F2838]">Best in standards, first in results — proud of every student who made this year's SSC results shine.</p><div className="mx-auto mt-8 grid max-w-[900px] gap-6 sm:grid-cols-2 lg:grid-cols-3">{resultImages.map((item, index) => <a key={item.src} href={item.src} target="_blank" rel="noreferrer" className="reveal school-card block overflow-hidden rounded border border-[#1F2838] bg-white shadow-[0_2px_5px_rgba(31,40,56,.18)]" data-testid={`card-result-${index + 1}`}><img src={item.src} alt={item.caption} className={index > 0 ? 'aspect-[1310/1222] w-full object-cover object-center' : 'h-auto w-full object-cover'} /><p className="px-4 py-4 text-center text-[18px] font-semibold text-[#8E140E]">{item.caption}</p></a>)}</div></div></section>;
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
      <p className="mx-auto max-w-[460px] text-center text-[15px] leading-6 text-[#1F2838]/75">Type your village or area below. If it is on one of our three routes, our bus can pick your child up and drop them home.</p>

      <div className="mx-auto mt-5 flex max-w-[420px] items-center gap-2 rounded-full border-2 border-[#1C2A37]/30 bg-white px-4 py-2.5 focus-within:border-[#8E140E]">
        <Search size={17} className="shrink-0 text-[#8E140E]" aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search your area…" aria-label="Search for your village or area" className="w-full bg-transparent text-[15px] text-[#1F2838] outline-none placeholder:text-[#1F2838]/45" data-testid="input-bus-area-search" />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="shrink-0 rounded-full p-1 text-[#1F2838]/60 hover:text-[#8E140E]" data-testid="button-bus-search-clear"><X size={15} /></button>}
      </div>

      {searching && <p className={`mx-auto mt-4 max-w-[520px] rounded-xl px-4 py-3 text-center text-[15px] leading-6 ${found ? 'bg-[#8E140E]/10 text-[#8E140E]' : 'bg-[#1F2838]/8 text-[#1F2838]'}`} role="status" aria-live="polite" data-testid="text-bus-search-result">
        {found
          ? <><Check size={16} className="mr-1 inline align-[-2px]" aria-hidden="true" />Good news — our school bus reaches {found === 1 ? 'this area' : 'these areas'}. Board at the {matches.map((route) => route.stop).join(' or ')} route{matches.length > 1 ? 's' : ''}.</>
          : <>We do not have “{query.trim()}” on a route yet. Call us on <a href="tel:+918500045678" className="font-semibold underline">+91 85000 45678</a> and we will see what can be arranged.</>}
      </p>}

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {(searching ? matches : busRoutes.map((route) => ({ stop: route.stop, hits: route.areas }))).map((route) => <div key={route.stop} data-testid={`card-bus-route-${route.stop.toLowerCase().replaceAll(' ', '-')}`}>
          <h4 className="flex items-start gap-1.5 text-[15px] font-semibold leading-5 text-[#8E140E]"><Bus size={15} className="mt-0.5 shrink-0" aria-hidden="true" />Sree Swamy Vivekananda School, {route.stop}</h4>
          <ul className="mt-2 space-y-0.5 text-[14px] leading-5 text-[#1F2838]/80">
            {route.hits.map((area) => <li key={area}>{area}</li>)}
          </ul>
        </div>)}
      </div>
    </div>
  </div>;
}

function Facilities() {
  const [, navigate] = useLocation();
  return <section id="media" className="py-6 md:py-9"><div className="container-wide">
    <Heading title="Our" accent="Facilities" />
    <div className="mx-auto mt-8 grid max-w-[880px] grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
      {facilities.map(({ icon: Icon, image, contain, title, copy }, index) => <article key={title} className="reveal flex flex-col items-center text-center" data-testid={`card-facility-${index + 1}`}>
        <span className={`facility-circle grid h-32 w-32 place-items-center overflow-hidden rounded-full p-1 ${index % 2 === 0 ? 'text-[#8E140E]' : 'text-[#1F2838]'}`}>{image ? <img src={image} alt="" className={`h-full w-full rounded-full ${contain ? 'object-contain p-2' : 'object-cover'}`} /> : Icon ? <Icon size={54} /> : null}</span>
        <h3 className="mt-4 font-sans text-[24px] font-medium text-[#1F2838]">{title}</h3>
        <p className="mt-2 max-w-[320px] text-[16px] leading-6 text-[#1F2838]/75">{copy}</p>
        {/* A real anchor so it can be opened in a new tab or read as a link,
            with the click intercepted for a client-side route. */}
        {index === 0 && <a href="/bus-routes" onClick={(event) => { event.preventDefault(); navigate('/bus-routes'); window.scrollTo({ top: 0 }); }} className="mt-3 text-[15px] font-semibold text-[#8E140E] underline decoration-dotted underline-offset-4 hover:text-[#1F2838]" data-testid="link-bus-routes">Check if our bus comes to your area →</a>}
      </article>)}
    </div>
  </div></section>;
}

const gallery = ['/making-lab.jpg', '/campus-courtyard.jpg', '/athletics-field.jpg', '/campus-courtyard.jpg', '/making-lab.jpg', '/athletics-field.jpg'];
const galleryFrames = [
  { shape: 'g-shape-arch', colour: '#8E140E' },
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
  return <section id="faculty" className="py-6 md:py-9"><div className="container-wide">{heading && <Heading title="Our" accent="Faculty" />}<p className="reveal mx-auto mt-4 max-w-[620px] text-center text-[17px] leading-6 text-[#1F2838]">Experienced teachers who know every child by name, and stay with them from the first lesson to the final board exam.</p><div className="mx-auto mt-8 grid max-w-[900px] gap-6 sm:grid-cols-2 lg:grid-cols-4">{faculty.map((member, index) => <article key={member.role} className="reveal school-card rounded-2xl border border-[#1C2A37]/20 bg-white/85 p-5 text-center shadow-[0_4px_12px_rgba(31,40,56,.12)]" data-testid={`card-faculty-${index + 1}`}><span className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-dashed border-[#1C2A37]/40 text-[#1C2A37]"><GraduationCap size={34} /></span><h3 className="mt-4 font-sans text-[18px] font-semibold text-[#1C2A37]">{member.role}</h3><p className="mt-2 text-[15px] leading-6 text-[#1F2838]/75">{member.copy}</p></article>)}</div></div></section>;
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
    <div className="reveal relative mx-auto w-full max-w-[210px] overflow-hidden rounded-2xl border-[5px] border-white bg-[#1F2838] shadow-[0_10px_26px_rgba(31,40,56,.2)]"><div className="relative aspect-[9/16] overflow-hidden rounded-xl"><StoryVideo /></div></div>
    <div className="grid grid-cols-2 gap-x-5 gap-y-6 md:grid-cols-3">{gallery.map((src, index) => { const frame = galleryFrames[index % galleryFrames.length]; return <button key={`${src}-${index}`} className={`group relative block aspect-[1.5] w-full p-[6px] ${frame.shape}`} style={{ backgroundColor: frame.colour }} onClick={() => window.open(src, '_blank')} data-testid={`button-gallery-${index + 1}`}><span className={`relative block h-full w-full overflow-hidden bg-white ${frame.shape}`}><img src={src} alt={`School life gallery ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute inset-0 bg-[#8E140E]/0 transition-colors group-hover:bg-[#8E140E]/20" /></span></button>; })}</div>
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
  return <section id="blogs" className="py-5 md:py-7"><div className="container-wide"><Heading title="Parent Say" accent="About us" /><div className="relative mx-auto mt-6 max-w-[760px] px-7 text-center sm:px-14" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} aria-roledescription="carousel" aria-live="polite"><Quote className="absolute left-0 top-0 h-7 w-7 text-[#8E140E] sm:h-10 sm:w-10" fill="currentColor" /><Quote className="absolute right-0 top-0 h-7 w-7 rotate-180 text-[#8E140E] sm:h-10 sm:w-10" fill="currentColor" /><div key={active} className="testimonial-fade"><blockquote className="whitespace-pre-line text-[16px] leading-[1.55] text-[#1F2838]" data-testid="text-testimonial">{testimonial.quote}</blockquote><p className="mt-4 text-right text-[18px] font-semibold text-[#8E140E]" data-testid="text-testimonial-name">{testimonial.name}</p></div><div className="absolute -right-2 bottom-4 hidden h-20 w-14 rounded-[50%] bg-gradient-to-br from-[#8E140E] via-white to-[#1F2838] md:block" /></div></div></section>;
}

function Admissions({ onEnquire }: { onEnquire: () => void }) {
  return <section id="career" className="py-4 text-center"><button onClick={onEnquire} className="rounded-full border-2 border-[#8E140E] px-10 py-5 text-base font-semibold text-[#8E140E] hover:bg-[#8E140E] hover:text-white" data-testid="button-admissions-enquiry">START YOUR ADMISSION ENQUIRY <ArrowRight className="ml-2 inline" size={20} /></button></section>;
}

function Footer({ onEnquire }: { onEnquire: () => void }) {
  return <footer id="contact" className="footer-texture relative overflow-hidden text-white"><div id="disclosure" className="container-wide py-8 md:py-10"><div className="grid gap-8 md:grid-cols-[1.25fr_.8fr_1.25fr]"><div><div className="text-center"><a href="#top" className="mx-auto flex w-max flex-col items-center gap-3 text-white" data-testid="link-logo-footer"><img src="/logo.jpeg" alt="Vivekananda Concept School logo" className="h-24 w-24 rounded-full border-4 border-white object-cover shadow" /><span className="block text-center leading-[1.15]"><b className="block text-[18px] tracking-[.06em]">VIVEKANANDA</b><small className="block text-[13px] tracking-[.18em]">CONCEPT SCHOOL</small><small className="block text-[13px] tracking-[.18em]">PULIVENDLA</small></span></a><small className="mt-3 block text-[13px] tracking-[.13em] text-white">LEARN • GROW • SHINE</small><p className="mx-auto mt-4 max-w-[260px] text-center text-[16px] leading-5">Vivekananda Concept School, Pulivendla, under the guidance of a dedicated team of educators.</p></div></div><div><h3 className="font-semibold">Helpful Links</h3><div className="mt-4 grid gap-2 text-[16px]">{navItems.slice(0, 8).map(([label, href]) => <a key={href} href={href} className="hover:text-[#FFFFFF]" data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}</div></div><div><h3 className="font-semibold">Address</h3><a href="tel:+918500045678" className="mt-5 flex items-center gap-2 text-[16px]" data-testid="link-phone-footer"><Phone size={14} /> +91 85000 45678 / 85004 95678</a><a href="https://www.google.com/maps/search/?api=1&query=3-4-55%2C+Guntha+Bazar+Rd%2C+near+Raja+Reddy+Hospital%2C+Pulivendla%2C+516390" target="_blank" rel="noreferrer" className="mt-4 flex gap-2 text-[16px] leading-5 hover:text-[#FFFFFF]" data-testid="link-address-footer"><MapPin size={15} className="mt-0.5 shrink-0" /> 3-4-55, Guntha Bazar Rd, near Raja Reddy Hospital, Pulivendla, 516390</a><a href="mailto:hello@vivekanandaconcept.school" className="mt-3 flex items-center gap-2 text-[16px]" data-testid="link-email-footer"><Mail size={14} /> hello@vivekanandaconcept.school</a><a href="https://www.instagram.com/vcsplvd?igsh=MW00NW1xdWtoY2Q1Mw==" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-[16px] hover:text-[#FFFFFF]" data-testid="link-instagram-footer"><Instagram size={14} /> Instagram</a><button onClick={onEnquire} className="mt-5 rounded border border-white px-4 py-2 text-[14px] font-semibold hover:bg-white hover:text-[#8E140E]" data-testid="button-footer-enquiry">ADMISSION ENQUIRY</button></div></div><div className="mt-7 border-t border-white/30 pt-4 text-[14px]">© 2026 Vivekananda Concept School · Mandatory Disclosure</div></div></footer>;
}

function EnquiryModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false); const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); const next: Record<string, string> = {}; if (!String(data.get('parentName')).trim()) next.parentName = 'Please tell us your name'; if (!String(data.get('email')).match(/^[^@]+@[^@]+\.[^@]+$/)) next.email = 'Enter a valid email address'; /* Spaces, dashes and a +91 are all normal ways to write a number down, so they are stripped before checking rather than rejected. What is left has to be a ten-digit Indian mobile — the admissions team calls back on this, so a landline or a short number is worth catching here. */ const phone = String(data.get('phone') ?? '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, ''); if (!/^[6-9]\d{9}$/.test(phone)) next.phone = 'Enter a 10-digit mobile number'; if (!String(data.get('childGrade'))) next.childGrade = 'Choose a grade'; if (Object.keys(next).length) { setErrors(next); return; } setErrors({}); setSent(true); };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#1F2838]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="relative max-h-[95dvh] w-full max-w-[490px] overflow-auto rounded bg-white p-5 text-[#1F2838] sm:p-7 shadow-2xl"><button onClick={onClose} className="absolute right-4 top-4 rounded p-1 text-[#8E140E]" aria-label="Close enquiry" data-testid="button-close-enquiry"><X size={19} /></button>{sent ? <div className="py-12 text-center"><Check className="mx-auto rounded-full bg-[#8E140E] p-3 text-white" size={58} /><h2 className="mt-6 font-display text-4xl">Thank you.</h2><p className="mt-3 text-sm text-[#1F2838]">Our admissions team will call you within one school day.</p><button onClick={onClose} className="mt-7 rounded-full bg-[#8E140E] px-6 py-3 text-xs font-bold text-white" data-testid="button-success-close">BACK TO SCHOOL</button></div> : <><p className="text-[14px] font-bold tracking-[.18em] text-[#8E140E]">ADMISSION ENQUIRY</p><h2 className="mt-3 font-display text-4xl leading-none">Please enter <i className="text-[#8E140E]">child’s details.</i></h2><p className="mt-3 text-sm text-[#1F2838]">Share a few details and we will arrange a personal campus visit.</p><form onSubmit={submit} className="mt-6 space-y-4" noValidate><label className="block text-xs font-semibold">Parent / guardian name<input name="parentName" className="mt-1.5 w-full rounded border border-[#1F2838] px-3 py-2.5 text-sm outline-none focus:border-[#8E140E]" data-testid="input-parent-name" />{errors.parentName && <span className="text-xs text-red-600">{errors.parentName}</span>}</label><label className="block text-xs font-semibold">Email address<input name="email" type="email" className="mt-1.5 w-full rounded border border-[#1F2838] px-3 py-2.5 text-sm outline-none focus:border-[#8E140E]" data-testid="input-email" />{errors.email && <span className="text-xs text-red-600">{errors.email}</span>}</label><label className="block text-xs font-semibold">Phone number<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" className="mt-1.5 w-full rounded border border-[#1F2838] px-3 py-2.5 text-sm outline-none focus:border-[#8E140E]" data-testid="input-phone" />{errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}</label><label className="block text-xs font-semibold">Child’s grade<select name="childGrade" defaultValue="" className="mt-1.5 w-full rounded border border-[#1F2838] bg-white px-3 py-2.5 text-sm outline-none" data-testid="select-child-grade"><option value="" disabled>Select a grade</option>{programmes.map((item) => <option key={item.name}>{item.name}</option>)}</select>{errors.childGrade && <span className="text-xs text-red-600">{errors.childGrade}</span>}</label><label className="block text-xs font-semibold">A note for our team<textarea name="note" rows={3} className="mt-1.5 w-full resize-none rounded border border-[#1F2838] px-3 py-2.5 text-sm outline-none" data-testid="textarea-note" /></label><button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8E140E] py-3.5 text-xs font-bold text-white" data-testid="button-submit-enquiry">SEND ENQUIRY <Send size={14} /></button></form></>}</div></div>;
}

function AdmissionsPopup({ onClose, onEnquire }: { onClose: () => void; onEnquire: () => void }) {
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-[#1F2838]/70 p-4" role="dialog" aria-modal="true" onClick={onClose}>
    <div className="relative w-full max-w-[500px]" onClick={(event) => event.stopPropagation()}>
      <button onClick={onClose} className="absolute -right-2 -top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-[#8E140E] shadow-lg" aria-label="Close admissions popup" data-testid="button-close-admissions-popup"><X size={18} /></button>
      <img src="/admissions.png" alt="Admissions open at Vivekananda Concept School" className="w-full rounded-lg border-4 border-white shadow-2xl" data-testid="img-admissions-popup" />
      <button onClick={() => { onClose(); onEnquire(); }} className="mt-3 w-full rounded-full bg-[#8E140E] py-3 text-xs font-bold text-white" data-testid="button-admissions-popup-enquiry">START YOUR ADMISSION ENQUIRY</button>
    </div>
  </div>;
}

function CallFab({ onEnquire }: { onEnquire: () => void }) {
  /* Scaled back below sm. At the full size this stack is 170px wide and about
     155px tall — on a 360px handset that is half the width of the screen
     parked over the content, and it sat on top of the footer links. The inset
     also clears the iOS home indicator via the safe-area inset. */
  return <div className="fixed bottom-3 right-3 z-40 flex flex-col items-center gap-1 sm:bottom-7 sm:right-7" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
    <button onClick={onEnquire} className="call-cloud relative block h-[56px] w-[124px] sm:h-[76px] sm:w-[170px]" aria-label="Start your admission enquiry" data-testid="button-call-cloud">
      <svg viewBox="0 0 200 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full drop-shadow-[0_4px_10px_rgba(31,40,56,.25)]" aria-hidden="true">
        <path d="M24 72 A20 20 0 0 1 30 33 A26 26 0 0 1 78 20 A24 24 0 0 1 124 24 A24 24 0 0 1 168 36 A19 19 0 0 1 176 72 L118 72 L106 93 L96 72 Z" fill="#FFFFFF" stroke="#1C2A37" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative flex h-full w-full flex-col items-center justify-center pb-2 text-[9px] font-bold leading-[1.2] tracking-[.09em] text-[#1C2A37] sm:pb-3 sm:text-[12px]"><span>ADMISSION</span><span>ENQUIRY</span></span>
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