import heroBg from '../assets/imgs/hero.jpeg';

export const Hero = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundColor: 'rgba(0, 0, 112, 0.48)',
        backgroundBlendMode: 'multiply',
      }}
      className="h-[80vh] bg-cover">
      {/* <div className="hidden h-full bg-primary lg:flex justify-center items-center text-white px-20">
        <div className="flex flex-col gap-20">
          <div className="font-bold text-5xl font-bold">
            Direction Générale de la Police Républicaine
          </div>
          <div className="font-bold text-3xl text-center">
            Concours de recrutement au titre de l'année 2024
          </div>
        </div>
      </div> */}
      <div className="flex flex-col justify-center items-center px-4 h-full text-white gap-6">
        {/* <div className="font-bold text-center text-2xl md:text-4xl font-bold">
          Direction Générale de la Police Républicaine
        </div> */}
        <div className="font-bold text-xl md:text-5xl text-center w-[80%]">
          ... UNE FORCE HUMAINE AU SERVICE DU PEUPLE ...
        </div>
      </div>
      <div className="hidden lg:block"></div>
    </div>
  );
};
