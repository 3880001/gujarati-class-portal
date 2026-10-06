'use client';

import React, { useState, useEffect } from 'react';
import { queueAttendanceOffline, initOfflineDB } from '@/lib/idb';
import { createBrowserClient } from '@supabase/ssr';

export function AttendanceLogger({ eventId, roster }: { eventId: string; roster: any[] }) {
  const [offlineCount, setOfflineCount] = useState(0);
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkPending = async () => {
      const db = await initOfflineDB();
      const pending = await db.getAllFromIndex('offline_attendance', 'by-synced', false);
      setOfflineCount(pending.length);
    };
    checkPending();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleQuickCheckin = async (studentId: string) => {
    await queueAttendanceOffline({
      eventId,
      studentId,
      parentCount: 0,
      isExtraParticipation: false,
    });
    setOfflineCount((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto bg-white rounded-xl shadow-md border border-slate-100">
      <div className="flex items-center justify-between pb-3 border-b">
        <h2 className="text-lg font-semibold text-slate-800">Class Attendance</h2>
        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {isOnline ? 'Online Sync Active' : 'Offline Mode (Local Storage)'}
        </span>
      </div>

      {offlineCount > 0 && (
        <div className="p-3 text-xs bg-amber-50 text-amber-900 rounded-lg flex items-center justify-between">
          <span>{offlineCount} records waiting to upload.</span>
          <span className="font-semibold text-amber-700">Auto-syncs on connect</span>
        </div>
      )}

      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
        {roster.map((student) => (
          <div key={student.id} className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">{student.first_name} {student.last_name}</p>
              <p className="text-xs text-slate-500">{student.wing} • Level 1</p>
            </div>
            <button
              onClick={() => handleQuickCheckin(student.id)}
              className="px-3 py-1.5 bg-orange-600 active:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Mark Present
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
