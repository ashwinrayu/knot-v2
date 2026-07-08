import React from 'react';

/**
 * KnotLogo — renders the official KNOT logo PNG exactly as provided.
 *
 * Props
 * ─────
 * height    : pixel height of the image (width scales automatically)
 * invert    : true → CSS invert(1) for use on dark backgrounds
 * className : extra classes on the <img> element
 */

interface KnotLogoProps {
  height?: number;
  invert?: boolean;
  className?: string;
}

export const KnotLogo: React.FC<KnotLogoProps> = ({
  height = 40,
  invert = false,
  className = '',
}) => {
  return (
    <img
      src="/knot-logo.png"
      alt="KNOT — Knowledge Navigation Optimization Tool"
      height={height}
      style={{
        height,
        width: 'auto',
        display: 'block',
        filter: invert ? 'invert(1)' : 'none',
        objectFit: 'contain',
      }}
      className={className}
      draggable={false}
    />
  );
};

export default KnotLogo;
