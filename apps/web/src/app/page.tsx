import { Mail, Trash } from 'lucide-react';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { IconButton } from '@/components/icon-button';

export default function Home() {
  return (
    <div className='flex flex-col gap-4 items-center py-10'>
      <IconButton icon={Trash} />
      <IconButton disabled icon={Trash} />
      <IconButton state='error' icon={Trash} />
      <IconButton state='error' disabled icon={Trash} />
    </div>
  );
}
