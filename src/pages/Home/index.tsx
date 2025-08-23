import React from 'react';
import Navigation from '../../components/Navigation';
import { WelcomeHero } from './components';

const Home = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WelcomeHero />
        </div>
      </div>
    </div>
  );
};

export default Home;
