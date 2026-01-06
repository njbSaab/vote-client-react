// src/components/VoteButton.tsx
interface VoteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const VoteButton = ({
  onClick,
  disabled = false,
  className = '',
  children = 'Сделать прогноз',
}: VoteButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        btn btn-gradient-hover
        text-2xl 
        transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};