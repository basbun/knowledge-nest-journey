
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const WelcomeMessage = () => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .maybeSingle();
      
      if (profile?.name) {
        setName(profile.name);
      }
    };

    fetchProfile();
  }, []);

  if (!name) return null;

  return (
    <h2 className="text-2xl font-semibold mb-6">
      Welcome {name}!
    </h2>
  );
};
