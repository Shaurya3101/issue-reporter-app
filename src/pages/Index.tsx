import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReportForm from "@/components/ReportForm";
import Footer from "@/components/Footer";

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
      {showReportForm && (
        <div id="report-form">
          <ReportForm />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;
