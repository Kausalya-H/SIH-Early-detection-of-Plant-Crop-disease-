import { apiClient } from './client';
import { CreateFarmerPayload, Farmer } from '@/types';

/**
 * Registers a new farmer profile in the national database.
 * Matches backend: POST /farmers/ (JSON: name, phone, language, location, crop)
 */
export async function createFarmer(payload: CreateFarmerPayload): Promise<Farmer> {
  return apiClient<Farmer>('/farmers/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Retrieves all registered farmers from the database.
 * Matches backend: GET /farmers/
 */
export async function getFarmers(): Promise<Farmer[]> {
  return apiClient<Farmer[]>('/farmers/', {
    method: 'GET',
  });
}
