import { apiClient } from '@/lib/api/client';
import {
  CampaignApplicationResponse,
  CampaignInvitationResponse,
  ApplyCampaignPayload,
  InviteCreatorPayload,
  UpdateApplicationStatusPayload,
  RespondInvitationPayload,
} from '@2becollab/types';

export const applicationsApi = {
  applyToCampaign: async (
    campaignId: string,
    payload: ApplyCampaignPayload,
  ): Promise<CampaignApplicationResponse> => {
    const res = await apiClient.post(`/campaigns/${campaignId}/apply`, payload);
    return res.data.data;
  },

  getCampaignApplications: async (
    campaignId: string,
  ): Promise<CampaignApplicationResponse[]> => {
    const res = await apiClient.get(`/campaigns/${campaignId}/applications`);
    return res.data.data;
  },

  getMyApplications: async (): Promise<CampaignApplicationResponse[]> => {
    const res = await apiClient.get('/creators/me/applications');
    return res.data.data;
  },

  updateApplicationStatus: async (
    campaignId: string,
    applicationId: string,
    payload: UpdateApplicationStatusPayload,
  ): Promise<CampaignApplicationResponse> => {
    const res = await apiClient.patch(
      `/campaigns/${campaignId}/applications/${applicationId}/status`,
      payload,
    );
    return res.data.data;
  },

  withdrawApplication: async (
    campaignId: string,
  ): Promise<{ success: boolean }> => {
    const res = await apiClient.delete(`/campaigns/${campaignId}/applications/withdraw`);
    return res.data.data;
  },

  inviteCreator: async (
    payload: InviteCreatorPayload,
  ): Promise<CampaignInvitationResponse> => {
    const res = await apiClient.post('/campaigns/invite', payload);
    return res.data.data;
  },

  getMyInvitations: async (): Promise<CampaignInvitationResponse[]> => {
    const res = await apiClient.get('/creators/me/invitations');
    return res.data.data;
  },

  respondToInvitation: async (
    invitationId: string,
    payload: RespondInvitationPayload,
  ): Promise<CampaignInvitationResponse> => {
    const res = await apiClient.patch(
      `/creators/me/invitations/${invitationId}/respond`,
      payload,
    );
    return res.data.data;
  },
};
