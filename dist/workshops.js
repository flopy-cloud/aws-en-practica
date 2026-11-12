let workshopTab='iam';
function workshop(){
 app.innerHTML=intro('TOCÁ, PROBÁ Y ENTENDÉ','Un taller para que el concepto haga clic.','Cambiá una decisión y mirá qué pasa. Todo se simula en tu navegador, sin conectarse con AWS.')+
 `<div class="workshop-tabs" role="group" aria-label="Elegir taller"><button data-lab="iam" aria-pressed="${workshopTab==='iam'}">01 · Permisos IAM</button><button data-lab="s3" aria-pressed="${workshopTab==='s3'}">02 · Elegir clase S3</button><button data-lab="tco" aria-pressed="${workshopTab==='tco'}">03 · Comparar TCO</button><button data-lab="responsibility" aria-pressed="${workshopTab==='responsibility'}">04 · ¿Quién se ocupa?</button></div><div id="lab-content"></div>`;
 document.querySelectorAll('[data-lab]').forEach(b=>b.onclick=()=>{workshopTab=b.dataset.lab;workshop()});
 ({iam:iamWorkshop,s3:s3Workshop,tco:tcoWorkshop,responsibility:responsibilityWorkshop})[workshopTab]();
}
function iamWorkshop(){
 $('#lab-content').innerHTML=`<div class="challenge"><section class="panel"><span class="eyebrow">MISIÓN · PERMISOS JUSTOS</span><h2>¿Puede leer? ¿Puede borrar?</h2><p>Una aplicación asume un rol. Elegí una acción y un recurso; configurá sus permisos y comprobá la decisión.</p>
 <div class="step"><label for="iam-action">Acción solicitada</label><select id="iam-action"><option value="read">s3:GetObject · leer objeto</option><option value="delete">s3:DeleteObject · borrar objeto</option></select></div>
 <div class="step"><label for="iam-resource">Recurso solicitado</label><select id="iam-resource"><option value="reports">Objeto en bucket informes</option><option value="other">Objeto en bucket privado de otro equipo</option></select></div>
 <div class="switches"><label><input type="checkbox" id="iam-read" checked> Allow de GetObject en informes/*</label><label><input type="checkbox" id="iam-delete"> Allow de DeleteObject en informes/*</label><label><input type="checkbox" id="iam-deny"> Deny explícito de DeleteObject en informes/*</label></div>
 <div class="notice">Desafío: permití leer informes y bloqueá su borrado. Después agregá un Allow para borrar y observá qué pasa si hay un Deny explícito.</div></section>
 <section class="panel"><span class="eyebrow">EVALUACIÓN EN TIEMPO REAL</span><div id="iam-result" aria-live="polite"></div><div id="iam-policy"></div><p class="muted">Modelo didáctico de políticas de identidad sobre objetos S3. Asume que el rol ya fue asumido. La evaluación real también considera políticas de recursos, SCP, límites y contexto.</p></section></div>`;
 const evaluate=()=>{const action=$('#iam-action').value,resource=$('#iam-resource').value,allowed=$('#iam-'+action).checked&&resource==='reports',denied=action==='delete'&&$('#iam-deny').checked&&resource==='reports';
 const ok=allowed&&!denied;
 $('#iam-result').innerHTML=`<div class="decision ${ok?'yes':'no'}"><span>${ok?'✓ Permitido':'× Denegado'}</span><p>${denied?'Hay un Deny explícito aplicable: prevalece incluso con un Allow.':allowed?'La acción y el recurso coinciden con un Allow; no hay Deny explícito en este modelo.':'No hay un Allow que autorice esta acción sobre este recurso: denegación implícita.'}</p></div><ol class="decision-steps"><li>Acción: <code>${action==='read'?'s3:GetObject':'s3:DeleteObject'}</code></li><li>Recurso: ${resource==='reports'?'informes/*':'otro bucket · fuera del alcance'}</li><li>Allow aplicable: ${allowed?'sí':'no'}</li><li>Deny explícito aplicable: ${denied?'sí':'no'}</li></ol>`;
 const rules=[];if($('#iam-read').checked)rules.push({Effect:'Allow',Action:'s3:GetObject',Resource:'arn:aws:s3:::informes/*'});if($('#iam-delete').checked)rules.push({Effect:'Allow',Action:'s3:DeleteObject',Resource:'arn:aws:s3:::informes/*'});if($('#iam-deny').checked)rules.push({Effect:'Deny',Action:'s3:DeleteObject',Resource:'arn:aws:s3:::informes/*'});
 $('#iam-policy').innerHTML=`<details><summary>Ver la policy de ejemplo · opcional</summary><pre>${esc(JSON.stringify({Version:'2012-10-17',Statement:rules},null,2))}</pre></details>`;
 };
 ['iam-action','iam-resource','iam-read','iam-delete','iam-deny'].forEach(id=>$('#'+id).onchange=evaluate);evaluate();
}
function s3Workshop(){
 $('#lab-content').innerHTML=`<div class="challenge"><section class="panel"><span class="eyebrow">MISIÓN · CADA OBJETO EN SU LUGAR</span><h2>¿Qué clase S3 elegirías?</h2><p>Cambiá las necesidades del archivo. La recomendación es conceptual y muestra el motivo.</p>
 <div class="step"><label for="s3-frequency">¿Cómo es el acceso?</label><select id="s3-frequency"><option value="frequent">Frecuente</option><option value="unknown">Desconocido o cambiante</option><option value="infrequent">Poco frecuente</option><option value="archive">Archivo de largo plazo</option></select></div>
 <div class="step"><label for="s3-latency">¿Cuánto podés esperar para leerlo?</label><select id="s3-latency"><option value="instant">Acceso inmediato</option><option value="minutes">Acepto restaurar y esperar minutos u horas</option><option value="hours">Acepto una espera mayor, de horas</option></select></div>
 <div class="switches"><label><input type="checkbox" id="s3-recreate"> Es una copia recreable y acepto una sola AZ</label></div></section>
 <section class="panel"><span class="eyebrow">LA DECISIÓN Y SU PORQUÉ</span><div id="s3-result" aria-live="polite"></div><p class="muted">No es un cotizador. La frecuencia y demora no son los únicos factores: considerá tamaños, solicitudes, recuperación y duración mínima. Express One Zone es un caso especializado de baja latencia y no se selecciona en este ejercicio.</p></section></div>`;
 const evaluate=()=>{const f=$('#s3-frequency').value,l=$('#s3-latency').value,r=$('#s3-recreate').checked;let n,why;
 if(f==='frequent'){n='S3 Standard';why='El archivo se consulta con frecuencia. No hay motivo para imponer restauraciones de archivo.'}
 else if(f==='unknown'){n='S3 Intelligent-Tiering';why='El acceso es cambiante; el servicio puede ajustar niveles. Los niveles de archivo que requieren espera son opcionales y deben configurarse según necesidad.'}
 else if(f==='infrequent'){n=r?'S3 One Zone-IA':'S3 Standard-IA';why=r?'La copia puede recrearse y aceptás una AZ; revisá el costo total y el riesgo de pérdida zonal.':'Necesitás poco acceso con lectura inmediata y resiliencia en varias AZ.'}
 else if(l==='instant'){n='S3 Glacier Instant Retrieval';why='Querés archivo con lectura inmediata. No elijas una clase que exige restauración si no podés esperar.'}
 else if(l==='minutes'){n='S3 Glacier Flexible Retrieval';why='Aceptás una recuperación diferida. La modalidad y condiciones de restauración determinan la demora.'}
 else {n='S3 Glacier Deep Archive';why='Priorizás archivo de largo plazo y aceptás mayor demora de recuperación. Revisá mínimos y costo de restaurar.'}
 $('#s3-result').innerHTML=`<div class="decision yes"><span>${n}</span><p>${why}</p></div><h3>Qué priorizaste</h3><p>${f==='archive'?'Necesidad de archivo + tiempo de recuperación.':f==='unknown'?'Incertidumbre de acceso.':f==='frequent'?'Acceso habitual.':'Poco acceso + resiliencia zonal.'}</p><button id="s3-openlesson">Ver comparador de clases →</button>`;$('#s3-openlesson').onclick=()=>openLesson(services.find(s=>s.name==='Comparador de clases S3').id);
 };['s3-frequency','s3-latency','s3-recreate'].forEach(id=>$('#'+id).onchange=evaluate);evaluate();
}
function tcoWorkshop(){
 const fields=[['tco-months','Período de comparación · meses',36],['tco-hardware','Compra inicial local · USD',8000],['tco-local','Operación local mensual · USD',400],['tco-migration','Migración inicial a nube · USD',2000],['tco-cloud','Operación cloud mensual · USD',450]];
 $('#lab-content').innerHTML=`<div class="notice">Cifras ficticias para aprender el cálculo. No son precios de AWS ni una recomendación financiera.</div><div class="challenge"><section class="panel"><span class="eyebrow">MISIÓN · COMPARAR EL ALCANCE COMPLETO</span><h2>El precio del servidor no es todo.</h2><p>Usá el mismo período y capacidades equivalentes. Agregá personal, licencias, energía, soporte y consumo a los totales operativos que correspondan.</p>${fields.map(([id,label,value])=>`<div class="step"><label for="${id}">${label}</label><input type="number" id="${id}" min="${id==='tco-months'?1:0}" max="${id==='tco-months'?120:10000000}" step="${id==='tco-months'?1:0.01}" value="${value}"></div>`).join('')}</section><section class="panel"><span class="eyebrow">TOTAL PARA EL MISMO PERÍODO</span><div id="tco-result" aria-live="polite"></div><p class="muted">Fórmula: costo inicial + costo mensual × meses. En un análisis real también revisarías valor residual, impuestos, crecimiento, disponibilidad, costos de salida y calidad del servicio.</p></section></div>`;
 const calculate=()=>{const vals=fields.map(([id])=>Number($('#'+id).value));if(vals.some(v=>!Number.isFinite(v)||v<0)||!Number.isInteger(vals[0])||vals[0]<1||vals[0]>120||fields.some(([id])=>$('#'+id).value==='')){$('#tco-result').innerHTML='<p>Ingresá importes no negativos y un período entero entre 1 y 120 meses.</p>';return}
 const [months,hardware,local,migration,cloud]=vals,totalLocal=hardware+local*months,totalCloud=migration+cloud*months,delta=totalLocal-totalCloud,max=Math.max(totalLocal,totalCloud,1),money=v=>v.toLocaleString('es-AR',{style:'currency',currency:'USD',maximumFractionDigits:0});
 $('#tco-result').innerHTML=`<div class="tco-number"><small>Infraestructura local</small><strong>${money(totalLocal)}</strong><div class="bar"><div style="width:${totalLocal/max*100}%;background:#c59851"></div></div></div><div class="tco-number"><small>Escenario cloud</small><strong>${money(totalCloud)}</strong><div class="bar"><div style="width:${totalCloud/max*100}%"></div></div></div><div class="memory"><strong>${delta===0?'Los totales son iguales.':delta>0?'Cloud cuesta menos en este escenario.':'Local cuesta menos en este escenario.'}</strong><p>Diferencia: ${money(Math.abs(delta))} durante ${months} meses.</p></div><p>El resultado cambia con tus supuestos. La nube aporta otras ventajas, pero no garantiza ahorro en toda carga.</p>`;
 };fields.forEach(([id])=>$('#'+id).oninput=calculate);calculate();
}
let responsibilityIndex=0,responsibilityAnswers={};
const responsibilityCases=[
 ['En EC2, reemplazar hardware físico del servidor.','AWS','AWS administra infraestructura física; vos administrás el sistema operativo invitado y la aplicación.'],
 ['En EC2, instalar parches del sistema operativo invitado.','Vos','En EC2 el cliente opera el sistema invitado. El reparto cambia en servicios más administrados.'],
 ['En S3, decidir quién tiene permiso de leer un objeto.','Vos','AWS opera la infraestructura del servicio; vos configurás el acceso y clasificás tus datos.'],
 ['En Lambda, mantener la infraestructura subyacente de ejecución.','AWS','No administrás esos servidores; seguís respondiendo por código, permisos y datos de la función.'],
 ['En una aplicación, clasificar datos sensibles y configurar su acceso.','Vos','Un servicio administrado no conoce automáticamente tus obligaciones ni tu intención de acceso.'],
 ['En RDS, administrar el hardware y el sistema operativo subyacente del servicio.','AWS','RDS delega tareas de infraestructura a AWS. El cliente sigue gestionando datos, accesos y opciones de configuración.']
];
function responsibilityWorkshop(){const c=responsibilityCases[responsibilityIndex],answer=responsibilityAnswers[responsibilityIndex];$('#lab-content').innerHTML=`<section class="quizbox"><div class="progresshead"><span>MISIÓN · RESPONSABILIDAD COMPARTIDA</span><span>${responsibilityIndex+1} / ${responsibilityCases.length}</span></div><span class="tag">${Object.values(responsibilityAnswers).filter(Boolean).length} aciertos</span><h2>${c[0]}</h2><p>¿Quién se ocupa de esta tarea en el contexto indicado?</p><div class="compare"><button class="answer" data-resp="AWS" ${answer!==undefined?'disabled':''}>☁ AWS</button><button class="answer" data-resp="Vos" ${answer!==undefined?'disabled':''}>◉ Vos · cliente</button></div><div id="responsibility-feedback" role="status">${answer!==undefined?`<div class="feedback ${answer?'':'bad'}"><strong>${answer?'✓ Correcto.':'La respuesta es '+c[1]+'.'}</strong> ${c[2]}</div>`:''}</div><div class="row spread" style="margin-top:20px"><button id="responsibility-reset">Reiniciar misión</button><button id="responsibility-next" ${answer===undefined?'disabled':''}>${responsibilityIndex===responsibilityCases.length-1?'Volver al inicio':'Siguiente →'}</button></div></section>`;document.querySelectorAll('[data-resp]').forEach(b=>b.onclick=()=>{responsibilityAnswers[responsibilityIndex]=b.dataset.resp===c[1];responsibilityWorkshop()});$('#responsibility-reset').onclick=()=>{responsibilityAnswers={};responsibilityIndex=0;responsibilityWorkshop()};$('#responsibility-next').onclick=()=>{responsibilityIndex=(responsibilityIndex+1)%responsibilityCases.length;responsibilityWorkshop()}}
const terms=[
 ['Administrado','AWS asume parte del trabajo operativo de un servicio. El alcance cambia: no elimina tu responsabilidad sobre datos, permisos y configuración.'],['API','Interfaz que define cómo un programa solicita operaciones o datos a otro. AWS expone operaciones como llamadas a API.'],['ARN','Amazon Resource Name: identificador de un recurso AWS usado, por ejemplo, al escribir policies.'],['AZ','Availability Zone: ubicación aislada dentro de una región para alojar recursos y diseñar resiliencia.'],['Backend','Parte de una aplicación que ejecuta lógica del servidor y accede a datos.'],['Bucket','Contenedor lógico para objetos de S3.'],['Caché','Copia de acceso rápido que reduce consultas repetidas. Necesita una estrategia para mantener los datos vigentes.'],['CapEx','Inversión de capital, por ejemplo la compra inicial de equipos.'],['CDN','Content Delivery Network: red que distribuye contenido desde ubicaciones cercanas a los usuarios. CloudFront es una CDN.'],['CIDR','Notación para representar un rango de direcciones de red con un prefijo, por ejemplo 10.0.0.0/24.'],['CI/CD','Integración continua y entrega o despliegue continuo: verificar y automatizar cambios de software.'],['Compliance','Cumplimiento de requisitos aplicables a una organización, industria, dato o ubicación.'],['Contenedor','Forma de empaquetar una aplicación y sus dependencias para ejecutarla de manera consistente.'],['CPU','Unidad que ejecuta instrucciones. Es una dimensión para elegir capacidad de cómputo.'],['Desacoplamiento','Reducir dependencia directa entre componentes, por ejemplo colocando una cola entre productor y consumidor.'],['DNS','Sistema que resuelve nombres como un dominio hacia destinos de red.'],['DDoS','Ataque distribuido de denegación de servicio: muchas fuentes intentan afectar disponibilidad.'],['Durabilidad','Capacidad de conservar datos; es distinta de poder acceder al sistema en un momento dado.'],['Elasticidad','Ajustar recursos hacia arriba y abajo según la demanda.'],['ETL','Extract, Transform, Load: extraer, transformar y cargar datos para otro uso.'],['Federación','Acceder mediante una identidad gestionada por un proveedor de identidades, evitando duplicar credenciales de larga duración.'],['Frontend','Interfaz de una aplicación con la que interactúa la persona, normalmente en su navegador.'],['Framework','Conjunto de herramientas o prácticas que estructura el trabajo. El significado concreto depende del contexto.'],['HTTPS / TLS','HTTPS usa TLS para proteger la comunicación web en tránsito.'],['IaC','Infrastructure as Code: declarar infraestructura en archivos que pueden versionarse y revisarse.'],['Idempotencia','Diseñar una operación para que repetirla no produzca efectos adicionales no deseados. Es importante con reintentos de mensajes.'],['Latencia','Tiempo que tarda una operación o comunicación. Menos latencia suele mejorar respuesta percibida.'],['MFA','Multi-Factor Authentication: verificar identidad con más de un factor de autenticación.'],['NoSQL','Familia de bases con modelos distintos del relacional; no significa que no requieran diseño de consultas.'],['On-premises','Infraestructura ubicada en instalaciones propias o bajo el entorno local de una organización.'],['OpEx','Gasto operativo, como costos recurrentes de funcionamiento.'],['Policy','Documento que expresa permisos, restricciones o condiciones, según el tipo de política.'],['Región','Área geográfica de AWS con varias zonas de disponibilidad.'],['RPO','Recovery Point Objective: pérdida temporal máxima de datos que una organización tolera.'],['RTO','Recovery Time Objective: tiempo objetivo para recuperar un servicio.'],['Serverless','Modelo en el que no administrás servidores subyacentes. Tiene servidores y puede generar cargos.'],['SQL','Lenguaje utilizado para consultar y manipular datos estructurados; se usa en motores y servicios diversos.'],['Stateful / Stateless','Con estado / sin estado. En filtros de red indica si se recuerda el contexto de una conexión para su respuesta.'],['Streaming','Procesar o transportar datos que llegan de manera continua.'],['TCO','Total Cost of Ownership: costo total de una alternativa durante un período y alcance comparables.'],['VPC','Virtual Private Cloud: red virtual aislada lógicamente en AWS.']
];
terms.push(...[["Recurso", "Componente que creás o utilizás en la nube.", "Una instancia EC2 o un bucket S3.", "Servicio: EC2 es el servicio; tu instancia es un recurso."], ["Workload / carga de trabajo", "Conjunto de componentes que entrega una capacidad de negocio.", "La web, API y base de datos de una tienda.", "Instancia: una carga puede usar muchos recursos."], ["Provisioning / aprovisionamiento", "Preparar y configurar recursos para usarlos.", "Crear una instancia con su red y almacenamiento.", "Despliegue: publica una versión de la aplicación; puede incluir aprovisionar."], ["Instancia", "Unidad concreta de ejecución de un servicio; en EC2, un servidor virtual.", "Una instancia EC2 ejecuta tu backend.", "Tipo de instancia: describe capacidad, no un servidor concreto."], ["Endpoint", "Dirección o punto de acceso a un servicio o componente.", "El hostname de conexión de una base RDS.", "VPC endpoint: recurso específico para acceso privado a servicios compatibles."], ["Disponibilidad", "Capacidad de acceder y usar un sistema cuando se necesita.", "Una web responde durante el horario requerido.", "Durabilidad: conservar datos no garantiza acceso inmediato."], ["Alta disponibilidad / HA", "Diseño que reduce interrupciones mediante recursos y mecanismos de recuperación.", "Servidores en varias AZ detrás de un balanceador.", "Disponibilidad absoluta: HA no significa cero interrupciones."], ["Redundancia", "Tener componentes o copias adicionales para reducir dependencias únicas.", "Dos servidores pueden cubrir una necesidad similar.", "Backup: una copia histórica recuperable cumple otra función."], ["Tolerancia a fallos", "Capacidad de seguir funcionando ante fallos definidos en el diseño.", "Otro componente asume trabajo al fallar uno.", "HA: comparten objetivos; tolerancia exige considerar continuidad ante fallos concretos."], ["Failover", "Pasar a un recurso alternativo cuando falla el principal.", "La base usa una instancia de reserva tras un fallo.", "Escalado: agrega capacidad; no implica sustituir un recurso averiado."], ["SPOF", "Single Point of Failure: componente cuya caída interrumpe el sistema.", "Un único servidor sin reemplazo.", "Redundancia: disponer de otra copia solo ayuda si puede asumir la función."], ["Backup / copia de seguridad", "Copia recuperable de datos para volver a un estado anterior.", "Respaldar una base antes de un cambio.", "Replicación: puede propagar un borrado accidental."], ["Restauración", "Proceso de recuperar datos o recursos desde una copia.", "Recuperar una base desde un backup verificado.", "Backup: tener la copia no demuestra que puedas restaurarla a tiempo."], ["Replicación", "Copiar cambios a otro destino para mantener datos relacionados.", "Una réplica de lectura recibe cambios de la base principal.", "Backup: las réplicas no sustituyen copias históricas independientes."], ["Snapshot", "Captura del estado de datos en un momento, según las garantías del servicio.", "Un snapshot de un volumen EBS.", "Copia completa física: algunos snapshots almacenan cambios incrementalmente."], ["Mínimo privilegio", "Otorgar solo las acciones y recursos necesarios para una tarea.", "Un rol lee un bucket sin poder borrarlo.", "Acceso administrador: es mucho más amplio de lo necesario."], ["Credenciales", "Elementos usados para demostrar una identidad o firmar solicitudes.", "Credenciales temporales de un rol.", "Permisos: identificarse no concede automáticamente todas las acciones."], ["Principal", "Identidad o entidad que solicita una acción; en policies, quién puede actuar.", "Un rol asumido llama a una API.", "Policy: define permisos; no es la identidad que actúa."], ["Autenticación", "Verificar quién realiza una solicitud.", "Iniciar sesión con contraseña y MFA.", "Autorización: decide qué puede hacer esa identidad."], ["Autorización", "Evaluar si una identidad puede realizar una acción sobre un recurso.", "Una policy permite s3:GetObject en un bucket.", "Autenticación: saber quién sos no basta para permitir la operación."], ["Cifrado", "Transformar datos usando claves para impedir su lectura sin autorización criptográfica.", "Cifrar datos almacenados con una clave KMS.", "Hash: genera una huella, no se descifra para recuperar el original."], ["Rotación de secretos", "Reemplazar periódicamente o por un evento una credencial y coordinar su uso.", "Actualizar una contraseña gestionada por Secrets Manager.", "Rotación de clave KMS: no es el mismo proceso que cambiar una contraseña."], ["Subred / subnet", "Rango de direcciones de una VPC que pertenece a una sola AZ.", "Una subred privada contiene servidores de aplicación.", "Pública: la determina su ruta al Internet Gateway, no solo su nombre."], ["Puerto", "Número que identifica un punto lógico de comunicación de un protocolo de transporte.", "HTTPS suele usar TCP 443.", "Dirección IP: identifica el destino de red, no la aplicación por sí sola."], ["Protocolo", "Reglas para intercambiar información.", "TCP transporta datos y HTTPS protege comunicación web con TLS.", "Puerto: es un número; el protocolo define reglas."], ["Tabla de rutas", "Reglas que eligen el siguiente destino para un rango de direcciones.", "Una ruta 0.0.0.0/0 apunta a un NAT Gateway.", "Security Group: permite o bloquea tráfico; no elige su camino."], ["IP pública", "Dirección enrutable en internet, si conectividad y controles lo permiten.", "Una instancia accesible tiene IP pública y rutas adecuadas.", "Acceso garantizado: también requiere rutas y permisos de red."], ["IP privada", "Dirección usada para comunicación dentro de redes privadas.", "Dos instancias se comunican por direcciones privadas.", "Aislamiento total: una red privada puede tener salida mediante NAT o conectividad privada."], ["Ancho de banda / bandwidth", "Capacidad de transferencia de un enlace por unidad de tiempo.", "Un enlace de 1 Gbit/s tiene esa capacidad nominal.", "Latencia: mide demora, no capacidad."], ["Ingress / entrada", "Tráfico que ingresa al recurso o límite que estás considerando.", "Una solicitud entra al balanceador.", "Egress: el sentido se define respecto del componente observado."], ["Egress / salida", "Tráfico que sale del recurso o límite considerado.", "Un servidor descarga actualizaciones hacia internet.", "Ingreso: una misma comunicación tiene entrada y salida en distintos puntos."], ["Evento", "Registro de que ocurrió un cambio o hecho.", "Se creó un objeto en S3.", "Comando: solicita una acción; el evento informa algo ocurrido."], ["Trigger / disparador", "Configuración o condición que inicia una acción.", "Una carga en S3 inicia el procesamiento de una función.", "Evento: el hecho ocurrido; trigger es el mecanismo que reacciona."], ["Productor", "Componente que publica mensajes o eventos.", "La API envía pedidos a una cola SQS.", "Consumidor: recibe y procesa esos mensajes."], ["Consumidor", "Componente que recibe y procesa mensajes o eventos.", "Una Lambda procesa pedidos desde SQS.", "Suscriptor: expresa una suscripción; no siempre describe una cola de trabajo."], ["Cola / queue", "Almacén de mensajes pendientes para procesamiento desacoplado.", "SQS retiene pedidos mientras el consumidor está ocupado.", "Pub/sub: distribuye publicaciones a suscriptores; una cola reparte trabajo entre consumidores."], ["Suscriptor", "Destino que se registra para recibir publicaciones de un tema o sistema.", "Una cola SQS se suscribe a un tema SNS.", "Productor: es quien publica el mensaje."], ["Reintento / retry", "Volver a ejecutar una operación tras un fallo o falta de confirmación.", "Reprocesar un mensaje después de un error transitorio.", "Éxito seguro: pudo ejecutarse antes de perderse la respuesta; diseñá idempotencia."], ["DLQ / dead-letter queue", "Cola para mensajes que no pudieron procesarse según la configuración.", "Inspeccionar pedidos que excedieron los intentos permitidos.", "Backup: la DLQ requiere investigación y una estrategia de reprocesamiento."], ["Cuota / service quota", "Límite de uso de recursos u operaciones de un servicio.", "Cantidad permitida de ciertas instancias por región.", "Presupuesto: controla objetivos de gasto, no capacidad del servicio."], ["Umbral / threshold", "Valor que una métrica o condición compara para disparar una evaluación.", "Una alarma evalúa CPU mayor al 80% durante un período.", "Cuota: limita uso; un umbral de alarma no lo limita por sí mismo."], ["Utilización", "Proporción de capacidad usada en un período y dimensión.", "CPU al 20% es una señal de uso de cómputo.", "Eficiencia total: también importan memoria, red y necesidades de respuesta."], ["Rightsizing", "Ajustar tipo y tamaño de recursos a la demanda observada.", "Reducir una instancia sobredimensionada tras medirla.", "Auto Scaling: cambia cantidad o capacidad automáticamente según reglas."], ["Pago por uso / pay as you go", "Pagar según consumo y dimensiones de cada servicio.", "S3 cobra según almacenamiento y otras operaciones aplicables.", "Gratis: puede haber mínimos, recursos ociosos y cargos adicionales."], ["Compromiso de uso", "Aceptar un compromiso por un plazo a cambio de condiciones de precio.", "Savings Plans compromete un importe por hora durante un plazo.", "Reserva de capacidad: un descuento no siempre garantiza capacidad disponible."], ["Escalabilidad", "Capacidad de aumentar recursos para sostener más carga.", "Agregar servidores al crecer el tráfico.", "Elasticidad: también implica ajustar dinámicamente y reducir al bajar la demanda."], ["Escalado horizontal", "Agregar o quitar unidades de cómputo.", "Pasar de dos a cuatro servidores.", "Vertical: cambia el tamaño de una unidad."], ["Escalado vertical", "Aumentar o reducir capacidad de un recurso individual.", "Elegir una instancia con más memoria.", "Horizontal: modifica cantidad de unidades."], ["Security Group", "Filtro de red con estado asociado a recursos compatibles.", "Permitir HTTPS al balanceador.", "NACL: opera en la subred y no mantiene estado."], ["NACL", "Lista de control de red sin estado aplicada a una subred.", "Permitir puertos de ida y vuelta mediante reglas separadas.", "Security Group: mantiene estado y solo contiene reglas de permiso."], ["Observabilidad", "Entender el estado interno de un sistema mediante señales.", "Combinar métricas, logs y trazas para investigar errores.", "Monitoreo: vigila señales conocidas; observabilidad ayuda a explorar lo que ocurre."], ["Métrica", "Medición numérica registrada en el tiempo.", "Uso de CPU cada minuto.", "Log: registra eventos o mensajes con contexto."], ["Log", "Registro de eventos o mensajes producidos por un sistema.", "Una aplicación escribe un error con su identificador.", "Traza: sigue una solicitud entre componentes."], ["Traza / trace", "Seguimiento de una solicitud a través de sus operaciones y servicios.", "Ver cuánto tarda la API y su consulta a la base.", "Métrica: resume medidas; la traza conecta operaciones de una solicitud."]]);
const glossaryDetails = {
  "Administrado": [
    "En RDS, AWS mantiene la infraestructura subyacente del servicio.",
    "Serverless: un servicio administrado también puede requerir elegir instancias."
  ],
  "API": [
    "El frontend llama a una API para guardar una nota.",
    "Interfaz gráfica: la API conecta programas; la pantalla permite interacción humana."
  ],
  "ARN": [
    "Una policy usa arn:aws:s3:::informes/* para identificar objetos.",
    "Endpoint: es una dirección de acceso, no el identificador del recurso en una policy."
  ],
  "AZ": [
    "Distribuir servidores entre dos AZ de una región.",
    "Región: contiene varias AZ; una AZ puede incluir más de un centro de datos."
  ],
  "Backend": [
    "Una función valida un pedido y lo guarda en una base.",
    "Frontend: muestra la interfaz con la que interactuás."
  ],
  "Bucket": [
    "Un bucket S3 contiene fotos y documentos como objetos.",
    "Carpeta: el bucket contiene objetos con claves; los prefijos pueden parecer carpetas."
  ],
  "Caché": [
    "Guardar temporalmente un resultado frecuente en ElastiCache.",
    "Base de origen: la caché puede contener datos vencidos o perder entradas."
  ],
  "CapEx": [
    "Comprar servidores físicos para un centro de datos.",
    "OpEx: gastos operativos recurrentes, como electricidad o consumo de servicios."
  ],
  "CDN": [
    "CloudFront entrega imágenes desde ubicaciones de borde.",
    "DNS: resuelve nombres; no distribuye por sí mismo el contenido."
  ],
  "CIDR": [
    "10.0.1.0/24 representa un bloque de 256 direcciones IPv4 totales.",
    "Direcciones utilizables: en una subred IPv4 AWS reserva cinco direcciones del bloque."
  ],
  "CI/CD": [
    "Un pipeline verifica cambios y despliega una versión aprobada.",
    "Entrega continua y despliegue continuo: la entrega puede conservar una aprobación manual para producción."
  ],
  "Compliance": [
    "Revisar controles y evidencias frente a requisitos de una auditoría.",
    "Seguridad garantizada: cumplir un estándar no elimina todos los riesgos."
  ],
  "Contenedor": [
    "Empaquetar una API con sus dependencias en una imagen.",
    "Máquina virtual: los contenedores comparten el kernel del host; una VM tiene su propio sistema invitado."
  ],
  "CPU": [
    "Medir uso del procesador para elegir capacidad de una instancia.",
    "Memoria RAM: almacena datos de trabajo; no ejecuta instrucciones como la CPU."
  ],
  "Desacoplamiento": [
    "SQS conserva pedidos mientras el procesador está ocupado.",
    "Independencia absoluta: siguen existiendo contratos de mensajes y dependencias operativas."
  ],
  "DNS": [
    "Resolver el nombre de una web hacia su destino de red.",
    "URL: también puede incluir protocolo, ruta y parámetros."
  ],
  "DDoS": [
    "Muchas fuentes saturan un servicio con tráfico para interrumpirlo.",
    "Carga legítima: un pico de visitas reales no es necesariamente un ataque."
  ],
  "Durabilidad": [
    "Conservar un objeto aunque fallen componentes de almacenamiento.",
    "Disponibilidad: los datos pueden conservarse aunque temporalmente no puedas acceder a ellos."
  ],
  "Elasticidad": [
    "Agregar capacidad ante un pico y reducirla cuando termina.",
    "Escalabilidad: describe la capacidad de crecer; no exige ajuste dinámico de ida y vuelta."
  ],
  "ETL": [
    "Extraer ventas, normalizar monedas y cargar un repositorio analítico.",
    "ELT: carga antes de transformar, cambiando el orden del procesamiento."
  ],
  "Federación": [
    "Acceder a AWS mediante el proveedor de identidades de la empresa.",
    "Usuario IAM local: tiene una identidad gestionada directamente en la cuenta AWS."
  ],
  "Frontend": [
    "La pantalla que permite escribir y enviar una nota.",
    "Backend: valida solicitudes y ejecuta lógica del servidor."
  ],
  "Framework": [
    "Well-Architected organiza la revisión de una arquitectura mediante pilares y prácticas.",
    "Servicio: un marco de prácticas no es un recurso que desplegás."
  ],
  "HTTPS / TLS": [
    "El navegador establece una conexión HTTPS con la API.",
    "Cifrado en reposo: TLS protege datos en tránsito, no el almacenamiento por sí solo."
  ],
  "IaC": [
    "Versionar archivos Terraform que declaran una VPC y sus subredes.",
    "Script imperativo: describe pasos; IaC también permite declarar un estado deseado."
  ],
  "Idempotencia": [
    "Procesar dos veces el mismo identificador de pedido sin cobrar dos veces.",
    "Entrega exactamente una vez: la idempotencia controla efectos aunque haya entregas repetidas."
  ],
  "Latencia": [
    "Una solicitud tarda 80 ms en recibir respuesta.",
    "Ancho de banda: mide capacidad de transferencia, no demora."
  ],
  "MFA": [
    "Usar una contraseña y un código de una aplicación autenticadora.",
    "Dos contraseñas: siguen siendo el mismo tipo de factor, algo que sabés."
  ],
  "NoSQL": [
    "DynamoDB almacena elementos consultados mediante claves diseñadas para la aplicación.",
    "Ausencia de esquema: igual necesitás definir estructura y patrones de acceso."
  ],
  "On-premises": [
    "Ejecutar servidores en las instalaciones de la empresa.",
    "Nube privada: no toda infraestructura local ofrece un modelo de nube."
  ],
  "OpEx": [
    "Pagar mensualmente energía, soporte o consumo cloud.",
    "CapEx: inversión inicial de capital, como comprar hardware."
  ],
  "Policy": [
    "Permitir s3:GetObject sobre objetos de un bucket específico.",
    "Rol: es una identidad a la que pueden asociarse políticas."
  ],
  "Región": [
    "Elegir una región para ubicar una base cerca de sus usuarios.",
    "AZ: es una ubicación aislada dentro de la región."
  ],
  "RPO": [
    "Un RPO de 15 minutos tolera perder como máximo ese intervalo de cambios.",
    "RTO: mide el tiempo objetivo para recuperar el servicio, no la pérdida de datos."
  ],
  "RTO": [
    "Un RTO de una hora establece el objetivo para restablecer el servicio.",
    "RPO: expresa cuánto historial reciente de datos puede perderse."
  ],
  "Serverless": [
    "Lambda ejecuta una función sin que administres el servidor subyacente.",
    "Sin servidores o sin costo: existen servidores y se aplican dimensiones de cobro."
  ],
  "SQL": [
    "Consultar pedidos con SELECT en una base relacional.",
    "Base de datos: SQL es un lenguaje; RDS es un servicio que ofrece distintos motores."
  ],
  "Stateful / Stateless": [
    "Un Security Group recuerda conexiones; una NACL evalúa por separado tráfico de ida y vuelta.",
    "Estado de una aplicación: el significado depende del contexto; aquí se describe filtrado de red."
  ],
  "Streaming": [
    "Procesar mediciones de sensores a medida que llegan.",
    "Batch: procesa grupos de datos en ejecuciones separadas."
  ],
  "TCO": [
    "Comparar compra, operación y mantenimiento durante tres años.",
    "Precio inicial: no incluye todos los costos del período analizado."
  ],
  "VPC": [
    "Ubicar servidores y subredes en una red virtual de tu cuenta.",
    "VPN: conecta redes o usuarios mediante un túnel; no es la red virtual misma."
  ]
};
for (const term of terms) {
 if (term.length === 2) term.push(...glossaryDetails[term[0]]);
}
terms.sort((a,b)=>a[0].localeCompare(b[0],'es',{sensitivity:'base'}));
function glossary(){app.innerHTML=intro('GLOSARIO TÉCNICO','El término exacto, en palabras claras.','Definiciones, ejemplos y diferencias para conectar el vocabulario con situaciones reales.')+`<div class="tools"><input id="term-search" type="search" aria-label="Buscar término técnico" placeholder="Buscar: failover, endpoint, DLQ, permisos…"></div><div id="term-count" class="term-count" role="status"></div><div class="glossary-grid" id="terms"></div>`;const show=()=>{const q=normalize($('#term-search').value),items=terms.filter(t=>normalize(t.join(' ')).includes(q));$('#term-count').textContent=items.length+' de '+terms.length+' términos';$('#terms').innerHTML=items.map(([n,d,e,c])=>`<article class="panel"><h3>${esc(n)}</h3><p>${esc(d)}</p>${e?`<p class="term-example"><strong>Ejemplo:</strong> ${esc(e)}</p><p class="term-confusion"><strong>No confundir con:</strong> ${esc(c)}</p>`:''}</article>`).join('')||'<p>No encontramos ese término. Probá con otra palabra.</p>'};$('#term-search').oninput=show;show()}
