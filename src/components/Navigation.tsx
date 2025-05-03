
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="flex items-center justify-between p-4 md:p-6">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-leadhustle-blue">
          LeadHustle.pro
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Home
        </Link>
        <Link to="/features" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Features
        </Link>
        <Link to="/testimonials" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Testimonials
        </Link>
        <Link to="/faq" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          FAQ
        </Link>
        <Link to="/contact" className="text-gray-800 hover:text-leadhustle-blue font-medium">
          Contact
        </Link>
      </div>
      
      <div>
        <Link to="/signup">
          <Button className="bg-leadhustle-blue hover:bg-leadhustle-darkBlue text-white">
            Start Free Trial
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
