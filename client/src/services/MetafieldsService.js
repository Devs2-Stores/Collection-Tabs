import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BaseService from "./BaseService";
import httpClient from "../config/AxiosConfig";
import { message } from "antd";

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
        if (response.data) return response.data;
        return response.data;
      },
    });
  };

  useCreateField = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.post(`/api/metafields`, variables);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          window.error("Có lỗi xảy ra, vui lòng thử lại");
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["metafields", variables.type, variables.objectID]);
        if (!cache) return;
        queryClient.setQueryData(["metafields", variables.type, variables.objectID], (oddData) => {
          oddData.data.metafields.push(newData.data.metafield);
          return oddData;
        });
      },
      onSettled: (_data, _error, variables) => {
        setTimeout(() => {
          message.success("Khởi tạo Field thành công");
          queryClient.invalidateQueries(["metafields", variables.type, variables.objectID]);
        }, 2500);
      }
    });
  };

  useUpdateField = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (variables) => {
        try {
          const response = await httpClient.put(`/api/metafields`, variables);
          return this.toResult(response);
        } catch (error) {
          const handleError = this.toResultError(error);
          message.error(String(handleError.errorMessage));
          throw error;
        }
      },
      onSuccess: (newData, variables) => {
        if (!newData) return;
        const cache = queryClient.getQueryData(["metafields", variables.type, variables.objectID]);
        if (!cache) return;
        queryClient.setQueryData(["metafields", variables.type, variables.objectID], (oddData) => {
          const findOldMetafield = oddData.data.metafields.find((metafield) => metafield.id === variables.metafieldID);
          if (findOldMetafield) {
            // Remove cái cũ, append cái mới
            oddData.data.metafields = oddData.data.metafields.filter((metafield) => metafield.id !== variables.metafieldID);
            oddData.data.metafields.push(newData.data.metafield);
          }
          return oddData;
        });
      },
      onSettled: (_data, _error, variables) => {
        setTimeout(() => {
          message.success("Cập nhật Field thành công");
          queryClient.invalidateQueries(["metafields", variables.type, variables.objectID]);
        }, 1500);
      }
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
