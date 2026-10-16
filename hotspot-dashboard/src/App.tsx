import { useState } from 'react';
import { ForecastTable } from './components/ForecastTable';
import { MetricsSummary } from './components/MetricsSummary';
import { RegionSelector } from './components/RegionSelector';
import { forecastPoints, regions } from './data/forecastData';
import './App.css';

function App() {
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0].region_id);
  const availableDates = Array.from(new Set(forecastPoints.map((point) => point.date))).sort();
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const selectedRegion = regions.find((region) => region.region_id === selectedRegionId);
  const selectedRegionName = selectedRegion?.region_name ?? 'Selected region';
  const regionPoints = forecastPoints.filter((point) => point.region === selectedRegionId);
  const selectedPoints = regionPoints.filter((point) => point.date === selectedDate);

  return (
    <main className="dashboard">
      <p className="eyebrow">Environmental monitoring</p>
      <h1>Hotspot activity forecast</h1>
      <p className="intro">Choose a region and date to explore daily fire detections and forecasts.</p>

      <section className="panel" aria-labelledby="filters-heading">
        <h2 id="filters-heading">Choose filters</h2>
        <div className="filters">
          <RegionSelector
            regions={regions}
            selectedRegionId={selectedRegionId}
            onRegionChange={setSelectedRegionId}
          />
          <label className="filter-control">
            <span>Forecast date</span>
            <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="selection-message">
          Showing selections for <strong>{selectedRegionName}</strong> on <strong>{selectedDate}</strong>.
        </p>
      </section>

      <ForecastTable points={selectedPoints} />
      <MetricsSummary points={regionPoints} regionName={selectedRegionName} />
    </main>
  );
}

export default App;
