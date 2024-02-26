import armoirie from '../assets/imgs/armoirie.png';
import logo from '../assets/imgs/logo-with-text.png';

export const Header = () => {
  return (
    <div className="bg-white px-[6vw] py-3 flex justify-between items-center">
      <img
        src={armoirie}
        alt="ARMOIRIE"
        className="h-[40px] lg:h-[70px]"
      />
      <img
        src={logo}
        alt="LOGO"
        className="h-[30px] lg:h-[60px]"
      />
    </div>
  );
};
