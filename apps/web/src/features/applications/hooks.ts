import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from './api';
import {
  ApplyCampaignPayload,
  InviteCreatorPayload,
  UpdateApplicationStatusPayload,
  RespondInvitationPayload,
} from '@2becollab/types';

export const APPLICATIONS_KEYS = {
  all: ['applications'] as const,
  campaignApplications: (campaignId: string) =>
    [...APPLICATIONS_KEYS.all, 'campaign', campaignId] as const,
  myApplications: () => [...APPLICATIONS_KEYS.all, 'my-applications'] as const,
  myInvitations: () => [...APPLICATIONS_KEYS.all, 'my-invitations'] as const,
};

export function useCampaignApplications(campaignId: string | null) {
  return useQuery({
    queryKey: APPLICATIONS_KEYS.campaignApplications(campaignId || ''),
    queryFn: () => applicationsApi.getCampaignApplications(campaignId!),
    enabled: !!campaignId,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: APPLICATIONS_KEYS.myApplications(),
    queryFn: () => applicationsApi.getMyApplications(),
  });
}

export function useMyInvitations() {
  return useQuery({
    queryKey: APPLICATIONS_KEYS.myInvitations(),
    queryFn: () => applicationsApi.getMyInvitations(),
  });
}

export function useApplyCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      payload,
    }: {
      campaignId: string;
      payload: ApplyCampaignPayload;
    }) => applicationsApi.applyToCampaign(campaignId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: APPLICATIONS_KEYS.campaignApplications(variables.campaignId),
      });
      queryClient.invalidateQueries({
        queryKey: APPLICATIONS_KEYS.myApplications(),
      });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) =>
      applicationsApi.withdrawApplication(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: APPLICATIONS_KEYS.myApplications(),
      });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      applicationId,
      payload,
    }: {
      campaignId: string;
      applicationId: string;
      payload: UpdateApplicationStatusPayload;
    }) =>
      applicationsApi.updateApplicationStatus(
        campaignId,
        applicationId,
        payload,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: APPLICATIONS_KEYS.campaignApplications(variables.campaignId),
      });
    },
  });
}

export function useInviteCreator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InviteCreatorPayload) =>
      applicationsApi.inviteCreator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: APPLICATIONS_KEYS.all,
      });
    },
  });
}

export function useRespondInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invitationId,
      payload,
    }: {
      invitationId: string;
      payload: RespondInvitationPayload;
    }) => applicationsApi.respondToInvitation(invitationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: APPLICATIONS_KEYS.myInvitations(),
      });
    },
  });
}
