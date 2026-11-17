import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { calculateTiles } from './tile.js';
import { quoteXlsx } from './quote-xlsx.js';

const dir = 'web/quote-template';
const template = Object.fromEntries(readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((d) => d.isFile() && d.name !== '.DS_Store')
  .map((d) => { const f = join(d.parentPath, d.name); return [f.slice(dir.length + 1), readFileSync(f).toString('base64')]; }));

test('견적서 엑셀: 품명·비고·단가 수식이 양식 칸에 들어간다', () => {
  const r = calculateTiles([{ type: 'n', color: '실버 마블', width: 100, height: 100 }]);
  const xml = Buffer.from(quoteXlsx(template, r.lines, '테스트')).toString('utf8');
  assert.match(xml, /<c r="B6" s="\d+" t="inlineStr"><is><t>테스트<\/t>/);
  assert.match(xml, /<c r="F11" s="\d+" t="inlineStr"><is><t>데코타일 600x600 비접착식<\/t>/);
  assert.match(xml, /<c r="G11" s="\d+" t="inlineStr"><is><t>실버 마블<\/t>/);
  assert.match(xml, /<c r="I11" s="\d+"><f>3600\/1.1<\/f>/);
  assert.match(xml, /fullCalcOnLoad="1"/);
});

test('견적서 엑셀: 양식 7줄을 넘으면 알린다', () => {
  const lines = Array.from({ length: 8 }, () => ({ item: 'x', note: '', count: 1, unit: 1, amount: 1 }));
  assert.throws(() => quoteXlsx(template, lines, ''), /7줄/);
});
