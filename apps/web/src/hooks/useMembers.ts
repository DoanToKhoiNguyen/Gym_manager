import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { membersApi } from "../api/members";
import type { ListParams, MemberInput } from "../api/members";

export function useMembers(params: ListParams) {
  return useQuery({
    queryKey: ["members", "list", params],
    queryFn: () => membersApi.list(params),
    placeholderData: keepPreviousData, // đổi trang không bị nháy trống
  });
}

export function useMember(id: number | undefined) {
  return useQuery({
    queryKey: ["members", "detail", id],
    queryFn: () => membersApi.getById(id as number),
    enabled: id !== undefined && Number.isInteger(id) && id > 0,
  });
}

// Ngày hết hạn dự kiến do SERVER tính, frontend không tự cộng tháng
export function usePreviewExpiry(packageId: number | null, startDate: string) {
  return useQuery({
    queryKey: ["preview-expiry", packageId, startDate],
    queryFn: () => membersApi.previewExpiry(packageId as number, startDate),
    enabled: packageId !== null && /^\d{4}-\d{2}-\d{2}$/.test(startDate),
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MemberInput) => membersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MemberInput }) =>
      membersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => membersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
  });
}