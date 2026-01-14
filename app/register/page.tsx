'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const router = useRouter();

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

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!form.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120)
      newErrors.age = 'Enter a valid age';
    if (!form.family_branch.trim()) newErrors.family_branch = 'Family branch required';
    if (!form.employment_status) newErrors.employment_status = 'Select employment status';
    if (!form.marital_status) newErrors.marital_status = 'Select marital status';
    if (!form.graduate_status) newErrors.graduate_status = 'Select graduate status';
    if (!form.location.trim()) newErrors.location = 'Location required';
    if (!form.address.trim()) newErrors.address = 'Address required';
    if (!form.phone_number.trim() || !/^\+?\d{7,15}$/.test(form.phone_number))
      newErrors.phone_number = 'Enter a valid phone number';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (form.photo && !form.photo.type.startsWith('image/'))
      newErrors.photo = 'File must be an image';
    if (form.photo && form.photo.size > 2 * 1024 * 1024)
      newErrors.photo = 'Image must be < 2MB';

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

      // 1️⃣ Upload profile photo first (if possible), or handle later
      // NOTE: Without a session, RLS might block upload if policy requires auth.
      // Ideally, upload AFTER login or allow public uploads for a temp folder.
      // For now, we'll try to include the URL if the user manages to upload, 
      // otherwise this might fail if policies are strict. 
      // SKIPPING photo upload for initial registration to avoid RLS issues if email confirm is on.
      // You can implement "upload after login" logic later.

      // 2️⃣ Sign up with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            age: form.age,
            family_branch: form.family_branch,
            employment_status: form.employment_status,
            marital_status: form.marital_status,
            graduate_status: form.graduate_status,
            location: form.location,
            address: form.address,
            phone_number: form.phone_number,
            photo_url: photo_url, // empty for now
          }
        }
      });

      if (authError) throw authError;

      // 2.5 Manually insert into family_members to ensure data persistence
      // (in case the trigger fails or is missing)
      

      // 3️⃣ Redirect to dashboard (or email confirmation page)
      // Check if session exists (meaning auto-login worked)
      if (authData.session) {
        router.push('/dashboard');
      } else {
        alert('Registration successful! Please check your email to verify your account.');
        router.push('/login');
      }

    } catch (err: any) {
      alert(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {Object.values(errors).map(
          (err, i) =>
            err && (
              <p key={i} className="text-red-500 text-sm">
                {err}
              </p>
            )
        )}

        {/* Input fields */}
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="family_branch"
          placeholder="Family Branch"
          value={form.family_branch}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <select
          name="employment_status"
          value={form.employment_status}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="">Employment Status</option>
          <option value="Employed">Employed</option>
          <option value="Unemployed">Unemployed</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Student">Student</option>
          <option value="Retired">Retired</option>
        </select>

        <select
          name="marital_status"
          value={form.marital_status}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="">Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
        </select>

        <select
          name="graduate_status"
          value={form.graduate_status}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        >
          <option value="">Graduate Status</option>
          <option value="Graduate">Graduate</option>
          <option value="Non-Graduate">Non-Graduate</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded"
        />

        <input type="file" accept="image/*" onChange={handleFileChange}
          className='border rounded-3xl font-black text-sm p-3 w-[250px] cursor-pointer hover:bg-gray-100 transition'
        />

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full p-3 rounded text-white ${isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
