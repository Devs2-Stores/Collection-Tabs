import httpClient from "../config/AxiosConfig";
import BaseService from "./BaseService";
import { jwtDecode } from "jwt-decode";

export default class AuthService extends BaseService {
  getUser() {
    const id_token = localStorage.getItem("hara_token");
    if (id_token && id_token !== "null") {
      const decoded = jwtDecode(id_token);
      return JSON.parse(JSON.stringify(decoded));
    }
    return undefined;
  }

  getUrlAuthorize() {
    const url_authorize = import.meta.env.VITE_APP_URL_AUTHORIZE;
    const response_mode = import.meta.env.VITE_APP_RESPONSE_MODE;
    const response_type = import.meta.env.VITE_APP_RESPONSE_TYPE;
    const scope_login = import.meta.env.VITE_APP_SCOPE_LOGIN;
    const app_id = import.meta.env.VITE_APP_APP_ID;
    const login_callback_url = import.meta.env.VITE_APP_LOGIN_CALLBACK_URL;
    const access_type = import.meta.env.VITE_APP_ACCESS_TYPE;
    const nonce = import.meta.env.VITE_APP_NONCE;
    const url = `${url_authorize}?response_mode=${response_mode}&response_type=${response_type}&scope=${scope_login}&client_id=${app_id}&redirect_uri=${login_callback_url}&access_type=${access_type}&nonce=${nonce}`;
    console.log(url);
    return encodeURI(url);
  }

  getUrlInstall() {
    const url_authorize = import.meta.env.VITE_APP_URL_AUTHORIZE;
    const response_type = import.meta.env.VITE_APP_RESPONSE_TYPE;
    const scope = import.meta.env.VITE_APP_SCOPE;
    const app_id = import.meta.env.VITE_APP_APP_ID;
    const install_callback_url = import.meta.env.VITE_APP_INSTALL_CALLBACK_URL;
    const nonce = import.meta.env.VITE_APP_NONCE;
    const url = `${url_authorize}?response_type=${response_type}&scope=${scope}&client_id=${app_id}&redirect_uri=${install_callback_url}`;
    console.log(url);
    return encodeURI(url);
  }

  authorizeLogin() {
    try {
      window.location.href = this.getUrlAuthorize();
    } catch (error) {
      console.log(error);
    }
  }

  authorizeInstall() {
    try {
      window.location.href = this.getUrlInstall();
    } catch (error) {
      console.log(error);
    }
  }

  async login() {
    try {
      const response = await httpClient.post("/api/oauth/install/login");
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

export const authService = new AuthService();
