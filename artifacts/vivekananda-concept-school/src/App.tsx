import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronRight, Compass, FlaskConical, Heart, Menu, MoveUpRight, Play, Quote, Send, Sparkles, Sprout, Trophy, Users, X } from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3 shrink-0" data-testid="link-logo">
      <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#e8b657] text-[#e8b657] font-display text-xl leading-none">V</span>
      {!compact && <span className="leading-[.9]"><b className="block text-[13px] tracking-[.16em] text-[#f4e9ce]">VIVEKANANDA</b><small className="text-[10px] tracking-[.22em] text-[#e8b657]">CONCEPT SCHOOL</small></span>}
    </a>
  );
}

function Header({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const links = [['Our approach', '#approach'], ['Campus life', '#campus'], ['Stories', '#stories'], ['Admissions', '#admissions']];
  const go = (href: string) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); };
  return (
    <header className="absolute left-0 right-0 top-0 z-40 text-[#f4e9ce]">
      <div className="container-wide flex h-[86px] items-center justify-between border-b border-white/15">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => <a href={href} key={href} onClick={(e) => { e.preventDefault(); go(href); }} className="text-[12px] font-semibold tracking-[.08em] text-[#f4e9ce]/80 transition-colors hover:text-[#e8b657]" data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>)}
        </nav>
        <button onClick={onEnquire} className="hidden items-center gap-2 rounded-full bg-[#e8b657] px-5 py-3 text-[11px] font-bold tracking-[.1em] text-[#272a44] transition-transform hover:-translate-y-0.5 md:flex" data-testid="button-header-enquiry">START AN ENQUIRY <ArrowUpRight size={14} /></button>
        <button onClick={() => setOpen(!open)} className="rounded-full border border-white/25 p-2 md:hidden" aria-label="Toggle menu" data-testid="button-mobile-menu">{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {open && <div className="border-b border-white/15 bg-[#272a44] px-7 py-5 md:hidden">
        {links.map(([label, href]) => <a href={href} key={href} onClick={(e) => { e.preventDefault(); go(href); }} className="block border-b border-white/10 py-3 text-sm font-semibold">{label}</a>)}
        <button onClick={onEnquire} className="mt-4 w-full rounded-full bg-[#e8b657] py-3 text-xs font-bold text-[#272a44]" data-testid="button-mobile-enquiry">START AN ENQUIRY</button>
      </div>}
    </header>
  );
}

function Button({ children, onClick, secondary = false, testId }: { children: ReactNode; onClick?: () => void; secondary?: boolean; testId: string }) {
  return <button onClick={onClick} className={`group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[11px] font-bold tracking-[.1em] transition-all hover:-translate-y-0.5 ${secondary ? 'border border-[#f4e9ce]/35 text-[#f4e9ce] hover:border-[#e8b657] hover:text-[#e8b657]' : 'bg-[#d6674c] text-[#fff5e2] shadow-[0_8px_20px_rgba(214,103,76,.22)] hover:bg-[#bf543b]'}`} data-testid={testId}>{children}<ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>;
}

function Hero({ onEnquire }: { onEnquire: () => void }) {
  return <section id="top" className="relative min-h-[740px] overflow-hidden bg-[#272a44] text-[#f4e9ce]">
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,42,68,.97)_0%,rgba(39,42,68,.8)_43%,rgba(39,42,68,.18)_100%)]" />
    <img src="/campus-courtyard.jpg" alt="Students crossing Vivekananda Concept School campus" className="absolute inset-0 h-full w-full object-cover object-center opacity-75" />
    <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-[#272a44] to-transparent" />
    <Header onEnquire={onEnquire} />
    <div className="container-wide relative flex min-h-[740px] items-center pt-20">
      <div className="max-w-[670px] pb-12">
        <p className="reveal mb-5 font-mono-ui text-[10px] font-bold tracking-[.24em] text-[#e8b657]">A SCHOOL FOR THE WHOLE CHILD · KURNOOL</p>
        <h1 className="reveal delay-1 font-display text-[clamp(3.5rem,8vw,7.25rem)] leading-[.9] tracking-[-.045em]">Bright minds.<br /><em className="text-[#e8b657]">Brave hearts.</em></h1>
        <p className="reveal delay-2 mt-7 max-w-[450px] text-[17px] leading-7 text-[#f4e9ce]/76">A purposeful, joyful place where children learn to think deeply, stand kindly, and step confidently into what comes next.</p>
        <div className="reveal delay-3 mt-9 flex flex-wrap items-center gap-4"><Button onClick={onEnquire} testId="button-hero-enquiry">PLAN A VISIT</Button><Button secondary testId="button-hero-story" onClick={() => document.querySelector('#approach')?.scrollIntoView({ behavior: 'smooth' })}>DISCOVER OUR WAY</Button></div>
      </div>
    </div>
    <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] tracking-[.16em] text-[#f4e9ce]/60 md:flex"><span className="grid h-8 w-8 place-items-center rounded-full border border-[#f4e9ce]/30"><ArrowDownRight size={14} /></span> SCROLL TO EXPLORE</div>
    <div className="absolute bottom-9 right-8 hidden text-right md:block"><span className="font-mono-ui text-[10px] text-[#e8b657]">01 / 07</span><p className="mt-1 text-xs text-[#f4e9ce]/60">The beginning of a<br />bigger story</p></div>
  </section>;
}

function Intro() {
  return <section id="approach" className="bg-[#f4e9ce] py-24 md:py-32">
    <div className="container-wide grid gap-14 md:grid-cols-[.72fr_1.28fr] md:items-end">
      <div className="reveal"><p className="font-mono-ui text-[10px] tracking-[.2em] text-[#d6674c]">01 — THE VIVEKANANDA DIFFERENCE</p><h2 className="mt-5 font-display text-[clamp(2.7rem,5vw,5rem)] leading-[.96] text-[#272a44]">Not just what<br /><span className="text-[#d6674c]">they learn.</span></h2></div>
      <div className="reveal delay-1"><p className="max-w-[570px] text-xl leading-8 text-[#272a44]/75">We believe school should give children more than answers. It should give them the appetite to ask better questions, the courage to try again, and the steadiness to know who they are.</p><a href="#campus" className="mt-8 inline-flex items-center gap-3 border-b border-[#272a44]/30 pb-2 text-[11px] font-bold tracking-[.13em] text-[#272a44] transition-colors hover:border-[#d6674c] hover:text-[#d6674c]" data-testid="link-intro-campus">WALK THROUGH OUR CAMPUS <ChevronRight size={15} /></a></div>
    </div>
    <div className="container-wide mt-20 grid gap-4 sm:grid-cols-3">
      {[{ icon: BookOpen, title: 'Think deeply', text: 'Strong foundations, taught with context and wonder.' }, { icon: Heart, title: 'Stand kindly', text: 'Character is practiced in every classroom and corridor.' }, { icon: Compass, title: 'Step boldly', text: 'Confidence grows when every child gets room to lead.' }].map(({ icon: Icon, title, text }, i) => <div key={title} className={`reveal delay-${i + 1} border-t border-[#272a44]/20 pt-5`}><Icon className="mb-10 text-[#d6674c]" size={22} strokeWidth={1.5} /><h3 className="font-display text-2xl text-[#272a44]">{title}</h3><p className="mt-2 max-w-[230px] text-sm leading-6 text-[#272a44]/65">{text}</p></div>)}
    </div>
  </section>;
}

function Campus() {
  return <section id="campus" className="bg-[#f8f1df] py-24 md:py-32">
    <div className="container-wide"><div className="flex flex-wrap items-end justify-between gap-6"><div className="reveal"><p className="font-mono-ui text-[10px] tracking-[.2em] text-[#d6674c]">02 — A DAY IN THE MAKING</p><h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,5rem)] leading-[.94] text-[#272a44]">A campus that<br /><i>keeps asking.</i></h2></div><p className="reveal max-w-[300px] text-sm leading-6 text-[#272a44]/65">Every corner is an invitation: to make, move, perform, notice, and belong.</p></div>
      <div className="mt-14 grid gap-5 md:grid-cols-[1.42fr_.8fr] md:grid-rows-[250px_250px]">
        <div className="reveal group relative overflow-hidden rounded-[1.5rem] md:row-span-2"><img src="/making-lab.jpg" alt="Students building a project in the school making lab" className="h-full min-h-[340px] w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#272a44]/85 to-transparent" /><div className="absolute bottom-7 left-7 text-[#f4e9ce]"><p className="font-mono-ui text-[10px] tracking-[.18em] text-[#e8b657]">THE MAKER'S ROOM</p><h3 className="mt-2 font-display text-3xl">Curiosity, with tools.</h3></div></div>
        <div className="reveal delay-1 flex flex-col justify-between rounded-[1.5rem] bg-[#e8b657] p-7 text-[#272a44]"><Sparkles size={22} /><div><p className="font-mono-ui text-[10px] tracking-[.16em]">06:40 AM — 04:15 PM</p><h3 className="mt-3 font-display text-3xl leading-none">The rhythm<br />of a school day.</h3></div></div>
        <div className="reveal delay-2 group relative overflow-hidden rounded-[1.5rem]"><img src="/athletics-field.jpg" alt="Students on the school athletics field" className="h-full min-h-[250px] w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#272a44]/75 to-transparent" /><div className="absolute bottom-5 left-6 text-[#f4e9ce]"><p className="font-mono-ui text-[10px] tracking-[.18em] text-[#e8b657]">THE OPEN FIELD</p><h3 className="mt-1 font-display text-2xl">Find your stride.</h3></div></div>
      </div>
    </div>
  </section>;
}

function Numbers() {
  return <section className="bg-[#d6674c] py-20 text-[#fff5e2]"><div className="container-wide grid gap-10 md:grid-cols-[.75fr_1.25fr] md:items-center"><div className="reveal"><p className="font-mono-ui text-[10px] tracking-[.2em] text-[#f4e9ce]/70">03 — ROOM TO GROW</p><h2 className="mt-5 font-display text-5xl leading-none md:text-6xl">Small enough<br /><i>to know you.</i></h2></div><div className="grid grid-cols-2 gap-y-10 border-l border-[#fff5e2]/30 pl-8 sm:grid-cols-4 md:pl-12">{[['1:18','teacher to learner'],['2008','our first year'],['14','clubs to explore'],['100%','heart in it']].map(([number, label], i) => <div className={`reveal delay-${i + 1}`} key={label}><p className="font-display text-4xl md:text-5xl">{number}</p><p className="mt-2 max-w-[100px] text-xs leading-4 text-[#fff5e2]/70">{label}</p></div>)}</div></div></section>;
}

function Learning() {
  return <section className="bg-[#272a44] py-24 text-[#f4e9ce] md:py-32"><div className="container-wide"><div className="reveal flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono-ui text-[10px] tracking-[.2em] text-[#e8b657]">04 — LEARNING THAT LINGERS</p><h2 className="mt-5 max-w-[720px] font-display text-[clamp(2.8rem,5vw,5rem)] leading-[.95]">From first questions<br /><i className="text-[#e8b657]">to big ideas.</i></h2></div><p className="max-w-[290px] text-sm leading-6 text-[#f4e9ce]/65">A considered journey from Early Years through Grade 10, where rigour and imagination share the same desk.</p></div>
      <div className="mt-16 divide-y divide-[#f4e9ce]/15 border-y border-[#f4e9ce]/15">{[['01','Early Years','Ages 3–5','Wonder is the curriculum.'],['02','Primary School','Grades 1–5','Build the habits that make learning joyful.'],['03','Middle School','Grades 6–8','Find your voice. Test your thinking.'],['04','Senior School','Grades 9–10','Stand ready for the world beyond our gates.']].map(([num, title, ages, text], i) => <div key={num} className="reveal group grid gap-3 py-7 transition-colors hover:bg-[#f4e9ce]/[.05] md:grid-cols-[80px_1fr_1fr_28px] md:items-center"><span className="font-mono-ui text-[11px] text-[#e8b657]">{num}</span><h3 className="font-display text-3xl">{title}</h3><p className="text-sm text-[#f4e9ce]/65"><b className="mr-3 font-mono-ui text-[10px] font-normal tracking-wider text-[#e8b657]">{ages}</b>{text}</p><ChevronRight className="hidden transition-transform group-hover:translate-x-1 md:block" size={18} /></div>)}</div>
    </div></section>;
}

function Stories() {
  const [active, setActive] = useState(0);
  const stories = [{ quote: 'I used to think being good at school meant getting everything right. Here, I learnt that the best learners are the ones who keep wondering.', name: 'Aarav, Grade 8', detail: 'Student voice' }, { quote: 'We were looking for a place that saw our daughter as a person first. That has been the most meaningful part of our journey here.', name: 'Meera’s parents', detail: 'Family voice' }, { quote: 'The most beautiful sound on campus is a room full of children disagreeing thoughtfully, then figuring it out together.', name: 'Ms. Ananya Rao', detail: 'Faculty voice' }];
  return <section id="stories" className="bg-[#f4e9ce] py-24 md:py-32"><div className="container-wide grid gap-14 md:grid-cols-[.7fr_1.3fr]"><div className="reveal"><p className="font-mono-ui text-[10px] tracking-[.2em] text-[#d6674c]">05 — HEARD ON CAMPUS</p><h2 className="mt-5 font-display text-[clamp(2.8rem,5vw,5rem)] leading-[.94] text-[#272a44]">The stories<br /><i className="text-[#d6674c]">between</i> the lines.</h2><div className="mt-12 flex gap-2">{stories.map((story, i) => <button key={story.name} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${i === active ? 'w-10 bg-[#d6674c]' : 'w-2 bg-[#272a44]/25'}`} aria-label={`Show story ${i + 1}`} data-testid={`button-story-${i + 1}`} />)}</div></div><div className="reveal delay-1 relative min-h-[360px] rounded-[1.5rem] bg-[#e8b657] p-8 md:p-14"><Quote size={30} className="text-[#272a44]/45" /><blockquote className="mt-10 max-w-[640px] font-display text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.07] text-[#272a44]">“{stories[active].quote}”</blockquote><div className="absolute bottom-8 left-8 right-8 flex items-end justify-between border-t border-[#272a44]/20 pt-4 md:bottom-12 md:left-14 md:right-14"><div><p className="text-sm font-bold text-[#272a44]">{stories[active].name}</p><p className="mt-1 font-mono-ui text-[9px] tracking-wider text-[#272a44]/60">{stories[active].detail}</p></div><button className="grid h-10 w-10 place-items-center rounded-full border border-[#272a44]/30 transition-colors hover:bg-[#272a44] hover:text-[#f4e9ce]" onClick={() => setActive((active + 1) % stories.length)} aria-label="Next story" data-testid="button-next-story"><ArrowRightIcon /></button></div></div></div></section>;
}

function ArrowRightIcon() { return <ArrowUpRight size={17} />; }

function Admissions({ onEnquire }: { onEnquire: () => void }) {
  return <section id="admissions" className="relative overflow-hidden bg-[#f8f1df] py-24 md:py-32"><div className="absolute -right-20 top-0 h-80 w-80 rounded-full border-[45px] border-[#e8b657]/35" /><div className="container-wide relative grid gap-12 md:grid-cols-[1fr_.8fr] md:items-end"><div className="reveal"><p className="font-mono-ui text-[10px] tracking-[.2em] text-[#d6674c]">06 — YOUR NEXT STEP</p><h2 className="mt-5 max-w-[650px] font-display text-[clamp(3.2rem,6vw,6rem)] leading-[.9] text-[#272a44]">Come see what<br /><i className="text-[#d6674c]">could be.</i></h2><p className="mt-7 max-w-[455px] text-base leading-7 text-[#272a44]/68">The best way to understand Vivekananda is to walk through it. Meet a teacher, see a class in motion, and ask us anything.</p></div><div className="reveal delay-1 rounded-[1.5rem] bg-[#272a44] p-7 text-[#f4e9ce] md:p-9"><p className="font-mono-ui text-[10px] tracking-[.16em] text-[#e8b657]">ADMISSIONS 2025–26</p><h3 className="mt-4 font-display text-3xl">Let’s start with a conversation.</h3><p className="mt-3 text-sm leading-6 text-[#f4e9ce]/65">No pressure, just a useful first step for your family.</p><button onClick={onEnquire} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#e8b657] px-5 py-3 text-[11px] font-bold tracking-wider text-[#272a44] transition-transform hover:-translate-y-0.5" data-testid="button-admissions-enquiry">REQUEST A CAMPUS VISIT <ArrowUpRight size={15} /></button></div></div></section>;
}

function EnquiryModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); const next: Record<string, string> = {}; if (!String(data.get('parentName')).trim()) next.parentName = 'Please tell us your name'; if (!String(data.get('email')).match(/^[^@]+@[^@]+\.[^@]+$/)) next.email = 'Enter a valid email address'; if (!String(data.get('childGrade'))) next.childGrade = 'Choose a grade'; if (Object.keys(next).length) { setErrors(next); return; } setErrors({}); setSent(true); };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#272a44]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><div className="relative max-h-[95dvh] w-full max-w-[520px] overflow-auto rounded-[1.5rem] bg-[#f8f1df] p-7 text-[#272a44] shadow-2xl md:p-10"><button onClick={onClose} className="absolute right-5 top-5 rounded-full p-2 transition-colors hover:bg-[#272a44]/10" aria-label="Close enquiry" data-testid="button-close-enquiry"><X size={19} /></button>{sent ? <div className="py-12 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8b657]"><Check size={30} /></span><h2 className="mt-7 font-display text-4xl" id="enquiry-title">We’ll be in touch.</h2><p className="mx-auto mt-3 max-w-[330px] text-sm leading-6 text-[#272a44]/65">Thank you for taking the first step. Our admissions team will call you within one school day.</p><button onClick={onClose} className="mt-8 rounded-full bg-[#d6674c] px-6 py-3 text-[11px] font-bold tracking-wider text-[#fff5e2]" data-testid="button-success-close">BACK TO CAMPUS</button></div> : <><p className="font-mono-ui text-[10px] tracking-[.18em] text-[#d6674c]">ADMISSIONS ENQUIRY</p><h2 id="enquiry-title" className="mt-3 font-display text-4xl leading-none">Let’s meet your<br /><i className="text-[#d6674c]">curious one.</i></h2><p className="mt-4 text-sm leading-6 text-[#272a44]/65">Share a few details and we’ll arrange a personal campus visit.</p><form className="mt-7 space-y-4" onSubmit={submit} noValidate><label className="block text-xs font-bold">Parent / guardian name<input name="parentName" className="mt-2 w-full rounded-xl border border-[#272a44]/18 bg-[#fffaf0] px-4 py-3 text-sm outline-none transition-colors focus:border-[#d6674c]" placeholder="Your name" data-testid="input-parent-name" />{errors.parentName && <span className="mt-1 block text-xs text-[#b84d37]">{errors.parentName}</span>}</label><label className="block text-xs font-bold">Email address<input name="email" type="email" className="mt-2 w-full rounded-xl border border-[#272a44]/18 bg-[#fffaf0] px-4 py-3 text-sm outline-none transition-colors focus:border-[#d6674c]" placeholder="you@example.com" data-testid="input-email" />{errors.email && <span className="mt-1 block text-xs text-[#b84d37]">{errors.email}</span>}</label><label className="block text-xs font-bold">Child’s grade<select name="childGrade" defaultValue="" className="mt-2 w-full rounded-xl border border-[#272a44]/18 bg-[#fffaf0] px-4 py-3 text-sm outline-none focus:border-[#d6674c]" data-testid="select-child-grade"><option value="" disabled>Select a grade</option>{['Early Years','Grade 1–5','Grade 6–8','Grade 9–10'].map((grade) => <option key={grade}>{grade}</option>)}</select>{errors.childGrade && <span className="mt-1 block text-xs text-[#b84d37]">{errors.childGrade}</span>}</label><label className="block text-xs font-bold">A note for our team <textarea name="note" rows={3} className="mt-2 w-full resize-none rounded-xl border border-[#272a44]/18 bg-[#fffaf0] px-4 py-3 text-sm outline-none focus:border-[#d6674c]" placeholder="What would you like to know?" data-testid="textarea-note" /></label><button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#d6674c] py-4 text-[11px] font-bold tracking-[.12em] text-[#fff5e2] transition-colors hover:bg-[#bf543b]" data-testid="button-submit-enquiry">SEND ENQUIRY <Send size={15} /></button><p className="text-center text-[10px] text-[#272a44]/45">We respect your inbox. No automated marketing, ever.</p></form></>}</div></div>;
}

function Footer({ onEnquire }: { onEnquire: () => void }) {
  return <footer className="bg-[#272a44] py-14 text-[#f4e9ce]"><div className="container-wide"><div className="grid gap-12 border-b border-[#f4e9ce]/15 pb-14 md:grid-cols-[1.2fr_.8fr_.8fr]"><div><Logo /><p className="mt-7 max-w-[300px] text-sm leading-6 text-[#f4e9ce]/60">A school for bright minds, brave hearts, and the many ways a child can become themselves.</p></div><div><p className="font-mono-ui text-[10px] tracking-[.16em] text-[#e8b657]">FIND US</p><p className="mt-4 text-sm leading-6 text-[#f4e9ce]/70">Vivekananda Concept School<br />Kurnool, Andhra Pradesh<br />India 518001</p></div><div><p className="font-mono-ui text-[10px] tracking-[.16em] text-[#e8b657]">SAY HELLO</p><a href="tel:+918500012345" className="mt-4 block text-sm text-[#f4e9ce]/70 hover:text-[#e8b657]" data-testid="link-phone">+91 85000 12345</a><a href="mailto:hello@vivekanandaconcept.school" className="mt-2 block break-all text-sm text-[#f4e9ce]/70 hover:text-[#e8b657]" data-testid="link-email">hello@vivekanandaconcept.school</a><button onClick={onEnquire} className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold tracking-wider text-[#e8b657]" data-testid="button-footer-enquiry">START AN ENQUIRY <ArrowUpRight size={14} /></button></div></div><div className="flex flex-wrap items-center justify-between gap-4 pt-6 text-[10px] text-[#f4e9ce]/40"><p>© 2025 Vivekananda Concept School</p><p className="font-mono-ui tracking-wider">LEARN WITH PURPOSE · LIVE WITH HEART</p><a href="#top" className="flex items-center gap-2 hover:text-[#e8b657]" data-testid="link-back-top">BACK TO TOP <ArrowUpRight size={13} /></a></div></div></footer>;
}

function Home() {
  const [modal, setModal] = useState(false);
  useReveals();
  useEffect(() => {
    document.title = 'Vivekananda Concept School | Bright minds. Brave hearts.';
    const description = 'Vivekananda Concept School is a purposeful, joyful school in Kurnool where children learn to think deeply, stand kindly, and step confidently.';
    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!tag) { tag = document.createElement('meta'); tag.name = 'description'; document.head.appendChild(tag); }
    tag.content = description;
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.content = document.title;
    else { const meta = document.createElement('meta'); meta.setAttribute('property', 'og:title'); meta.content = document.title; document.head.appendChild(meta); }
  }, []);
  return <div className="grain min-h-[100dvh] overflow-hidden"><Hero onEnquire={() => setModal(true)} /><Intro /><Campus /><Numbers /><Learning /><Stories /><Admissions onEnquire={() => setModal(true)} /><Footer onEnquire={() => setModal(true)} />{modal && <EnquiryModal onClose={() => setModal(false)} />}</div>;
}

function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;