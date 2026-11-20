const toggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
if(toggle&&nav){toggle.addEventListener("click",()=>{const opened=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(opened));toggle.textContent=opened?"×":"☰";});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰";}));}
const $=id=>document.getElementById(id),KEY="verena_catalog_v1",CART="verena_cart_v1",PROMO="verena_promo_v1";
const seed=[
{id:"p1",name:"Pão francês",category:"Pães",description:"Clássico para o café da manhã",price:"",emoji:"🥖"},
{id:"p2",name:"Pão de queijo",category:"Pães",description:"Um clássico mineiro",price:"",emoji:"🧀"},
{id:"p3",name:"Baguete",category:"Pães",description:"Opção tradicional para compartilhar",price:"",emoji:"🥖"},
{id:"p4",name:"Coxinha",category:"Salgados",description:"Consulte os sabores disponíveis",price:"",emoji:"🥟"},
{id:"p5",name:"Salgado assado",category:"Salgados",description:"Consulte as opções do dia",price:"",emoji:"🥐"},
{id:"p6",name:"Bolo caseiro",category:"Doces",description:"Consulte os sabores disponíveis",price:"",emoji:"🍰"},
{id:"p7",name:"Café",category:"Bebidas",description:"Para acompanhar seu lanche",price:"",emoji:"☕"},
{id:"p8",name:"Pão de batata",category:"Pães",description:"Consulte disponibilidade",price:"",emoji:"🥯"},
{id:"p9",name:"Sonho",category:"Doces",description:"Consulte os recheios disponíveis",price:"",emoji:"🍩"},
{id:"p10",name:"Pudim",category:"Doces",description:"Sobremesa tradicional; consulte disponibilidade",price:"",emoji:"🍮"},
{id:"p11",name:"Torta doce",category:"Doces",description:"Consulte sabores e fatias disponíveis",price:"",emoji:"🥧"},
{id:"p12",name:"Pão de mel",category:"Doces",description:"Consulte disponibilidade",price:"",emoji:"🍯"},
{id:"p13",name:"Suco",category:"Bebidas",description:"Consulte sabores e tamanhos",price:"",emoji:"🧃"},
{id:"p14",name:"Refrigerante",category:"Bebidas",description:"Consulte marcas e tamanhos",price:"",emoji:"🥤"},
{id:"p15",name:"Água",category:"Bebidas",description:"Consulte opções disponíveis",price:"",emoji:"💧"},
{id:"p16",name:"Chocolate quente",category:"Bebidas",description:"Consulte disponibilidade",price:"",emoji:"🍫"},
{id:"p17",name:"Misto quente",category:"Lanches",description:"Consulte montagem e disponibilidade",price:"",emoji:"🥪"},
{id:"p18",name:"Sanduíche natural",category:"Lanches",description:"Consulte sabores disponíveis",price:"",emoji:"🥪"},
{id:"p19",name:"Hambúrguer",category:"Lanches",description:"Sugestão de cardápio; confirme com a unidade",price:"",emoji:"🍔"},
{id:"p20",name:"Pizza em fatia",category:"Lanches",description:"Consulte se há disponibilidade no dia",price:"",emoji:"🍕"},
{id:"p21",name:"Prato feito",category:"Refeições",description:"Consulte se há refeições disponíveis",price:"",emoji:"🍛"},
{id:"p22",name:"Self-service",category:"Refeições",description:"Consulte existência, dias, horários e valores",price:"",emoji:"🥗"},
{id:"p23",name:"Marmita",category:"Refeições",description:"Consulte disponibilidade e opções",price:"",emoji:"🍱"},
{id:"p24",name:"Kit café da manhã",category:"Encomendas",description:"Consulte composição, prazo e valores",price:"",emoji:"🧺"},
{id:"p25",name:"Bolo por encomenda",category:"Encomendas",description:"Consulte tamanhos, sabores e antecedência",price:"",emoji:"🎂"},
{id:"p26",name:"Salgados para festas",category:"Encomendas",description:"Consulte quantidade mínima e prazo",price:"",emoji:"🥟"}
];
let products=load(KEY,seed),cart=load(CART,[]),category="Todos",favorites=new Set(load("verena_favs_v1",[]));
function load(k,fallback){try{const v=JSON.parse(localStorage.getItem(k));return v??fallback}catch{return fallback}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(error){console.warn("Não foi possível salvar neste navegador:",error)}}
function money(v){return v?"R$ "+v:"Consultar"}
function render(){
 const term=($("productSearch")?.value||"").toLocaleLowerCase("pt-BR");
 const list=products.filter(p=>(category==="Todos"||p.category===category)&&((p.name+" "+p.description).toLocaleLowerCase("pt-BR").includes(term))&&(!window.onlyFavorites||favorites.has(p.id)));
 $("catalogGrid").innerHTML=list.length?list.map(p=>'<article class="catalog-card"><div class="catalog-emoji">'+p.emoji+'</div><button class="favorite-button '+(favorites.has(p.id)?"selected":"")+'" data-fav="'+p.id+'" aria-label="Favoritar '+escapeHtml(p.name)+'">'+(favorites.has(p.id)?"♥":"♡")+'</button><span class="catalog-category">'+escapeHtml(p.category)+'</span><h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.description)+'</p><div class="catalog-card-bottom"><strong>'+money(p.price)+'</strong><button class="add-button" data-add="'+p.id+'">Adicionar +</button></div></article>').join(""):'<p class="empty-state">Nenhum produto encontrado nesta seleção.</p>';
 $("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("productSearch").addEventListener("input",()=>{window.onlyFavorites=false;render()});
$("categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;window.onlyFavorites=false;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===b));render()});
$("catalogGrid").addEventListener("click",e=>{const f=e.target.closest("[data-fav]"),a=e.target.closest("[data-add]");if(f){const id=f.dataset.fav;favorites.has(id)?favorites.delete(id):favorites.add(id);save("verena_favs_v1",[...favorites]);render()}if(a){const id=a.dataset.add,found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});save(CART,cart);render();renderCart();}});
$("showFavorites").addEventListener("click",()=>{window.onlyFavorites=true;category="Todos";$("productSearch").value="";document.querySelectorAll(".filter-chip").forEach((x,i)=>x.classList.toggle("active",i===0));render();$("cardapio").scrollIntoView({behavior:"smooth"});});
function show(id){$(id).hidden=false;document.body.classList.add("modal-open")}
function hide(id){$(id).hidden=true;if(document.querySelectorAll(".overlay:not([hidden])").length===0)document.body.classList.remove("modal-open")}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>hide(b.dataset.close)));
document.querySelectorAll(".overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)hide(o.id)}));
$("openCart").addEventListener("click",()=>{renderCart();show("cartOverlay")});
function renderCart(){$("cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(p=>p.id===x.id);return p?'<div class="cart-line"><div><strong>'+escapeHtml(p.name)+'</strong><small>'+money(p.price)+'</small></div><div class="qty-control"><button data-qty="'+p.id+'" data-delta="-1">−</button><b>'+x.qty+'</b><button data-qty="'+p.id+'" data-delta="1">+</button><button class="remove-line" data-remove="'+p.id+'">×</button></div></div>':''}).join(""):'<p class="empty-state">Sua sacola está vazia. Escolha algo no cardápio!</p>'}
$("cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const x=cart.find(v=>v.id===q.dataset.qty);x.qty+=Number(q.dataset.delta);if(x.qty<=0)cart=cart.filter(v=>v.id!==q.dataset.qty)}if(r)cart=cart.filter(v=>v.id!==r.dataset.remove);save(CART,cart);render();renderCart()});
const orderMode=$("orderMode"),addressWrap=$("deliveryAddressWrap");if(orderMode&&addressWrap)orderMode.addEventListener("change",()=>{addressWrap.hidden=orderMode.value!=="Entrega (consultar disponibilidade)"});
$("sendOrder").addEventListener("click",()=>{if(!cart.length){alert("Adicione pelo menos um produto à sacola.");return}const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return p?x.qty+"x "+p.name:""}).filter(Boolean);const mode=orderMode?.value||"Retirada no balcão";const address=$("deliveryAddress")?.value.trim()||"";if(mode.startsWith("Entrega")&&!address){alert("Informe o endereço para consultar a disponibilidade da entrega.");$("deliveryAddress")?.focus();return}const notes=$("orderNotes")?.value.trim()||"";const msg="Olá! Gostaria de consultar este pedido:\n"+lines.join("\n")+"\n\nModalidade: "+mode+(address?"\nEndereço: "+address:"")+(notes?"\nObservações: "+notes:"")+"\n\nPodem confirmar disponibilidade, valores, prazo e condições?";window.open("https://wa.me/5531990905985?text="+encodeURIComponent(msg),"_blank","noopener");});
const fb=window.verenaFirebase||null;
const db=fb?.db||null,auth=fb?.auth||null;
const ADMIN_UID="A4N9gGjLF4WKwY6N1Uzz0jyPWns2";
let isVerenaAdmin=false;
async function loadPublicProducts(){
 if(!db)return;
 try{
  const snap=await db.collection("produtos").where("ativo","==",true).get();
  if(!snap.empty){
   const remote=snap.docs.map(d=>({id:d.id,...d.data()}));
   const known=new Set(remote.map(p=>String(p.name||"").toLocaleLowerCase("pt-BR")));
   products=[...remote,...seed.filter(p=>!known.has(p.name.toLocaleLowerCase("pt-BR")))];
   render();
  }else{
   products=seed.slice();
   render();
  }
 }catch(error){console.error("Erro ao carregar catálogo:",error)}
}
async function loadAdminProducts(){
 const snap=await db.collection("produtos").get();
 if(snap.empty){
  for(const p of seed){
   const {id,...data}=p;
   await db.collection("produtos").doc(id).set({...data,ativo:true});
  }
 }
 const all=await db.collection("produtos").get();
 products=all.docs.map(d=>({id:d.id,...d.data()}));
 render();renderAdmin();
}
$("openAdmin").addEventListener("click",async()=>{
 $("adminLoginStatus").textContent="";
 $("adminPassword").value="";
 $("adminLoginForm").hidden=!!isVerenaAdmin;
 $("adminTools").hidden=!isVerenaAdmin;
 if(isVerenaAdmin){
  try{
   await loadAdminProducts();
   await loadAdminInbox();
   const config=await db.collection("configuracoes").doc("geral").get();
   const promoText=config.exists?(config.data().promo||""):"";
   $("promoInput").value=promoText;
  }catch(error){$("adminLoginStatus").textContent="Não foi possível carregar o painel: "+error.message}
 }
 show("adminOverlay");
});
$("adminLoginForm").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!auth||!db){$("adminLoginStatus").textContent="Firebase indisponível. Atualize a página e tente novamente.";return}
 const button=$("adminLoginButton");button.disabled=true;button.textContent="Verificando...";
 try{
  const credential=await auth.signInWithEmailAndPassword($("adminEmail").value.trim(),$("adminPassword").value);
  if(credential.user.uid!==ADMIN_UID){
   await auth.signOut();
   throw new Error("Esta conta não tem autorização para administrar o site.");
  }
  isVerenaAdmin=true;
  $("adminLoginForm").hidden=true;$("adminTools").hidden=false;
  $("adminSessionEmail").textContent=credential.user.email||"Administrador conectado";
  await loadAdminProducts();
  await loadAdminInbox();
  const config=await db.collection("configuracoes").doc("geral").get();
  const promoText=config.exists?(config.data().promo||""):"";
  $("promoInput").value=promoText;$("promoText").textContent=promoText||"Acompanhe os destaques e consulte a equipe sobre as ofertas disponíveis hoje.";
  $("adminLoginStatus").textContent="";
 }catch(error){$("adminLoginStatus").textContent=error.message||"Não foi possível entrar."}
 finally{button.disabled=false;button.textContent="Entrar no painel"}
});
$("adminLogout").addEventListener("click",async()=>{
 isVerenaAdmin=false;if(auth)await auth.signOut();
 $("adminTools").hidden=true;$("adminLoginForm").hidden=false;
 $("adminEmail").value="";$("adminPassword").value="";
});
if(auth)auth.onAuthStateChanged(user=>{
 isVerenaAdmin=!!(user&&user.uid===ADMIN_UID);
 if(user&&!isVerenaAdmin)auth.signOut().catch(console.error);
});
$("savePromo").addEventListener("click",async()=>{
 if(!isVerenaAdmin)return;
 const promo=$("promoInput").value.trim();
 try{
  await db.collection("configuracoes").doc("geral").set({promo,publico:true,atualizadoEm:new Date().toISOString()},{merge:true});
  $("promoText").textContent=promo||"Acompanhe os destaques e consulte a equipe sobre as ofertas disponíveis hoje.";
  alert("Destaque atualizado para todos os visitantes.");
 }catch(error){alert("Não foi possível salvar o destaque: "+error.message)}
});
function renderAdmin(){
 $("adminProductCount").textContent=products.length+" itens";
 $("adminProductList").innerHTML=products.map(p=>'<div class="admin-product"><span><strong>'+escapeHtml(p.name)+'</strong><small>'+escapeHtml(p.category)+' · '+money(p.price)+'</small></span><span><button data-edit="'+p.id+'">Editar</button><button data-delete="'+p.id+'">Excluir</button></span></div>').join("");
}
function resetForm(){$("productForm").reset();$("editProductId").value="";$("saveProduct").textContent="Adicionar produto";$("cancelEdit").hidden=true}
$("productForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!isVerenaAdmin)return;
 const id=$("editProductId").value;
 const data={name:$("adminProductName").value.trim(),category:$("adminProductCategory").value,price:$("adminProductPrice").value.trim(),description:$("adminProductDescription").value.trim(),emoji:"🥐",ativo:true};
 try{
  if(id)await db.collection("produtos").doc(id).set(data,{merge:true});
  else await db.collection("produtos").add(data);
  const snap=await db.collection("produtos").get();products=snap.docs.map(d=>({id:d.id,...d.data()}));
  resetForm();render();renderAdmin();
 }catch(error){alert("Erro ao salvar produto: "+error.message)}
});
$("adminProductList").addEventListener("click",async e=>{
 const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
 if(edit){const p=products.find(x=>x.id===edit.dataset.edit);if(!p)return;$("editProductId").value=p.id;$("adminProductName").value=p.name;$("adminProductCategory").value=p.category;$("adminProductPrice").value=p.price;$("adminProductDescription").value=p.description;$("saveProduct").textContent="Salvar alterações";$("cancelEdit").hidden=false}
 if(del&&confirm("Excluir este produto do catálogo compartilhado?")){
  try{await db.collection("produtos").doc(del.dataset.delete).delete();products=products.filter(p=>p.id!==del.dataset.delete);cart=cart.filter(x=>x.id!==del.dataset.delete);save(CART,cart);render();renderAdmin();renderCart()}
  catch(error){alert("Erro ao excluir produto: "+error.message)}
 }
});
$("cancelEdit").addEventListener("click",resetForm);
const promo=load(PROMO,"");if(promo)$("promoText").textContent=promo;
if(auth&&auth.currentUser&&auth.currentUser.uid===ADMIN_UID){isVerenaAdmin=true}
loadPublicProducts();
const reviewTrack=document.querySelector("#reviewsCarousel .reviews-track");
if(reviewTrack){
 const reviewCards=Array.from(reviewTrack.querySelectorAll(".review-card"));
 const reviewDots=Array.from(document.querySelectorAll("#reviewDots [data-review-dot]"));
 const prev=document.getElementById("reviewPrev"),next=document.getElementById("reviewNext");
 let reviewIndex=0,reviewTimer=null;
 const visibleCount=()=>window.matchMedia("(max-width:600px)").matches?1:2;
 const maxIndex=()=>Math.max(0,reviewCards.length-visibleCount());
 function moveReviews(index){
  reviewIndex=(index+maxIndex()+1)%(maxIndex()+1);
  const step=reviewCards.length>1?reviewCards[1].offsetLeft-reviewCards[0].offsetLeft:0;
  reviewTrack.style.transform="translate3d(-"+(step*reviewIndex)+"px,0,0)";
  reviewDots.forEach((dot,i)=>dot.classList.toggle("active",i===reviewIndex));
 }
 function restartAuto(){
  if(reviewTimer)clearInterval(reviewTimer);
  reviewTimer=setInterval(()=>moveReviews(reviewIndex>=maxIndex()?0:reviewIndex+1),3500);
 }
 if(prev)prev.addEventListener("click",()=>{moveReviews(reviewIndex<=0?maxIndex():reviewIndex-1);restartAuto()});
 if(next)next.addEventListener("click",()=>{moveReviews(reviewIndex>=maxIndex()?0:reviewIndex+1);restartAuto()});
 reviewDots.forEach(dot=>dot.addEventListener("click",()=>{moveReviews(Number(dot.dataset.reviewDot));restartAuto()}));
 window.addEventListener("resize",()=>moveReviews(Math.min(reviewIndex,maxIndex())));
 moveReviews(0);
 restartAuto();
}

/* Avaliações públicas: envio ao Firestore com moderação. */
const REVIEW_KEY="verena_reviews_prototype_v1";
function renderReviews(){
 const list=$("reviewList"),count=$("reviewCount");
 if(!list||!count)return;
 count.textContent="Carregando avaliações...";
 list.innerHTML='<div class="review-empty"><p>Carregando avaliações...</p></div>';
 if(!db)return;
 db.collection("avaliacoes").where("status","==","aprovada").get().then(snap=>{
  const saved=snap.docs.map(d=>d.data());
  count.textContent=saved.length+" "+(saved.length===1?"avaliação":"avaliações");
  list.innerHTML=saved.length?saved.map(r=>'<article class="review-item"><div class="review-item-top"><span class="review-item-name">'+escapeHtml(r.nome)+'</span><time class="review-item-date">'+escapeHtml(r.data||"")+'</time></div><div class="review-item-stars" aria-label="'+r.nota+' de 5 estrelas">'+("★".repeat(r.nota))+("☆".repeat(5-r.nota))+'</div><p>'+escapeHtml(r.comentario)+'</p></article>').join(""):'<div class="review-empty"><span>✦</span><strong>Seja a primeira pessoa a avaliar</strong><p>As avaliações aprovadas aparecerão aqui.</p></div>';
 }).catch(error=>{console.error(error);count.textContent="Avaliações";list.innerHTML='<p class="empty-state">Não foi possível carregar as avaliações agora.</p>'});
}
const reviewForm=$("reviewForm");
if(reviewForm){
 reviewForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const name=$("reviewName").value.trim(),comment=$("reviewComment").value.trim(),rating=Number($("reviewRating").value);
  if(!name||!comment||rating<1||rating>5)return;
  if(!db){$("reviewFeedback").textContent="Serviço temporariamente indisponível. Atualize a página e tente novamente.";return;}
  try{
   await db.collection("avaliacoes").add({nome:name,comentario:comment,nota:rating,data:new Date().toLocaleDateString("pt-BR"),status:"pendente"});
   reviewForm.reset();$("reviewFeedback").textContent="Avaliação enviada para análise. Obrigado por compartilhar sua experiência!";
  }catch(error){console.error("Falha ao enviar avaliação:",error);$("reviewFeedback").textContent="Falha ao enviar ("+(error?.code||"erro")+"): "+(error?.message||"Tente novamente.")}
 });
 renderReviews();
}

/* Sugestões e reclamações privadas no Firestore. */
const feedbackForm=$("feedbackForm");
if(feedbackForm){
 feedbackForm.addEventListener("submit",async e=>{
  e.preventDefault();
  const status=$("feedbackStatus"),submit=feedbackForm.querySelector('button[type="submit"]');
  const typeMap={"Sugestão":"sugestao","Reclamação":"reclamacao","Elogio":"elogio"};
  const tipo=typeMap[$("feedbackType").value],nome=$("feedbackName").value.trim(),mensagem=$("feedbackMessage").value.trim();
  if(!mensagem){status.textContent="Escreva sua mensagem antes de enviar.";return;}
  if(!tipo){status.textContent="Selecione o tipo da mensagem.";return;}
  if(!db){status.textContent="Firebase não foi inicializado. Recarregue a página e tente novamente.";return;}
  if(submit){submit.disabled=true;submit.dataset.originalText=submit.textContent;submit.textContent="Enviando...";}
  status.textContent="Enviando sua mensagem...";
  try{
   await db.collection("feedbacks").add({tipo,nome,mensagem,data:new Date().toISOString()});
   feedbackForm.reset();
   status.textContent="Mensagem enviada com sucesso à equipe da padaria. Obrigado pelo contato!";
  }catch(error){
   console.error("Falha ao registrar feedback no Firestore:",error);
   const code=error?.code||"erro-desconhecido";
   status.textContent="Falha ao enviar ("+code+"): "+(error?.message||"Verifique as regras do Firestore e tente novamente.");
  }finally{
   if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalText||"Registrar mensagem ↗";}
  }
 });
}

render();

/* Ações explícitas nos atalhos de sugestão, reclamação e elogio. */
document.querySelectorAll("[data-feedback-choice]").forEach(button=>{
 button.addEventListener("click",()=>{
  const form=$("feedbackForm"),select=$("feedbackType");
  if(!form||!select)return;
  select.value=button.dataset.feedbackChoice;
  form.scrollIntoView({behavior:"smooth",block:"center"});
  setTimeout(()=> $("feedbackMessage")?.focus({preventScroll:true}),350);
 });
});
/* Mensagens e avaliações: ferramentas administrativas protegidas pelas regras Firestore. */
async function loadAdminInbox(){
 if(!isVerenaAdmin||!db)return;
 const feedbackBox=$("adminFeedbackList"),reviewBox=$("adminReviewModeration");
 if(feedbackBox)feedbackBox.innerHTML='<p class="empty-state">Carregando mensagens...</p>';
 if(reviewBox)reviewBox.innerHTML='<p class="empty-state">Carregando avaliações...</p>';
 try{
  const [feedbackSnap,reviewSnap]=await Promise.all([
   db.collection("feedbacks").get(),
   db.collection("avaliacoes").where("status","==","pendente").get()
  ]);
  if(feedbackBox){
   feedbackBox.innerHTML=feedbackSnap.empty?'<p class="empty-state">Nenhuma mensagem recebida.</p>':feedbackSnap.docs.map(doc=>{
    const d=doc.data(),type=({sugestao:"Sugestão",reclamacao:"Reclamação",elogio:"Elogio"})[d.tipo]||"Mensagem";
    return '<article class="admin-message"><div class="admin-message-head"><strong>'+escapeHtml(type)+' · '+escapeHtml(d.nome||"Visitante")+'</strong><small>'+escapeHtml(d.data||"")+'</small></div><p>'+escapeHtml(d.mensagem||"")+'</p><div class="admin-message-actions"><button type="button" data-feedback-delete="'+doc.id+'">Excluir mensagem</button></div></article>';
   }).join("");
  }
  if(reviewBox){
   reviewBox.innerHTML=reviewSnap.empty?'<p class="empty-state">Nenhuma avaliação aguardando aprovação.</p>':reviewSnap.docs.map(doc=>{
    const d=doc.data();
    return '<article class="admin-message"><div class="admin-message-head"><strong>'+escapeHtml(d.nome||"Visitante")+' · '+Number(d.nota||0)+'/5</strong><small>'+escapeHtml(d.data||"")+'</small></div><p>'+escapeHtml(d.comentario||"")+'</p><div class="admin-message-actions"><button type="button" data-review-approve="'+doc.id+'">Aprovar publicação</button><button type="button" data-review-reject="'+doc.id+'">Rejeitar</button></div></article>';
   }).join("");
  }
 }catch(error){
  console.error("Erro ao carregar caixa de entrada:",error);
  if(feedbackBox)feedbackBox.innerHTML='<p class="empty-state">Não foi possível carregar mensagens. Verifique a conexão e as regras do Firestore.</p>';
  if(reviewBox)reviewBox.innerHTML='<p class="empty-state">Não foi possível carregar avaliações pendentes.</p>';
 }
}
$("adminFeedbackList")?.addEventListener("click",async e=>{
 const b=e.target.closest("[data-feedback-delete]");if(!b||!isVerenaAdmin)return;
 if(!confirm("Excluir esta mensagem permanentemente?"))return;
 try{await db.collection("feedbacks").doc(b.dataset.feedbackDelete).delete();await loadAdminInbox()}
 catch(error){alert("Não foi possível excluir: "+error.message)}
});
$("adminReviewModeration")?.addEventListener("click",async e=>{
 const approve=e.target.closest("[data-review-approve]"),reject=e.target.closest("[data-review-reject]");
 const button=approve||reject;if(!button||!isVerenaAdmin)return;
 try{
  await db.collection("avaliacoes").doc(button.dataset.reviewApprove||button.dataset.reviewReject).update({status:approve?"aprovada":"rejeitada"});
  await loadAdminInbox();if(approve)renderReviews();
 }catch(error){alert("Não foi possível moderar a avaliação: "+error.message)}
});
$("refreshAdminInbox")?.addEventListener("click",loadAdminInbox);
$("refreshAdminReviews")?.addEventListener("click",loadAdminInbox);

/* Atendimento virtual demonstrativo: respostas locais, sem IA externa ou coleta de dados. */
(function(){
 const panel=$("assistantPanel"),launcher=$("assistantLauncher"),messages=$("assistantMessages"),form=$("assistantForm"),input=$("assistantInput");
 if(!panel||!launcher||!messages||!form||!input)return;
 function toggle(open){panel.hidden=!open;launcher.setAttribute("aria-expanded",String(open));if(open)input.focus()}
 launcher.addEventListener("click",()=>toggle(panel.hidden));
 $("openVirtualAssistant")?.addEventListener("click",()=>{toggle(true);$("virtualAssistant").scrollIntoView({behavior:"smooth",block:"end"})});
 $("closeAssistant")?.addEventListener("click",()=>toggle(false));
 function add(text,who){const p=document.createElement("p");p.className="assistant-bubble"+(who==="user"?" user":"");p.textContent=text;messages.appendChild(p);messages.scrollTop=messages.scrollHeight}
 function answer(q){
  const t=q.toLocaleLowerCase("pt-BR");
  if(/hor[aá]rio|abre|fecha|funciona/.test(t))return "O horário divulgado para a unidade é de segunda a sábado, das 06h às 21h20, e domingo, das 06h às 13h30. Em feriados, confirme pelo WhatsApp.";
  if(/endere[cç]o|onde fica|localiza|mapa/.test(t))return "A unidade fica na Praça José Lino da Silva, 101, Brasiléia, Betim–MG. Você pode abrir o mapa na seção Como chegar.";
  if(/entrega|delivery|self.?service|buffet/.test(t))return "A disponibilidade de entrega e self-service ainda precisa ser confirmada pela equipe. Toque em Falar com a equipe ou consulte a seção Formas de atendimento.";
  if(/pedido|comprar|sacola|retirada/.test(t))return "Adicione produtos ao cardápio, abra sua sacola e escolha retirada, consumo no local ou uma modalidade para consultar. O WhatsApp será aberto para confirmar tudo com a equipe.";
  if(/pre[cç]o|valor|quanto custa/.test(t))return "Os preços não confirmados aparecem como “Consultar”. Envie sua seleção pelo WhatsApp para receber valores atualizados.";
  if(/card[aá]pio|comida|produto|bebida|bolo|p[aã]o|salgado/.test(t))return "O cardápio tem categorias de pães, salgados, doces, bebidas, lanches, refeições e encomendas. Os itens são sugestões e a disponibilidade deve ser confirmada.";
  if(/reclama|sugest|elogio|mensagem|ajuda|suporte/.test(t))return "Você pode enviar uma mensagem privada pelo Canal de atendimento ou falar com a equipe pelo WhatsApp.";
  if(/whats|telefone|contato|falar/.test(t))return "O WhatsApp divulgado da unidade é (31) 99090-5985. Use o botão Falar com a equipe para iniciar a conversa.";
  return "Posso orientar sobre horários, endereço, cardápio, preços, pedidos, entrega, self-service e contato. Para confirmar informações específicas, fale com a equipe pelo WhatsApp.";
 }
 function send(q){const clean=String(q||"").trim();if(!clean)return;add(clean,"user");input.value="";window.setTimeout(()=>add(answer(clean),"bot"),180)}
 form.addEventListener("submit",e=>{e.preventDefault();send(input.value)});
 document.querySelectorAll("[data-assistant-question]").forEach(b=>b.addEventListener("click",()=>send(b.dataset.assistantQuestion)));
})();
document.querySelectorAll("[data-menu-jump]").forEach(link=>link.addEventListener("click",()=>{const categoryName=link.dataset.menuJump;const chip=document.querySelector('[data-category="'+categoryName+'"]');if(chip)chip.click()}));
