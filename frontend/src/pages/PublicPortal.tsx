import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Utensils,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  LogIn,
} from 'lucide-react';

interface PublicPortalProps {
  onOpenLogin: () => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({ onOpenLogin }) => {
  const [activeNoticeTab, setActiveNoticeTab] = useState<'all' | 'admissions' | 'academic' | 'schemes'>('all');

  const notices = [
    {
      id: 1,
      title: 'Free Uniform & Textbook Consignment Distribution (SSA Scheme 2026-27)',
      category: 'schemes',
      date: 'August 24, 2026',
      desc: 'All enrolled students from Class 1st to 8th are hereby informed that the annual free uniform kits and revised NCERT textbook sets are ready for collection at the school office.',
      tag: 'PM-POSHAN / SSA',
      urgent: true,
    },
    {
      id: 2,
      title: 'Term-1 Evaluation & Continuous Assessment (CCE) Schedule',
      category: 'academic',
      date: 'August 20, 2026',
      desc: 'The Term-1 Summative & Formative Assessments for Classes 6th, 7th, and 8th under SCERT J&K guidelines will commence from September 10, 2026.',
      tag: 'Academic',
      urgent: false,
    },
    {
      id: 3,
      title: 'Admissions Open for Classes 1st to 8th Standard (Academic Year 2026-27)',
      category: 'admissions',
      date: 'August 15, 2026',
      desc: 'Govt Middle School Awanpora invites fresh admissions. Zero tuition fee, free nutritious midday meals, library access, and qualified faculty support.',
      tag: 'Admissions',
      urgent: true,
    },
    {
      id: 4,
      title: 'Clean Drinking Water RO Plant & Solar Power Unit Operational',
      category: 'schemes',
      date: 'August 10, 2026',
      desc: 'Upgraded infrastructure under the Composite School Grant is now operational, ensuring 100% clean drinking water and uninterrupted smart class power.',
      tag: 'Infrastructure',
      urgent: false,
    },
  ];

  const facultyList = [
    {
      name: 'Mohammad Ashraf Bhat',
      role: 'Headmaster / Administrator',
      qualification: 'M.A., M.Ed.',
      experience: '22+ Years in J&K SED',
      subject: 'Administration & Educational Leadership',
    },
    {
      name: 'Teaching & SSA Faculty',
      role: 'General Line & Specialized Teachers',
      qualification: 'Master Degrees & B.Ed / D.El.Ed Certified',
      experience: 'J&K School Education Dept',
      subject: 'Mathematics, Science, Languages & Social Sciences',
    },
  ];

  const filteredNotices = activeNoticeTab === 'all' ? notices : notices.filter((n) => n.category === activeNoticeTab);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-slate-800 font-sans selection:bg-[#9ae1ff] selection:text-[#002147]">
      {/* Top Banner Bar */}
      <div className="bg-[#002147] text-white px-4 lg:px-12 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-white/10">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Department of School Education • Jammu & Kashmir</span>
          <span className="text-slate-300 hidden md:inline">• Zone Mattan, District Anantnag</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-300 font-mono">
          <span>UDISE Code: 01061102301</span>
          <span className="hidden sm:inline">|</span>
          <span className="text-amber-300 font-semibold">SSA Samagra Shiksha</span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-base lg:text-lg font-black tracking-tight text-[#002147] leading-none">
              Govt Middle School Awanpora
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Zone Mattan, Dist. Anantnag, J&K • Public Institutional Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#002147] to-[#0c6780] hover:from-[#09325e] hover:to-[#095469] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
          >
            <LogIn className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            <span>Staff & Student Login</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002147] via-[#09325e] to-[#0c6780] text-white py-16 lg:py-24 px-4 lg:px-12 shadow-inner">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
              <span>Official Public Portal • Session 2026-2027</span>
            </div>

            <h2 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              Nurturing Excellence, Equality & Innovation in the Heart of Mattan
            </h2>

            <p className="text-sm lg:text-base text-slate-200 leading-relaxed">
              Govt Middle School Awanpora provides holistic, free, and technology-empowered education from Classes 1st through 8th standard under the SCERT J&K curriculum, supported by Samagra Shiksha and PM-POSHAN schemes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenLogin}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#002147] text-xs font-black transition-all shadow-lg flex items-center gap-2"
              >
                <span>Access School ERP & Report Cards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#notices"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-md"
              >
                View Circulars & Notices
              </a>
            </div>
          </div>

          {/* Quick Metrics Bento Card in Hero */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
              <div className="text-2xl lg:text-3xl font-black text-amber-300">1st - 8th</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Academic Classes</div>
              <p className="text-[11px] text-slate-300">Co-educational Curriculum</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
              <div className="text-2xl lg:text-3xl font-black text-emerald-400">SSA</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Samagra Shiksha</div>
              <p className="text-[11px] text-slate-300">Govt Funded & Supported</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
              <div className="text-2xl lg:text-3xl font-black text-blue-300">100%</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">PM-POSHAN Meals</div>
              <p className="text-[11px] text-slate-300">Nutritious Daily Hot Lunch</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-1">
              <div className="text-2xl lg:text-3xl font-black text-purple-300">SCERT</div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">J&K Curriculum</div>
              <p className="text-[11px] text-slate-300">CCE Continuous Assessment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Pillars & Facilities */}
      <section className="py-14 px-4 lg:px-12 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0c6780]">Institutional Highlights</span>
          <h3 className="text-2xl lg:text-3xl font-black text-[#002147]">
            Empowering Every Student with Modern Educational Support
          </h3>
          <p className="text-xs text-slate-500">
            Govt Middle School Awanpora ensures that every child receives top-tier academic foundation without financial barriers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002147] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#002147]">Continuous & Comprehensive Evaluation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized report cards following the SCERT J&K CCE pattern with Formative (FA) and Summative (SA) assessments across all core languages, sciences, and mathematics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#002147]">PM-POSHAN Daily Mid-Day Meals</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hygienic, hot-cooked meals prepared under strict quality guidelines to ensure daily nourishment, mental alertness, and healthy growth for all enrolled children.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#002147]">Free Uniforms & Composite Grants</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under SSA, 100% of students receive free school uniforms, textbook sets, and stationery, with transparent allocation of composite school development grants.
            </p>
          </div>
        </div>
      </section>

      {/* Public Notices & Circulars Section */}
      <section id="notices" className="py-14 px-4 lg:px-12 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0c6780]">Official Announcements</span>
              <h3 className="text-2xl font-black text-[#002147]">Latest Circulars & School Notices</h3>
              <p className="text-xs text-slate-500 mt-1">
                Stay updated with academic schedules, government directives, and school events
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveNoticeTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeNoticeTab === 'all' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-[#002147]'
                }`}
              >
                All Notices
              </button>
              <button
                onClick={() => setActiveNoticeTab('academic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeNoticeTab === 'academic' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-[#002147]'
                }`}
              >
                Academics
              </button>
              <button
                onClick={() => setActiveNoticeTab('admissions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeNoticeTab === 'admissions' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-[#002147]'
                }`}
              >
                Admissions
              </button>
              <button
                onClick={() => setActiveNoticeTab('schemes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeNoticeTab === 'schemes' ? 'bg-[#002147] text-white shadow-sm' : 'text-slate-600 hover:text-[#002147]'
                }`}
              >
                SSA Schemes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotices.map((n) => (
              <div
                key={n.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#002147] border border-blue-100">
                      {n.tag}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#002147] leading-snug">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Official Circular
                  </span>
                  <button
                    onClick={onOpenLogin}
                    className="text-[#0c6780] font-bold hover:underline flex items-center gap-1"
                  >
                    View in ERP →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Showcase */}
      <section className="py-14 px-4 lg:px-12 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0c6780]">Faculty & Staff</span>
          <h3 className="text-2xl font-black text-[#002147]">Dedicated Educational Mentors</h3>
          <p className="text-xs text-slate-500">
            Meet the experienced educators guiding the children of Govt Middle School Awanpora
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facultyList.map((f, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#002147] to-[#0c6780] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                {f.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#002147]">{f.name}</h4>
                <p className="text-[11px] font-semibold text-[#0c6780] mt-0.5">{f.role}</p>
                <p className="text-[10px] text-slate-500 mt-1">{f.qualification}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-600">
                  {f.subject}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer & Contact info */}
      <footer className="bg-[#002147] text-white pt-12 pb-6 px-4 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Govt Middle School Awanpora</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Zone Mattan, District Anantnag, Jammu & Kashmir - 192129. Recognized middle school under the Department of School Education, J&K Govt.
            </p>
            <div className="text-xs font-mono text-amber-300">UDISE Code: 01061102301</div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact & Location</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Awanpora, Salia, Zone Mattan, Dist. Anantnag, J&K - 192129</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91-1932-220000 / Office Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>gmsawanpora@jk.gov.in</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">School Portals</h4>
            <div className="space-y-2">
              <button
                onClick={onOpenLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#002147] text-xs font-bold transition-all shadow flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ERP Portal Sign In</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                For Teachers, Staff, Students & Parents
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>© 2026 Govt Middle School Awanpora. All Rights Reserved.</span>
          <span>Samagra Shiksha Abhiyan (SSA) • J&K School Education Dept</span>
        </div>
      </footer>
    </div>
  );
};
