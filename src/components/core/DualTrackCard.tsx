import React from 'react';

interface Props {
  categoryTitle: string;
  gujaratiTitle: string;
  guidingQuestion: string;
  metricLabel: string;
  metricValue: string | number;
  metricSubtext: string;
  narrativeTitle?: string;
  narrativeText?: string;
  reportingQuarter?: string;
}

export function DualTrackCard({
  categoryTitle,
  gujaratiTitle,
  guidingQuestion,
  metricLabel,
  metricValue,
  metricSubtext,
  narrativeTitle,
  narrativeText,
  reportingQuarter,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row mb-6">
      <div className="p-6 md:w-5/12 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 tracking-wider uppercase">{categoryTitle}</span>
            <span className="text-xs text-slate-500 font-medium">{gujaratiTitle}</span>
          </div>
          <p className="text-xs italic text-slate-600 mt-1 mb-4">"{guidingQuestion}"</p>
          <div className="mt-2">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{metricValue ?? '—'}</span>
            <p className="text-sm font-semibold text-slate-700 mt-1">{metricLabel}</p>
            <p className="text-xs text-slate-500 mt-0.5">{metricSubtext}</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-400">
          Source: Verified Roster & Center Rollups
        </div>
      </div>

      <div className="p-6 md:w-7/12 flex flex-col justify-between bg-gradient-to-br from-white to-orange-50/20">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
              Lived Experience & Seva Rajipo
            </span>
            {reportingQuarter && <span className="text-xs text-slate-400">{reportingQuarter}</span>}
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">
            {narrativeTitle || 'Quarterly Narrative Spotlight'}
          </h4>
          <blockquote className="text-sm text-slate-600 italic border-l-2 border-orange-400 pl-3 my-2 leading-relaxed">
            {narrativeText
              ? `"${narrativeText}"`
              : 'Individual-level growth in Satsang Samjan and Rajipo cannot be reduced to a number alone. Local reflections from GKs and GCs are presented alongside quantitative trends.'}
          </blockquote>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>Submitted by local Karyakar</span>
          <span className="text-emerald-700 font-medium">Verified by Regional Review</span>
        </div>
      </div>
    </div>
  );
}
