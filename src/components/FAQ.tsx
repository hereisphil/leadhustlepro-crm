
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full p-4 text-left"
      >
        <h3 className="text-lg font-medium">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does LeadHustle.pro help me save time?",
      answer: "LeadHustle.pro automates repetitive tasks like follow-ups, offers customizable templates, and gives you a central place to manage all your leads and interactions, eliminating the need to switch between multiple tools or spreadsheets."
    },
    {
      question: "Do I need technical skills to use LeadHustle.pro?",
      answer: "Not at all! We've designed LeadHustle.pro to be incredibly user-friendly. You don't need any technical background or special training to get started and see results right away."
    },
    {
      question: "Can I import my existing leads and contacts?",
      answer: "Yes! We support easy importing of your leads from CSV files, Google Sheets, Excel, and many popular CRM and email marketing platforms. Our import wizard will guide you through the entire process."
    },
    {
      question: "Is my data secure on LeadHustle.pro?",
      answer: "Absolutely. We use bank-level encryption to protect your data both in transit and at rest. We never sell your data or contacts, and you remain the sole owner of all information you store on our platform."
    },
    {
      question: "What if I need help getting started?",
      answer: "We offer comprehensive onboarding resources including video tutorials, documentation, and webinars. Plus, our customer support team is available via live chat and email to answer any questions you have along the way."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to common questions about LeadHustle.pro and how it can help your business.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <p className="mb-4 text-gray-600">Still have questions? We're here to help!</p>
          <a
            href="/contact"
            className="inline-block bg-leadhustle-blue hover:bg-leadhustle-darkBlue text-white font-semibold py-3 px-8 rounded-md transition-colors"
          >
            Contact Our Support Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
