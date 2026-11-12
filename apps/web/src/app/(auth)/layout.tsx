import { Header } from './_components/header';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 flex flex-col p-12 bg-gray-100'>{children}</main>
    </div>
  );
}
