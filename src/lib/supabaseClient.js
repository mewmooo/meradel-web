import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://skzkhrhflrubmbzfwdsg.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNremtocmhmbHJ1Ym1iemZ3ZHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDMwNzQsImV4cCI6MjEwODYxOTA3NH0.73HDkw1UZUlDsDSAgeuHU_ErtkveudaA93LESoxHxKw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
