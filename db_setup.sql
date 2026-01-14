-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.family_members (
    id,
    email,
    full_name,
    age,
    family_branch,
    employment_status,
    marital_status,
    graduate_status,
    location,
    address,
    phone_number,
    photo_url
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'age')::int,
    new.raw_user_meta_data->>'family_branch',
    new.raw_user_meta_data->>'employment_status',
    new.raw_user_meta_data->>'marital_status',
    new.raw_user_meta_data->>'graduate_status',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'photo_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
