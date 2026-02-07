/**
 * ReLeaf frontend – backend API client.
 * Backend: GET /heatmap/{lat}/{lon}, POST /generate-vision
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface HeatmapResponse {
  lat: number;
  lon: number;
  temperature_c: number;
  source: string;
}

export async function getTemperature(lat: number, lon: number): Promise<HeatmapResponse> {
  const res = await fetch(`${API_URL}/heatmap/${lat}/${lon}`);
  if (!res.ok) throw new Error('Failed to fetch temperature');
  return res.json();
}

export async function generateVision(imageBase64: string): Promise<string> {
  const res = await fetch(`${API_URL}/generate-vision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: imageBase64 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || res.statusText);
  }
  const data = await res.json();
  const b64 = (data as { image_base64?: string }).image_base64;
  return b64 ? `data:image/png;base64,${b64}` : '';
}
