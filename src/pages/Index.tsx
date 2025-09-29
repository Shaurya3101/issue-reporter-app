import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReportForm from "@/components/ReportForm";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import VoiceGuide from "@/components/VoiceGuide";

const Index = () => {
  const [showReportForm, setShowReportForm] = useState(false);

  const scrollToForm = () => {
    setShowReportForm(true);
    setTimeout(() => {
      document.getElementById('report-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero onReportClick={scrollToForm} />
      
      {/* Voice Guide for Hero Section */}
      <div className="container mx-auto px-4 py-6">
        <VoiceGuide 
          text="Welcome to Report to Resolve, your platform for reporting civic issues. Click the Report an Issue button to start filing a complaint, or use the chatbot for assistance with civic services."
          title="How to use this platform"
          className="max-w-4xl mx-auto"
        />
      </div>

      {showReportForm && (
        <div id="report-form">
          <div className="container mx-auto px-4 pb-6">
            <VoiceGuide 
              text="Fill out this form with details about your civic issue. Provide a clear description, select the appropriate category, add your location, and optionally attach photos. All fields marked with an asterisk are required."
              title="How to fill the report form"
              className="max-w-4xl mx-auto mb-6"
            />
          </div>
          <ReportForm />
        </div>
      )}
      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
