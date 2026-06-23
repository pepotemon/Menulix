import { AdminShell } from "@/components/admin/admin-shell";
import { AdminDataProvider } from "@/components/admin/admin-data-provider";
import { AuthProvider } from "@/components/admin/auth-provider";
import { ToastProvider } from "@/components/ui/toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({
  children
}: AdminLayoutProps): JSX.Element {
  return (
    <AuthProvider>
      <AdminDataProvider>
        <ToastProvider>
          <AdminShell>{children}</AdminShell>
        </ToastProvider>
      </AdminDataProvider>
    </AuthProvider>
  );
}
