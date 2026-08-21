import { BookMarked, BookOpen, BookText, Calculator, FlaskConical, Globe2 } from 'lucide-react';

/* Pulled out of App.tsx and parked here, unused, while the Faculty section is
   off the branch pages — reinstate by importing `Faculty` and rendering it
   where it used to sit (right after the About Us section in
   `BranchPageTemplate`), and add a `Faculty` nav entry back into
   `headerNavItems`'s branch-only insertion in `Header`. */

/* Placeholder roster - the layout is the point; swap the names, the years and
   the portraits for the real staff list. `photo` is optional and the card
   falls back to the subject icon, so a missing headshot never leaves a hole
   in the grid. */
export const FACULTY: { name: string; rank: string; subject: string; years: string; tint: string; accent: string; icon: typeof BookText; photo?: string }[] = [
  { name: 'Smt. Anusha R.', rank: 'Senior Lecturer', subject: 'Telugu', years: '12+ yrs', tint: '#EDF7EE', accent: '#2E7D32', icon: BookText },
  { name: 'Ms. Kavya M.', rank: 'Lecturer', subject: 'Hindi', years: '8+ yrs', tint: '#FFF4EA', accent: '#E65100', icon: BookMarked },
  { name: 'Mr. Ramesh K.', rank: 'Lecturer', subject: 'English', years: '6+ yrs', tint: '#ECF3FC', accent: '#1565C0', icon: BookOpen },
  { name: 'Smt. Deepa T.', rank: 'Junior Lecturer', subject: 'Mathematics', years: '3+ yrs', tint: '#F6EEFA', accent: '#6A1B9A', icon: Calculator },
  { name: 'Mr. Suresh P.', rank: 'Lecturer', subject: 'Science', years: '5+ yrs', tint: '#E8F6F4', accent: '#00695C', icon: FlaskConical },
  { name: 'Ms. Lakshmi V.', rank: 'Lecturer', subject: 'Social Studies', years: '4+ yrs', tint: '#FDEEEB', accent: '#BF360C', icon: Globe2 },
];

/* `heading` off when the page above already carries the title as its `h1` -
   otherwise the section repeats it and the page has two competing headings.
   `branchOffset` rotates the starting member so branch pages that otherwise
   share this exact roster don't all show it in the same order — each page
   leads with a different teacher and icon. */
export function Faculty({ heading = true, branchOffset = 0 }: { heading?: boolean; branchOffset?: number }) {
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
