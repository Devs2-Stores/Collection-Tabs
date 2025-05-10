import { Issuer } from 'openid-client';

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
