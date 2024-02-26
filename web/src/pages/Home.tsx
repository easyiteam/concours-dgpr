import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { PickExam } from '../components/PickExam';
import { Posts } from '../components/Posts';

export const Home = () => {
  return (
    <div>
      <Hero />
      <PickExam />
      <Posts />
      <Footer />
    </div>
  );
};
