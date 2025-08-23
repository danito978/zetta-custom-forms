import React from 'react';
import Navigation from '../components/Navigation';

function FromGenerator() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            From Generator
          </h1>
          <p className="text-lg text-neutral-600">
            This page is ready for you to add components
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 border border-neutral-200">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Ready for Components
            </h2>
            <p className="text-neutral-600">
              Start adding your components here to build out the from-generator functionality.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default FromGenerator;
