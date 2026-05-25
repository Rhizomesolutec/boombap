export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page renders standalone — no sidebar, no auth checks.
  return <>{children}</>;
}
