
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <div className="py-20 bg-gradient-to-r from-leadhustle-blue to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Outreach?</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of successful freelancers and marketers who've boosted their
          productivity and conversions with LeadHustle.pro.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="bg-white text-leadhustle-blue hover:bg-blue-50 font-bold py-4 px-8 rounded-md transition-colors">
            Start Your Free 14-Day Trial
          </Link>
          <Link to="/demo" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-md transition-colors">
            Schedule a Demo
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/90">No credit card required. Cancel anytime.</p>
      </div>
    </div>
  );
};

export default CTA;
