/**
 * Govt Middle School Awanpora — Unified API Service Facade
 * 
 * Aggregates domain services into a single, cohesive, backwards-compatible API object.
 */

import { authService } from './domains/auth.service';
import { academicService } from './domains/academic.service';
import { attendanceService } from './domains/attendance.service';
import { financeService } from './domains/finance.service';
import { directoryService } from './domains/directory.service';
import { noticeService } from './domains/notice.service';
import { aiService } from './domains/ai.service';
import { ORG_ID, normalizeClassId, safeBtoa, safeAtob } from './domains/common';

export const api = {
  // Common constants & helpers
  ORG_ID,
  normalizeClassId,
  safeBtoa,
  safeAtob,

  // 1. Authentication & Session
  ...authService,

  // 2. Academics, Classes, Timetable, Homework & Exams
  ...academicService,

  // 3. Attendance Roster & PM-POSHAN Mid-Day Meals
  ...attendanceService,

  // 4. Finance, Grants, Invoices, Expenses & Summary
  ...financeService,

  // 5. Directory & User Management
  ...directoryService,

  // 6. Notices & Multilingual Announcements
  ...noticeService,

  // 7. Gemini AI Assistant & Evaluation
  ...aiService,
};

export {
  authService,
  academicService,
  attendanceService,
  financeService,
  directoryService,
  noticeService,
  aiService,
  ORG_ID,
  normalizeClassId,
  safeBtoa,
  safeAtob,
};

export default api;
