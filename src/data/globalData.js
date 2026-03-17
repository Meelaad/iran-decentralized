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

export const regionMarkers = [
  { id: 'TEH', name: 'Tehran', coordinates: [51.3890, 35.6892] },
  { id: 'BER', name: 'Berlin', coordinates: [13.4050, 52.5200] },
  { id: 'NYC', name: 'New York', coordinates: [-74.0060, 40.7128] },
  { id: 'LON', name: 'London', coordinates: [-0.1275, 51.5072] },
  { id: 'TOR', name: 'Toronto', coordinates: [-79.3832, 43.6532] },
  { id: 'STO', name: 'Stockholm', coordinates: [18.0686, 59.3294] },
  { id: 'SYD', name: 'Sydney', coordinates: [151.21, -33.8678] },
  { id: 'DXB', name: 'Dubai', coordinates: [55.2972, 25.2631] },
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
