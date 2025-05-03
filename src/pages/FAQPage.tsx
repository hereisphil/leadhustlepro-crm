
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about LeadHustle.pro and how it can help your business.
            </p>
          </div>
          
          <FAQ />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
