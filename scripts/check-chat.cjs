const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(source, { exports, require: name => load(path.resolve(path.dirname(file), name + '.ts')) }, { filename: file });
  return exports;
}
const { findAnswer } = load(path.join(__dirname, '../lib/chat-engine.ts'));
const cases = [
  ['Tell me about your work experience', 'experience', '/work'],
  ['Tell me about PulseLoop', 'project:PulseLoop', '/work'],
  ['Tell me about Financial Chatbot', 'project:Financial Chatbot', '/projects'],
];
for (const [query, intent, href] of cases) {
  const answer = findAnswer(query);
  assert.equal(answer.id, intent);
  assert.ok(answer.links.some(link => link.href === href), `${query}: link must point at the dedicated page`);
}
assert.equal(findAnswer('How do I bake sourdough?').id, 'fallback');
assert.ok(!findAnswer('What blogs can I read?').text.includes('1 posts'));
console.log('Passed: assistant intent matching, cross-page section links, fallback, and singular post count.');
