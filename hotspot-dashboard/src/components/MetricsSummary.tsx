import type { ForecastPoint } from '../data/forecastData';
import './MetricsSummary.css';

interface MetricsSummaryProps {
  points: ForecastPoint[];
  regionName: string;
}

type ForecastField = 'baseline_forecast' | 'model_forecast';

function meanAbsoluteError(points: ForecastPoint[], forecastField: ForecastField): number | null {
  if (points.length === 0) {
    return null;
  }

  const totalError = points.reduce(
    (total, point) => total + Math.abs(point.actual_count - point[forecastField]),
    0,
  );

  return totalError / points.length;
}

export function MetricsSummary({ points, regionName }: MetricsSummaryProps) {
  if (points.length === 0) {
    return <p className="empty-state">No metrics are available for this region.</p>;
  }

  const baselineMae = meanAbsoluteError(points, 'baseline_forecast');
  const modelMae = meanAbsoluteError(points, 'model_forecast');

  return (
    <section className="panel metrics-panel" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading">Forecast accuracy</h2>
      <p className="metrics-caption">Mean Absolute Error across sample dates for {regionName}</p>
      <div className="metrics-grid">
        <article className="metric-card">
          <h3>Baseline MAE</h3>
          <p>{baselineMae === null ? '—' : baselineMae.toFixed(2)}</p>
          <span>detections</span>
        </article>
        <article className="metric-card">
          <h3>Model MAE</h3>
          <p>{modelMae === null ? '—' : modelMae.toFixed(2)}</p>
          <span>detections</span>
        </article>
      </div>
    </section>
  );
}
