import httpClient from "../config/AxiosConfig";
import BaseService from "./BaseService";

export default class CollectionService extends BaseService {
  async fetchCollection() {
    try {
      const response = await httpClient.post("/api/collections");
      return this.toResult(response);
    } catch (error) {
      return this.toResultError(error);
    }
  } 

  async install() {
    try {
      const response = await httpClient.post("/api/oauth/install/grandservice");
      return this.toResult(response);
    } catch (error) {
      return this.toResultError(error);
    }
  }
}

export const collectionService = new CollectionService();
