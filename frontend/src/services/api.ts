const API_BASE = '/api/v1';

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('gms_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Stats
  getOverviewStats: async () => {
    const res = await fetch(`${API_BASE}/stats/overview`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Attendance
  getClasses: async () => {
    const res = await fetch(`${API_BASE}/attendance/classes`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  getRoster: async (classId: string, date: string) => {
    const res = await fetch(`${API_BASE}/attendance/roster?classId=${classId}&date=${date}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  markAttendance: async (classId: string, date: string, records: any[]) => {
    const res = await fetch(`${API_BASE}/attendance/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ classId, date, records }),
    });
    return res.json();
  },

  getStudentAttendance: async (studentId: string) => {
    const res = await fetch(`${API_BASE}/attendance/student/${studentId}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Academics
  getExamResults: async (classId?: string, studentId?: string) => {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (studentId) params.append('studentId', studentId);
    const res = await fetch(`${API_BASE}/academics/results?${params.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  saveExamResult: async (payload: any) => {
    const res = await fetch(`${API_BASE}/academics/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getTimetable: async (classId?: string) => {
    const params = classId ? `?classId=${classId}` : '';
    const res = await fetch(`${API_BASE}/academics/timetable${params}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  saveTimetable: async (payload: { classId: string; dayOfWeek: string; periods: any[] }) => {
    const res = await fetch(`${API_BASE}/academics/timetable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getHomework: async (classId?: string) => {
    const params = classId ? `?classId=${classId}` : '';
    const res = await fetch(`${API_BASE}/academics/homework${params}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  addHomework: async (payload: any) => {
    const res = await fetch(`${API_BASE}/academics/homework`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Notices
  getNotices: async () => {
    const res = await fetch(`${API_BASE}/notices`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  createNotice: async (payload: any) => {
    const res = await fetch(`${API_BASE}/notices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  translateNotice: async (id: string, language: string) => {
    const res = await fetch(`${API_BASE}/notices/${id}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ language }),
    });
    return res.json();
  },

  // Grants & MDM
  getGrants: async () => {
    const res = await fetch(`${API_BASE}/grants`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  createGrant: async (payload: any) => {
    const res = await fetch(`${API_BASE}/grants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getMdmLogs: async () => {
    const res = await fetch(`${API_BASE}/grants/mdm-log`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  saveMdmLog: async (payload: any) => {
    const res = await fetch(`${API_BASE}/grants/mdm-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Directory & Users
  getStudents: async (classId?: string) => {
    const params = classId ? `?classId=${classId}` : '';
    const res = await fetch(`${API_BASE}/users/students${params}`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  getTeachers: async () => {
    const res = await fetch(`${API_BASE}/users/teachers`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  getParents: async () => {
    const res = await fetch(`${API_BASE}/users/parents`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  createUser: async (payload: any) => {
    const res = await fetch(`${API_BASE}/users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  deleteUser: async (id: string) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // AI Service
  generateAiRemarks: async (payload: any) => {
    const res = await fetch(`${API_BASE}/ai/generate-remarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  sendAiChat: async (message: string, context?: string) => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ message, context }),
    });
    return res.json();
  },
};
