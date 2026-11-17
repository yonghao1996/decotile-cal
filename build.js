/**
 * index.html 빌드. tile.js / quote-xlsx.js 원본을 페이지에 그대로 인라인하고,
 * 견적서 엑셀 양식(web/quote-template/)을 quote-template.json 으로 묶는다.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');
const toClassic = (src) => src.replace(/^import\b[\s\S]*?;\s*$/gm, '').replace(/^export\s+/gm, '').trim();

const fragment = read('web/index.template.html')
  .replace('/*__BUNDLE__*/', () => [read('quote-xlsx.js'), read('tile.js')].map(toClassic).join('\n\n'));
const cut = fragment.indexOf('<style>');
writeFileSync(join(root, 'index.html'), `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="데코타일 600×600 치수를 넣으면 필요한 장수, 주문 옵션, 견적을 계산합니다.">
${fragment.slice(0, cut).trim()}
</head>
<body>
${fragment.slice(cut)}
</body>
</html>
`);

const tplDir = join(root, 'web/quote-template');
writeFileSync(join(root, 'quote-template.json'), JSON.stringify(Object.fromEntries(
  readdirSync(tplDir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && d.name !== '.DS_Store')
    .map((d) => { const f = join(d.parentPath, d.name); return [f.slice(tplDir.length + 1), readFileSync(f).toString('base64')]; }),
)));
console.log('index.html · quote-template.json');
