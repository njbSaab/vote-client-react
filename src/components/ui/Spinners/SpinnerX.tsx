// src/components/ui/Spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number;     // 'sm'/'md'/'lg' или число в px
  className?: string;                     // любые доп. классы (цвет, анимация и т.д.)
  style?: React.CSSProperties;            // для inline-стилей, если вдруг понадобится
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  style = {},
}) => {
  // Преобразуем size в пиксели
  const getSizePx = () => {
    if (typeof size === 'number') return size;
    const sizes: Record<string, number> = {
      sm: 100,
      md: 200,
      lg: 400,
    };
    return sizes[size] || 48;
  };

  const spinnerSize = getSizePx();

  return (
    <div className="loader-box" style={{
        width: `${spinnerSize}px`,
        height: `${spinnerSize}px`,
    }}>
        <span
        className={`${className}`}
        style={{
            ...style,
        }}
        />
    </div>
  );
};