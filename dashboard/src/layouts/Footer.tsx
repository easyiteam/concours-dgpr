export const Footer = () => {
  return (
    <div className="flex justify-between items-center bg-gray-50 rounded py-4 px-4 lg:px-6 text-gray-500 text-xs lg:text-sm">
      <div>
        <span>2023</span> <span>&copy;</span>
        <span> OpenCTS | Mairie d'Ifangni - Bénin</span>
      </div>
      <div>
        <a
          href="https://opencts.com"
          className="text-primary hover:underline"
          target="_blank">
          Contacts
        </a>
      </div>
    </div>
  );
};
