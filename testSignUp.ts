
import { supabase } from './lib/supabaseClient';

async function testSignUpWithMetadata() {
    const email = `test_meta_${Date.now()}@example.com`;
    const password = 'password123';

    console.log('Attempting signup with metadata:', email);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Trigger Test User',
                age: 25,
                family_branch: 'Test Branch',
                employment_status: 'Test Employed',
                marital_status: 'Single',
                graduate_status: 'Graduate',
                location: 'Test City',
                address: '123 Test St',
                phone_number: '1234567890',
                photo_url: '',
            }
        }
    });

    if (error) {
        console.error('Signup error:', error.message);
        return;
    }

    console.log('User created:', data.user?.id);

    // Wait a bit for the trigger to fire
    console.log('Waiting for trigger...');
    await new Promise(r => setTimeout(r, 2000));

    // Check if profile exists
    if (data.user?.id) {
        // We might not be able to read it if RLS blocks us and we have no session.
        // But we can try (or use the service role key if we had it, but we don't).
        // However, if the public policy exists, we should be able to read.

        const { data: profile, error: fetchError } = await supabase
            .from('family_members')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (fetchError) {
            console.error('Could not fetch profile (might be RLS or trigger failed):', fetchError.message);
        } else {
            console.log('Profile found automatically created by trigger:', profile);
        }
    }
}

testSignUpWithMetadata();
