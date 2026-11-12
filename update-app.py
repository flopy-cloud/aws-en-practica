from pathlib import Path
p=Path(__file__).resolve().parents[1]/'dist'
f=p/'app.js';t=f.read_text()
t=t.replace("const cats=[...new Set(services.map(s=>s.cat))];",'''const moduleConfig=[
 ['Fundamentos cloud','01','D1','Qué es la nube, modelos, beneficios e infraestructura.'],
 ['Diseño y adopción','02','D1','Well-Architected, CAF, resiliencia y estrategias.'],
 ['IAM en profundidad','03','D2','Usuarios, grupos, roles, policies y protección de root.'],
 ['Seguridad y detección','04','D2','Detectar amenazas, vulnerabilidades y proteger aplicaciones.'],
 ['Cifrado y protección de datos','05','D2','Claves, certificados, secretos y cifrado.'],
 ['Compliance y gobernanza','06','D2','Auditoría, controles y organización de cuentas.'],
 ['Cómputo y contenedores','07','D3','Servidores, funciones, contenedores y capacidad.'],
 ['Almacenamiento y respaldo','08','D3','Objetos, bloques, archivos y recuperación.'],
 ['S3: clases y protección','09','D3','Clases, acceso, versiones y ciclo de vida.'],
 ['Bases de datos','10','D3','Relacional, NoSQL, memoria y casos de uso.'],
 ['Redes y seguridad de red','11','D3','VPC, subredes, rutas, SG, NACL y conectividad.'],
 ['Migración y transferencia','12','D3','Descubrimiento, conversión, traslado y seguimiento.'],
 ['IA y machine learning','13','D3','Qué tarea resuelve cada servicio de IA.'],
 ['Apps y mensajería','14','D3','Colas, notificaciones, eventos y flujos.'],
 ['Analítica y big data','15','D3','SQL, ETL, streaming y visualización.'],
 ['Usuarios finales y negocio','16','D3','Escritorios, aplicaciones, correo, atención e IoT.'],
 ['DevOps y desarrollo','17','D3','Herramientas, automatización e infraestructura como código.'],
 ['Monitoreo y estado','18','D3','Métricas, logs, alarmas, trazas y salud de AWS.'],
 ['Economía, billing y soporte','19','D4','TCO, compras, facturación, estimaciones y ayuda.']
];
const cats=moduleConfig.map(m=>m[0]);
const preferred=['Cloud computing: qué es la nube','IaaS, PaaS y SaaS','Modelos de despliegue: cloud, local e híbrido','Beneficios de la nube','Escalabilidad, elasticidad y agilidad','Infraestructura global: regiones, AZ y edge','Principios de diseño en la nube','Well-Architected: los seis pilares','AWS Cloud Adoption Framework (CAF)','Las 7 R de migración','AWS IAM','Autenticación y autorización','Root user: la identidad inicial','IAM users: usuarios','IAM groups: grupos de usuarios','IAM roles y credenciales temporales','IAM policies: Effect, Action y Resource','Evaluación de permisos: Allow y Deny','MFA, access keys y federación'];
const learningOrder=cats.flatMap(cat=>services.filter(s=>s.cat===cat).sort((a,b)=>{const ai=preferred.indexOf(a.name),bi=preferred.indexOf(b.name);return (ai<0?999:ai)-(bi<0?999:bi)||a.id-b.id}));
const normalize=s=>s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'');''')
t=t.replace("function render(){({home,library,cards,practice,quiz:renderQuiz,lesson:()=>lesson(current)})[view]()}","function render(){({home,library,cards,practice,quiz:renderQuiz,workshop,glossary,lesson:()=>lesson(current)})[view]()}")
def repl(start,end,new):
 global t
 a=t.index(start);b=t.index(end,a);t=t[:a]+new+'\n'+t[b:]
repl('function home(){','function library(){', '''function home(){
 const next=learningOrder.find(s=>!state.done.includes(s.id))||learningOrder[0];
 const xp=state.done.length*10+state.known.length*3+state.challenges.length*15+state.attempts.reduce((n,a)=>n+a.score*2,0);
 app.innerHTML=intro('Tu guía de estudio · CLF-C02','Toda tu ruta. Un tema a la vez.','Entendé la nube desde cero, conectá servicios y practicá decisiones. Términos técnicos, explicados sin vueltas.')+
 `<section class="hero"><div><span class="eyebrow">DE LOS FUNDAMENTOS A LOS SERVICIOS</span><h2>Entender primero.<br>Recordar viene después.</h2><p>Lecciones breves, comparaciones y situaciones reales. Seguí la ruta o explorá el tema que necesitás.</p><button id="continue">${state.done.length?'Continuar mi recorrido':'Empezar desde cero'} ↗</button><p class="nextlesson">Sigue: ${next.name}</p></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orb">☁<small>ENTENDER</small></div><div class="orb">✓<small>DECIDIR</small></div></div></section>
 <section class="stats"><div class="stat"><span class="label">Tu recorrido</span><strong>${state.done.length}<small> / ${services.length} lecciones</small></strong><div class="bar"><div style="width:${progress()}%"></div></div></div><div class="stat"><span class="label">Puntos de aprendizaje</span><strong>${xp}<small> XP</small></strong><small>Lecturas, repaso y decisiones</small></div><div class="stat"><span class="label">Sesiones y desafíos</span><strong>${state.attempts.length+state.challenges.length}</strong><small>${state.known.length} tarjetas que ya dominás</small></div></section>
 <div class="activity-strip"><button id="tryworkshop"><b>⌘ Taller interactivo</b><span>Probá permisos y compará costos →</span></button><button id="tryquiz"><b>✓ Ponete a prueba</b><span>Escenarios con explicación →</span></button><button id="tryglossary"><b>Aa Glosario sin vueltas</b><span>Traducí el tecnicismo →</span></button></div>
 <div class="domain-strip"><span>D1 · Conceptos <b>24%</b></span><span>D2 · Seguridad <b>30%</b></span><span>D3 · Tecnología <b>34%</b></span><span>D4 · Costos y soporte <b>12%</b></span></div>
 <p class="muted">Los porcentajes son pesos de los dominios del examen, no de las lecciones de esta app. Diseño y talleres amplían la práctica conceptual.</p>
 <div class="sectionline"><h2>Tu mapa de aprendizaje</h2><span>${cats.length} módulos · ${services.length} lecciones</span></div>
 <section class="grid">${moduleConfig.map((m,i)=>`<button class="card category" data-cat="${m[0]}"><div class="row spread" style="width:100%"><span class="module-number">${m[1]}</span><span class="tag">${m[2]} · ${progress(m[0])}%</span></div><h3>${m[0]}</h3><p>${m[3]}</p><div class="bar" style="width:100%;margin-bottom:14px"><div style="width:${progress(m[0])}%"></div></div><div class="cardend"><span>${services.filter(s=>s.cat===m[0]).length} lecciones</span><span>Explorar →</span></div></button>`).join('')}</section>
 <div class="notice" style="margin-top:24px">Síntesis educativa independiente basada en el temario CLF-C02. No pretende reunir todo internet ni garantizar aprobación. Consultá las fuentes y los cambios antes de tu examen.</div>`;
 $('#continue').onclick=()=>openLesson(next.id);$('#tryworkshop').onclick=()=>go('workshop');$('#tryquiz').onclick=()=>go('quiz');$('#tryglossary').onclick=()=>go('glossary');
 document.querySelectorAll('.category').forEach(b=>b.onclick=()=>{category=b.dataset.cat;search='';go('library')});
}''')
t=t.replace("intro('BIBLIOTECA DE SERVICIOS','Encontrá la pieza que te falta.','Buscá un servicio o recorré los temas. Cada lección conecta la teoría con un caso concreto.')", "intro('BIBLIOTECA DE CONCEPTOS Y SERVICIOS','La explicación que necesitás, sin dar mil vueltas.','Buscá un término o elegí un módulo. Seguí el orden sugerido dentro de cada tema.')")
t=t.replace("const found=services.filter(s=>", "const found=learningOrder.filter(s=>")
t=t.replace("(s.name+' '+s.definition+' '+s.cat).toLowerCase().includes(search.toLowerCase())", "normalize(s.name+' '+s.definition+' '+s.cat+' '+(s.use||'')).includes(normalize(search))")
t=t.replace('<span class="tag">${s.cat}</span><h3>${s.name}</h3>', '<div class="row"><span class="tag">${s.kind===\'concept\'?\'Concepto\':\'Servicio\'}</span>${s.scope===\'complemento\'?\'<span class="tag gold">Complementario</span>\':\'\'}</div><h3>${s.name}</h3>')
repl('function relevance(s){','function lesson(id){', '''function relevance(s){
 const specialized=['IA y machine learning','Analítica y big data','Usuarios finales y negocio'].includes(s.cat);
 const security=['IAM en profundidad','Seguridad y detección','Cifrado y protección de datos','Compliance y gobernanza'].includes(s.cat);
 return [{target:'Cloud Practitioner',level:s.scope==='complemento'?'Baja':specialized?'Media':'Alta',text:s.scope==='complemento'?'Contexto adicional; no priorizar sobre fundamentos de la guía.':'Explicar su propósito y distinguirlo en un escenario.'},
 {target:'Cloud Support',level:specialized?'Media':'Alta',text:security?'Interpretar acceso, controles y evidencias relacionadas.':s.cat==='Economía, billing y soporte'?'Elegir herramientas para investigar gasto y orientar consultas.':'Reconocer su papel y revisar las dependencias que describe la lección.'},
 {target:'Cloud / DevSecOps',level:security||s.cat==='DevOps y desarrollo'?'Alta':specialized?'Baja':'Media',text:security?'Aplicar mínimo privilegio, automatización y revisión de controles.':s.cat==='DevOps y desarrollo'?'Versionar, automatizar y verificar cambios.':'Profundizar según el tipo de infraestructura que construyas.'}];
}''')
repl('function lesson(id){','function shuffled(a){', '''function lesson(id){
 const s=services[id],position=learningOrder.findIndex(x=>x.id===id),src=studyMeta.sources[s.source]||studyMeta.sources.exam;
 const table=s.table?`<div class="compare-table"><table><thead><tr>${s.table.headers.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
 app.innerHTML=`<div class="lesson"><button class="back" id="back">← Volver al módulo</button><div class="lessonhead"><span class="eyebrow">${s.cat}</span><h1>${s.name}</h1><div class="row"><span class="tag">${state.done.includes(id)?'✓ Estudiado':s.kind==='concept'?'Concepto':'Servicio'}</span>${s.scope==='complemento'?'<span class="tag gold">Tema complementario</span>':''}<span class="muted">${position+1} de ${services.length} en tu recorrido</span></div></div>
 <article class="lessonbody"><section class="block"><h3>01 / Qué es</h3><p>${s.definition}</p></section><section class="block"><h3>02 / Para qué sirve</h3><p>${s.use||s.memory}</p></section>${table}
 <section class="example"><h3>03 / Miralo en una situación real</h3><p>${s.example}</p></section>
 ${s.points?.length?`<section class="block"><h3>Lo que necesitás entender</h3><ul class="keypoints">${s.points.map(x=>`<li>${x}</li>`).join('')}</ul></section>`:''}
 <section class="block"><h3>04 / Cómo se conecta</h3><p>${s.related}</p></section>
 <div class="pitfall"><strong>⚑ No confundas esto</strong><p>${s.pitfall}</p></div>
 <details class="relevance"><summary>05 / Importancia para Practitioner, Support y DevSecOps</summary><div class="compare-table"><table><thead><tr><th>Objetivo</th><th>Importancia</th><th>Qué conviene saber</th></tr></thead><tbody>${relevance(s).map(r=>`<tr><td>${r.target}</td><td>${r.level}</td><td>${r.text}</td></tr>`).join('')}</tbody></table></div><small class="muted">Orientación razonada de estudio, no clasificación oficial de AWS.</small></details>
 <div class="memory"><span class="eyebrow">06 / QUEDATE CON ESTA IDEA</span><p>${s.memory}</p></div>
 <section class="checkpoint"><span class="eyebrow">TU TURNO · RECORDAR Y DECIDIR</span><h3>¿Lo podés aplicar?</h3><p>Hacé una decisión breve y comprobá el porqué.</p><button id="quick">Resolver mini desafío →</button><div id="lessoncheck"></div></section>
 <label class="noteslabel" for="note">Mis apuntes, con mis palabras</label><textarea id="note" class="note" placeholder="¿Qué problema resuelve? ¿Con qué no lo confundirías?">${esc(state.notes[id]||'')}</textarea><p class="muted" id="notestatus">Se guardan en este navegador.</p>
 <button class="primary" id="mark">${state.done.includes(id)?'✓ Estudiado · desmarcar':'Marcar como estudiado · +10 XP'}</button>
 <div class="lesson-source"><span>Referencia de estudio · ${studyMeta.reviewed}</span><a href="${src[1]}" target="_blank" rel="noopener">${src[0]} ↗</a><small>El enlace amplía o ubica el tema. Precios, planes y disponibilidad pueden cambiar.</small></div>
 <div class="row spread" style="margin-top:25px"><button id="prev" ${position===0?'disabled':''}>← Anterior</button><button id="next" ${position===learningOrder.length-1?'disabled':''}>Siguiente →</button></div></article></div>`;
 $('#back').onclick=()=>{category=s.cat;go('library')};$('#note').oninput=e=>{state.notes[id]=e.target.value;save();$('#notestatus').textContent='✓ Apunte guardado.'};$('#mark').onclick=()=>{state.done=state.done.includes(id)?state.done.filter(x=>x!==id):[...state.done,id];save();lesson(id)};
 $('#prev').onclick=()=>openLesson(learningOrder[position-1].id);$('#next').onclick=()=>openLesson(learningOrder[position+1].id);
 $('#quick').onclick=()=>{const q=makeQuestion(s);$('#lessoncheck').innerHTML=`<h3>${q.prompt}</h3><div class="answers">${q.options.map(o=>`<button class="answer" data-a="${o.id}">${o.name}</button>`).join('')}</div><div id="miniresult" role="status"></div>`;
 document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const right=+b.dataset.a===id;b.classList.add(right?'correct':'wrong');$('#miniresult').innerHTML=`<div class="feedback ${right?'':'bad'}"><strong>${right?'✓ Bien pensado.':'Revisá la distinción.'}</strong> ${q.explanation}</div>`;if(right)document.querySelectorAll('[data-a]').forEach(x=>x.disabled=true)})};
}''')
repl('function makeQuestion(s){','function cards(){', '''function makeQuestion(s){
 if(s.check)return {s,prompt:s.check.q,explanation:s.check.why,options:shuffled([{id:s.id,name:s.check.correct},...s.check.wrong.map((name,i)=>({id:-(i+1),name}))])};
 let pool=services.filter(x=>x.cat===s.cat&&x.id!==s.id);if(pool.length<3)pool=services.filter(x=>x.id!==s.id);
 return {s,prompt:s.definition+' ¿Qué servicio o concepto describe?',explanation:s.name+': '+s.memory,options:shuffled([s,...shuffled(pool).slice(0,3)])};
}''')
t=t.replace("const pool=services.filter(s=>flashCat", "const pool=learningOrder.filter(s=>flashCat")
t=t.replace('Diez oportunidades para aprender.','Hasta diez oportunidades para aprender.')
t=t.replace("shuffled(services.filter(s=>cat==='Todas'||s.cat===cat)).slice(0,10).map(makeQuestion)","shuffled(services.filter(s=>(cat==='Todas'||s.cat===cat)&&s.check)).slice(0,10).map(makeQuestion)")
t=t.replace('${q.s.example}</h2><p>¿Qué servicio o concepto encaja mejor con esta necesidad?</p>','${q.prompt}</h2><p>Elegí la mejor respuesta para este caso.</p>')
t=t.replace('${q.s.definition}<br><em>${q.s.memory}</em>','${q.explanation}<br><em>${q.s.memory}</em>')
t=t.replace("'La respuesta es '+q.s.name", "'La respuesta es '+(q.s.check?.correct||q.s.name)")
# Every module has at least a recognition fallback so choosing any module works.
t=t.replace("quiz={questions:shuffled(services.filter(s=>(cat==='Todas'||s.cat===cat)&&s.check)).slice(0,10).map(makeQuestion),index:0,answers:[]}", "const eligible=services.filter(s=>(cat==='Todas'||s.cat===cat)&&s.check);const candidates=eligible.length?eligible:services.filter(s=>cat==='Todas'||s.cat===cat);quiz={questions:shuffled(candidates).slice(0,10).map(makeQuestion),index:0,answers:[]}")
f.write_text(t)
h=(p/'index.html').read_text().replace('Explorar servicios</span>','Conceptos y servicios</span>')
h=h.replace('</nav>','<button data-view="workshop">⌘ <span>Taller interactivo</span></button><button data-view="glossary">Aa <span>Glosario técnico</span></button></nav>')
h=h.replace('Este espacio reúne 100 lecciones de servicios y conceptos.','Este espacio reúne 178 lecciones de conceptos y servicios en 19 módulos.')
h=h.replace('Incluye fundamentos además de servicios.','Incluye fundamentos, servicios de la lista oficial consultada y temas complementarios identificados. No sustituye documentación ni pretende reunir todo internet.')
h=h.replace('<script src="app.js"></script>','<script src="workshops.js"></script><script src="app.js"></script>')
h=h.replace('content="v2"','content="v3"')
(p/'index.html').write_text(h)
