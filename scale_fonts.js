const fs = require('fs');
const files = [
  'app/page.tsx',
  'components/ClassifiedHeader.tsx',
  'components/StatsOverview.tsx',
  'components/TelemetryTables.tsx'
];
const map = {
  'text-\\\\[9px\\\\]': 'text-sm',
  'text-\\\\[10px\\\\]': 'text-sm',
  'text-\\\\[11px\\\\]': 'text-base',
  '\\\\btext-xs\\\\b': 'text-base',
  '\\\\btext-sm\\\\b': 'text-lg',
  '\\\\btext-base\\\\b': 'text-xl',
  '\\\\btext-lg\\\\b': 'text-2xl',
  '\\\\btext-xl\\\\b': 'text-3xl',
  '\\\\btext-2xl\\\\b': 'text-4xl',
  '\\\\btext-3xl\\\\b': 'text-5xl'
};
const regex = new RegExp(Object.keys(map).join('|'), 'g');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(regex, matched => {
    for (let key in map) {
      if (new RegExp('^' + key + '$').test(matched)) return map[key];
    }
    return matched;
  });
  fs.writeFileSync(f, content);
});
console.log('Font sizes scaled up successfully.');
