import React, { useState, useEffect } from 'react';
import { Clock, BellRing, Utensils } from 'lucide-react';

export const LivePeriodWidget: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState({
    title: 'School Schedule',
    teacher: 'Academic Routine',
    timeRange: '09:00 AM - 03:30 PM',
    isBreak: false,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  });

  useEffect(() => {
    const updateSchedule = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeNum = hours * 100 + minutes;

      if (timeNum < 930) {
        setCurrentStatus({
          title: 'School Gates Open & Assembly Prep',
          teacher: 'Duty Staff',
          timeRange: '09:00 AM - 09:30 AM',
          isBreak: true,
          badgeColor: 'bg-blue-50 text-[#0c6780] border-blue-200',
        });
      } else if (timeNum < 945) {
        setCurrentStatus({
          title: 'Morning Assembly, National Anthem & Prayer',
          teacher: 'Faculty & Administration',
          timeRange: '09:30 AM - 09:45 AM',
          isBreak: true,
          badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
        });
      } else if (timeNum < 1030) {
        setCurrentStatus({
          title: 'Period 1 • English Language & Literature',
          teacher: 'Subject Teacher',
          timeRange: '09:45 AM - 10:30 AM',
          isBreak: false,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        });
      } else if (timeNum < 1115) {
        setCurrentStatus({
          title: 'Period 2 • Mathematics',
          teacher: 'Subject Teacher',
          timeRange: '10:30 AM - 11:15 AM',
          isBreak: false,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        });
      } else if (timeNum < 1200) {
        setCurrentStatus({
          title: 'Period 3 • General Science',
          teacher: 'Subject Teacher',
          timeRange: '11:15 AM - 12:00 PM',
          isBreak: false,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        });
      } else if (timeNum < 1245) {
        setCurrentStatus({
          title: 'Period 4 • Urdu / Regional Language',
          teacher: 'Language Faculty',
          timeRange: '12:00 PM - 12:45 PM',
          isBreak: false,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        });
      } else if (timeNum < 1330) {
        setCurrentStatus({
          title: 'PM-POSHAN Mid-Day Meal (Hot Lunch Break)',
          teacher: 'MDM Committee In-charge',
          timeRange: '12:45 PM - 01:30 PM',
          isBreak: true,
          badgeColor: 'bg-orange-50 text-orange-900 border-orange-200',
        });
      } else if (timeNum < 1415) {
        setCurrentStatus({
          title: 'Period 5 • Social Studies',
          teacher: 'Subject Teacher',
          timeRange: '01:30 PM - 02:15 PM',
          isBreak: false,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        });
      } else if (timeNum < 1500) {
        setCurrentStatus({
          title: 'Period 6 • Kashmiri & Physical Education',
          teacher: 'Physical Education / Activity Faculty',
          timeRange: '02:15 PM - 03:00 PM',
          isBreak: false,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        });
      } else {
        setCurrentStatus({
          title: 'Dispersal & Remedial Study Support',
          teacher: 'Duty Staff',
          timeRange: '03:00 PM - 03:30 PM',
          isBreak: true,
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        });
      }
    };

    updateSchedule();
    const interval = setInterval(updateSchedule, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-between px-3.5 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${currentStatus.badgeColor}`}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <div className="flex items-center gap-1.5">
          {currentStatus.isBreak ? <Utensils className="w-3.5 h-3.5" /> : <BellRing className="w-3.5 h-3.5" />}
          <span className="font-bold">{currentStatus.title}</span>
          <span className="opacity-75 hidden sm:inline">({currentStatus.teacher})</span>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-80 text-[11px]">
        <Clock className="w-3 h-3" />
        <span>{currentStatus.timeRange}</span>
      </div>
    </div>
  );
};
