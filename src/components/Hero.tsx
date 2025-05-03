
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gray-800">Get More Leads,</span>
              <br />
              <span className="text-leadhustle-blue">Close More Deals</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              LeadHustle.pro helps freelancers and marketers stay 
              organized with outreach, so you can focus on building real 
              connections instead of juggling spreadsheets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="bg-leadhustle-blue hover:bg-leadhustle-darkBlue text-white px-8 py-6 text-lg">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="border-leadhustle-blue text-leadhustle-blue hover:bg-blue-50 px-8 py-6 text-lg">
                  <Play className="mr-2 h-4 w-4" /> Watch Video
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative animate-fade-in">
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-lg p-1">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="public/lovable-uploads/915d615f-9eec-4d71-a233-7e076074f15a.png" 
                  alt="LeadHustle.pro dashboard preview" 
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 rounded-full p-4 cursor-pointer hover:bg-white">
                    <Play className="h-8 w-8 text-leadhustle-blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
