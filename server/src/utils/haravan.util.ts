import axios from 'axios';
import { Issuer } from 'openid-client';
import slugify from 'slugify';

export const createHaravanClient = async (config): Promise<any> => {
  const issuer = await Issuer.discover(
    'https://accounts.haravan.com/.well-known/openid-configuration',
  );

  return new issuer.Client({
    client_id: config.get('HRV_CLIENT_ID'),
    client_secret: config.get('HRV_CLIENT_SECRET'),
    redirect_uris: [config.get('HRV_CALLBACK_URL')],
    response_types: ['code id_token'],
  });
};

export default class HaravanAPI {
  static async getMetafields(shop: string, token: string, type: string, id: string) {
    const url = `https://apis.haravan.com/com/metafields.json?metafield[owner_id]=${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });
    if (!response) {
      return {
        success: false,
        data: null,
        status: 500,
        errorCode: 'METAFIELDS_NOT_FOUND',
        errorMessage: 'Metafields not found',
      };
    }
    return {
      success: true,
      data: response.data,
      status: 200,
      errorCode: null,
      errorMessage: null,
    };
  }

  static async updateMetafields(shop, token, data) {
    const { objectID, type, metafieldID, values } = data;
    const metafield = {
      value: values,
      value_type: 'json',
    };
    const url = `https://apis.haravan.com/com/metafields/${metafieldID}.json`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    console.log(token)
    const response = await axios.put(url, { metafield }, { headers });
    console.log(response.data.metafield);
    if (!response) {
      return {
        success: false,
        data: null,
        status: 500,
        errorCode: 'METAFIELDS_NOT_FOUND',
        errorMessage: 'Metafields not found',
      };
    }
    return {
      success: true,
      data: response.data,
      status: 200,
      errorCode: null,
      errorMessage: null,
    };
  }
}
