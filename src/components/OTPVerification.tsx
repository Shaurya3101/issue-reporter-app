import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, Lock } from "lucide-react";

interface OTPVerificationProps {
  phoneNumber?: string;
  onVerificationComplete: (verified: boolean) => void;
  onClose: () => void;
}

const OTPVerification = ({ phoneNumber, onVerificationComplete, onClose }: OTPVerificationProps) => {
  const [phone, setPhone] = useState(phoneNumber || "");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const sendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsOtpSent(true);
      setCountdown(60);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified",
        });
        onVerificationComplete(true);
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      onVerificationComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = () => {
    if (countdown === 0) {
      sendOTP();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isOtpSent ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={sendOTP} 
                  disabled={isLoading || !phone}
                  className="flex-1"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-2">
                <Lock className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to {phone}
                </p>
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="text-center text-lg tracking-wider"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={verifyOTP} 
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resendOTP}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `Resend (${countdown}s)` : "Resend"}
                </Button>
              </div>
              <Button variant="ghost" onClick={onClose} className="w-full">
                Cancel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;