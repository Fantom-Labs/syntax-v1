
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, userId, chatHistory } = await req.json();
    
    // Create system message that describes the app's capabilities
    const systemMessage = `
You are an advanced AI assistant integrated into a personal productivity app. 
Your name is Lily, and you're designed to help users manage tasks, goals, habits, and more.

You have access to the following features in the app:
1. Tasks - help create, organize, and track daily tasks
2. Habits - assist in building positive habits and tracking progress
3. Goals - help set and track short, medium, and long-term goals
4. Books - recommend and track reading progress
5. Notes - help organize thoughts and information
6. Daily Routine - assist in planning and optimizing daily schedules

When the user wants to create/update/delete any of these items, respond with both:
1. A helpful, empathetic message
2. A structured command that the app will interpret

Command format examples:
- To add a task: [[ADD_TASK: {title: "Example task"}]]
- To add a goal: [[ADD_GOAL: {title: "Example goal", period: "short"}]]
- To add a habit: [[ADD_HABIT: {title: "Exercise daily", type: "build"}]]
- To add a note: [[ADD_NOTE: {title: "Meeting notes", content: "Discussion points..."}]]
- To add a book: [[ADD_BOOK: {title: "Book title", author: "Author name"}]]

For updates and deletions, use similar format with UPDATE_ or DELETE_ prefixes and include the item's id when available.

Remember to maintain a friendly, helpful tone like a personal assistant would. You're here to make the user's life easier by helping them organize their productivity system.
`;
    
    // Prepare conversation history
    const messages = [
      { role: "system", content: systemMessage },
      ...chatHistory,
      { role: "user", content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API request failed');
    }

    return new Response(JSON.stringify({
      content: data.choices[0].message.content,
      role: "assistant"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in assistant-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
