
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProcessAssistantCommands = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();
  
  const processCommands = async (content: string) => {
    setIsProcessing(true);
    
    try {
      // Extract commands from response - they are in format [[COMMAND: {json}]]
      const commandRegex = /\[\[(ADD|UPDATE|DELETE)_(\w+):\s*({.*?})\]\]/g;
      const matches = [...content.matchAll(commandRegex)];
      
      if (matches.length === 0) {
        return; // No commands found
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You need to be logged in to perform these actions');
        return;
      }
      
      const userId = userData.user.id;
      
      for (const match of matches) {
        const [_, action, type, jsonStr] = match;
        const data = JSON.parse(jsonStr);
        
        switch (`${action}_${type}`) {
          case 'ADD_TASK':
            await supabase
              .from('tasks')
              .insert([{ 
                title: data.title, 
                user_id: userId,
                completed: false,
                archived: false
              }]);
            toast.success('Task added successfully');
            break;
            
          case 'UPDATE_TASK':
            if (data.id) {
              await supabase
                .from('tasks')
                .update({ 
                  title: data.title,
                  completed: data.completed !== undefined ? data.completed : undefined 
                })
                .eq('id', data.id)
                .eq('user_id', userId);
              toast.success('Task updated successfully');
            }
            break;
            
          case 'DELETE_TASK':
            if (data.id) {
              await supabase
                .from('tasks')
                .delete()
                .eq('id', data.id)
                .eq('user_id', userId);
              toast.success('Task deleted successfully');
            }
            break;
            
          case 'ADD_GOAL':
            await supabase
              .from('goals')
              .insert([{ 
                title: data.title, 
                user_id: userId,
                period: data.period || 'short',
                completed: false
              }]);
            toast.success('Goal added successfully');
            break;
            
          case 'UPDATE_GOAL':
            if (data.id) {
              await supabase
                .from('goals')
                .update({ 
                  title: data.title,
                  period: data.period,
                  completed: data.completed !== undefined ? data.completed : undefined 
                })
                .eq('id', data.id)
                .eq('user_id', userId);
              toast.success('Goal updated successfully');
            }
            break;
            
          case 'DELETE_GOAL':
            if (data.id) {
              await supabase
                .from('goals')
                .delete()
                .eq('id', data.id)
                .eq('user_id', userId);
              toast.success('Goal deleted successfully');
            }
            break;
            
          case 'ADD_HABIT':
            await supabase
              .from('habits')
              .insert([{ 
                title: data.title, 
                user_id: userId,
                type: data.type || 'build',
                tracking_type: 'task',
                checks_per_day: data.checksPerDay || 1
              }]);
            toast.success('Habit added successfully');
            break;
          
          case 'ADD_NOTE':
            await supabase
              .from('notes')
              .insert([{ 
                title: data.title, 
                content: data.content,
                user_id: userId
              }]);
            toast.success('Note added successfully');
            break;
            
          case 'ADD_BOOK':
            // First check if book exists
            const { data: existingBook } = await supabase
              .from('books')
              .select('id')
              .eq('title', data.title)
              .maybeSingle();
              
            let bookId;
            
            if (existingBook) {
              bookId = existingBook.id;
            } else {
              // Create new book
              const { data: newBook } = await supabase
                .from('books')
                .insert([{
                  title: data.title,
                  author: data.author,
                  cover_url: data.coverUrl || null,
                  language: data.language || 'pt'
                }])
                .select('id')
                .single();
                
              bookId = newBook.id;
            }
            
            // Add to reading list
            await supabase
              .from('reading_list')
              .insert([{
                book_id: bookId,
                user_id: userId,
                status: 'to_read'
              }]);
              
            toast.success('Book added to your reading list');
            break;
            
          default:
            console.log(`Unknown command: ${action}_${type}`);
        }
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries();
      
    } catch (error) {
      console.error('Error processing commands:', error);
      toast.error('Failed to process assistant commands');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return { processCommands, isProcessing };
};
