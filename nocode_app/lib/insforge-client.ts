import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL?.trim();
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY?.trim();

if (!insforgeUrl) {
  throw new Error('NEXT_PUBLIC_INSFORGE_URL environment variable is missing');
}

if (!insforgeAnonKey) {
  throw new Error('NEXT_PUBLIC_INSFORGE_ANON_KEY environment variable is missing');
}

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('✅ InsForge Client initialized successfully');
  console.log('URL:', insforgeUrl);
  console.log('Anon Key:', insforgeAnonKey.slice(0, 15) + '...');
}

export const insforgeClient = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey,
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});