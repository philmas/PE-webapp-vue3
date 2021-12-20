import { useState } from '#app';
import { User } from '@supabase/supabase-js';

export default function () {
  const auth = useAuth();
  const user = useState<User>('user', () => auth.user());

  // When auth state changes => change user
  auth.onAuthStateChange((_, session) => {
    user.value = session?.user;
  });

  return user;
}
