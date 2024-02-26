import { Icon } from '../display/Icon';

type Props = {
  position?: 'left' | 'center' | 'right';
};

const _position = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

export const Logo = ({ position = 'center' }: Props) => {
  return (
    <div
      className={[
        'text-center font-semibold flex gap-2 items-center',
        _position[position],
      ].join(' ')}>
      <Icon
        name="manage_history"
        size={48}
        className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-blue-300 font-bold"
      />
      <span className="text-xl mt-1">
        <span className="text-orange-400">OChrono</span>
        <span className="text-blue-800">Team</span>
      </span>
    </div>
  );
};
