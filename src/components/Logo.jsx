import React from 'react';

function Logo({ width = '150px', className = '', iconOnly = false }) {
  const logoSrc = iconOnly ? '/logo/inkflow-icon.png' : '/logo/inkflow-logo.png';
  
  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ width: iconOnly ? 'auto' : width }}>
      <img 
        src={logoSrc} 
        alt="Inkflow Logo" 
        className={`${iconOnly ? 'h-9 w-9' : 'h-10 md:h-11 w-auto'} object-contain transition-transform duration-200 hover:scale-105`}
        onError={(e) => {
          // Fallback if image path fails
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
}

export default Logo;