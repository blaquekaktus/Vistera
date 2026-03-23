// supabase/functions/enhance-panorama/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

Deno.serve(async (req) => {
  // Extract the data sent by the SQL Trigger
  const { record } = await req.json() 
  
  // Construct the public URL of the uploaded image
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/panoramas/${record.name}`

  // Call Replicate AI
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${Deno.env.get("REPLICATE_API_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "74b6f01a3420473...", // A real-estate upscaler model
      input: { image: imageUrl },
      // CRITICAL: Tell AI where to send the result when finished
      webhook: `${Deno.env.get('SITE_URL')}/api/replicate-webhook`, 
      webhook_events_filter: ["completed"]
    }),
  })

  return new Response(JSON.stringify({ status: 'sent_to_ai' }))
})