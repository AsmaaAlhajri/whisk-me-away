/* ============================================================
   supabase.js - the connection to our database

   These two values are meant to be public: the publishable key
   only ever grants what Row Level Security allows, and every
   table is locked to `auth.uid()`, so a signed-in customer can
   reach their own rows and nobody else's. The secret service
   key is NOT here and must never be put in front-end code.
   ============================================================ */
const SUPABASE_URL = 'https://evusdtrixeynrbgfyqxp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_v0sRHGMIAPgze1WUZMhQVg_BDV75YnT';

/* the CDN script exposes window.supabase; this is our client */
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
