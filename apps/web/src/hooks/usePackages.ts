import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { packagesApi } from "../api/packages";

export function usePackages(activeOnly = false) {
  return useQuery({
    queryKey: ["packages", { activeOnly }],
    queryFn: () => packagesApi.list(activeOnly),
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: packagesApi.create,
    // Thêm xong thì làm mới mọi danh sách gói (kể cả dropdown ở form hội viên sau này)
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["packages"] }),
  });
}