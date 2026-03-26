import { createClient } from "@supabase/supabase-js";

// Substitua pelas suas chaves do Supabase
const supabaseUrl = "https://cpgrbwzixftisqwoeeju.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZ3Jid3ppeGZ0aXNxd29lZWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTc3MzYsImV4cCI6MjA5MDA3MzczNn0.b3T9jFluAlNn1nPoYIu7ntap36_m8ARK6lTBjYXx8yA";

export const supabase = createClient(supabaseUrl, supabaseKey);
