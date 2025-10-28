import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eppscbqkcdnxnguyjypo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwcHNjYnFrY2RueG5ndXlqeXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTQ0OTUsImV4cCI6MjA3NTc3MDQ5NX0.eqve6kYXEfpQZt62zANQy9jRS7NJPGwR6KFVd2jOq8I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

