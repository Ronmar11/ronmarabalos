-- =============================================================================
-- Register YOU as the site admin. Run once, after schema.sql.
--
-- 1. Supabase dashboard -> Authentication -> Users -> "Add user" -> "Create new user".
--    Enter your email + a strong password, and tick "Auto Confirm User".
-- 2. Edit the two values below, then run this in the SQL Editor.
-- 3. Authentication -> Sign In / Providers -> turn OFF "Allow new users to sign up",
--    so nobody else can create an account. (Even if it were on, a new account
--    would not be in admin_users and could not edit anything -- this is just
--    tidiness.)
-- =============================================================================

insert into public.admin_users (user_id, username)
select id, 'ronmar'                          -- <- the username you'll log in with
from auth.users
where email = 'ronmarabalos2311@gmail.com'   -- <- the email you used in step 1
on conflict (user_id) do update set username = excluded.username;

-- Should return one row. If it returns none, the email above doesn't match the
-- user you created in step 1.
select a.username, u.email
from public.admin_users a
join auth.users u on u.id = a.user_id;
