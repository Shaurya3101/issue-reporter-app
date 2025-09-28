import { Shield, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-civic-primary" />
              <span className="font-bold text-lg">Report2Resolve</span>
            </div>
            <p className="text-muted-foreground mb-4">
              An official platform for reporting civic issues directly to government authorities.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-civic-primary transition-colors">Track Your Report</a></li>
              <li><a href="#" className="hover:text-civic-primary transition-colors">Report Status</a></li>
              <li><a href="#" className="hover:text-civic-primary transition-colors">Emergency Services</a></li>
              <li><a href="#" className="hover:text-civic-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>100 (Police Emergency)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>108 (Emergency Services)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>1950 (Citizen Helpline)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@report2resolve.gov.in</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Report2Resolve. Official Government of India Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;