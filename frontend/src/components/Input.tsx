export function Input({ className, ...props }) {
  return (
    <input
      className="appearance-none rounded-md border border-border px-2 py-1 text-sm active:ring-1"
      {...props}
    />
  );
}
