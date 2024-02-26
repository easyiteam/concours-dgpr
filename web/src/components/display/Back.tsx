import { useNavigate } from 'react-router-dom';
import { Icon } from '../display/Icon';

export const Back = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-fit h-fit mr-2"
      onClick={() => navigate('/')}>
      <Icon
        name="arrow_back"
        size={20}
      />
    </div>
  );
};
