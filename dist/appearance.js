(()=>{
 const palettes={sage:['Verde salvia','#216e5c','#83c8ad'],slate:['Azul pizarra','#3e607c','#9cbfdc'],lavender:['Lavanda grisácea','#6b587f','#c5addc'],terracotta:['Terracota','#92533f','#e5ad98'],sand:['Arena','#786035','#d7c394']};
 let choice={palette:'sage',mode:'light'};
 try{const saved=JSON.parse(localStorage.getItem('aws-flopy-appearance-v1')||'null');if(saved&&palettes[saved.palette]&&['light','dark'].includes(saved.mode))choice=saved}catch{}
 const apply=()=>{const root=document.documentElement;root.dataset.palette=choice.palette;root.dataset.mode=choice.mode;root.style.setProperty('--green',palettes[choice.palette][choice.mode==='dark'?2:1]);root.style.colorScheme=choice.mode;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',choice.mode==='dark'?'#141416':'#f7f8f5')};
 apply();
 document.addEventListener('DOMContentLoaded',()=>{
 const dialog=document.querySelector('#appearance-dialog'),status=document.querySelector('#appearance-status');
 document.querySelector('#palette-options').innerHTML=Object.entries(palettes).map(([key,[name,color]])=>`<button data-palette="${key}" aria-pressed="false"><span class="palette-dot" style="background:${color}" aria-hidden="true"></span>${name}</button>`).join('');
 const sync=()=>{dialog.querySelectorAll('[data-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===choice.palette)));dialog.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===choice.mode)))};
 const save=()=>{apply();sync();try{localStorage.setItem('aws-flopy-appearance-v1',JSON.stringify(choice));status.textContent=palettes[choice.palette][0]+' · modo '+(choice.mode==='dark'?'oscuro':'claro')+' guardado.'}catch{status.textContent='Aplicado. Este navegador no permitió guardar la preferencia.'}};
 dialog.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>{choice.palette=b.dataset.palette;save()});dialog.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{choice.mode=b.dataset.mode;save()});
 document.querySelector('#appearance-open').onclick=()=>{sync();dialog.showModal()};document.querySelector('#appearance-close').onclick=()=>dialog.close();sync();
 });
})();
