import Image from 'next/image';
import { Navigation } from './navigation';

export function Header() {
  return (
    <header className='inline-flex w-full items-center justify-between px-12 py-4 border-b border-b-gray-200'>
      <Image src='logo.svg' width={100} height={24} alt='logo' />

      <Navigation />

      <div className='rounded-full bg-gray-300 size-9' />
    </header>
  );
}
