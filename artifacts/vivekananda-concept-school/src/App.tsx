import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, BookOpen, Bus, Check, ChevronRight, GraduationCap, Instagram, Mail, MapPin, Menu, Phone, Quote, Send, Trophy, X } from 'lucide-react';
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
  { file: 'icon-10.png', leftPct: 3.233, topPct: 32.858, widthPct: 3.456 },
  { file: 'icon-11.png', leftPct: 87.737, topPct: 34.17, widthPct: 11.371 },
  { file: 'icon-12.png', leftPct: 3.456, topPct: 40.103, widthPct: 3.79 },
  { file: 'icon-13.png', leftPct: 93.2, topPct: 48.431, widthPct: 3.122 },
  { file: 'icon-14.png', leftPct: 3.233, topPct: 50.086, widthPct: 6.577 },
  { file: 'icon-15.png', leftPct: 89.967, topPct: 51.169, widthPct: 8.25 },
  { file: 'icon-16.png', leftPct: 4.236, topPct: 57.616, widthPct: 2.787 },
  { file: 'icon-17.png', leftPct: 93.088, topPct: 58.985, widthPct: 3.233 },
  { file: 'icon-18.png', leftPct: 89.855, topPct: 63.149, widthPct: 9.142 },
  { file: 'icon-19.png', leftPct: 3.01, topPct: 63.206, widthPct: 6.243 },
  { file: 'icon-20.png', leftPct: 3.233, topPct: 73.36, widthPct: 7.692 },
  { file: 'icon-21.png', leftPct: 3.902, topPct: 84.598, widthPct: 3.456 },
  { file: 'icon-22.png', leftPct: 91.527, topPct: 86.537, widthPct: 3.233 },
  { file: 'icon-23.png', leftPct: 87.402, topPct: 90.873, widthPct: 7.135 },
  { file: 'icon-24.png', leftPct: 5.24, topPct: 90.987, widthPct: 8.361 },
] as const;

const FLOAT_VARIANTS = ['wallpaper-icon-float-a', 'wallpaper-icon-float-b', 'wallpaper-icon-float-c'];

function WallpaperTile() {
  return <div className="relative mx-auto w-[90%]" style={{ aspectRatio: `${WALLPAPER_TILE.width} / ${WALLPAPER_TILE.height}` }}>
    {WALLPAPER_ICONS.map((icon, index) => <div key={icon.file} className="wallpaper-icon-depth pointer-events-auto absolute z-20" style={{ left: `${icon.leftPct}%`, top: `${icon.topPct}%`, width: `${icon.widthPct}%` }}>
      <img src={`/wallpaper-icons/${icon.file}`} alt="" aria-hidden="true" className={`block w-full ${FLOAT_VARIANTS[index % FLOAT_VARIANTS.length]}`} style={{ animationDelay: `${((index * 0.83) % 6).toFixed(2)}s`, animationDuration: `${(5 + (index % 6) * 1.1).toFixed(2)}s` }} />
    </div>)}
  </div>;
}

function WallpaperLayer() {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="flex flex-col">
      {Array.from({ length: 16 }, (_, index) => <WallpaperTile key={index} />)}
    </div>
  </div>;
}


const queryClient = new QueryClient();
const navItems = [
  ['Home', '#top'], ['About Us', '#about'], ['Results', '#results'], ['Gallery', '#gallery'],
  ['Blogs', '#blogs'], ['Contact Us', '#contact'],
] as const;

function useReveals() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function Logo({ footer = false }: { footer?: boolean }) {
  return <a href="#top" className={`flex items-center gap-3 ${footer ? 'text-white' : 'text-[#8E140E]'}`} data-testid="link-logo">
    <img src="/logo.jpeg" alt="Vivekananda Concept School logo" className="h-16 w-16 shrink-0 rounded-full object-cover" />
    <span className="leading-[.9]"><b className="block text-[22px] tracking-[.06em]">VIVEKANANDA</b><small className={`text-[15px] tracking-[.18em] ${footer ? 'text-[#FFFFFF]' : 'text-[#8E140E]'}`}>CONCEPT SCHOOL</small></span>
  </a>;
}

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const go = (href: string) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); };
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
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} className="nav-link whitespace-nowrap py-2 text-[14px] font-medium text-[#1F2838] hover:text-[#8E140E]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}
        </nav>
      </div>
    </div>
    {open && <div className="border-t border-[#1F2838] bg-[#FFFFFF] px-5 py-3 md:hidden"><nav>{navItems.map(([label, href]) => <a key={href} href={href} onClick={(e) => { e.preventDefault(); go(href); }} className="flex items-center justify-between border-b border-[#1F2838] py-3 text-sm font-semibold text-[#1F2838]" data-testid={`link-mobile-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}<ChevronRight size={15} /></a>)}</nav><a href="tel:+918500045678" className="mt-4 flex items-center gap-2 text-sm text-[#8E140E]" data-testid="link-mobile-phone"><Phone size={14} /> +91 85000 45678</a><button onClick={onEnquire} className="mt-3 w-full rounded-full bg-[#8E140E] py-3 text-xs font-bold text-white" data-testid="button-mobile-enquiry">ADMISSION ENQUIRY</button></div>}
  </header>;
}

function Hero() {
  return <section id="top" className="bg-white">
    <div className="grid min-h-[365px] md:h-[550px] md:grid-cols-3">
      <div className="relative min-h-[275px] overflow-hidden bg-[#1F2838] md:h-full">
        <img src="/campus-courtyard.jpg" alt="Vivekananda Concept School campus" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1F2838]/30 to-transparent" />
        <div className="absolute bottom-4 left-5 rounded bg-white/90 px-3 py-2 text-[13px] font-bold tracking-[.14em] text-[#8E140E]">A CAMPUS BUILT FOR CHILDREN</div>
      </div>
      <div className="hero-pattern relative flex items-center overflow-hidden px-8 py-12 sm:px-8">
        <div className="absolute -left-16 top-[-38px] h-[310px] w-[90px] rotate-[27deg] bg-[#8E140E]" />
        <div className="absolute -right-12 bottom-[-60px] h-[330px] w-[60px] rotate-[26deg] bg-[#8E140E]" />
        <div className="relative z-10 max-w-[480px] text-white">
          <p className="text-[14px] font-bold tracking-[.25em] text-[#FFFFFF]">WELCOME TO OUR SCHOOL</p>
          <h1 className="mt-4 font-sans text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.08]">Vivekananda Concept School</h1>
          <p className="mt-3 font-display text-[clamp(1.4rem,2.2vw,1.9rem)] italic text-[#FFFFFF]">KURNOOL</p>
          <p className="mt-3 max-w-[315px] text-[17px] leading-6 text-white/85">A place where every child learns, grows and shines.</p>
        </div>
      </div>
      <div className="relative min-h-[275px] overflow-hidden bg-[#1F2838] md:h-full">
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
  return <section id="about" className="relative overflow-hidden py-14 md:py-20"><div className="absolute left-0 top-0 h-16 w-16 border-l-[3px] border-t-[3px] border-[#8E140E] opacity-70" /><div className="container-wide grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
    <div className="reveal"><h2 className="section-heading text-[clamp(1.9rem,3.3vw,2.5rem)]">Welcome to Vivekananda <em>Concept School</em></h2><div className="ornament mt-2"><span className="ornament-mark">◆</span></div><p className="mt-6 max-w-[470px] text-[17px] leading-6 text-[#1F2838]">Welcome to Vivekananda Concept School! Igniting minds, shaping futures. Join us for academic excellence, character building, and holistic development.</p></div>
    <div className="reveal relative mx-auto w-full max-w-[430px] border-[8px] border-[#FFFFFF] bg-[#1F2838] shadow-sm"><div className="relative aspect-video overflow-hidden"><video src="/our-story.mp4" poster="/making-lab.jpg" controls className="h-full w-full object-cover" data-testid="video-our-story" /><span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-black/65 px-3 py-2 text-[14px] font-semibold text-white">Vivekananda Concept School — Our story</span></div></div>
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
  return <section id="results" className="relative py-14 md:py-20"><div className="container-wide"><Heading title="SSC" accent="RESULTS 2026" /><p className="reveal mx-auto mt-4 max-w-[520px] text-center text-[17px] leading-6 text-[#1F2838]">Best in standards, first in results — proud of every student who made this year's SSC results shine.</p><div className="mx-auto mt-10 grid max-w-[900px] gap-6 sm:grid-cols-2 lg:grid-cols-3">{resultImages.map((item, index) => <a key={item.src} href={item.src} target="_blank" rel="noreferrer" className="reveal school-card block overflow-hidden rounded border border-[#1F2838] bg-white shadow-[0_2px_5px_rgba(31,40,56,.18)]" data-testid={`card-result-${index + 1}`}><img src={item.src} alt={item.caption} className="h-auto w-full object-cover" /><p className="px-3 py-3 text-center text-[16px] font-semibold text-[#8E140E]">{item.caption}</p></a>)}</div></div></section>;
}

const facilities = [
  [Bus, 'Safe & Convenient Transport', 'GPS-tracked buses covering all major routes, with trained staff ensuring safe pickup and drop every day. Parents can rely on consistent timing and real attendance checks at every stop.'],
  [GraduationCap, 'Smart Classrooms', 'Interactive digital boards and audio-visual tools that make every lesson engaging and easy to grasp. Concepts come alive through visuals, simulations and collaborative activities.'],
  [BookOpen, 'CBSE Based LEAD Curriculum', 'A structured, activity-based curriculum aligned with CBSE standards for strong conceptual learning. Regular assessments track progress and close gaps early.'],
  [Trophy, 'IIT-JEE and NEET Foundation', 'Early foundation coaching that builds problem-solving skills for competitive exams from school itself. Experienced faculty blend board preparation with entrance-exam thinking.'],
] as const;
function Facilities() {
  return <section id="media" className="py-20 md:py-28"><div className="container-wide"><Heading title="Our" accent="Facilities" /><div className="mx-auto mt-14 grid max-w-[880px] grid-cols-1 gap-x-14 gap-y-16 sm:grid-cols-2">{facilities.map(([Icon, title, copy], index) => <article key={title} className="reveal flex flex-col items-center text-center" data-testid={`card-facility-${index + 1}`}><span className={`facility-circle grid h-32 w-32 place-items-center rounded-full ${index % 2 === 0 ? 'text-[#8E140E]' : 'text-[#1F2838]'}`}><Icon size={54} /></span><h3 className="mt-5 font-sans text-[24px] font-medium text-[#1F2838]">{title}</h3><p className="mt-3 max-w-[320px] text-[16px] leading-6 text-[#1F2838]/75">{copy}</p></article>)}</div></div></section>;
}

const gallery = ['/making-lab.jpg', '/campus-courtyard.jpg', '/athletics-field.jpg', '/campus-courtyard.jpg', '/making-lab.jpg', '/athletics-field.jpg'];
function Gallery() {
  return <section id="gallery" className="relative overflow-hidden py-14 md:py-20"><div className="absolute right-0 top-20 hero-dots h-24 w-16 opacity-60" /><div className="container-wide"><Heading title="PHOTO" accent="GALLERY" /><div className="mx-auto mt-10 grid max-w-[740px] grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">{gallery.map((src, index) => <button key={`${src}-${index}`} className="gallery-blob group relative aspect-[1.18] overflow-hidden bg-[#FFFFFF]" onClick={() => window.open(src, '_blank')} data-testid={`button-gallery-${index + 1}`}><img src={src} alt={`School life gallery ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><span className="absolute inset-0 bg-[#8E140E]/0 transition-colors group-hover:bg-[#8E140E]/20" /></button>)}</div></div></section>;
}

function Testimonials() {
  const testimonials = [
    { quote: 'Kudos to the entire team of Vivekananda Concept School for running online classes without compromising on the quality during this pandemic. We are lucky to get the admission for our kids. Kids initially faced a lot of difficulties in coping up with the syllabus and they felt it was too much for them. Slowly, they got settled here and started liking the teaching style, syllabus, and contents. Teachers are helping them in understanding the subjects and also taking extra efforts in teaching Maths and Hindi by conducting extra classes.\\n\\nOverall, kids love the school and started socializing with the teachers and fellow students. They also helped my kids a lot in learning the missed lessons.', name: 'Murali Krishna' },
    { quote: 'The teachers at Vivekananda Concept School are very loving and nurturing while providing the guidance and structure my kids need. I have been impressed with the dedication of the staff. Truly impressed.', name: 'Sai Chandrika' },
  ];
  const [active, setActive] = useState(0); const testimonial = testimonials[active];
  return <section id="blogs" className="py-14 md:py-20"><div className="container-wide"><Heading title="Parent Say" accent="About us" /><div className="relative mx-auto mt-8 max-w-[760px] px-10 text-center sm:px-14"><Quote className="absolute left-0 top-0 text-[#8E140E]" fill="currentColor" size={40} /><Quote className="absolute right-0 top-0 rotate-180 text-[#8E140E]" fill="currentColor" size={40} /><blockquote className="whitespace-pre-line text-[16px] leading-[1.55] text-[#1F2838]" data-testid="text-testimonial">{testimonial.quote}</blockquote><p className="mt-5 text-right text-[18px] font-semibold text-[#8E140E]" data-testid="text-testimonial-name">{testimonial.name}</p><div className="mt-7 flex justify-center gap-1.5">{testimonials.map((item, index) => <button key={item.name} onClick={() => setActive(index)} className={`h-1.5 ${active === index ? 'w-6 bg-[#8E140E]' : 'w-5 bg-[#1F2838]'}`} aria-label={`Show testimonial ${index + 1}`} data-testid={`button-testimonial-dot-${index + 1}`} />)}</div><div className="mt-3 flex justify-center gap-2"><button onClick={() => setActive((active + testimonials.length - 1) % testimonials.length)} className="rounded p-1 text-[#8E140E]" aria-label="Previous testimonial" data-testid="button-testimonial-previous"><ArrowLeft size={16} /></button><button onClick={() => setActive((active + 1) % testimonials.length)} className="rounded p-1 text-[#8E140E]" aria-label="Next testimonial" data-testid="button-testimonial-next"><ArrowRight size={16} /></button></div><div className="absolute -right-2 bottom-4 hidden h-20 w-14 rounded-[50%] bg-gradient-to-br from-[#8E140E] via-white to-[#1F2838] md:block" /></div></div></section>;
}

function Admissions({ onEnquire }: { onEnquire: () => void }) {
  return <section id="career" className="py-8 text-center"><button onClick={onEnquire} className="rounded-full border-2 border-[#8E140E] px-10 py-5 text-base font-semibold text-[#8E140E] hover:bg-[#8E140E] hover:text-white" data-testid="button-admissions-enquiry">START YOUR ADMISSION ENQUIRY <ArrowRight className="ml-2 inline" size={20} /></button></section>;
}

function Footer({ onEnquire }: { onEnquire: () => void }) {
  return <footer id="contact" className="footer-texture relative overflow-hidden text-white"><div id="disclosure" className="container-wide py-10 md:py-12"><div className="grid gap-9 md:grid-cols-[1.25fr_.8fr_1.25fr]"><div><div className="text-center"><a href="#top" className="mx-auto flex h-36 w-36 flex-col items-center justify-center gap-1 rounded-full bg-white p-4 text-[#8E140E] shadow" data-testid="link-logo-footer"><img src="/logo.jpeg" alt="Vivekananda Concept School logo" className="h-14 w-14 rounded-full object-cover" /><b className="text-[14px] leading-none tracking-[.06em]">VIVEKANANDA</b><small className="text-[10px] leading-none tracking-[.12em]">CONCEPT SCHOOL</small></a><small className="mt-3 block text-[13px] tracking-[.13em] text-white">LEARN • GROW • SHINE</small></div><p className="mt-4 max-w-[245px] text-[16px] leading-5">Vivekananda Concept School, Kurnool, under the guidance of a dedicated team of educators.</p></div><div><h3 className="font-semibold">Helpful Links</h3><div className="mt-4 grid gap-2 text-[16px]">{navItems.slice(0, 8).map(([label, href]) => <a key={href} href={href} className="hover:text-[#FFFFFF]" data-testid={`link-footer-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}</div></div><div><h3 className="font-semibold">Address</h3><a href="tel:+918500045678" className="mt-5 flex items-center gap-2 text-[16px]" data-testid="link-phone-footer"><Phone size={14} /> +91 85000 45678 / 85004 95678</a><a href="https://www.google.com/maps/search/?api=1&query=3-4-55%2C+Guntha+Bazar+Rd%2C+near+Raja+Reddy+Hospital%2C+Pulivendla%2C+516390" target="_blank" rel="noreferrer" className="mt-4 flex gap-2 text-[16px] leading-5 hover:text-[#FFFFFF]" data-testid="link-address-footer"><MapPin size={15} className="mt-0.5 shrink-0" /> 3-4-55, Guntha Bazar Rd, near Raja Reddy Hospital, Pulivendla, 516390</a><a href="mailto:hello@vivekanandaconcept.school" className="mt-3 flex items-center gap-2 text-[16px]" data-testid="link-email-footer"><Mail size={14} /> hello@vivekanandaconcept.school</a><a href="https://www.instagram.com/vcsplvd?igsh=MW00NW1xdWtoY2Q1Mw==" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-[16px] hover:text-[#FFFFFF]" data-testid="link-instagram-footer"><Instagram size={14} /> Instagram</a><button onClick={onEnquire} className="mt-5 rounded border border-white px-4 py-2 text-[14px] font-semibold hover:bg-white hover:text-[#8E140E]" data-testid="button-footer-enquiry">ADMISSION ENQUIRY</button></div></div><div className="mt-9 border-t border-white/30 pt-4 text-[14px]">© 2026 Vivekananda Concept School · Mandatory Disclosure</div></div><div className="absolute bottom-4 right-8 rotate-[-18deg] text-[46px] text-white/80">↗</div></footer>;
}

function EnquiryModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false); const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); const next: Record<string, string> = {}; if (!String(data.get('parentName')).trim()) next.parentName = 'Please tell us your name'; if (!String(data.get('email')).match(/^[^@]+@[^@]+\.[^@]+$/)) next.email = 'Enter a valid email address'; if (!String(data.get('childGrade'))) next.childGrade = 'Choose a grade'; if (Object.keys(next).length) { setErrors(next); return; } setErrors({}); setSent(true); };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#1F2838]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="relative max-h-[95dvh] w-full max-w-[490px] overflow-auto rounded bg-white p-7 text-[#1F2838] shadow-2xl"><button onClick={onClose} className="absolute right-4 top-4 rounded p-1 text-[#8E140E]" aria-label="Close enquiry" data-testid="button-close-enquiry"><X size={19} /></button>{sent ? <div className="py-12 text-center"><Check className="mx-auto rounded-full bg-[#8E140E] p-3 text-white" size={58} /><h2 className="mt-6 font-display text-4xl">Thank you.</h2><p className="mt-3 text-sm text-[#1F2838]">Our admissions team will call you within one school day.</p><button onClick={onClose} className="mt-7 rounded-full bg-[#8E140E] px-6 py-3 text-xs font-bold text-white" data-testid="button-success-close">BACK TO SCHOOL</button></div> : <><p className="text-[14px] font-bold tracking-[.18em] text-[#8E140E]">ADMISSION ENQUIRY</p><h2 className="mt-3 font-display text-4xl leading-none">Let’s start a <i className="text-[#8E140E]">conversation.</i></h2><p className="mt-3 text-sm text-[#1F2838]">Share a few details and we will arrange a personal campus visit.</p><form onSubmit={submit} className="mt-6 space-y-4" noValidate><label className="block text-xs font-semibold">Parent / guardian name<input name="parentName" className="mt-1.5 w-full rounded border border-[#1F2838] px-3 py-2.5 text-sm outline-none focus:border-[#8E140E]" data-testid="input-parent-name" />{errors.parentName && <span className="text-xs text-red-600">{errors.parentName}</span>}</label><label className="block text-xs font-semibold">Email address<input name="email" type="email" className="mt-1.5 w-full rounded border border-[#1F2838] px-3 py-2.5 text-sm outline-none focus:border-[#8E140E]" data-testid="input-email" />{errors.email && <span className="text-xs text-red-600">{errors.email}</span>}</label><label className="block text-xs font-semibold">Child’s grade<select name="childGrade" defaultValue="" className="mt-1.5 w-full rounded border border-[#1F2838] bg-white px-3 py-2.5 text-sm outline-none" data-testid="select-child-grade"><option value="" disabled>Select a grade</option>{programmes.map((item) => <option key={item.name}>{item.name}</option>)}</select>{errors.childGrade && <span className="text-xs text-red-600">{errors.childGrade}</span>}</label><label className="block text-xs font-semibold">A note for our team<textarea name="note" rows={3} className="mt-1.5 w-full resize-none rounded border border-[#1F2838] px-3 py-2.5 text-sm outline-none" data-testid="textarea-note" /></label><button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8E140E] py-3.5 text-xs font-bold text-white" data-testid="button-submit-enquiry">SEND ENQUIRY <Send size={14} /></button></form></>}</div></div>;
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

function Home() {
  const [modal, setModal] = useState(false); const [admissionsPopup, setAdmissionsPopup] = useState(true); useReveals();
  useEffect(() => { document.title = 'Vivekananda Concept School | Kurnool'; const description = 'Vivekananda Concept School in Kurnool offers thoughtful education from Pre-School through High-School.'; const set = (name: string, content: string) => { let meta = document.querySelector(`meta[name="${name}"]`); if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', name); document.head.appendChild(meta); } meta.setAttribute('content', content); }; set('description', description); }, []);
  return <div className="grain relative min-h-[100dvh] overflow-hidden bg-white">
    <WallpaperLayer />
    <div className="relative z-10"><Header onEnquire={() => setModal(true)} /><Hero /><Intro /><Results /><Facilities /><Gallery /><Testimonials /><Admissions onEnquire={() => setModal(true)} /><Footer onEnquire={() => setModal(true)} /></div>
    {modal && <EnquiryModal onClose={() => setModal(false)} />}{admissionsPopup && <AdmissionsPopup onClose={() => setAdmissionsPopup(false)} onEnquire={() => setModal(true)} />}
  </div>;
}
function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;