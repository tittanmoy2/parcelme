import { Suspense } from 'react';
import { AdminSidebar, AdminSidebarView } from '@/components/admin/AdminSidebar';

// Shell from the prototype's admin pages: the dark sidebar here, each page renders its own <main>.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-area="admin" className="flex flex-wrap items-stretch min-h-full bg-slate-100 font-sans text-slate-900">
      <Suspense fallback={<AdminSidebarView pathname={null} />}>
        <AdminSidebar />
      </Suspense>
      {children}
    </div>
  );
}
