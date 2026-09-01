export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export const validator = {
  validateUserCreation: (payload: any): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!payload || typeof payload !== 'object') {
      return { valid: false, errors: { payload: 'Payload must be a valid object' }, firstError: 'Invalid payload' };
    }

    if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
      errors.name = 'Full Name is required and must be at least 2 characters.';
    }

    if (!payload.username || typeof payload.username !== 'string' || payload.username.trim().length < 3) {
      errors.username = 'Username / Email is required and must be at least 3 characters.';
    }

    if (!payload.password || typeof payload.password !== 'string' || payload.password.trim().length < 4) {
      errors.password = 'Password is required and must be at least 4 characters.';
    }

    const validRoles = ['admin', 'teacher', 'student', 'parent'];
    if (!payload.role || !validRoles.includes(payload.role)) {
      errors.role = `Role must be one of: ${validRoles.join(', ')}`;
    }

    if (payload.role === 'student' && payload.rollNumber !== undefined) {
      const roll = Number(payload.rollNumber);
      if (isNaN(roll) || roll < 1 || roll > 200) {
        errors.rollNumber = 'Roll number must be a positive integer between 1 and 200.';
      }
    }

    const errorKeys = Object.keys(errors);
    return {
      valid: errorKeys.length === 0,
      errors,
      firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : undefined,
    };
  },

  validateExamResult: (payload: any): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!payload || typeof payload !== 'object') {
      return { valid: false, errors: { payload: 'Invalid payload' }, firstError: 'Invalid payload' };
    }

    if (!payload.classId) {
      errors.classId = 'Target class is required.';
    }

    if (!payload.studentId) {
      errors.studentId = 'Student ID is required.';
    }

    if (!Array.isArray(payload.subjectMarks) || payload.subjectMarks.length === 0) {
      errors.subjectMarks = 'At least one subject evaluation record is required.';
    } else {
      payload.subjectMarks.forEach((sub: any, idx: number) => {
        if (!sub.subjectName || typeof sub.subjectName !== 'string') {
          errors[`subject_${idx}_name`] = `Subject name at index ${idx} is required.`;
        }
        const max = Number(sub.maxMarks);
        const obt = Number(sub.obtainedMarks);
        if (isNaN(max) || max <= 0) {
          errors[`subject_${idx}_max`] = `Max marks at index ${idx} must be greater than 0.`;
        }
        if (isNaN(obt) || obt < 0) {
          errors[`subject_${idx}_obt`] = `Obtained marks at index ${idx} cannot be negative.`;
        }
        if (obt > max) {
          errors[`subject_${idx}_range`] = `Obtained marks (${obt}) cannot exceed max marks (${max}) for ${sub.subjectName}.`;
        }
      });
    }

    const errorKeys = Object.keys(errors);
    return {
      valid: errorKeys.length === 0,
      errors,
      firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : undefined,
    };
  },

  validateAttendanceData: (classId: string, date: string, attendanceData: any[]): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!classId) {
      errors.classId = 'Class ID is required.';
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.date = 'Date must be formatted as YYYY-MM-DD.';
    }

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      errors.attendanceData = 'Attendance data array cannot be empty.';
    } else {
      const validStatuses = ['present', 'absent', 'late', 'leave', 'holiday'];
      attendanceData.forEach((rec: any, idx: number) => {
        if (!rec.studentId) {
          errors[`student_${idx}_id`] = `Student ID missing at index ${idx}.`;
        }
        if (rec.status && !validStatuses.includes(rec.status)) {
          errors[`student_${idx}_status`] = `Invalid status '${rec.status}' at index ${idx}.`;
        }
      });
    }

    const errorKeys = Object.keys(errors);
    return {
      valid: errorKeys.length === 0,
      errors,
      firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : undefined,
    };
  },

  validateGrantEntry: (payload: any): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!payload || typeof payload !== 'object') {
      return { valid: false, errors: { payload: 'Invalid payload' }, firstError: 'Invalid payload' };
    }

    const amt = Number(payload.amount);
    if (isNaN(amt) || amt <= 0) {
      errors.amount = 'Grant amount must be a positive numeric value.';
    }

    if (!payload.schemeType && !payload.fundName) {
      errors.fundName = 'Scheme type or Fund name is required.';
    }

    const errorKeys = Object.keys(errors);
    return {
      valid: errorKeys.length === 0,
      errors,
      firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : undefined,
    };
  },

  validateInvoice: (payload: any): ValidationResult => {
    const errors: Record<string, string> = {};

    if (!payload || typeof payload !== 'object') {
      return { valid: false, errors: { payload: 'Invalid payload' }, firstError: 'Invalid payload' };
    }

    if (!payload.clientName || typeof payload.clientName !== 'string' || payload.clientName.trim().length < 2) {
      errors.clientName = 'Client / Student Beneficiary name is required.';
    }

    const amt = Number(payload.amount) || Number(payload.items?.[0]?.unitPrice);
    if (isNaN(amt) || amt <= 0) {
      errors.amount = 'Invoice total amount must be greater than zero.';
    }

    const errorKeys = Object.keys(errors);
    return {
      valid: errorKeys.length === 0,
      errors,
      firstError: errorKeys.length > 0 ? errors[errorKeys[0]] : undefined,
    };
  },
};
