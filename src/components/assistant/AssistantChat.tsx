
import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useProcessAssistantCommands } from './useProcessAssistantCommands';

type Message = {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

interface AssistantChatProps {
  onClose?: () => void;
}

export const AssistantChat = ({ onClose }: AssistantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { processCommands } = useProcessAssistantCommands();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Check for user session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
      
      // Add initial welcome message
      if (messages.length === 0) {
        setMessages([
          {
            content: "Hello! I'm Lily, your personal assistant. I can help you with tasks, goals, habits, and more. How can I help you today?",
            role: "assistant",
            timestamp: new Date()
          }
        ]);
      }
    };
    
    getUser();
  }, []);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      content: input,
      role: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Format chat history for the API
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('assistant-chat', {
        body: { message: input, userId, chatHistory }
      });
      
      if (error) throw new Error(error.message);
      
      const assistantMessage = {
        content: data.content,
        role: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Process any commands in the assistant's response
      if (data.content) {
        await processCommands(data.content);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response from the assistant');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="flex flex-col h-[600px] w-full bg-card border-2 shadow-lg relative max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          Chat with Lily
        </h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-3 ${
                message.role === 'assistant' 
                  ? 'bg-muted/50 rounded-lg p-3' 
                  : ''
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {message.role === 'assistant' ? (
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString(undefined, { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};
