export const aiService = {
  generateAiRemarks: async (studentNameOrPayload: any, percentageParam?: number, marksParam?: any[]) => {
    let studentName = 'Student';
    let percentage = 85;
    let marks: any[] = [];

    if (typeof studentNameOrPayload === 'object' && studentNameOrPayload !== null) {
      studentName = studentNameOrPayload.studentName || 'Student';
      marks = studentNameOrPayload.marks || [];
      if (studentNameOrPayload.attendancePercentage !== undefined) {
        percentage = Number(studentNameOrPayload.attendancePercentage) || 85;
      }
      if (marks.length > 0) {
        const totalObt = marks.reduce((acc, m) => acc + (Number(m.obtainedMarks) || 0), 0);
        const totalMax = marks.reduce((acc, m) => acc + (Number(m.maxMarks) || 100), 0);
        if (totalMax > 0) {
          percentage = parseFloat(((totalObt / totalMax) * 100).toFixed(2));
        }
      }
    } else {
      studentName = studentNameOrPayload || 'Student';
      percentage = percentageParam || 85;
      marks = marksParam || [];
    }

    const sorted = [...(marks || [])].sort((a, b) => (b.obtainedMarks || 0) - (a.obtainedMarks || 0));
    const strongSubject = sorted[0]?.subjectName || 'Academics';
    const weakSubject = sorted[sorted.length - 1]?.subjectName || 'General Studies';

    let remark = '';
    if (percentage >= 90) {
      remark = `${studentName} exhibits extraordinary scholastic brilliance with an exemplary ${percentage}%. Exceptional aptitude in ${strongSubject}. Recommended for state and zonal talent representations.`;
    } else if (percentage >= 80) {
      remark = `${studentName} demonstrates commendable academic consistency with ${percentage}% marks and Grade A. Strong comprehension in ${strongSubject}, with steady progress in ${weakSubject}.`;
    } else if (percentage >= 70) {
      remark = `${studentName} shows good foundational grasping with ${percentage}%. Regular daily practice in ${weakSubject} will elevate performance to Grade A.`;
    } else if (percentage >= 50) {
      remark = `${studentName} displays active classroom participation with ${percentage}%. Targeted remedial support in ${weakSubject} is advised under SCERT continuous learning guidelines.`;
    } else {
      remark = `${studentName} needs structured individual guidance and regular parent-teacher review in ${weakSubject} to strengthen conceptual foundations.`;
    }

    return {
      success: true,
      remarks: remark,
    };
  },

  sendAiChat: async (message: string, _context?: string) => {
    const msg = message.toLowerCase();
    let reply = 'Welcome to Govt Middle School Awanpora Gemini ERP Assistant. How can I assist you with SCERT CCE grading, daily attendance, PM-POSHAN midday meals, or SSA grant tracking?';

    if (msg.includes('timing') || msg.includes('time') || msg.includes('hour')) {
      reply = 'Govt Middle School Awanpora operates from 09:00 AM to 03:00 PM (Summer) and 09:30 AM to 03:30 PM (Winter). Morning Assembly begins at 09:30 AM, followed by 6 instructional periods and a PM-POSHAN lunch break from 12:45 PM to 01:30 PM.';
    } else if (msg.includes('attendance') || msg.includes('roll') || msg.includes('present') || msg.includes('absent')) {
      reply = 'Daily student and staff attendance is tracked in 1-click under the Attendance & MDM Tracker module. It automatically records attendance percentage and syncs the daily hot lunch meal count.';
    } else if (msg.includes('meal') || msg.includes('mdm') || msg.includes('lunch') || msg.includes('food') || msg.includes('poshan')) {
      reply = 'Under the PM-POSHAN scheme, Govt Middle School Awanpora provides fresh, hygienic, and nutritious hot midday meals daily to all enrolled students. The daily rice consumption and vegetable expenditure are audited in the MDM log.';
    } else if (msg.includes('grant') || msg.includes('fund') || msg.includes('ssa') || msg.includes('money') || msg.includes('budget')) {
      reply = 'Samagra Shiksha Abhiyan (SSA) Composite School Grants are managed with full financial transparency in the SSA Grants & MDM Logs ledger, enabling instant audit trail and voucher export for ZEO inspections.';
    } else if (msg.includes('udise') || msg.includes('zone') || msg.includes('district') || msg.includes('location') || msg.includes('where')) {
      reply = 'Govt Middle School Awanpora is situated in Salia/Awanpora, Educational Zone Mattan, District Anantnag, Jammu & Kashmir (PIN: 192129). Official UDISE Code is 01061102301.';
    } else if (msg.includes('scheme') || msg.includes('benefit') || msg.includes('uniform') || msg.includes('book') || msg.includes('free')) {
      reply = 'Under government welfare schemes, all students receive 100% free school uniforms, free SCERT textbooks, and daily hot cooked lunches under PM-POSHAN with zero tuition fees.';
    }

    return {
      success: true,
      reply,
    };
  },
};
