
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import SignupForm from '@/components/SignupForm';
import { ChevronLeft } from 'lucide-react';

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <Navigation />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-leadhustle-blue mb-8">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to home
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SignupForm />
            </div>
            
            <div className="hidden md:block">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src="public/lovable-uploads/5c931b2a-a18f-4977-8aa2-f4802ad44d27.png"
                  alt="People shaking hands" 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4">LeadHustle.pro</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p>Easy-to-use lead management tools</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p>Automated follow-ups and reminders</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p>Free 14-day trial, no credit card required</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-1 mr-3">
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p>Cancel anytime with no questions asked</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    "Using LeadHustle.pro has helped me increase my closing rate by 34% in just one month!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
