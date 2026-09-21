import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex flex-col gap-8 items-center justify-center min-h-screen w-full'>
      <Image src='/logo.svg' width={134} height={32} alt='logo' />
      {children}
    </div>
  );
}
