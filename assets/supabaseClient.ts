// supabaseClient.ts
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqzxwxygrgwhcjunmaeb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxenh3eHlncmd3aGNqdW5tYWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzE1ODcsImV4cCI6MjA3NDQ0NzU4N30.HyKNAweK1iVXGYPbFg8HCtu5Uic9i2PISEWlTZOjpuY'; //  anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
