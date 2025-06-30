// app/page.tsx
import { Metadata } from 'next';
import IVCHomepage from '@/components/IVCHomepage';

export const metadata: Metadata = {
  title: 'IVC Accounting - Other Accountants File. We Fight.',
  description: 'Personal UK accounting services with a 50-client limit. Founded by James Howard after his PE exit, choosing values over valuations to fight for business owners.',
};

export default function HomePage() {
  return <IVCHomepage />;
}