import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const app=fs.readFileSync('dist/app.js','utf8'),workshops=fs.readFileSync('dist/workshops.js','utf8');
const ctx=vm.createContext({});vm.runInContext(app.slice(app.indexOf('const challenges='),app.indexOf('let challengeIndex='))+';globalThis.items=challenges',ctx);assert.equal(ctx.items.length,9);for(const c of ctx.items){assert.equal(c.steps.length,3);for(const [prompt,answer,options,why] of c.steps){assert.ok(options.includes(answer));assert.equal(new Set(options).size,options.length);assert.ok(why.length>0)}}
vm.runInContext(workshops.slice(workshops.indexOf('const terms='),workshops.indexOf('function glossary()'))+';globalThis.words=terms',ctx);assert.equal(ctx.words.length,95);assert.equal(new Set(ctx.words.map(t=>t[0].toLowerCase())).size,95);for(const t of ctx.words)assert.equal(t.length,4);
const appearance=fs.readFileSync('dist/appearance.js','utf8');
for(const palette of ['sage','slate','lavender','terracotta','sand'])for(const mode of ['light','dark']){
 const root={dataset:{},style:{setProperty(){}}},writes=[];
 vm.runInNewContext(appearance,{localStorage:{getItem:()=>JSON.stringify({palette,mode}),setItem:(...args)=>writes.push(args)},document:{documentElement:root,querySelector:()=>null,addEventListener(){}}});assert.equal(root.dataset.palette,palette);assert.equal(root.dataset.mode,mode);assert.equal(writes.length,0);
}
assert.deepEqual(Array.from(ctx.words,t=>t[0]),Array.from(ctx.words,t=>t[0]).sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})));
assert.ok(!app.includes('Importancia para Practitioner'));assert.ok(!appearance.includes('aws-flopy-v1'));console.log('PASS: nine challenges, 95 unique glossary terms, all ten persisted appearance combinations, progress isolation');
