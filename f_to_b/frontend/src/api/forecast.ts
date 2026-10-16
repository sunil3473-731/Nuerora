export interface ForecastResponse {
  date: string;
  region: string;
  actual_count: number;
  baseline_forecast: number;
  model_forecast: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export async function fetchForecast(region: string, date: string): Promise<ForecastResponse> {
  const query = new URLSearchParams({ region, date });
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/forecast?${query.toString()}`);
  } catch {
    throw new Error('Could not reach the forecast API. Check that the FastAPI server is running.');
  }

  if (!response.ok) {
    let message = `The forecast API returned an error (${response.status}).`;

    try {
      const body: unknown = await response.json();
      if (typeof body === 'object' && body !== null && 'detail' in body) {
        if (typeof body.detail === 'string') {
          message = body.detail;
        } else if (Array.isArray(body.detail)) {
          const details = body.detail
            .map((item) =>
              typeof item === 'object' && item !== null && 'msg' in item && typeof item.msg === 'string'
                ? item.msg
                : null,
            )
            .filter((item): item is string => item !== null);
          if (details.length > 0) message = details.join(' ');
        }
      }
    } catch {
      // Keep the status-based message when the error response has no JSON body.
    }

    throw new Error(message);
  }

  return (await response.json()) as ForecastResponse;
}
