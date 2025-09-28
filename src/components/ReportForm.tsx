import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload, X, MapPin, AlertCircle } from "lucide-react";

const ReportForm = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    if (files) {
      const newFiles = Array.from(files).filter((_, i) => i !== index);
      const dataTransfer = new DataTransfer();
      newFiles.forEach(file => dataTransfer.items.add(file));
      setFiles(dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Report Submitted Successfully",
      description: "Your civic issue report has been forwarded to the relevant government department. You'll receive a tracking number via email.",
    });

    setIsSubmitting(false);
    // Reset form would go here
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-civic">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-civic-primary">Submit a Civic Issue Report</CardTitle>
            <CardDescription>
              Provide details about the issue you'd like to report to government authorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of issue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roads">Roads & Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities (Water, Power, Gas)</SelectItem>
                    <SelectItem value="waste">Waste Management</SelectItem>
                    <SelectItem value="safety">Public Safety</SelectItem>
                    <SelectItem value="parks">Parks & Recreation</SelectItem>
                    <SelectItem value="housing">Housing & Building Codes</SelectItem>
                    <SelectItem value="noise">Noise Complaints</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <Input
                    id="location"
                    placeholder="Enter the address or location of the issue"
                    required
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Issue Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail. Include any relevant information that would help government officials understand and address the problem."
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">Photos/Videos</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload photos or videos of the issue (Max 20MB per file)
                  </p>
                  <Input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('photos')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
                
                {files && Array.from(files).length > 0 && (
                  <div className="space-y-2">
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input id="name" placeholder="Full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" />
              </div>

              <div className="bg-civic-info/10 border border-civic-info/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-civic-info mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-civic-info mb-1">Important Information</p>
                    <p className="text-muted-foreground">
                      Your report will be forwarded to the appropriate government department. 
                      You'll receive a tracking number and updates via email. For emergencies, 
                      please call 100 (Police), 108 (Emergency Services), or 112 (National Emergency).
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 shadow-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting Report..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ReportForm;