import type { ForecastPoint } from '../data/forecastData';
import './ForecastTable.css';

interface ForecastTableProps {
  points: ForecastPoint[];
}

export function ForecastTable({ points }: ForecastTableProps) {
  if (points.length === 0) {
    return <p className="empty-state">No forecast data is available for this selection.</p>;
  }

  return (
    <section className="panel table-panel" aria-labelledby="table-heading">
      <h2 id="table-heading">Daily detections and forecasts</h2>
      <div className="table-scroll">
        <table aria-label="Daily detection counts and forecasts">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Actual detections</th>
              <th scope="col">Baseline forecast</th>
              <th scope="col">Model forecast</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={`${point.region}-${point.date}`}>
                <td>{point.date}</td>
                <td>{point.actual_count}</td>
                <td>{point.baseline_forecast}</td>
                <td>{point.model_forecast}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
