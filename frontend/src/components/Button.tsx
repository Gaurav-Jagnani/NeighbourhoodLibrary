export function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`cursor-pointer rounded-md border px-2 py-1 hover:bg-muted active:bg-accent ${className}`}
    >
      {children}{" "}
    </button>
  );
}
