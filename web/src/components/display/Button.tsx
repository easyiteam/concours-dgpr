import { ButtonHTMLAttributes, useState } from 'react';
import { Icon } from '../display/Icon';
import { Spinner } from './Spinner';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string };

export const Button = ({
  children,
  className,
  onClick,
  icon,
  ...props
}: ButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setLoading(true);
    if (onClick) {
      await onClick(event);
    }
    setLoading(false);
  };

  return (
    <button
      className={[
        'bg-primary disabled:opacity-25 hover:opacity-75 shadow-lg rounded py-2 text-white px-4 flex justify-center gap-3 items-center',
        className,
      ].join(' ')}
      {...props}
      onClick={handleClick}>
      {!loading && icon && <Icon name={icon} />}
      {loading ? <Spinner /> : children}
    </button>
  );
};
