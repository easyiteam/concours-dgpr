import { useState } from 'react';
import AddPage from './add-page/AddPage';
import Footer from './Footer';
import Header from './Header';
import VerifyPage from './verify-page/VerifyPage';

const pages = ['Saisir les notes', 'Vérifier un code'];

export default function Container() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="grid grid-rows-[auto_auto_1fr_auto] h-full shadow bg-[#f3f3f3]">
      <Header />
      <div className="text-center py-3 bg-white font-bold">
        {pages[currentPage]}
      </div>
      {currentPage === 0 ? <AddPage /> : <VerifyPage />}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
