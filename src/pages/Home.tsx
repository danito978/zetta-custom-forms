import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Welcome to React
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Your clean React application is ready to go
          </p>
          
          <div className="space-y-4">
            <Link
              to="/from-generator"
              className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Go to From Generator
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Home;
