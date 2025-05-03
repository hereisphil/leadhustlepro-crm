
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 inline-block">
              LeadHustle.pro
            </Link>
            <p className="text-gray-400 mb-6">
              Simple, cloud-based tool designed to help freelancers and marketers stay organized with their outreach.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/testimonials" className="text-gray-400 hover:text-white">Testimonials</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-lg">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/refund-policy" className="text-gray-400 hover:text-white">Refund Policy</Link></li>
                <li><Link to="/gdpr" className="text-gray-400 hover:text-white">GDPR Compliance</Link></li>
                <li><Link to="/cookie-policy" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">© 2025 LeadHustle.pro. All rights reserved.</p>
          <div className="flex items-center mt-4 md:mt-0">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-500">Veteran Owned & Operated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
