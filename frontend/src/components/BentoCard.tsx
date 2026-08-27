import React from 'react';

interface BentoCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  span?: string; // e.g. "col-span-12 md:col-span-6"
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  subtitle,
  action,
  icon,
  children,
  className = '',
  span = 'col-span-12 md:col-span-6',
}) => {
  return (
    <div
      className={`bento-card p-5 md:p-6 flex flex-col justify-between ${span} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002147] flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-bold text-sm md:text-base text-[#002147] tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
};
