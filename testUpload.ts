import { supabase } from './lib/supabaseClient';

async function testBucket() {
  try {
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;

    console.log('Buckets in this project:');
    buckets?.forEach((b) => console.log(b.name));

    // Try to upload a dummy file
    const file = new File(['hello world'], 'test.txt', { type: 'text/plain' });
    const bucketName = 'profile-photos';

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload('test.txt', file, { upsert: true });

    if (uploadError) throw uploadError;

    console.log('Upload success:', data);

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl('test.txt');
    console.log('Public URL:', urlData.publicUrl);
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

testBucket();
