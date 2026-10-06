import { openDB, DBSchema } from 'idb';

interface GujaratiAppDB extends DBSchema {
  'offline_attendance': {
    key: string;
    value: {
      eventId: string;
      studentId?: string;
      userId?: string;
      parentCount: number;
      isExtraParticipation: boolean;
      checkInTime: string;
      deviceSyncId: string;
      synced: boolean;
    };
    indexes: { 'by-synced': boolean };
  };
}

export const initOfflineDB = async () => {
  return openDB<GujaratiAppDB>('gujarati-pravrutti-cache', 1, {
    upgrade(db) {
      const store = db.createObjectStore('offline_attendance', {
        keyPath: 'deviceSyncId',
      });
      store.createIndex('by-synced', 'synced');
    },
  });
};

export const queueAttendanceOffline = async (record: {
  eventId: string;
  studentId?: string;
  userId?: string;
  parentCount: number;
  isExtraParticipation: boolean;
}) => {
  const db = await initOfflineDB();
  const deviceSyncId = crypto.randomUUID();
  await db.put('offline_attendance', {
    ...record,
    deviceSyncId,
    checkInTime: new Date().toISOString(),
    synced: false,
  });

  // Trigger service worker sync registration if supported
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    // @ts-ignore - background sync API
    await registration.sync.register('sync-attendance');
  }
};
