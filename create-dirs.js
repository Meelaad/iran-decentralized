/* global require */
const fs = require('fs');

const dirs = [
  'src/styles',
  'src/components/Layout',
  'src/pages/Architecture',
  'src/pages/Sector'
];

dirs.forEach(d => {
  fs.mkdirSync(d, { recursive: true });
  console.log(`Created: ${d}`);
});
