import { Dropdown } from '../components/actions/Dropdown';
import { DisplayUser } from '../components/display/DisplayUser';
import { Icon } from '../components/display/Icon';
import { UserInfoDropdown } from '../components/views/UserInfoDropdown';
import logo from '../assets/imgs/logo.png';
import { AuthStore } from '../store/auth.store';

export const Topbar = ({
  full = true,
  title,
}: {
  full?: boolean;
  title?: string;
}) => {
  return (
    <div className="bg-white flex items-center justify-between rounded px-8 py-4">
      <div className="flex gap-6 items-center">
        <Icon
          size={28}
          name="menu"
          className="lg:hidden text-gray-500"
        />
        {full ? (
          <div className="font-semibold text-gray-800 flex items-center gap-4">
            <img
              src={logo}
              alt="LOGO"
              className="h-[48px]"
            />
            {/* <span>Direction Générale de la Police Républicaine</span> */}
          </div>
        ) : (
          <div className="text-xs font-bold text-gray-500">{title}</div>
        )}
      </div>
      <div className="flex items-center gap-8 text-gray-500">
        <a
          className="text-blue-500 underline text-sm"
          target="_blank"
          href="#">
          Webmail
        </a>
        <Dropdown
          contentContainerClass="mt-2 shadow-xl border p-2 -translate-x-[25%] w-[180px] rounded z-40"
          content={<UserInfoDropdown />}>
          <DisplayUser username={AuthStore.get()?.fullname ?? ''} />
        </Dropdown>
      </div>
    </div>
  );
};
