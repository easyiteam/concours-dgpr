import icon from '../assets/icon.png';

export default function Header() {
  return (
    <div className="bg-[#183661] p-3">
      <div className="flex gap-8 items-center">
        <img
          src={icon}
          width={36}
          height={36}
          alt="Icon"
        />

        <div className="text-white font-bold text-xl text-center">
          Recrutement des douanes 2022
        </div>
      </div>
    </div>
  );
}
