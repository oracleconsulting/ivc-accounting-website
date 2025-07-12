import { useState, useEffect } from 'react';
import { Campaign } from '@/types/campaign';
import { campaignService } from '@/lib/services/campaignService';

export function useCampaign(campaignId?: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaign = async () => {
    if (!campaignId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/campaign/${campaignId}`);
      if (!response.ok) throw new Error('Failed to fetch campaign');
      
      const data = await response.json();
      setCampaign(data.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCampaign = async (updates: Partial<Campaign>) => {
    if (!campaignId) return;

    try {
      const response = await fetch(`/api/campaign/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update campaign');
      
      const updated = await response.json();
      setCampaign(updated.data);
      return updated;
    } catch (error) {
      throw error;
    }
  };

  const publishCampaign = async () => {
    if (!campaignId) return;

    try {
      const response = await fetch('/api/campaign/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      });

      if (!response.ok) throw new Error('Failed to publish campaign');
      
      await fetchCampaign(); // Refresh campaign data
    } catch (error) {
      throw error;
    }
  };

  const deleteCampaign = async () => {
    if (!campaignId) return;

    try {
      const response = await fetch(`/api/campaign/${campaignId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete campaign');
      
      setCampaign(null);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  return {
    campaign,
    isLoading,
    error,
    updateCampaign,
    publishCampaign,
    deleteCampaign,
    refetch: fetchCampaign
  };
} 