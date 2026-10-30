// Stands in for the prototype's <body data-area="rider">: centres the phone frame (.rp-app) on wider screens.
export default function RiderLayout({ children }: { children: React.ReactNode }) {
  return <div data-area="rider">{children}</div>;
}
