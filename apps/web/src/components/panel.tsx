function PanelRoot({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      className={`flex flex-col border border-gray-200 rounded-xl bg-white ${className}`}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      className={`w-full p-6 inline-flex justify-between items-center border-b border-gray-200 ${className}`}
      {...props}
    />
  );
}

function PanelFooter({ className, ...props }: React.ComponentProps<'footer'>) {
  return (
    <footer
      className={`flex flex-1 items-center justify-center border-t border-t-gray-200 ${className}`}
      {...props}
    />
  );
}

export const Panel = {
  Root: PanelRoot,
  Header: PanelHeader,
  Footer: PanelFooter,
};
