type CardProps = React.ComponentProps<'div'>;

export function Card({ className, ...rest }: CardProps) {
  return (
    <div
      className={`border border-gray-200 rounded-xl bg-white p-6 ${className}`}
      {...rest}
    />
  );
}
