/* Public browser config for KORZH FAN.
   The publishable key is intentionally client-side. Security comes from Supabase Auth + RLS.
   NEVER put a Supabase secret/service-role key in this file. */
window.KORZH_SUPABASE = {
  url: 'https://ewcgfdlxgukxuqitcqlv.supabase.co',
  publishableKey: 'sb_publishable_sT__AePAgVee97eDWIBtEw_DTFmiA7O'
};

(function () {
  if (!window.supabase || !window.KORZH_SUPABASE) return;
  window.korzhSupabase = window.supabase.createClient(
    window.KORZH_SUPABASE.url,
    window.KORZH_SUPABASE.publishableKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
})();
