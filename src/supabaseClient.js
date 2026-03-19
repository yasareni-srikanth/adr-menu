import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://eomwhrxdgczsafqblhpd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbXdocnhkZ2N6c2FmcWJsaHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NzI5MjEsImV4cCI6MjA4OTA0ODkyMX0.SUifXShtnKcIwGGp5KaNau876PR0tMHQz2l9szokjwM";

export const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase client created in supabaseClient.js");
