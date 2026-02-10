import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim?.();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim?.();

let supabase;

if (url && anonKey) {
  supabase = createClient(url, anonKey);
} else {
  // No-op client when Supabase is not configured — app runs without auth/persistence
  const noop = () => {};
  const emptySub = { unsubscribe: noop };
  const resolveEmpty = (v = null) => Promise.resolve({ data: v, error: null });
  const rejectNotConfigured = () =>
    Promise.reject(new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable."));

  const chain = (out = { data: null, error: null }) => ({
    select: () => chain(out),
    insert: () => ({ select: () => ({ single: () => rejectNotConfigured() }) }),
    update: () => ({ eq: () => resolveEmpty() }),
    delete: () => ({ eq: () => resolveEmpty() }),
    eq: () => chain(out),
    order: () => chain({ data: [], error: null }),
    single: () => resolveEmpty(null),
    then: (fn) => Promise.resolve(out).then((r) => fn(r)),
  });

  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: emptySub } }),
      signInWithPassword: rejectNotConfigured,
      signUp: rejectNotConfigured,
      signOut: () => Promise.resolve(),
      getUser: () => Promise.resolve({ data: { user: null } }),
    },
    from: () => chain({ data: [], error: null }),
    rpc: () => rejectNotConfigured,
    channel: () => ({
      on: () => ({ subscribe: noop }),
    }),
    removeChannel: noop,
  };
}

export { supabase };
