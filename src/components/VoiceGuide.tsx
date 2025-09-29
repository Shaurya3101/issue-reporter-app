import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface VoiceGuideProps {
  text: string;
  title?: string;
  className?: string;
}

const VoiceGuide = ({ text, title = "Listen to explanation", className = "" }: VoiceGuideProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const startSpeaking = () => {
    if (isPlaying && utterance) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setUtterance(null);
      return;
    }

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 0.8;
    newUtterance.pitch = 1;
    newUtterance.volume = 0.8;
    
    newUtterance.onstart = () => setIsPlaying(true);
    newUtterance.onend = () => {
      setIsPlaying(false);
      setUtterance(null);
    };
    newUtterance.onerror = () => {
      setIsPlaying(false);
      setUtterance(null);
    };

    setUtterance(newUtterance);
    speechSynthesis.speak(newUtterance);
  };

  return (
    <Card className={`bg-accent/50 border-accent ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">{title}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={startSpeaking}
            className="bg-background/50"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Play
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceGuide;