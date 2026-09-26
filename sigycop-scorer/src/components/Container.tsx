import Header from './Header';
import SigycopEntry from './sigycop-page/SigycopEntry';

export default function Container() {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full shadow bg-[#f3f3f3]">
      <Header />
      <SigycopEntry />
    </div>
  );
}
