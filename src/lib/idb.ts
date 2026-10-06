import { openDB, DBSchema } from 'idb';

interface GujaratiDB extends DBSchema {
  offline_attendance: {
    key: string;
    value: {
      deviceSyncId: string;
      eventId: string;
      studentId?: string;
      userId?: string;
      parentCount: number;
      isExtraParticipation: boolean;
      checkInTime: string;
      synced: boolean;
    };
    indexes: { 'by-synced': boolean };
  };
}

export const getDB = async () => {
  return openDB<GujaratiDB>('gc-pravrutti-cache', 1, {
    upgrade(db) {
      const store = db.createObjectStore('offline_attendance', { keyPath: 'deviceSyncId' });
      store.createIndex('by-synced', 'synced');
    },
  });
};

export const queueAttendance = async (item: {
  eventId: string;
  studentId?: string;
  userId?: string;
  parentCount: number;
  isExtraParticipation: boolean;
}) => {
  const db = await getDB();
  const deviceSyncId = crypto.randomUUID();
  await db.put('offline_attendance', {
    ...item,
    deviceSyncId,
    checkInTime: new Date().toISOString(),
    synced: false,
  });
  return deviceSyncId;
};

export const getPendingAttendance = async () => {
  const db = await getDB();
  return db.getAllFromIndex('offline_attendance', 'by-synced', false);
};

export const markAttendanceSynced = async (deviceSyncId: string) => {
  const db = await getDB();
  const record = await db.get('offline_attendance', deviceSyncId);
  if (record) {
    record.synced = true;
    await db.put('offline_attendance', record);
  }
};
