import './button.scss';
import { ReactNode, MouseEventHandler } from 'react';

type ButtonProps = {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

export default function Button({
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${props.className} ${loading ? 'button--loading' : ''}`}
      onClick={props.onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : props.children}
    </button>
  );
}
