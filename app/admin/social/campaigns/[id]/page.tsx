import { CampaignDashboard } from '@/components/admin/CampaignDashboard';

export default function CampaignPage({ params }: { params: { id: string } }) {
  return <CampaignDashboard campaignId={params.id} />;
} 