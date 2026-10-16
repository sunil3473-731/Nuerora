import { useState, type FormEvent } from 'react';
import { fetchForecast, type ForecastResponse } from './api/forecast';
import { ForecastTable } from './components/ForecastTable';
import { RegionSelector } from './components/RegionSelector';
import { forecastPoints, regions } from './data/forecastData';
import './App.css';

function App() {
  const [selectedRegionId, setSelectedRegionId] = useState(regions[0].region_id);
  const availableDates = Array.from(
    new Set(forecastPoints.filter((point) => point.region === selectedRegionId).map((point) => point.date)),
  ).sort();
  const [selectedDate, setSelectedDate] = useState(availableDates[0] ?? '');
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const selectedRegion = regions.find((region) => region.region_id === selectedRegionId);
  const selectedRegionName = selectedRegion?.region_name ?? 'Selected region';

  function handleRegionChange(regionId: string) {
    const regionDates = Array.from(
      new Set(forecastPoints.filter((point) => point.region === regionId).map((point) => point.date)),
    ).sort();
    setSelectedRegionId(regionId);
    setSelectedDate(regionDates[0] ?? '');
    setForecast(null);
    setStatus('idle');
    setErrorMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRegion) {
      setForecast(null);
      setStatus('error');
      setErrorMessage('Choose a valid region before requesting a forecast.');
      return;
    }

    const parsedDate = new Date(`${selectedDate}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== selectedDate
    ) {
      setForecast(null);
      setStatus('error');
      setErrorMessage('Enter a valid forecast date.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const result = await fetchForecast(selectedRegionId, selectedDate);
      setForecast(result);
      setStatus('success');
    } catch (error: unknown) {
      setForecast(null);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setStatus('error');
    }
  }

  return (
    <main className="dashboard">
      <p className="eyebrow">Environmental monitoring</p>
      <h1>Hotspot activity forecast</h1>
      <p className="intro">Choose a region and date to explore daily fire detections and forecasts.</p>

      <form className="panel" aria-labelledby="filters-heading" onSubmit={handleSubmit}>
        <h2 id="filters-heading">Choose filters</h2>
        <div className="filters">
          <RegionSelector
            regions={regions}
            selectedRegionId={selectedRegionId}
            onRegionChange={handleRegionChange}
            disabled={status === 'loading'}
          />
          <label className="filter-control">
            <span>Forecast date</span>
            <select
              disabled={status === 'loading'}
              required
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            >
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
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Loading forecast…' : 'Load forecast'}
        </button>
      </form>

      {status === 'loading' && <p role="status">Loading forecast…</p>}
      {status === 'error' && (
        <p className="api-error" role="alert">
          {errorMessage}
        </p>
      )}
      {status === 'success' && forecast && <ForecastTable points={[forecast]} />}
      {status === 'idle' && <p className="empty-state">Choose a region and date, then load the forecast.</p>}
    </main>
  );
}

export default App;
