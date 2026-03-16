import axios from 'axios';

/**
 * Returns an axios instance pre-configured with the super admin Bearer token.
 * Usage: const api = useSuperAdminApi(superAdmin?.access);
 */
export function createSuperAdminApi(token) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
  });
}
