
import { Shield } from "lucide-react";

const DashboardFooter = () => {
  return (
    <footer className="bg-white border-t py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">© 2025 LeadHustle.pro. All rights reserved.</p>
          <div className="flex items-center mt-2 md:mt-0">
            <Shield className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-500">Veteran Owned & Operated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
