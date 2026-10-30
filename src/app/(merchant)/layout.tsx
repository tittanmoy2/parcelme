import { Suspense } from 'react';
import { MerchantSidebar, MerchantSidebarView } from '@/components/merchant/MerchantSidebar';
import { SupportTicketDialog } from '@/components/merchant/SupportTicketDialog';

// Shell from the prototype's merchant pages: the sidebar here, each page renders its own <main>.
export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-area="merchant" className="flex flex-wrap items-stretch min-h-full bg-slate-50 font-sans text-slate-900">
      <Suspense fallback={<MerchantSidebarView pathname={null} />}>
        <MerchantSidebar />
      </Suspense>
      {children}
      <SupportTicketDialog />
    </div>
  );
}
