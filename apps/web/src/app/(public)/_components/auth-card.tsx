function AuthCardRoot(props: React.ComponentProps<'div'>) {
  return (
    <div
      className='min-w-145 grid grid-cols-4 gap-4 justify-items-center p-8 border border-gray-200 rounded-xl'
      {...props}
    />
  );
}

interface AuthCardHeaderProps {
  title: string;
  description: string;
}

function AuthCardHeader({ title, description }: AuthCardHeaderProps) {
  return (
    <div className='mb-4 col-span-4 flex flex-col items-center gap-2'>
      <h1 className='text-gray-800 leading-7 font-bold text-sans text-xl'>
        {title}
      </h1>

      <span className=' text-gray-600 leading-7 font-normal text-sans text-base'>
        {description}
      </span>
    </div>
  );
}

interface AuthCardFooterProps {
  children: React.ReactNode;
}

function AuthCardFooter({ children }: AuthCardFooterProps) {
  return (
    <div className='mt-4 col-span-4 w-full flex flex-col gap-8 items-center'>
      <div className=' flex flex-row w-full items-center gap-3'>
        <div className='flex-1 h-px border w-full border-gray-300' />
        <p className='text-gray-500 leading-5 font-sans text-sm'>ou</p>
        <div className='flex-1 h-px border border-gray-300' />
      </div>

      {children}
    </div>
  );
}

export const AuthCard = {
  Root: AuthCardRoot,
  Header: AuthCardHeader,
  Footer: AuthCardFooter,
};
