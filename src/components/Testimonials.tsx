
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "As someone who juggles multiple marketing campaigns, this tool has been a game-changer. The automated reminders ensure no lead slips through the cracks.",
    name: "James Wilson",
    title: "Marketing Consultant",
    avatar: "public/lovable-uploads/42bf547e-aaf0-46de-b971-dcccf1e6643b.png"
  },
  {
    id: 2,
    content: "I've increased my response rate by 37% since using LeadHustle's templates and follow-up system. Worth every penny!",
    name: "Sarah Johnson",
    title: "Affiliate Marketer",
    avatar: "public/lovable-uploads/d54efe68-aef4-47c8-a0dc-5f0bf55e4a36.png"
  },
  {
    id: 3,
    content: "The interface is so intuitive that I was able to get my entire team onboarded in less than an hour. Great for non-technical users!",
    name: "Michael Rodriguez",
    title: "Sales Team Lead",
    avatar: "public/lovable-uploads/773f3e01-25f6-4407-98ca-397ef0114a98.png"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it—hear from professionals who have transformed their outreach with LeadHustle.pro.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex flex-col items-center mb-8">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-gray-700 italic text-center mb-6">
                "{testimonials[currentIndex].content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                  <p className="text-gray-500">{testimonials[currentIndex].title}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
            <button 
              onClick={handlePrev}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
            <button 
              onClick={handleNext}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === currentIndex ? "bg-leadhustle-blue" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
