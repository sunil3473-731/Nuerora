export interface Region {
  region_id: string;
  region_name: string;
}

export interface ForecastPoint {
  date: string;
  region: string;
  actual_count: number;
  baseline_forecast: number;
  model_forecast: number;
}

export const regions: Region[] = [
  { region_id: 'north', region_name: 'Northern Range' },
  { region_id: 'south', region_name: 'Southern Range' },
];

export const forecastPoints: ForecastPoint[] = [
  { date: '2026-10-12', region: 'north', actual_count: 12, baseline_forecast: 10, model_forecast: 11 },
  { date: '2026-10-13', region: 'north', actual_count: 8, baseline_forecast: 9, model_forecast: 7 },
  { date: '2026-10-12', region: 'south', actual_count: 5, baseline_forecast: 7, model_forecast: 6 },
  { date: '2026-10-13', region: 'south', actual_count: 9, baseline_forecast: 8, model_forecast: 10 },
];
