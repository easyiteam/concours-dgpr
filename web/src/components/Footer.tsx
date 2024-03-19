import { MailSvg } from '../assets/svgs/MailSvg';
import { PhoneSvg } from '../assets/svgs/PhoneSvg';
import { BeninFlag } from './display/BeninFlag';

export const Footer = () => {
  return (
    <div className="text-sm bg-white">
      <div className="flex flex-col-reverse gap-4 lg:flex-row px-[6vw] py-10 justify-between items-center">
        <div className="text-center lg:text-left">
          Copyright © 2024 Direction Générale de la Police Républicaine
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div>BP 393 Cotonou</div>
          <div className="flex items-center gap-2 text-xs">
            <PhoneSvg />
            <span>+229 97576703</span>
            <span>+229 97112756</span>
            <span>+229 97402340</span>
          </div>
          <div className="flex items-center gap-2">
            <MailSvg />
            <span>contact@dgpr.bj</span>
          </div>
        </div>
      </div>
      <BeninFlag />
    </div>
  );
};
