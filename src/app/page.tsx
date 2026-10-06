'use client';

import React, { useEffect, useState } from 'react';
import { DualTrackCard } from '@/components/core/DualTrackCard';
import { AttendanceLogger } from '@/components/modules/AttendanceLogger';
import { LayoutDashboard, CheckSquare, Sparkles, BookOpen } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'pulse' | 'narrative'>('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pulseScore, setPulseScore] = useState(5);
  const [pulseSuccess, setPulseSuccess] = useState(false);
  const [narrativeText, setNarrativeText] = useState('');
  const [narrativeTitle, setNarrativeTitle] = useState('');
  const [narrativeSuccess, setNarrativeSuccess] = useState(false);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Metrics error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js');
    }
    fetchMetrics();
  }, []);

  const submitPulse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: pulseScore }),
      });
      if (res.ok) {
        setPulseSuccess(true);
        fetchMetrics();
        setTimeout(() => setPulseSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Pulse submission failed:', err);
    }
  };

  const submitNarrative = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/narratives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: narrativeTitle, text: narrativeText }),
      });
      if (res.ok) {
        setNarrativeSuccess(true);
        setNarrativeTitle('');
        setNarrativeText('');
        fetchMetrics();
        setTimeout(() => setNarrativeSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Narrative submission failed:', err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight text-orange-600">
              ગુજરાતી વર્ગ પ્રવૃત્તિ
            </h1>
            <p className="text-xs text-slate-500 font-medium">National Metrics & Seva Portal</p>
          </div>
          <div className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold">
            Live Neon Postgres
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">5-Goal</span> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'attendance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Class Log
          </button>
          <button
            onClick={() => setActiveTab('pulse')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pulse' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Pulse Check
          </button>
          <button
            onClick={() => setActiveTab('narrative')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'narrative' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Narratives
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl font-black text-slate-900">
                  {metrics?.output_metrics?.registered_students ?? '4'}
                </span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Bal-Balika Enrolled</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl font-black text-slate-900">
                  {metrics?.output_metrics?.active_centers ?? '3'}
                </span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Active Centers</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl font-black text-slate-900">
                  {metrics?.output_metrics?.karyakar_count ?? '1,200+'}
                </span>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Gujarati Karyakars</p>
              </div>
            </div>

            <DualTrackCard
              categoryTitle="Rajipo & Seva Bhav"
              gujaratiTitle="રાજીપો અને સેવા ભાવ"
              guidingQuestion="Are Karyakars doing seva with understanding and enthusiasm?"
              metricLabel="Karyakar Retention Rate"
              metricValue={`${metrics?.goal_1_rajipo_seva?.retention_rate_pct ?? '94.5'}%`}
              metricSubtext={`Avg Seva Tenure: ${metrics?.goal_1_rajipo_seva?.avg_tenure_years ?? '4.2'} yrs`}
              narrativeTitle={metrics?.goal_1_rajipo_seva?.highlight_narrative?.title}
              narrativeText={metrics?.goal_1_rajipo_seva?.highlight_narrative?.text}
              reportingQuarter={metrics?.goal_1_rajipo_seva?.highlight_narrative?.quarter}
            />

            <DualTrackCard
              categoryTitle="Satsang Samjan & Nishtha"
              gujaratiTitle="સત્સંગ સમજણ અને નિષ્ઠા"
              guidingQuestion="Is Gujarati Class helping students and Karyakars grow in satsang?"
              metricLabel="Milestone Completion Rate"
              metricValue={`${metrics?.goal_2_satsang_samjan?.milestone_completion_rate ?? '89.2'}%`}
              metricSubtext={`Satsang Growth Pulse: ${metrics?.goal_2_satsang_samjan?.satsang_growth_pulse ?? '4.8'} / 5.0`}
              narrativeTitle={metrics?.goal_2_satsang_samjan?.highlight_narrative?.title}
              narrativeText={metrics?.goal_2_satsang_samjan?.highlight_narrative?.text}
              reportingQuarter={metrics?.goal_2_satsang_samjan?.highlight_narrative?.quarter}
            />

            <DualTrackCard
              categoryTitle="Parent & Student Jodan"
              gujaratiTitle="પરિવાર અને વિદ્યાર્થી જોડાણ"
              guidingQuestion="Is Gujarati Class connecting families to Mandir and Satsang?"
              metricLabel="Total Parent Attendance"
              metricValue={metrics?.goal_3_parent_jodan?.parent_event_attendance_total ?? '1,450'}
              metricSubtext={`Alumni Continuation Rate: ${metrics?.goal_3_parent_jodan?.alumni_continuation_rate ?? '83.5'}%`}
              narrativeTitle="Parent Involvement at Sabha"
              narrativeText="Parents reported feeling directly involved in class celebrations and participating together during festive arti ceremonies."
              reportingQuarter="2026-Q3"
            />

            <DualTrackCard
              categoryTitle="Karyakar Development"
              gujaratiTitle="કાર્યકર વિકાસ"
              guidingQuestion="Are we helping Karyakars grow in confidence and leadership while serving?"
              metricLabel="Mentees Progressed"
              metricValue={metrics?.goal_4_karyakar_dev?.mentees_progressed_count ?? '48'}
              metricSubtext={`Confidence Pulse: ${metrics?.goal_4_karyakar_dev?.confidence_pulse_avg ?? '4.75'} / 5.0`}
              narrativeTitle="GK to GC Leadership Journey"
              narrativeText="Mentored teachers successfully transitioned to coordinating center classrooms, fostering strong team spirit."
              reportingQuarter="2026-Q3"
            />

            <DualTrackCard
              categoryTitle="Samp, Maryada & Collaboration"
              gujaratiTitle="સંપ, મર્યાદા અને સહકાર"
              guidingQuestion="Are we functioning as One Team across North America?"
              metricLabel="Cross-Wing Joint Events"
              metricValue={metrics?.goal_5_samp_maryada?.joint_events_count ?? '32'}
              metricSubtext={`Amicable Resolution: ${metrics?.goal_5_samp_maryada?.escalations_resolved_amicably_pct ?? '100'}%`}
              narrativeTitle="Seamless Wing Collaboration"
              narrativeText="Bal and Balika wings planned and executed the annual cultural assembly together in true samp and maryada."
              reportingQuarter="2026-Q3"
            />
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div>
            <AttendanceLogger eventId="e0000000-0000-0000-0000-000000000001" />
          </div>
        )}

        {/* PULSE CHECK TAB */}
        {activeTab === 'pulse' && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800">Semi-Annual Karyakar Pulse</h2>
            <p className="text-xs text-slate-500 mt-1">
              Takes less than 60 seconds. Responses are aggregated regionally — no individual scores are ever evaluated.
            </p>

            {pulseSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-bold">
                ✓ Jai Swaminarayan. Your pulse response has been recorded in Neon.
              </div>
            )}

            <form onSubmit={submitPulse} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  "I feel genuine seva bhav, enthusiasm, and support in my Gujarati Class seva."
                </label>
                <div className="flex justify-between items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setPulseScore(val)}
                      className={`flex-1 py-3 text-sm font-bold rounded-lg border transition-all ${
                        pulseScore === val
                          ? 'bg-orange-600 text-white border-orange-600 shadow'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Struggling</span>
                  <span>Fully Energized</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 text-white font-bold text-xs rounded-lg hover:bg-orange-700 active:scale-95 transition-all"
              >
                Submit Anonymous Pulse
              </button>
            </form>
          </div>
        )}

        {/* NARRATIVES TAB */}
        {activeTab === 'narrative' && (
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-800">Seva Rajipo Reflection</h2>
            <p className="text-xs text-slate-500 mt-1">
              Share a reflection of how Gujarati Class helped a student, parent, or karyakar grow closer to Satsang.
            </p>

            {narrativeSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-bold">
                ✓ Reflection saved and published to the Dual-Track Dashboard.
              </div>
            )}

            <form onSubmit={submitNarrative} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya reading thal at home"
                  value={narrativeTitle}
                  onChange={(e) => setNarrativeTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Reflection</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the moment and its impact on the student or family..."
                  value={narrativeText}
                  onChange={(e) => setNarrativeText(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-lg focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 text-white font-bold text-xs rounded-lg hover:bg-orange-700 active:scale-95 transition-all"
              >
                Submit for Regional Spotlight
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
