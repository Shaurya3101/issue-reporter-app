import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-civic-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Report2Resolve</h1>
              <p className="text-sm text-muted-foreground">Official Civic Issue Reporting</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Track Report
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;