
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Maximize2, Minimize2 } from 'lucide-react';
import { AssistantChat } from './AssistantChat';
import { Card } from '@/components/ui/card';

export const HomeAssistant = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }
  
  return (
    <div className={`transition-all duration-300 ${isExpanded ? 'fixed inset-8 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center' : 'w-full'}`}>
      <Card className={`relative rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'w-full max-w-4xl h-[80vh]' : 'w-full'}`}>
        {isExpanded && (
          <div className="absolute top-4 right-4 z-10">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsExpanded(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {!isExpanded && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsExpanded(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <AssistantChat onClose={isExpanded ? () => setIsExpanded(false) : undefined} />
      </Card>
    </div>
  );
};
