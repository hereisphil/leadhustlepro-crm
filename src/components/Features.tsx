
import { User, Calendar, Send, BarChart } from "lucide-react";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow animate-slide-in">
      <div className="bg-blue-100 rounded-full p-3 inline-block mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <User className="h-6 w-6 text-leadhustle-blue" />,
      title: "Lead Management",
      description: "Organize your leads with custom statuses, tags, and notes to keep track of every relationship."
    },
    {
      icon: <Calendar className="h-6 w-6 text-leadhustle-blue" />,
      title: "Follow-up Reminders",
      description: "Never miss a follow-up with automated reminders and scheduling for timely outreach."
    },
    {
      icon: <Send className="h-6 w-6 text-leadhustle-blue" />,
      title: "Outreach Templates",
      description: "Save time with customizable templates for emails, messages, and scripts."
    },
    {
      icon: <BarChart className="h-6 w-6 text-leadhustle-blue" />,
      title: "Performance Analytics",
      description: "Track your conversion rates and see which outreach strategies bring the best results."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Features Built for Closers</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to streamline your outreach process and convert more leads into clients.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="/features" className="inline-block bg-leadhustle-blue hover:bg-leadhustle-darkBlue text-white font-semibold py-3 px-8 rounded-md transition-colors">
            Explore All Features
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;
