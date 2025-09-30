import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Volume2, VolumeX, Mic, MicOff, MapPin, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OTPVerification from "./OTPVerification";
import { useLocation } from "@/hooks/useLocation";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your civic assistant with enhanced AI capabilities. I can help you with reporting issues, understanding government processes, navigating civic services, and provide location-based assistance. For secure interactions, I can verify your identity via OTP. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const { location, isLoading: locationLoading, getCurrentLocation } = useLocation();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add location context if available
    let messageWithContext = inputMessage;
    if (location) {
      messageWithContext += `\n\n[User's current location: ${location.address || `${location.latitude}, ${location.longitude}`}]`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: [
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: messageWithContext }
          ]
        }
      });

      if (error) throw error;

      // Handle streaming response
      if (data && data.body) {
        const reader = data.body.getReader();
        const decoder = new TextDecoder();
        let botResponse = "";
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "",
          isUser: false,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  botResponse += content;
                  setMessages(prev => prev.map(msg => 
                    msg.id === botMessage.id 
                      ? { ...msg, content: botResponse }
                      : msg
                  ));
                }
              } catch (e) {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
      } else {
        throw new Error("No response from AI service");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationRequest = async () => {
    try {
      const locationData = await getCurrentLocation();
      if (locationData) {
        const locationMessage: Message = {
          id: Date.now().toString(),
          content: `📍 Location detected: ${locationData.address || `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, locationMessage]);
      }
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Unable to get your location. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOTPVerification = () => {
    setShowOTPModal(true);
  };

  const onVerificationComplete = (verified: boolean) => {
    setIsVerified(verified);
    setShowOTPModal(false);
    
    if (verified) {
      const verificationMessage: Message = {
        id: Date.now().toString(),
        content: "🔐 Phone verification successful! You now have access to secure civic services and can file verified reports.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, verificationMessage]);
    }
  };

  const speakMessage = (text: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Civic Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {!message.isUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-6 p-1 text-xs"
                      onClick={() => speakMessage(message.content)}
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-3 w-3" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Action buttons */}
        <div className="flex gap-1 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocationRequest}
            disabled={locationLoading}
            className="flex-1 text-xs"
          >
            <MapPin className="h-3 w-3 mr-1" />
            {locationLoading ? "Getting..." : "Get Location"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOTPVerification}
            className={`flex-1 text-xs ${isVerified ? 'bg-green-50 border-green-200' : ''}`}
          >
            <Shield className="h-3 w-3 mr-1" />
            {isVerified ? "Verified" : "Verify OTP"}
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about civic services..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0"
              onClick={startListening}
              disabled={isLoading}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputMessage.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      
      {showOTPModal && (
        <OTPVerification
          onVerificationComplete={onVerificationComplete}
          onClose={() => setShowOTPModal(false)}
        />
      )}
    </Card>
  );
};

export default Chatbot;