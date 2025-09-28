import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Camera, MapPin, Shield } from "lucide-react";

interface HeroProps {
  onReportClick: () => void;
}

const Hero = ({ onReportClick }: HeroProps) => {
  return (
    <section className="bg-gradient-hero text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Report Civic Issues Directly to Indian Government
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Help improve your community by reporting infrastructure problems, 
            safety concerns, and public service issues with photos and precise locations.
          </p>
          <Button 
            onClick={onReportClick}
            size="lg" 
            className="bg-white text-civic-primary hover:bg-white/90 shadow-button text-lg px-8 py-6"
          >
            <AlertTriangle className="mr-2 h-5 w-5" />
            Report an Issue
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <Camera className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Photo Evidence</h3>
            <p className="text-white/80">Upload photos or videos to document the issue clearly</p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <MapPin className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Precise Location</h3>
            <p className="text-white/80">Pin the exact location for faster response times</p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <Shield className="h-8 w-8 text-white mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Direct to Government</h3>
            <p className="text-white/80">Reports go straight to the relevant government department</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;