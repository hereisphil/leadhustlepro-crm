
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { Star } from 'lucide-react';

const TestimonialsPage = () => {
  const testimonials = [
    {
      content: "As someone who juggles multiple marketing campaigns, this tool has been a game-changer. The automated reminders ensure no lead slips through the cracks.",
      name: "James Wilson",
      title: "Marketing Consultant",
      avatar: "public/lovable-uploads/42bf547e-aaf0-46de-b971-dcccf1e6643b.png",
      rating: 5
    },
    {
      content: "I've increased my response rate by 37% since using LeadHustle's templates and follow-up system. Worth every penny!",
      name: "Sarah Johnson",
      title: "Affiliate Marketer",
      avatar: "public/lovable-uploads/d54efe68-aef4-47c8-a0dc-5f0bf55e4a36.png",
      rating: 5
    },
    {
      content: "The interface is so intuitive that I was able to get my entire team onboarded in less than an hour. Great for non-technical users!",
      name: "Michael Rodriguez",
      title: "Sales Team Lead",
      avatar: "public/lovable-uploads/773f3e01-25f6-4407-98ca-397ef0114a98.png",
      rating: 5
    },
    {
      content: "Being able to track all my client communications in one place has saved me countless hours. I'm closing deals faster than ever.",
      name: "Emily Chang",
      title: "Freelance Consultant",
      avatar: "public/lovable-uploads/a5d92a76-8cbf-4047-9e29-39b27b4d6ac0.png",
      rating: 5
    },
    {
      content: "The template system alone has cut my outreach prep time by 70%. Now I can focus on relationship-building instead of repetitive tasks.",
      name: "David Martinez",
      title: "Network Marketer",
      avatar: "public/lovable-uploads/5c931b2a-a18f-4977-8aa2-f4802ad44d27.png",
      rating: 5
    },
    {
      content: "As a cold caller, keeping track of conversations used to be a nightmare. LeadHustle.pro simplified everything with its easy note-taking system.",
      name: "Jennifer Williams",
      title: "Sales Development Rep",
      avatar: "public/lovable-uploads/1d5bb1cd-d535-46b2-97ee-9ff6a2fc031b.png",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">What Our Customers Say</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it—hear from professionals who have transformed their outreach with LeadHustle.pro.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md p-8 flex flex-col"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gray-300" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic mb-6 flex-grow">"{testimonial.content}"</p>
                
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Customer Satisfaction</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-leadhustle-blue mb-2">98%</div>
                <p className="text-gray-600">Customer Satisfaction</p>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-leadhustle-blue mb-2">24h</div>
                <p className="text-gray-600">Average Response Time</p>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-leadhustle-blue mb-2">1,000+</div>
                <p className="text-gray-600">Active Users</p>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-leadhustle-blue mb-2">35%</div>
                <p className="text-gray-600">Average Productivity Increase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CTA />
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
