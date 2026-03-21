-- 1. Enable the net extension to allow webhooks
create extension if not exists pg_net;

-- 2. Create the function that triggers your Edge Function
create or replace function public.on_panorama_upload()
returns trigger as $$
begin
  perform
    net.http_post(
      url := 'https://your-project-id.supabase.co/functions/v1/enhance-panorama',
      headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer YOUR_ANON_KEY'),
      body := jsonb_build_object('record', row_to_json(new))
    );
  return new;
end;
$$ language plpgsql security definer;

-- 3. Attach the trigger to the storage table
create trigger panorama_upload_trigger
after insert on storage.objects
for each row execute function public.on_panorama_upload();