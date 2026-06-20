import { Button } from "./Button";

export function Dialog({ closeFn, children }) {
  return (
    <div className="fixed top-0 left-0 z-10 flex h-screen w-screen items-center justify-center bg-muted/90">
      <div className="min-w-1/2 rounded-lg bg-card p-4 shadow">{children}</div>
    </div>
  );
}
