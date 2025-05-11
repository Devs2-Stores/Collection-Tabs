import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BaseService from "./BaseService";
import httpClient from "../config/AxiosConfig";

export default class MetafieldsService extends BaseService {
  useGetMetafields = (data) => {
    const { type, id } = data;
    const queryClient = useQueryClient();
    return useQuery({
      queryKey: ["metafields", type, id],
      queryFn: async () => {
        try {
          const cache = queryClient.getQueryData(["metafields", type, id]);
          if (cache) return cache;

          const response = await httpClient.get(`/api/metafields?type=${type}&id=${id}`); /* prettier-ignore */
          return this.toResult(response);
        } catch (error) {
          this.toResultError(error);
        } 
      },
      select: (response) => {
        if (response.data.length === 0) return response.data;
        return JSON.parse(response.data);
      },
    });
  };

  useCreateField = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.post(`/fields`, variables);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.open({
            type: "error",
            content: handleError.errorMessage,
          });
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["fields", variables.type]);
        if (!cache) return;
        queryClient.setQueryData(["fields", variables.type], (oddData) => {
          return {
            status: newData?.status || 200,
            data: newData.data,
          };
        });
        newData?.success &&
          message.open({
            type: "success",
            content: "Khởi tạo Field thành công",
          });
      },
      onSettled: (newData, variables) => {
        if (!newData) return;
        queryClient.invalidateQueries(["fields", variables.type]);
      },
    });
  };

  useUpdateField = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const { key } = variables;
          const response = await httpClient.patch(`/fields/${key}`, variables);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.open({
            type: "error",
            content: handleError.errorMessage,
          });
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["fields", variables.type]);
        if (!cache) return;
        queryClient.setQueryData(["fields", variables.type], (oddData) => {
          return {
            status: newData?.status || 200,
            data: newData.data,
          };
        });
        newData?.success &&
          message.open({
            type: "success",
            content: "Cập nhật Field thành công",
          });
      },
      onSettled: (newData, variables) => {
        if (!newData) return;
        queryClient.invalidateQueries(["fields", variables.type]);
      },
    });
  };

  useDeleteField = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (variables) => {
        const { type, key } = variables;
        try {
          const response = await httpClient.delete(`/fields/${key}?type=${type}`); /* prettier-ignore */
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.open({
            type: "error",
            content: handleError.errorMessage,
          });
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["fields", variables?.type]);
        if (!cache) return;

        queryClient.setQueryData(["fields", variables?.type], (oddData) => {
          return {
            status: newData?.status || 200,
            data: newData.data,
          };
        });

        newData?.success &&
          message.open({
            type: "success",
            content: "Xóa Field thành công",
          });
      },
      onSettled: (newData, variables) => {
        if (!newData) return;
        queryClient.invalidateQueries(["fields", variables?.type, ""]); /* prettier-ignore */
      },
    });
  };
}

export const metafieldsService = new MetafieldsService();
