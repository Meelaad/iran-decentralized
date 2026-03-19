export const topCountries = [
  { code: 'IR', name: { en: 'Iran',          fa: 'ایران' },          members: 0, color: '#e8507a' },
  { code: 'DE', name: { en: 'Germany',       fa: 'آلمان' },          members: 0, color: '#FFCE00' },
  { code: 'US', name: { en: 'United States', fa: 'ایالات متحده' },   members: 0, color: '#4fc3f7' },
  { code: 'GB', name: { en: 'United Kingdom',fa: 'بریتانیا' },        members: 0, color: '#2563eb' },
  { code: 'CA', name: { en: 'Canada',        fa: 'کانادا' },          members: 0, color: '#b91c1c' },
  { code: 'SE', name: { en: 'Sweden',        fa: 'سوئد' },           members: 0, color: '#2563eb' },
  { code: 'NL', name: { en: 'Netherlands',   fa: 'هلند' },           members: 0, color: '#ea580c' },
];

export const countryColors = {
  IR: '#e8507a', DE: '#FFCE00', US: '#4fc3f7', GB: '#2563eb',
  CA: '#b91c1c', SE: '#2563eb', AU: '#3b82f6', FR: '#1d4ed8',
  NL: '#ea580c', TR: '#b91c1c', NO: '#dc2626', CH: '#dc2626',
  AT: '#dc2626', PL: '#dc2626', IT: '#15803d', ES: '#b91c1c',
  JP: '#dc143c', KR: '#3b82f6', CN: '#991b1b', IN: '#f59e0b',
  RU: '#FF0000', BR: '#FF0000', AE: '#f59e0b', SA: '#FFCE00',
  EG: '#1e40af', ZA: '#15803d', MX: '#15803d', AR: '#3b82f6',
};

// Verified country dot positions [lon, lat] — edit here to adjust highlights on the global map.
// Use 3–6 points spread across each country's interior, well away from borders.
export const COUNTRY_DOTS = {
  IR: [[51.4,35.7],[59.6,36.3],[44.5,37.8],[53.0,31.5],[57.5,29.5],[48.3,30.5]],
  DE: [[10.4,51.2],[13.4,52.5],[9.9,53.6],[11.6,48.1],[8.7,50.1]],
  US: [[-87.6,41.8],[-122.4,37.8],[-73.9,40.7],[-118.2,34.1],[-95.4,29.8],[-112.1,33.5],[-80.2,25.8],[-104.9,39.7]],
  GB: [[-0.1,51.5],[-4.2,55.9],[-1.9,52.5],[-3.2,55.9]],
  CA: [[-79.4,43.7],[-123.1,49.2],[-73.6,45.5],[-114.1,51.0],[-63.6,44.6]],
  SE: [[18.1,59.3],[11.9,57.7],[13.0,55.6],[20.3,63.8]],
  AU: [[151.2,-33.9],[144.9,-37.8],[115.9,-31.9],[153.0,-27.5],[138.6,-34.9]],
  FR: [[2.3,48.9],[5.4,43.3],[7.3,47.8],[1.4,43.6],[-0.6,44.8]],
  NL: [[4.9,52.4],[5.1,52.1],[4.5,51.9]],
  TR: [[32.9,39.9],[29.0,41.0],[35.5,37.0],[27.1,38.4]],
  NO: [[10.7,59.9],[5.3,60.4],[18.9,69.6]],
  CH: [[8.5,47.4],[7.4,46.9],[9.4,47.1]],
  AT: [[16.4,48.2],[14.3,48.3],[13.0,47.8]],
  PL: [[21.0,52.2],[19.9,50.1],[18.7,54.4]],
  IT: [[12.5,41.9],[9.2,45.5],[15.1,37.5],[14.0,40.8]],
  ES: [[-3.7,40.4],[2.2,41.4],[-8.6,42.9],[-5.9,37.4]],
  JP: [[139.7,35.7],[135.5,34.7],[141.4,43.1],[130.4,33.6]],
  KR: [[127.0,37.6],[129.1,35.2],[126.7,35.9]],
  CN: [[116.4,39.9],[121.5,31.2],[113.3,23.1],[104.1,30.7],[108.9,34.3]],
  IN: [[77.2,28.6],[72.9,19.1],[80.3,13.1],[88.4,22.6],[78.5,17.4]],
  RU: [[37.6,55.8],[60.6,56.8],[82.9,55.0],[131.9,43.1],[56.8,60.7]],
  BR: [[-46.6,-23.5],[-43.2,-22.9],[-48.5,-1.5],[-60.0,-3.1],[-51.2,-30.0]],
  AE: [[54.4,24.2],[55.3,25.2],[55.9,24.5]],
  SA: [[46.7,24.7],[39.2,21.5],[50.1,26.4],[44.4,17.3]],
  EG: [[31.2,30.1],[29.9,31.1],[33.8,27.2],[25.7,25.3]],
  ZA: [[18.4,-33.9],[28.0,-26.2],[30.9,-29.6],[22.9,-30.6]],
  MX: [[-99.1,19.4],[-103.3,20.7],[-89.6,21.2],[-117.1,32.5]],
  AR: [[-58.4,-34.6],[-64.2,-31.4],[-68.8,-53.2],[-65.4,-24.8]],
};

export const regionMarkers = [
  { id: 'TEH', name: 'Tehran', coordinates: [51.3890, 35.6892] },
  { id: 'BER', name: 'Berlin', coordinates: [13.4050, 52.5200] },
  { id: 'NYC', name: 'New York', coordinates: [-74.0060, 40.7128] },
  { id: 'LON', name: 'London', coordinates: [-0.1275, 51.5072] },
  { id: 'TOR', name: 'Toronto', coordinates: [-79.3832, 43.6532] },
  { id: 'STO', name: 'Stockholm', coordinates: [18.0686, 59.3294] },
  { id: 'SYD', name: 'Sydney', coordinates: [151.21, -33.8678] },
  { id: 'DXB', name: 'Dubai', coordinates: [55.3, 24.0] },
  { id: 'PAR', name: 'Paris', coordinates: [2.3522, 48.8567] },
  { id: 'AMS', name: 'Amsterdam', coordinates: [4.9041, 52.3676] },
];

export const placeholderStats = {
  totalMembers: 0,
  votesCast: 0,
  plansEndorsed: 0,
  countriesRepresented: 0,
  civicActions: 0,
};

export function formatNumber(num) {
  return num.toLocaleString('en-US');
}
