'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles, Upload, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const invite = searchParams.get('invite');
  const validInvite = invite === process.env.NEXT_PUBLIC_FAMILY_INVITE_TOKEN;

  const [form, setForm] = useState({
    full_name: '',
    age: '',
    family_branch: '',
    employment_status: '',
    marital_status: '',
    graduate_status: '',
    location: '',
    address: '',
    phone_number: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!validInvite) {
      router.replace('/not-authorized');
    }
  }, [validInvite, router]);

  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!form.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) newErrors.age = 'Enter a valid age';
    if (!form.family_branch.trim()) newErrors.family_branch = 'Family branch required';
    if (!form.employment_status) newErrors.employment_status = 'Select employment status';
    if (!form.marital_status) newErrors.marital_status = 'Select marital status';
    if (!form.graduate_status) newErrors.graduate_status = 'Select graduate status';
    if (!form.location.trim()) newErrors.location = 'Location required';
    if (!form.address.trim()) newErrors.address = 'Address required';
    if (!form.phone_number.trim() || !/^\+?\d{7,15}$/.test(form.phone_number)) newErrors.phone_number = 'Enter a valid phone number';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (form.photo && !form.photo.type.startsWith('image/')) newErrors.photo = 'File must be an image';
    if (form.photo && form.photo.size > 2 * 1024 * 1024) newErrors.photo = 'Image must be < 2MB';

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);

    try {
      let photo_url = '';

      if (form.photo) {
        const fileExt = form.photo.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(filePath, form.photo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
        photo_url = data.publicUrl;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            age: Number(form.age),
            family_branch: form.family_branch,
            employment_status: form.employment_status,
            marital_status: form.marital_status,
            graduate_status: form.graduate_status,
            location: form.location,
            address: form.address,
            phone_number: form.phone_number,
            photo_url,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from('family_members').upsert({
          id: authData.user.id,
          email: form.email,
          full_name: form.full_name,
          age: Number(form.age),
          family_branch: form.family_branch,
          employment_status: form.employment_status,
          marital_status: form.marital_status,
          graduate_status: form.graduate_status,
          location: form.location,
          address: form.address,
          phone_number: form.phone_number,
          photo_url,
        });

        if (profileError) throw profileError;
      }

      toast.success('Registration successful. Check your email to verify your account.');

      if (authData.session) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!validInvite) return null;

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <section className="app-surface relative mx-auto min-h-[calc(100vh-3rem)] w-full max-w-7xl overflow-hidden rounded-[2rem]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="absolute right-10 top-0 h-80 w-80 rounded-full bg-amber-400/15 blur-3xl" />
        </div>

        <div className="relative grid lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="flex flex-col justify-between bg-slate-950 px-8 py-8 text-white md:px-10 md:py-10">
            <div className="space-y-8">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white">
                <ShieldCheck size={18} /> Already registered? Login
              </Link>

              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
                  <Sparkles size={16} className="text-teal-300" /> Invite-only registration
                </div>
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  Join the family with a cleaner, more guided form.
                </h1>
                <p className="text-base leading-7 text-white/70 md:text-lg">
                  Add your profile details, upload a photo, and enter the family directory in one calm flow.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/55">Secure invite</p>
                <p className="mt-2 text-xl font-semibold">Token required</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/55">Upload</p>
                <p className="mt-2 text-xl font-semibold">Profile photo support</p>
              </div>
            </div>
          </aside>

          <div className="px-6 py-8 md:px-10 md:py-10">
            <div className="app-card rounded-[2rem] p-6 md:p-8">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Register</h2>
                <p className="mt-2 text-slate-500">Fill out your details to join the family directory.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {Object.values(errors).length > 0 && (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                    Please fix the highlighted fields before continuing.
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Full Name" error={errors.full_name}>
                    <input type="text" name="full_name" placeholder="John Doe" value={form.full_name} onChange={handleChange} className="app-input" />
                  </Field>
                  <Field label="Age" error={errors.age}>
                    <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} className="app-input" />
                  </Field>
                  <Field label="Family Branch" error={errors.family_branch}>
                    <input type="text" name="family_branch" placeholder="Family Branch" value={form.family_branch} onChange={handleChange} className="app-input" />
                  </Field>
                  <Field label="Location" error={errors.location}>
                    <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="app-input" />
                  </Field>
                  <Field label="Phone Number" error={errors.phone_number}>
                    <input type="tel" name="phone_number" placeholder="Phone Number" value={form.phone_number} onChange={handleChange} className="app-input" />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="app-input" />
                  </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Employment Status" error={errors.employment_status}>
                    <select name="employment_status" value={form.employment_status} onChange={handleChange} className="app-input">
                      <option value="">Employment Status</option>
                      <option value="Business">Business</option>
                      <option value="Employed">Employed</option>
                      <option value="Student">Student</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </Field>
                  <Field label="Marital Status" error={errors.marital_status}>
                    <select name="marital_status" value={form.marital_status} onChange={handleChange} className="app-input">
                      <option value="">Marital Status</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Married">Married</option>
                      <option value="Single">Single</option>
                    </select>
                  </Field>
                  <Field label="Graduate Status" error={errors.graduate_status}>
                    <select name="graduate_status" value={form.graduate_status} onChange={handleChange} className="app-input">
                      <option value="">Graduate Status</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Skilled">Skilled</option>
                      <option value="Non-Graduate">Under-Graduate</option>
                    </select>
                  </Field>
                </div>

                <Field label="Address" error={errors.address}>
                  <input type="text" name="address" placeholder="Street address" value={form.address} onChange={handleChange} className="app-input" />
                </Field>

                <Field label="Profile Photo" error={errors.photo}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition hover:border-teal-300 hover:bg-teal-50/40">
                    <Upload size={18} className="text-teal-700" />
                    <span>{form.photo ? form.photo.name : 'Choose an image file under 2MB'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                  </label>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Password" error={errors.password}>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={form.password} onChange={handleChange} className="app-input pr-12" />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-slate-100">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm Password" error={errors.confirmPassword}>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="app-input" />
                  </Field>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Password strength</p>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${form.password.length >= 10 ? 'w-full bg-emerald-500' : form.password.length >= 8 ? 'w-3/4 bg-teal-500' : form.password.length >= 6 ? 'w-1/2 bg-amber-500' : 'w-1/4 bg-rose-500'}`} />
                  </div>
                  <p className="text-xs text-slate-500">Use 8+ characters with a mix of letters and numbers.</p>
                </div>

                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="app-button-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}