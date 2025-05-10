import { createClient } from 'redis';

const redisClient = createClient({
  username: 'default',
  password: '92hG3h5NZUgdnvrJ53tOsbqkz2wyfxHg',
  socket: {
    host: 'redis-17840.crce194.ap-seast-1-1.ec2.redns.redis-cloud.com',
    port: 17840,
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  await redisClient.connect(); 
  console.log('Connected to Redis');
};

export const setToken = async (key: string, value: string, ttl: number) => {
  await redisClient.set(key, value, { EX: ttl }); // TTL là thời gian sống (giây)
};
 
export const getToken = async (key: string): Promise<string | null> => {
  const result = await redisClient.get(key);
  return result?.toString() ?? null;
};

export const deleteToken = async (key: string) => {
  await redisClient.del(key);
};

export default redisClient;
