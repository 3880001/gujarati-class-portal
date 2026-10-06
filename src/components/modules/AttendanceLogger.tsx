'use client';

import React, { useState, useEffect } from 'react';
import { queueAttendance, getPendingAttendance, markAttendanceSynced } from '@/lib/idb';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  wing: string;
}

export function AttendanceLogger({ eventId }: { eventId: string }) {
  const [roster, setRoster] = useState<Student[]>([]);
  const [offlineCount, setOfflineCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [parentCount, setParentCount] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  const refreshPending = async () => {
    const pending = await getPendingAttendance();
    setOfflineCount(pending.length);
  };

  const syncPending = async () => {
    if (!navigator.onLine) return;
    const pending = await getPendingAttendance();
    for (const item of pending) {
      try {
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (res.ok) {
          await markAttendanceSynced(item.deviceSyncId);
        }
      } catch (err) {
        console.error('Sync item failed:', err);
      }
    }
    await refreshPending();
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    refreshPending();

    fetch('/api/roster')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRoster(data);
      })
      .catch((err) => console.error('Failed to load roster:', err));

    const handleOnline = () => {
      setIsOnline(true);
      syncPending();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCheckin = async (studentId: string) => {
    await queueAttendance({
      eventId,
      studentId,
      parentCount,
      isExtraParticipation: false,
    });
    setStatusMsg('Recorded locally in IndexedDB.');
    await refreshPending();
    if (navigator.onLine) {
      await syncPending();
    }
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Attendance Log</h2>
          <p className="text-xs text-slate-500">1-tap class check-in with offline sync</p>
        </div>
        <span
          className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
            isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {isOnline ? '● Connected to Neon' : '○ Offline Mode'}
        </span>
      </div>

      {offlineCount > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex justify-between items-center">
          <span>{offlineCount} record(s) queued locally.</span>
          <button onClick={syncPending} className="underline font-bold">
            Sync Now
          </button>
        </div>
      )}

      {statusMsg && <p className="mt-2 text-xs font-semibold text-emerald-600">{statusMsg}</p>}

      <div className="my-4">
        <label className="text-xs font-medium text-slate-700">Parents Accompanying Students:</label>
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={() => setParentCount(Math.max(0, parentCount - 1))}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-bold"
          >
            -
          </button>
          <span className="font-bold text-slate-800">{parentCount}</span>
          <button
            type="button"
            onClick={() => setParentCount(parentCount + 1)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 mt-4 max-h-96 overflow-y-auto">
        {roster.map((s) => (
          <div key={s.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {s.first_name} {s.last_name}
              </p>
              <p className="text-xs text-slate-400">{s.wing}</p>
            </div>
            <button
              onClick={() => handleCheckin(s.id)}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              Mark Present
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
