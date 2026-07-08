import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardProps>;
  Title: React.FC<CardProps>;
  Description: React.FC<CardProps>;
  Content: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
} = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white border border-slate-200/60 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.015)] overflow-hidden hover:border-slate-300 transition-colors ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-b border-slate-100 bg-slate-50/20 ${className}`} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className = '', ...props }) => (
  <h3 className={`text-sm font-bold text-slate-900 ${className}`} {...props}>
    {children}
  </h3>
);

Card.Description = ({ children, className = '', ...props }) => (
  <p className={`text-[10px] text-slate-400 font-semibold mt-1 ${className}`} {...props}>
    {children}
  </p>
);

Card.Content = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-4 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-2 ${className}`} {...props}>
    {children}
  </div>
);
