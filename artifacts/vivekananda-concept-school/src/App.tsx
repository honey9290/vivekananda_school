import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Award, BookOpen, Check, ChevronDown, ChevronRight, Clock3, FlaskConical, HeartHandshake, Instagram, Landmark, Mail, MapPin, Menu, Music2, Play, Quote, Send, Sparkles, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function useReveals() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3" data-testid="link-logo">
      <span className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] ${light ? 'border-[#ffd567]' : 'border-[#ef614e]'} font-display text-[25px] leading-none ${light ? 'text-[#ffd567]' : 'text-[#ef614e]'}`}>
        V<span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 ${light ? 'border-[#ef614e] bg-[#ffd567]' : 'border-[#fffaf4] bg-[#ffd567]'}`} />
      </span>
      <span className={`leading-[.9] ${light ? 'text-white' : 'text-[#70372d]'}`}>
        <b className="block text-[15px] tracking-[.13em]">VIVEKANANDA</b>
        <small className={`text-[9px] tracking-[.2em] ${light ? 'text-[#ffd567]' : 'text-[#ef614e]'}`}>CONCEPT SCHOOL</small>
      </span>
    </a>
  );
}

type NavItem = { label: string; href: string; dropdown?: boolean };
const navItems: NavItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Programmes', href: '#programmes', dropdown: true },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Media Coverage', href: '#media' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Career', href: '#career' },
  { label: 'Contact Us', href: '#contact' },
  { label: 'Mandatory Disclosure', href: '#disclosure' },
];

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <header className="relative z-30 bg-white text-[#70372d]">
      <div className="container-wide">
        <div className="flex min-h-[78px] items-center justify-between gap-5">
          <Logo />
          <div className="hidden items-center gap-6 md:flex">
            <a href="tel:+918500045678" className="flex items-center gap-2 text-[12px] font-semibold text-[#8a5144] transition-colors hover:text-[#ef614e]" data-testid="link-header-phone"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#fff0ec] text-[#ef614e]"><Clock3 size={13} /></span>+91 85000 45678</a>
            <button onClick={onEnquire} className="rounded-sm border-2 border-[#ef614e] px-5 py-2.5 text-[11px] font-bold tracking-[.08em] text-[#ef614e] transition-colors hover:bg-[#ef614e] hover:text-white" data-testid="button-header-enquiry">ADMISSION ENQUIRY</button>
          </div>
          <button onClick={() => setOpen((value) => !value)} className="rounded-sm border border-[#ef614e]/40 p-2 text-[#ef614e] md:hidden" aria-label="Toggle menu" data-testid="button-mobile-menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        <div className="hidden border-t border-[#eadbd4] md:block">
          <nav className="flex min-h-[58px] items-center justify-between gap-3" aria-label="Primary navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); go(item.href); }} className="nav-link flex items-center gap-1 whitespace-nowrap py-2 text-[11px] font-bold text-[#75473d] transition-colors hover:text-[#ef614e]" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}{item.dropdown && <ChevronDown size={13} />}</a>)}
          </nav>
        </div>
      </div>
      {open && <div className="border-t border-[#eadbd4] bg-[#fff8f4] px-5 py-4 md:hidden">
        <nav className="space-y-1" aria-label="Mobile navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); go(item.href); }} className="flex items-center justify-between border-b border-[#eadbd4] py-3 text-sm font-bold text-[#75473d]" data-testid={`link-mobile-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}{item.dropdown && <ChevronDown size={15} />}</a>)}
        </nav>
        <a href="tel:+918500045678" className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#ef614e]" data-testid="link-mobile-phone"><Clock3 size={15} /> +91 85000 45678</a>
        <button onClick={onEnquire} className="mt-4 w-full rounded-sm bg-[#ef614e] py-3 text-[11px] font-bold tracking-[.1em] text-white" data-testid="button-mobile-enquiry">ADMISSION ENQUIRY</button>
      </div>}
    </header>
  );
}

function HeroIllustration({ variant = 0 }: { variant?: number }) {
  return (
    <div className={`relative min-h-[360px] overflow-hidden ${variant ? 'bg-[#f68a57]' : 'bg-[#f47655]'}`}>
      <div className="absolute -left-14 -top-20 h-64 w-64 rounded-full border-[32px] border-[#f99aa1]/80" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#e85748]" />
      <div className="absolute bottom-0 left-[9%] h-48 w-[72%] rounded-t-[110px] border-[12px] border-[#ffd567] bg-[#fa9d58]">
        <div className="absolute left-[12%] top-8 h-24 w-20 rounded-t-full bg-[#fff1d0]" />
        <div className="absolute right-[12%] top-8 h-24 w-20 rounded-t-full bg-[#fff1d0]" />
        <div className="absolute left-[38%] top-4 h-32 w-28 rounded-t-full bg-[#ff7354]" />
        <div className="absolute left-[19%] top-20 h-12 w-11 rounded-full border-4 border-[#70372d] bg-[#ffd567]" />
        <div className="absolute right-[22%] top-16 h-14 w-12 rounded-full border-4 border-[#70372d] bg-[#f99aa1]" />
        <div className="absolute left-[43%] top-12 h-14 w-12 rounded-full border-4 border-[#70372d] bg-[#fff1d0]" />
        <div className="absolute bottom-7 left-[11%] h-10 w-12 rounded-t-xl bg-[#ef614e]" />
        <div className="absolute bottom-7 right-[12%] h-10 w-12 rounded-t-xl bg-[#ef614e]" />
        <div className="absolute bottom-7 left-[43%] h-16 w-14 rounded-t-2xl bg-[#70372d]" />
      </div>
      <div className="absolute bottom-4 left-7 h-24 w-12 rotate-[-13deg] rounded-[50%_50%_15%_15%] bg-[#ffd567] shadow-[inset_-7px_0_0_#ed734e]" />
      <div className="absolute bottom-5 right-8 h-28 w-14 rotate-[12deg] rounded-[50%_50%_15%_15%] bg-[#f99aa1] shadow-[inset_7px_0_0_#ef614e]" />
      <span className="absolute right-7 top-7 rounded-full bg-[#ffd567] px-4 py-2 font-mono-ui text-[9px] font-bold tracking-[.15em] text-[#70372d]">LEARN • PLAY • GROW</span>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display text-2xl italic text-white/90">Every child can shine</span>
    </div>
  );
}

function Hero({ onEnquire }: { onEnquire: () => void }) {
  const slides = [
    { kicker: 'Admissions now open', title: 'A joyful beginning to a bright future.', copy: 'Discover a warm, confident learning community where every child is encouraged to ask, explore, and become.', button: 'EXPLORE ADMISSIONS' },
    { kicker: 'Welcome to our campus', title: 'Where learning feels like an adventure.', copy: 'From the first school day to the biggest idea, we make room for curiosity, friendship, and brave new steps.', button: 'PLAN A CAMPUS VISIT' },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((slide) => (slide + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);
  const slide = slides[active];
  return (
    <section id="top" className="relative overflow-hidden bg-[#f47655]">
      <div className="grid min-h-[525px] lg:grid-cols-[1.04fr_.96fr]">
        <div className="order-2 lg:order-1"><HeroIllustration variant={active} /></div>
        <div className="relative order-1 flex items-center bg-[#f47655] px-7 py-16 sm:px-12 lg:order-2 lg:px-16">
          <div className="absolute right-6 top-5 hidden h-20 w-28 hero-dots opacity-70 lg:block" />
          <div className="absolute bottom-0 left-0 h-14 w-14 border-l-[14px] border-t-[14px] border-[#f99aa1]" />
          <div className="relative z-10 max-w-[500px] text-white">
            <p className="reveal font-mono-ui text-[10px] font-bold tracking-[.2em] text-[#fff0ad]">{slide.kicker.toUpperCase()} · 2026 - 2027</p>
            <h1 key={slide.title} className="reveal mt-4 font-display text-[clamp(3rem,5.5vw,5.2rem)] leading-[.96] tracking-[-.025em]">{slide.title}</h1>
            <p className="reveal delay-1 mt-5 max-w-[420px] text-[15px] leading-7 text-white/85">{slide.copy}</p>
            <button onClick={onEnquire} className="reveal delay-2 mt-7 inline-flex items-center gap-3 rounded-sm bg-[#ffd567] px-5 py-3.5 text-[11px] font-bold tracking-[.1em] text-[#70372d] transition-transform hover:-translate-y-1" data-testid="button-hero-enquiry">{slide.button}<ArrowRight size={15} /></button>
          </div>
          <div className="paper-lines site-shadow absolute bottom-[-46px] right-[8%] hidden w-[230px] rotate-[3deg] bg-[#fffdf6] p-5 text-[#70372d] md:block lg:right-[11%]">
            <div className="mb-3 h-2 w-12 bg-[#ffd567]" /><p className="font-mono-ui text-[9px] font-bold tracking-[.12em] text-[#ef614e]">VIVEKANANDA CONCEPT SCHOOL</p><p className="mt-3 font-display text-3xl leading-[.95]">Admissions<br /><i>Open</i></p><p className="mt-4 border-t border-[#eadbd4] pt-3 font-mono-ui text-[9px] tracking-[.1em]">ACADEMIC YEAR<br /><b className="text-[14px]">2026 - 2027</b></p>
          </div>
        </div>
      </div>
      <div className="relative h-16 bg-[#fff8f4]">
        <div className="absolute left-0 top-0 h-16 w-28 bg-[#f99aa1]" style={{ clipPath: 'polygon(0 0, 100% 0, 74% 50%, 100% 100%, 0 100%, 29% 50%)' }} />
        <div className="absolute right-6 top-0 h-16 w-36 hero-dots" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2">
          {slides.map((item, index) => <button key={item.title} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${index === active ? 'w-8 bg-[#ef614e]' : 'w-2 bg-[#ef614e]/30'}`} aria-label={`Show hero slide ${index + 1}`} data-testid={`button-hero-slide-${index + 1}`} />)}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, accent }: { eyebrow: string; title: string; accent?: string }) {
  return <div className="reveal"><p className="font-mono-ui text-[10px] font-bold tracking-[.17em] text-[#ef614e]">{eyebrow}</p><h2 className="mt-3 font-display text-[clamp(2.3rem,4vw,4rem)] leading-[.98] text-[#70372d]">{title} {accent && <i className="text-[#ef614e]">{accent}</i>}</h2><div className="dot-divider mt-5 h-2 w-24" /></div>;
}

function Intro() {
  return <section id="about" className="bg-[#fffdf8] py-20 md:py-28"><div className="container-wide grid gap-12 md:grid-cols-[.92fr_1.08fr] md:items-center"><div><SectionHeading eyebrow="WELCOME TO OUR SCHOOL" title="Welcome to Vivekananda" accent="Concept School" /><p className="reveal delay-1 mt-7 max-w-[520px] text-[15px] leading-7 text-[#805b51]">Vivekananda Concept School is a nurturing home for curious young minds in Kurnool. We bring together strong academic foundations, a rich activity programme, and the everyday values that help children grow into thoughtful, capable people.</p><p className="reveal delay-2 mt-4 max-w-[520px] text-[15px] leading-7 text-[#805b51]">Our classrooms are energetic, our teachers are attentive, and every child is known by name. Here, learning is serious work — and it is full of wonder too.</p><a href="#programmes" className="reveal delay-3 mt-7 inline-flex items-center gap-2 border-b-2 border-[#ef614e] pb-2 text-[11px] font-bold tracking-[.1em] text-[#ef614e]" data-testid="link-intro-programmes">DISCOVER OUR PROGRAMMES <ChevronRight size={15} /></a></div><div id="gallery" className="reveal relative min-h-[335px] overflow-hidden rounded-sm bg-[#f99aa1] p-5"><div className="absolute right-5 top-5 h-20 w-28 hero-dots opacity-70" /><div className="relative flex h-full min-h-[295px] flex-col justify-end overflow-hidden bg-[#f8b45c] p-7"><div className="absolute left-12 top-8 h-28 w-28 rounded-full border-[14px] border-[#fff3d6]/70" /><div className="absolute right-9 top-10 h-28 w-40 rounded-t-[90px] bg-[#ef614e]" /><div className="absolute bottom-0 left-[18%] h-44 w-28 rounded-t-[70px] bg-[#fff3d6]" /><div className="absolute bottom-0 right-[20%] h-36 w-24 rounded-t-[60px] bg-[#ffd567]" /><div className="absolute bottom-0 left-[45%] h-52 w-28 rounded-t-[75px] bg-[#f47655]" /><div className="absolute bottom-10 left-7 h-11 w-11 rounded-full border-4 border-[#70372d] bg-[#ffd567]" /><div className="absolute bottom-16 right-24 h-11 w-11 rounded-full border-4 border-[#70372d] bg-[#f99aa1]" /><div className="relative z-10 flex items-center justify-between border-t border-white/50 pt-4 text-white"><span className="flex items-center gap-2 font-mono-ui text-[9px] font-bold tracking-[.15em]"><span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#ef614e]"><Play size={13} fill="currentColor" /></span> OUR SCHOOL STORY</span><span className="font-display text-2xl italic">See us in action</span></div></div></div></div></section>;
}

const programmes = [
  { name: 'Pre-School', tag: 'AGES 3 – 5', color: '#ffd567', icon: Sparkles, copy: 'A gentle, joyful start where play opens the door to language, numbers, friendship, and discovery.' },
  { name: 'Primary School', tag: 'GRADES 1 – 5', color: '#f99aa1', icon: BookOpen, copy: 'Confident foundations in every subject, with space to make, read, question, and try something new.' },
  { name: 'Middle-School', tag: 'GRADES 6 – 8', color: '#9ed8cf', icon: FlaskConical, copy: 'Big questions, capable mentors, and the skills to turn growing curiosity into independent thinking.' },
  { name: 'High-School', tag: 'GRADES 9 – 10', color: '#f8b45c', icon: Award, copy: 'Focused preparation for the future, balanced with leadership, creativity, and a strong sense of self.' },
];

function Programmes() {
  const [selected, setSelected] = useState<string | null>(null);
  return <section id="programmes" className="bg-[#fff8f4] py-20 md:py-28"><div className="container-wide"><SectionHeading eyebrow="LEARNING JOURNEY" title="Educational" accent="Programmes" /><div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{programmes.map(({ name, tag, color, icon: Icon, copy }, index) => <button key={name} onClick={() => setSelected(selected === name ? null : name)} className="school-card group relative overflow-hidden border border-[#ecdcd5] bg-white p-6 text-left" data-testid={`card-programme-${index + 1}`}><span className="absolute right-0 top-0 h-20 w-20" style={{ backgroundColor: color, clipPath: 'polygon(35% 0, 100% 0, 100% 65%)' }} /><span className="relative grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: color }}><Icon size={22} className="text-[#70372d]" /></span><p className="mt-8 font-mono-ui text-[9px] font-bold tracking-[.16em] text-[#ef614e]">{tag}</p><h3 className="mt-2 font-display text-[26px] leading-none text-[#70372d]">{name}</h3><p className="mt-4 text-[13px] leading-6 text-[#805b51]">{copy}</p><span className="mt-6 flex items-center gap-2 text-[10px] font-bold tracking-[.1em] text-[#ef614e]">{selected === name ? 'SELECTED' : 'LEARN MORE'} <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" /></span></button>)}</div>{selected && <div className="mt-6 flex items-center gap-3 border-l-4 border-[#ffd567] bg-[#fff3d6] px-5 py-4 text-sm text-[#70372d]" data-testid="status-selected-programme"><Check size={17} className="text-[#ef614e]" /><span><b>{selected}</b> is a wonderful place to begin. Enquire today and our academic team will share the details for your child.</span></div>}</div></section>;
}

const facilities = [
  { title: 'Smart Classrooms', copy: 'Bright, flexible rooms designed for conversation, making, and focused study.', icon: Landmark, tone: '#ef614e' },
  { title: 'Science & Discovery Lab', copy: 'A safe place to test an idea, observe closely, and learn from the result.', icon: FlaskConical, tone: '#54a99c' },
  { title: 'Arts & Music Studio', copy: 'Music, movement, colour, and performance woven into campus life.', icon: Music2, tone: '#e29a30' },
  { title: 'Play & Sports Grounds', copy: 'Open-air spaces for team spirit, healthy energy, and happy afternoons.', icon: HeartHandshake, tone: '#df7892' },
];

function Facilities() {
  return <section id="media" className="bg-[#f8b45c] py-20 md:py-28"><div className="container-wide"><div className="flex flex-wrap items-end justify-between gap-7"><SectionHeading eyebrow="MORE THAN A CLASSROOM" title="Our" accent="Facilities" /><p className="reveal max-w-[340px] text-[15px] leading-7 text-[#70372d]/75">A school day should have room for movement, imagination, teamwork, and quiet concentration. Our campus makes room for all of it.</p></div><div className="mt-11 grid gap-4 md:grid-cols-2">{facilities.map(({ title, copy, icon: Icon, tone }, index) => <button key={title} className="school-card group flex min-h-[170px] items-start gap-5 bg-white p-6 text-left" data-testid={`card-facility-${index + 1}`}><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: tone }}><Icon size={24} /></span><span><span className="block font-display text-[25px] leading-none text-[#70372d]">{title}</span><span className="mt-3 block text-[13px] leading-6 text-[#805b51]">{copy}</span><span className="mt-4 flex items-center gap-2 text-[10px] font-bold tracking-[.1em] text-[#ef614e]">TAKE A CLOSER LOOK <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span></span></button>)}</div></div></section>;
}

function Testimonials() {
  const testimonials = [
    { quote: 'The teachers notice the little things. Our daughter comes home eager to tell us what she discovered that day.', name: 'Ananya Reddy', role: 'Parent of Grade 3 learner' },
    { quote: 'There is a lovely balance here — children are encouraged to work hard, but they are never made to feel afraid of a mistake.', name: 'Rohit Menon', role: 'Parent of Grade 7 learner' },
    { quote: 'I love science because our class gets to ask questions first and find the answers together.', name: 'Vihaan S.', role: 'Student, Grade 6' },
  ];
  const [active, setActive] = useState(0);
  return <section id="blogs" className="bg-[#fffdf8] py-20 md:py-28"><div className="container-wide grid gap-12 md:grid-cols-[.7fr_1.3fr] md:items-center"><SectionHeading eyebrow="VOICES FROM OUR COMMUNITY" title="What our" accent="families say" /><div className="relative bg-[#ef614e] p-7 text-white sm:p-10"><Quote size={30} className="text-[#ffd567]" /><blockquote className="mt-6 min-h-[132px] font-display text-[clamp(1.65rem,3vw,2.8rem)] leading-[1.08]" data-testid="text-testimonial">“{testimonials[active].quote}”</blockquote><div className="mt-7 flex items-end justify-between border-t border-white/30 pt-4"><div><p className="text-sm font-bold">{testimonials[active].name}</p><p className="mt-1 text-[11px] text-white/70">{testimonials[active].role}</p></div><div className="flex gap-2"><button onClick={() => setActive((active - 1 + testimonials.length) % testimonials.length)} className="grid h-9 w-9 place-items-center border border-white/45 transition-colors hover:bg-white hover:text-[#ef614e]" aria-label="Previous testimonial" data-testid="button-testimonial-previous"><ArrowLeft size={15} /></button><button onClick={() => setActive((active + 1) % testimonials.length)} className="grid h-9 w-9 place-items-center border border-white/45 transition-colors hover:bg-white hover:text-[#ef614e]" aria-label="Next testimonial" data-testid="button-testimonial-next"><ArrowRight size={15} /></button></div></div></div></div></section>;
}

function Admissions({ onEnquire }: { onEnquire: () => void }) {
  return <section id="career" className="relative overflow-hidden bg-[#70372d] py-20 text-white md:py-24"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[30px] border-[#f99aa1]/40" /><div className="container-wide relative flex flex-wrap items-center justify-between gap-9"><div><p className="font-mono-ui text-[10px] font-bold tracking-[.18em] text-[#ffd567]">TAKE THE NEXT STEP</p><h2 className="mt-4 max-w-[700px] font-display text-[clamp(2.5rem,5vw,4.7rem)] leading-[.95]">Come see what makes<br /><i className="text-[#ffd567]">our school special.</i></h2><p className="mt-5 max-w-[520px] text-[15px] leading-7 text-white/72">Meet our team, walk through a classroom, and ask every question. We would love to welcome your family to campus.</p></div><button onClick={onEnquire} className="inline-flex items-center gap-3 rounded-sm bg-[#ffd567] px-6 py-4 text-[11px] font-bold tracking-[.1em] text-[#70372d] transition-transform hover:-translate-y-1" data-testid="button-admissions-enquiry">REQUEST A CAMPUS VISIT <ArrowRight size={16} /></button></div></section>;
}

function EnquiryModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get('parentName')).trim()) next.parentName = 'Please tell us your name';
    if (!String(data.get('email')).match(/^[^@]+@[^@]+\.[^@]+$/)) next.email = 'Enter a valid email address';
    if (!String(data.get('childGrade'))) next.childGrade = 'Choose a grade';
    if (Object.keys(next).length) { setErrors(next); return; }
    setErrors({});
    setSent(true);
  };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#70372d]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><div className="relative max-h-[95dvh] w-full max-w-[520px] overflow-auto rounded-sm bg-[#fffdf8] p-7 text-[#70372d] shadow-2xl md:p-10"><button onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 transition-colors hover:bg-[#f99aa1]/30" aria-label="Close enquiry" data-testid="button-close-enquiry"><X size={19} /></button>{sent ? <div className="py-12 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#ffd567]"><Check size={30} /></span><h2 className="mt-7 font-display text-4xl" id="enquiry-title">Thank you.</h2><p className="mx-auto mt-3 max-w-[330px] text-sm leading-6 text-[#805b51]">Your enquiry has reached our admissions team. We will call you within one school day.</p><button onClick={onClose} className="mt-8 rounded-sm bg-[#ef614e] px-6 py-3 text-[11px] font-bold tracking-wider text-white" data-testid="button-success-close">BACK TO SCHOOL</button></div> : <><p className="font-mono-ui text-[10px] tracking-[.18em] text-[#ef614e]">ADMISSION ENQUIRY</p><h2 id="enquiry-title" className="mt-3 font-display text-4xl leading-none">Let’s start a<br /><i className="text-[#ef614e]">conversation.</i></h2><p className="mt-4 text-sm leading-6 text-[#805b51]">Share a few details and we will arrange a personal campus visit.</p><form className="mt-7 space-y-4" onSubmit={submit} noValidate><label className="block text-xs font-bold">Parent / guardian name<input name="parentName" className="mt-2 w-full rounded-sm border border-[#eadbd4] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#ef614e]" placeholder="Your name" data-testid="input-parent-name" />{errors.parentName && <span className="mt-1 block text-xs text-[#b84d37]">{errors.parentName}</span>}</label><label className="block text-xs font-bold">Email address<input name="email" type="email" className="mt-2 w-full rounded-sm border border-[#eadbd4] bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#ef614e]" placeholder="you@example.com" data-testid="input-email" />{errors.email && <span className="mt-1 block text-xs text-[#b84d37]">{errors.email}</span>}</label><label className="block text-xs font-bold">Child’s grade<select name="childGrade" defaultValue="" className="mt-2 w-full rounded-sm border border-[#eadbd4] bg-white px-4 py-3 text-sm outline-none focus:border-[#ef614e]" data-testid="select-child-grade"><option value="" disabled>Select a grade</option>{['Pre-School','Primary School','Middle-School','High-School'].map((grade) => <option key={grade}>{grade}</option>)}</select>{errors.childGrade && <span className="mt-1 block text-xs text-[#b84d37]">{errors.childGrade}</span>}</label><label className="block text-xs font-bold">A note for our team<textarea name="note" rows={3} className="mt-2 w-full resize-none rounded-sm border border-[#eadbd4] bg-white px-4 py-3 text-sm outline-none focus:border-[#ef614e]" placeholder="What would you like to know?" data-testid="textarea-note" /></label><button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-[#ef614e] py-4 text-[11px] font-bold tracking-[.12em] text-white transition-colors hover:bg-[#d94d3b]" data-testid="button-submit-enquiry">SEND ENQUIRY <Send size={15} /></button><p className="text-center text-[10px] text-[#805b51]/60">Your details stay with our admissions team.</p></form></>}</div></div>;
}

function Footer({ onEnquire }: { onEnquire: () => void }) {
  return <footer id="contact" className="bg-[#fff8f4] text-[#70372d]"><div id="disclosure" className="container-wide py-14"><div className="grid gap-10 border-b border-[#eadbd4] pb-12 md:grid-cols-[1.3fr_.75fr_.9fr]"><div><Logo /><p className="mt-6 max-w-[330px] text-sm leading-6 text-[#805b51]">A happy, purposeful school in Kurnool where children build strong foundations and learn to lead with kindness.</p><div className="mt-5 flex gap-3"><a href="#gallery" className="grid h-9 w-9 place-items-center rounded-full bg-[#f99aa1]/45 text-[#70372d] transition-colors hover:bg-[#ef614e] hover:text-white" aria-label="School gallery" data-testid="link-gallery-footer"><Instagram size={16} /></a><a href="mailto:hello@vivekanandaconcept.school" className="grid h-9 w-9 place-items-center rounded-full bg-[#ffd567] text-[#70372d] transition-colors hover:bg-[#ef614e] hover:text-white" aria-label="Email school" data-testid="link-email-footer"><Mail size={16} /></a></div></div><div><p className="font-mono-ui text-[10px] font-bold tracking-[.16em] text-[#ef614e]">VISIT US</p><p className="mt-4 flex gap-2 text-sm leading-6 text-[#805b51]"><MapPin size={17} className="mt-1 shrink-0 text-[#ef614e]" /> Vivekananda Concept School<br />Kurnool, Andhra Pradesh<br />India 518001</p></div><div><p className="font-mono-ui text-[10px] font-bold tracking-[.16em] text-[#ef614e]">SAY HELLO</p><a href="tel:+918500045678" className="mt-4 flex items-center gap-2 text-sm text-[#805b51] hover:text-[#ef614e]" data-testid="link-phone-footer"><Clock3 size={15} /> +91 85000 45678</a><a href="mailto:hello@vivekanandaconcept.school" className="mt-2 flex items-center gap-2 break-all text-sm text-[#805b51] hover:text-[#ef614e]" data-testid="link-email"><Mail size={15} /> hello@vivekanandaconcept.school</a><button onClick={onEnquire} className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold tracking-wider text-[#ef614e]" data-testid="button-footer-enquiry">ADMISSION ENQUIRY <ArrowRight size={14} /></button></div></div><div className="flex flex-wrap items-center justify-between gap-4 pt-6 text-[10px] text-[#805b51]/70"><p>© 2026 Vivekananda Concept School</p><p>Mandatory Disclosure · Privacy</p><a href="#top" className="flex items-center gap-2 hover:text-[#ef614e]" data-testid="link-back-top">BACK TO TOP <ArrowRight size={13} /></a></div></div></footer>;
}

function Home() {
  const [modal, setModal] = useState(false);
  useReveals();
  useEffect(() => {
    document.title = 'Vivekananda Concept School | Admissions Open 2026 - 2027';
    const description = 'Vivekananda Concept School in Kurnool is a joyful, purposeful learning community for children from Pre-School through High-School.';
    const setMeta = (selector: string, attribute: string, value: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, selector.includes('property=') ? selector.split('"')[1] : selector.split('"')[1]); document.head.appendChild(tag); }
      tag.content = value;
    };
    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', document.title);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:type"]', 'property', 'website');
  }, []);
  return <div className="grain min-h-[100dvh] bg-[#fffdf8]"><Header onEnquire={() => setModal(true)} /><Hero onEnquire={() => setModal(true)} /><Intro /><Programmes /><Facilities /><Testimonials /><Admissions onEnquire={() => setModal(true)} /><Footer onEnquire={() => setModal(true)} />{modal && <EnquiryModal onClose={() => setModal(false)} />}</div>;
}

function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;