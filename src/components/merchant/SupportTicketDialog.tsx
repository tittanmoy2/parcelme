'use client';

import { useEffect, useState } from 'react';
import { PmDialog } from '@/components/ui/PmDialog';
import { showToast } from '@/hooks/useToast';

// openTicket() from merchant.js. Mounted once in the merchant layout; any "#ticket" link or
// openSupportTicket() call opens it, optionally with a tracking ID filled in.
const TICKET_EVENT = 'pm:ticket';

export function openSupportTicket(parcelId = '') {
  window.dispatchEvent(new CustomEvent(TICKET_EVENT, { detail: parcelId }));
}

export function SupportTicketDialog() {
  const [parcelId, setParcelId] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => setParcelId((e as CustomEvent<string>).detail || '');
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href="#ticket"]');
      if (!a) return;
      e.preventDefault();
      setParcelId('');
    };
    window.addEventListener(TICKET_EVENT, onOpen);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener(TICKET_EVENT, onOpen);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const close = () => setParcelId(null);

  return (
    <PmDialog
      open={parcelId !== null}
      onClose={close}
      title="Open a support ticket"
      onSubmit={() => {
        close();
        showToast(`Ticket TK-${Math.floor(4000 + Math.random() * 999)} opened. Farhana will reply within 2 hours.`, 'ok', 4500);
      }}
      footer={<><button type="button" className="m-btn" onClick={close}>Cancel</button><button type="submit" className="m-btn p">Submit ticket</button></>}
    >
      <label className="m-fld">
        Topic
        <select className="m-in" name="topic" required defaultValue="">
          <option value="">Choose a topic</option>
          <option>Parcel delayed</option>
          <option>Parcel damaged or lost</option>
          <option>Wrong COD amount</option>
          <option>Payout issue</option>
          <option>Rider behaviour</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="m-fld">
        Tracking ID <small>Optional</small>
        <input className="m-in font-mono" name="pid" defaultValue={parcelId ?? ''} placeholder="PM-2410-…" />
      </label>
      <label className="m-fld">
        What happened?
        <textarea className="m-in" name="msg" required minLength={10} placeholder="Tell us a few details so we can help faster" />
      </label>
    </PmDialog>
  );
}
