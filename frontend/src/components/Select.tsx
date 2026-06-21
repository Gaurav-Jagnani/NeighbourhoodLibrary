export function Select({ children, className, ...props }) {
  return (
    <select
      className={`rounded-md border border-border bg-background px-2 py-1 text-lg ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
