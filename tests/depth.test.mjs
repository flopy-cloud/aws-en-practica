import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=new URL('../dist/',import.meta.url);
const {services}=vm.runInNewContext(fs.readFileSync(new URL('data.js',base),'utf8')+'\n'+fs.readFileSync(new URL('depth.js',base),'utf8')+';({services})');
for(const s of services){
 assert.ok(s.definition.length>15&&s.use.length>30,s.name+': definition and utility');
 assert.equal(s.mechanics.length,3,s.name+': steps');
 assert.ok(s.mechanics.every(x=>x.length>20),s.name+': substantive steps');
 assert.ok(s.analogy.length>35&&s.analogyBoundary.length>35,s.name+': bounded analogy');
 assert.ok(s.useCases.length>=2&&s.useCases.every(x=>x.length>8),s.name+': use cases');
 assert.ok(s.alternatives.length>=2,s.name+': comparisons');
 assert.ok(s.alternatives.every(x=>x.option.length>1&&x.difference.length>15&&x.relation.length>3),s.name+': comparative decisions');
}
assert.equal(new Set(services.map(s=>s.mechanics.join(';'))).size,178,'No generic repeated mechanism');
assert.equal(new Set(services.map(s=>s.analogy)).size,178,'Topic-specific analogies');
const app=fs.readFileSync(new URL('app.js',base),'utf8');
for(const label of ['Definición','Para qué sirve','Cómo funciona por dentro','Analogía','Casos de uso típicos','Alternativas y comparación'])assert.ok(app.includes(label));
const sw=fs.readFileSync(new URL('sw.js',base),'utf8');assert.ok(sw.includes("'/depth.js'"));
const html=fs.readFileSync(new URL('index.html',base),'utf8');assert.ok(html.indexOf('src="depth.js"')<html.indexOf('src="app.js"'));
console.log('PASS: 178 complete six-part lessons; unique mechanisms/analogies; comparative labels; offline inclusion and script order');
