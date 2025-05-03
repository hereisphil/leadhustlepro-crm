
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTA from '@/components/CTA';
import { User, Calendar, Send, BarChart, Tag, MessageSquare, FileText, Settings, Database } from "lucide-react";

const FeaturePage = () => {
  const features = [
    {
      icon: <User className="h-8 w-8 text-leadhustle-blue" />,
      title: "Lead Management",
      description: "Organize your leads with custom statuses, tags, and notes to keep track of every relationship.",
      details: [
        "Custom lead stages and pipelines",
        "Detailed contact profiles",
        "Lead scoring and prioritization",
        "Custom fields and categorization",
        "Bulk lead management tools"
      ]
    },
    {
      icon: <Calendar className="h-8 w-8 text-leadhustle-blue" />,
      title: "Follow-up Reminders",
      description: "Never miss a follow-up with automated reminders and scheduling for timely outreach.",
      details: [
        "Automated follow-up sequences",
        "Calendar integration",
        "Task management system",
        "Time zone intelligence",
        "Recurring task scheduling"
      ]
    },
    {
      icon: <Send className="h-8 w-8 text-leadhustle-blue" />,
      title: "Outreach Templates",
      description: "Save time with customizable templates for emails, messages, and scripts.",
      details: [
        "Customizable email templates",
        "Message personalization",
        "Saved responses library",
        "A/B testing capabilities",
        "Template performance metrics"
      ]
    },
    {
      icon: <BarChart className="h-8 w-8 text-leadhustle-blue" />,
      title: "Performance Analytics",
      description: "Track your conversion rates and see which outreach strategies bring the best results.",
      details: [
        "Conversion tracking",
        "Campaign performance metrics",
        "Custom reporting tools",
        "Goal setting and monitoring",
        "Data visualization dashboards"
      ]
    },
    {
      icon: <Tag className="h-8 w-8 text-leadhustle-blue" />,
      title: "Tag & Segment System",
      description: "Organize contacts with custom tags and create targeted segments for personalized outreach.",
      details: [
        "Custom tagging system",
        "Dynamic segmentation",
        "Automated tagging rules",
        "Target audience building",
        "Saved segment templates"
      ]
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-leadhustle-blue" />,
      title: "Conversation Tracking",
      description: "Keep all your communications in one place with integrated conversation history.",
      details: [
        "Email thread integration",
        "SMS conversation tracking",
        "Call logs and recordings",
        "Interaction timelines",
        "Notes and follow-up reminders"
      ]
    },
    {
      icon: <FileText className="h-8 w-8 text-leadhustle-blue" />,
      title: "Document Management",
      description: "Store and manage all your sales documents, proposals, and contracts in one secure location.",
      details: [
        "Document storage and organization",
        "Template library for proposals",
        "E-signature capabilities",
        "Version control system",
        "Document tracking and analytics"
      ]
    },
    {
      icon: <Settings className="h-8 w-8 text-leadhustle-blue" />,
      title: "Workflow Automation",
      description: "Set up custom workflows to automate repetitive tasks and keep your leads moving through the pipeline.",
      details: [
        "Customizable automation rules",
        "Trigger-based actions",
        "Multi-step workflows",
        "Integration with other tools",
        "Notification system"
      ]
    },
    {
      icon: <Database className="h-8 w-8 text-leadhustle-blue" />,
      title: "Data Import & Export",
      description: "Easily import existing leads and export your data whenever you need it.",
      details: [
        "CSV/Excel import capabilities",
        "Data mapping tools",
        "Duplicate detection",
        "Scheduled data exports",
        "Third-party integration support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">All Features</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the complete set of tools designed to help freelancers and marketers 
              streamline their outreach process and close more deals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="bg-blue-100 rounded-full p-3 inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-5">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-leadhustle-blue font-bold mr-2">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <CTA />
      <Footer />
    </div>
  );
};

export default FeaturePage;
