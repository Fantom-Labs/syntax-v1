import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, language, limit = 40 } = await req.json()
    const langParam = language ? `&langRestrict=${language}` : ''
    
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}${langParam}&maxResults=${limit}&orderBy=relevance&printType=books`
    )
    
    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    const books = data.items?.map((item: any) => ({
      google_books_id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown',
      cover_url: item.volumeInfo.imageLinks?.thumbnail || null,
      language: item.volumeInfo.language,
      description: item.volumeInfo.description,
      publishedDate: item.volumeInfo.publishedDate,
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories,
    })) || []

    return new Response(
      JSON.stringify({ books }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        }, 
        status: 500 
      }
    )
  }
})