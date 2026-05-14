import { insforgeClient } from './insforge-client';
import { ServiceResponse } from './types';

export async function signUp(
  email: string,
  password: string
): Promise<ServiceResponse> {
  try {
    const { data, error } = await insforgeClient.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return {
      data: null,
      error: { message: error.message || 'Failed to sign up' },
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<ServiceResponse> {
  try {
    const { data, error } = await insforgeClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return {
      data: null,
      error: { message: error.message || 'Invalid credentials' },
    };
  }
}

export async function signOut(): Promise<ServiceResponse> {
  try {
    const { error } = await insforgeClient.auth.signOut();
    if (error) throw error;
    return { data: null, error: null };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return {
      data: null,
      error: { message: error.message || 'Failed to sign out' },
    };
  }
}

/**
 * Get current user using getSession() - more compatible with InsForge
 */
export async function getCurrentUser(): Promise<ServiceResponse> {
  try {
    const { data: { session }, error } = await insforgeClient.auth.getSession();

    if (error) throw error;

    return { 
      data: session?.user || null, 
      error: null 
    };
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return {
      data: null,
      error: { message: error.message || 'Failed to get current user' },
    };
  }
}

export async function resetPassword(email: string): Promise<ServiceResponse> {
  try {
    const { error } = await insforgeClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`,
    });

    if (error) throw error;

    return { data: { message: 'Reset password email sent' }, error: null };
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return {
      data: null,
      error: { message: error.message || 'Failed to send reset email' },
    };
  }
}