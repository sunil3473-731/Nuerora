// ==========================================================================
// 1. Sample Mock Dataset (Simulated API Response)
// ==========================================================================
const mockForecastDatabase = {
  amazon: {
    name: "Amazon Basin (South America)",
    data: [
      { date: "2026-10-17", actual: 142, baseline: 130, model: 138 },
      { date: "2026-10-18", actual: 168, baseline: 135, model: 160 },
      { date: "2026-10-19", actual: 185, baseline: 140, model: 178 },
      { date: "2026-10-20", actual: 154, baseline: 142, model: 152 },
      { date: "2026-10-21", actual: 210, baseline: 145, model: 198 }
    ]
  },
  cerrado: {
    name: "Cerrado Biome (Brazil)",
    data: [
      { date: "2026-10-17", actual: 95, baseline: 88, model: 92 },
      { date: "2026-10-18", actual: 110, baseline: 90, model: 105 },
      { date: "2026-10-19", actual: 125, baseline: 92, model: 120 },
      { date: "2026-10-20", actual: 102, baseline: 95, model: 100 },
      { date: "2026-10-21", actual: 140, baseline: 98, model: 135 }
    ]
  },
  congo: {
    name: "Congo Basin (Central Africa)",
    data: [
      { date: "2026-10-17", actual: 215, baseline: 190, model: 205 },
      { date: "2026-10-18", actual: 230, baseline: 195, model: 220 },
      { date: "2026-10-19", actual: 245, baseline: 200, model: 240 },
      { date: "2026-10-20", actual: 210, baseline: 205, model: 215 },
      { date: "2026-10-21", actual: 260, baseline: 210, model: 255 }
    ]
  },
  borneo: {
    name: "Borneo Peatlands (Southeast Asia)",
    data: [
      { date: "2026-10-17", actual: 48, baseline: 52, model: 50 },
      { date: "2026-10-18", actual: 62, baseline: 55, model: 58 },
      { date: "2026-10-19", actual: 75, baseline: 56, model: 70 },
      { date: "2026-10-20", actual: 58, baseline: 58, model: 56 },
      { date: "2026-10-21", actual: 82, baseline: 60, model: 78 }
    ]
  }
};

// ==========================================================================
// 2. Select HTML Elements from the DOM
// ==========================================================================
const regionSelect = document.getElementById("regionSelect");
const forecastDate = document.getElementById("forecastDate");
const showForecastBtn = document.getElementById("showForecastBtn");
const forecastHeading = document.getElementById("forecastHeading");
const forecastTableBody = document.getElementById("forecastTableBody");
const chartContainer = document.getElementById("chartContainer");

// Set default date input to today
const today = new Date().toISOString().split("T")[0];
forecastDate.value = today;

// ==========================================================================
// 3. Render Table Rows
// ==========================================================================
function renderTable(forecastList) {
  // Clear any existing rows
  forecastTableBody.innerHTML = "";

  // Loop through each forecast entry and generate HTML row
  forecastList.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><strong>${item.date}</strong></td>
      <td class="value-actual">${item.actual.toLocaleString()}</td>
      <td class="value-baseline">${item.baseline.toLocaleString()}</td>
      <td class="value-model">${item.model.toLocaleString()}</td>
    `;

    forecastTableBody.appendChild(row);
  });
}

// ==========================================================================
// 4. Render Simple Line Chart Placeholder (Interactive Pure SVG)
// ==========================================================================
function renderChartPlaceholder(forecastList) {
  const width = 800;
  const height = 180;
  const padding = 40;

  // Find max value to scale chart vertically
  const maxVal = Math.max(
    ...forecastList.flatMap((d) => [d.actual, d.baseline, d.model])
  );

  const numPoints = forecastList.length;
  const stepX = (width - padding * 2) / (numPoints - 1);

  // Helper to convert data point to (x, y) coordinates
  const getCoordinates = (value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - (value / (maxVal * 1.15)) * (height - padding * 2);
    return { x, y };
  };

  // Build SVG path coordinate strings
  const actualPoints = forecastList.map((d, i) => getCoordinates(d.actual, i));
  const baselinePoints = forecastList.map((d, i) => getCoordinates(d.baseline, i));
  const modelPoints = forecastList.map((d, i) => getCoordinates(d.model, i));

  const toPathString = (points) =>
    points.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" ");

  // Generate SVG circles and labels
  let svgContent = `
    <svg viewBox="0 0 ${width} ${height}" class="chart-svg" xmlns="http://www.w3.org/2000/svg">
      <!-- Gridlines -->
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#334155" stroke-width="1" />
      <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#1e293b" stroke-dasharray="4" stroke-width="1" />
      
      <!-- Baseline Path (Gray dashed) -->
      <path d="${toPathString(baselinePoints)}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 5" />

      <!-- Model Forecast Path (Green solid) -->
      <path d="${toPathString(modelPoints)}" fill="none" stroke="#10b981" stroke-width="2.5" />

      <!-- Actual Hotspot Detections Path (Orange solid) -->
      <path d="${toPathString(actualPoints)}" fill="none" stroke="#f97316" stroke-width="3" />
  `;

  // Draw dots and date labels on X axis
  forecastList.forEach((item, index) => {
    const act = actualPoints[index];
    const mod = modelPoints[index];

    svgContent += `
      <!-- Actual Dot -->
      <circle cx="${act.x}" cy="${act.y}" r="4.5" fill="#f97316" stroke="#0f172a" stroke-width="2" />
      <!-- Model Dot -->
      <circle cx="${mod.x}" cy="${mod.y}" r="3.5" fill="#10b981" stroke="#0f172a" stroke-width="1.5" />
      
      <!-- Date Label -->
      <text x="${act.x}" y="${height - 12}" fill="#64748b" font-size="11" text-anchor="middle" font-family="Inter, sans-serif">
        ${item.date.slice(5)}
      </text>
    `;
  });

  svgContent += `</svg>`;
  chartContainer.innerHTML = svgContent;
}

// ==========================================================================
// 5. Main Update Function
// ==========================================================================
function updateDashboard() {
  const selectedKey = regionSelect.value;
  const regionRecord = mockForecastDatabase[selectedKey];

  if (regionRecord) {
    forecastHeading.textContent = `Forecast Data: ${regionRecord.name}`;
    renderTable(regionRecord.data);
    renderChartPlaceholder(regionRecord.data);
  }
}

// ==========================================================================
// 6. Event Listeners & Initial Load
// ==========================================================================
showForecastBtn.addEventListener("click", updateDashboard);

// Run automatically on first load to populate initial view
updateDashboard();
