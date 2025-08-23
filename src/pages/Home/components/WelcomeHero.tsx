import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeHero = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-neutral-900 mb-4">
        Welcome to React
      </h1>
      <p className="text-lg text-neutral-600 mb-8">
        Your clean React application is ready to go
      </p>
      
      <div className="space-y-4">
        <Link
          to="/form-generator"
          className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Go to Form Generator
        </Link>
      </div>
    </div>
  );
};

export default WelcomeHero;
