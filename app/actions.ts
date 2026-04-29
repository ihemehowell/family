'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { profileSchema, type ProfileFormData } from '@/lib/validations';

export async function updateProfile(formData: ProfileFormData) {
  const supabase = createClient();
  
  // Validate form data
  const validation = profileSchema.safeParse(formData);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Invalid profile data' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('family_members')
    .update({
      full_name: formData.full_name,
      age: formData.age,
      family_branch: formData.family_branch,
      employment_status: formData.employment_status,
      marital_status: formData.marital_status,
      graduate_status: formData.graduate_status,
      location: formData.location,
      address: formData.address,
      phone_number: formData.phone_number,
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  // Log activity
  await supabase.rpc('log_activity', {
    p_user_id: user.id,
    p_action: 'update',
    p_table_name: 'family_members',
    p_record_id: user.id,
  });

  revalidatePath('/dashboard');
  revalidatePath('/profile');
  revalidatePath('/table');
  
  return { success: true };
}

export async function updateAvatar(photoUrl: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('family_members')
    .update({ photo_url: photoUrl })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/profile');
  
  return { success: true };
}

export async function requestPasswordReset(email: string) {
  const supabase = createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resendVerificationEmail() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'No user session' };
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email!,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}