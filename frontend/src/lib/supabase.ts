export function createSupabaseBrowserClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
    }),
  };
}

export function createSupabaseServerClient() {
  return createSupabaseBrowserClient();
}
