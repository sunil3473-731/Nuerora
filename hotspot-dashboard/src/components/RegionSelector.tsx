import type { Region } from '../data/forecastData';
import './RegionSelector.css';

interface RegionSelectorProps {
  regions: Region[];
  selectedRegionId: string;
  onRegionChange: (regionId: string) => void;
}
export function RegionSelector({ regions, selectedRegionId, onRegionChange }: RegionSelectorProps) {
  return (
    <label className="region-selector">
      <span>Region</span>
      <select value={selectedRegionId} onChange={(event) => onRegionChange(event.target.value)}>
        {regions.map((region) => (
          <option key={region.region_id} value={region.region_id}>
            {region.region_name}
          </option>
        ))}
      </select>
    </label>
  );
}
