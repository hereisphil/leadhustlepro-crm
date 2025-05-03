
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? Our team is here to help you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <Mail className="h-6 w-6 text-leadhustle-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">
                Our friendly team is here to help.
              </p>
              <a href="mailto:support@leadhustle.pro" className="text-leadhustle-blue font-medium hover:underline">
                support@leadhustle.pro
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <Phone className="h-6 w-6 text-leadhustle-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Mon-Fri from 8am to 5pm.
              </p>
              <a href="tel:+18001234567" className="text-leadhustle-blue font-medium hover:underline">
                +1 (800) 123-4567
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <MapPin className="h-6 w-6 text-leadhustle-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Office</h3>
              <p className="text-gray-600 mb-4">
                Come say hello at our office.
              </p>
              <p className="text-leadhustle-blue font-medium">
                100 Main Street, Suite 300<br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 p-8">
                <ContactForm />
              </div>
              
              <div className="lg:col-span-2 bg-leadhustle-blue p-8 flex items-center">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-4">Need help right away?</h3>
                  <p className="mb-6">
                    Our support team typically responds within 2 hours during business hours.
                  </p>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Business Hours:</h4>
                    <p>Monday - Friday: 8:00 AM - 6:00 PM EST</p>
                    <p>Saturday - Sunday: Closed</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Holiday Hours:</h4>
                    <p>We observe all major U.S. holidays.</p>
                    <p>Support availability may be limited during these times.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
