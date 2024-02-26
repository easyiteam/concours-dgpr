import icon from '../assets/icon.png';

export default function Header() {
  return (
    <div className="bg-[#007000] p-3">
      <div className="flex gap-8 items-center">
        <img
          src={icon}
          width={36}
          height={36}
          alt="Icon"
        />

        <div className="text-white font-bold text-xl text-center">
          Recrutement DGEFC 2023
        </div>
      </div>
    </div>
  );
}
