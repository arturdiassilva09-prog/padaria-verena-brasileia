const toggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
if(toggle&&nav){toggle.addEventListener("click",()=>{const opened=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(opened));toggle.textContent=opened?"×":"☰";});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰";}));}
const $=id=>document.getElementById(id),KEY="verena_catalog_v1",CART="verena_cart_v1",PROMO="verena_promo_v1";

/* Aba exclusiva de produtos: mantém o catálogo fora da tela inicial sem remover recursos. */
document.addEventListener("click",e=>{
 const link=e.target.closest('a[href^="#"]');
 if(!link)return;
 const target=link.getAttribute("href");
 if(target==="#inicio"){
  e.preventDefault();
  document.body.classList.remove("products-only");
  requestAnimationFrame(()=>window.scrollTo({top:0,behavior:"smooth"}));
  return;
 }
 if(target==="#produtos"||target==="#cardapio"){
  document.body.classList.add("products-only");
  requestAnimationFrame(()=>document.querySelector(target)?.scrollIntoView({behavior:"smooth",block:"start"}));
 }else if(document.querySelector(target)){
  document.body.classList.remove("products-only");
 }
});

const seed=[
{id:"foto-paes",name:"Pães variados",category:"Pães",description:"Seleção ilustrativa de pães de padaria",price:""},
{id:"foto-frances",name:"Pão francês",category:"Pães",description:"Imagem ilustrativa de pão francês",price:""},
{id:"foto-integral",name:"Pão integral",category:"Pães",description:"Imagem ilustrativa de pão integral",price:""},
{id:"foto-batata",name:"Pão de batata",category:"Pães",description:"Imagem ilustrativa de pão de batata",price:""},
{id:"foto-croissant",name:"Croissant",category:"Pães",description:"Imagem ilustrativa de croissant",price:""},
{id:"foto-baguete",name:"Baguete",category:"Pães",description:"Imagem ilustrativa de baguete",price:""},
{id:"foto-broa",name:"Broa de fubá",category:"Pães",description:"Imagem ilustrativa de broa",price:""},
{id:"foto-queijo",name:"Pão de queijo",category:"Salgados",description:"Imagem ilustrativa de pão de queijo",price:""},
{id:"foto-coxinha",name:"Coxinha de frango",category:"Salgados",description:"Imagem ilustrativa de coxinha",price:""},
{id:"foto-empada",name:"Empada",category:"Salgados",description:"Imagem ilustrativa de empada",price:""},
{id:"foto-esfirra",name:"Esfirra",category:"Salgados",description:"Imagem ilustrativa de esfirra",price:""},
{id:"foto-pastel",name:"Pastel",category:"Salgados",description:"Imagem ilustrativa de pastel",price:""},
{id:"foto-bolo-chocolate",name:"Bolo de chocolate",category:"Bolos",description:"Imagem ilustrativa de bolo de chocolate",price:""},
{id:"foto-bolo-cenoura",name:"Bolo de cenoura",category:"Bolos",description:"Imagem ilustrativa de bolo de cenoura",price:""},
{id:"foto-pudim",name:"Pudim",category:"Doces",description:"Imagem ilustrativa de pudim",price:""},
{id:"foto-brownie",name:"Brownie",category:"Doces",description:"Imagem ilustrativa de brownie",price:""},
{id:"foto-cafe",name:"Café espresso",category:"Cafés",description:"Imagem ilustrativa de café espresso",price:""},
{id:"foto-cappuccino",name:"Cappuccino",category:"Cafés",description:"Imagem ilustrativa de cappuccino",price:""},
{id:"foto-suco-laranja",name:"Suco de laranja",category:"Sucos e vitaminas",description:"Imagem ilustrativa de suco de laranja",price:""},
{id:"foto-limonada",name:"Limonada",category:"Sucos e vitaminas",description:"Imagem ilustrativa de limonada",price:""},
{id:"foto-agua",name:"Água engarrafada",category:"Bebidas",description:"Imagem ilustrativa de água engarrafada",price:""},
{id:"foto-refrigerante",name:"Refrigerante gelado",category:"Bebidas",description:"Imagem ilustrativa de refrigerante",price:""},
{id:"foto-sanduiche",name:"Sanduíche natural",category:"Lanches",description:"Imagem ilustrativa de sanduíche natural",price:""},
{id:"foto-misto",name:"Misto quente",category:"Lanches",description:"Imagem ilustrativa de misto quente",price:""},
{id:"foto-hamburguer",name:"Hambúrguer",category:"Lanches",description:"Imagem ilustrativa de hambúrguer",price:""},
{id:"foto-pizza",name:"Pizza",category:"Lanches",description:"Imagem ilustrativa de pizza",price:""},
{id:"foto-refeicao",name:"Refeição no prato",category:"Refeições",description:"Imagem ilustrativa de refeição",price:""},
{id:"foto-marmita",name:"Marmita",category:"Refeições",description:"Imagem ilustrativa de refeição em marmita",price:""},
{id:"foto-paes-recheados",name:"Pães recheados",category:"Encomendas",description:"Imagem ilustrativa de pães recheados",price:""},
{id:"foto-tortinhas",name:"Tortinhas doces",category:"Encomendas",description:"Imagem ilustrativa de tortinhas doces",price:""}
];

function normalizeCart(value){if(!Array.isArray(value))return[];return value.filter(x=>x&&x.id!==undefined&&Number.isInteger(Number(x.qty))&&Number(x.qty)>0&&Number(x.qty)<=99).map(x=>({id:String(x.id),qty:Number(x.qty)}));}
let products=(()=>{const saved=load(KEY,seed),ids=new Set(saved.map(p=>String(p.id)));return [...saved,...seed.filter(p=>!ids.has(String(p.id)))]})(),cart=normalizeCart(load(CART,[])),category="Todos",currentPage=1,productsPerPage=12,favorites=new Set(Array.isArray(load("verena_favs_v1",[]))?load("verena_favs_v1",[]).map(String):[]);
function load(k,fallback){try{const v=JSON.parse(localStorage.getItem(k));return v??fallback}catch{return fallback}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(error){console.warn("Não foi possível salvar neste navegador:",error)}}
function money(v){return v!==undefined&&v!==null&&String(v).trim()!==""?"R$ "+escapeHtml(String(v).trim()):"Consultar"}
const catalogCategories=["Todos","Pães","Salgados","Bolos","Doces","Cafés","Sucos e vitaminas","Bebidas","Lanches","Refeições","Encomendas"];
const productPhotos={
 bread:{url:"https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",alt:"Pães artesanais"},
 croissant:{url:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",alt:"Croissants"},
 cheeseBread:{url:"https://images.unsplash.com/photo-1559141680-d0bd7bc5af84?auto=format&fit=crop&w=900&q=85",alt:"Pão de queijo brasileiro"},
 savory:{url:"https://images.unsplash.com/photo-1641848421554-f692b9dc9d8e?auto=format&fit=crop&w=900&q=85",alt:"Salgado brasileiro"},
 cake:{url:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",alt:"Bolo decorado"},
 dessert:{url:"https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",alt:"Sobremesa"},
 coffee:{url:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",alt:"Café servido em xícara"},
 juice:{url:"https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85",alt:"Suco de frutas"},
 water:{url:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",alt:"Garrafa de água"},
 soda:{url:"https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=85",alt:"Bebida gelada"},
 sandwich:{url:"https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85",alt:"Sanduíche"},
 burger:{url:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",alt:"Hambúrguer"},
 pizza:{url:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",alt:"Pizza"},
 meal:{url:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",alt:"Refeição servida"},
 order:{url:"https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=85",alt:"Mesa com alimentos"}
};
function productPhoto(product){
 const name=String(product?.name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
 const category=String(product?.category||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");
 let key="bread";
 if(/pao de que?ijo/.test(name))key="cheeseBread";
 if(/cento de salgados|salgados para festas|torta salgada/.test(name))key="savory";
 else if(/kit|encomenda|festa/.test(name))key="order";
 else if(/pao de mel/.test(name))key="dessert";
 else if(/pizza/.test(name))key="pizza";
 else if(/hamburguer|x-salada|burger/.test(name))key="burger";
 else if(/sanduiche|misto quente|americano|bauru|pao com ovo|pao na chapa|cachorro-quente|tapioca|crepioca|porcao de batata/.test(name))key="sandwich";
 else if(/coxinha|empada|esfirra|enroladinho|pastel|quibe|bolinha de queijo|risole|salgado|pao de queijo recheado|mini salgado/.test(name))key="savory";
 else if(/cafe|cappuccino|mocha|latte|macchiato|pingado|chocolate quente|cha quente|leite com canela/.test(name))key="coffee";
 else if(/suco|limonada|vitamina/.test(name))key="juice";
 else if(/agua/.test(name))key="water";
 else if(/refrigerante|energetico|cha gelado|achocolatado|iogurte/.test(name))key="soda";
 else if(/bolo/.test(name))key="cake";
 else if(/croissant/.test(name))key="croissant";
 else if(/pao de que?ijo/.test(name))key="cheeseBread";
 else if(/pao|baguete|broa|rosca|bisnaguinha/.test(name))key="bread";
 else if(/pudim|brigadeiro|beijinho|torta|sonho|rocambole|quindim|gelatina|mousse|cookie|brownie|churros|pave|cupcake|doce|sobremesa/.test(name))key="dessert";
 else if(/prato|self-service|marmita|arroz|frango|bife|omelete|salada|refeicao/.test(name))key="meal";

 else if(/salgad/.test(category))key="savory";
 else if(/bolo/.test(category))key="cake";
 else if(/doce/.test(category))key="dessert";
 else if(/cafe/.test(category))key="coffee";
 else if(/suco/.test(category))key="juice";
 else if(/bebida/.test(category))key="water";
 else if(/lanche/.test(category))key="sandwich";
 else if(/refeicao/.test(category))key="meal";
 else if(/encomenda/.test(category))key="order";
 return {...productPhotos[key],alt:"Imagem ilustrativa de "+String(product?.name||"produto")};
}
products=products.filter(p=>productPhoto(p));
save(KEY,products);
$("categoryFilters").innerHTML=catalogCategories.map((name,i)=>`<button class="filter-chip${i===0?" active":""}" data-category="${name}">${name}</button>`).join("");
function render(){
 const term=($("productSearch")?.value||"").toLocaleLowerCase("pt-BR");
 const list=products.filter(p=>productPhoto(p)&&(category==="Todos"||p.category===category)&&((p.name+" "+p.description).toLocaleLowerCase("pt-BR").includes(term))&&(!window.onlyFavorites||favorites.has(p.id)));
 const pageCount=Math.max(1,Math.ceil(list.length/productsPerPage));
 currentPage=Math.min(currentPage,pageCount);
 const start=(currentPage-1)*productsPerPage;
 const pageItems=list.slice(start,start+productsPerPage);
 $("catalogGrid").innerHTML=pageItems.length?pageItems.map(p=>{const photo=productPhoto(p);return '<article class="catalog-card"><div class="catalog-product-image" role="img" aria-label="'+escapeHtml(photo.alt)+'" style="background-image:url(\''+photo.url+'\');background-size:cover;background-position:center;background-repeat:no-repeat"></div><button class="favorite-button '+(favorites.has(p.id)?"selected":"")+'" data-fav="'+p.id+'" aria-label="Favoritar '+escapeHtml(p.name)+'">'+(favorites.has(p.id)?"♥":"♡")+'</button><span class="catalog-category">'+escapeHtml(p.category)+'</span><h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.description)+'</p><div class="catalog-card-bottom"><strong>'+money(p.price)+'</strong><button type="button" class="add-button" data-add="'+p.id+'">Adicionar +</button></div></article>';}).join(""):'<p class="empty-state">Nenhum produto com foto correspondente encontrado nesta seleção.</p>';
 $("catalogPagination").innerHTML=pageCount>1?Array.from({length:pageCount},(_,i)=>i+1).map(n=>'<button type="button" class="catalog-page'+(n===currentPage?' active':'')+'" data-page="'+n+'" aria-label="Página '+n+'" aria-current="'+(n===currentPage?'page':'false')+'">'+n+'</button>').join(""):'';
 $("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);if($("cartCountProducts"))$("cartCountProducts").textContent=cart.reduce((n,x)=>n+x.qty,0);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("productSearch").addEventListener("input",()=>{window.onlyFavorites=false;currentPage=1;render()});
$("categoryFilters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;currentPage=1;window.onlyFavorites=false;document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===b));render()});
$("catalogPagination").addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(!b)return;currentPage=Number(b.dataset.page)||1;render();$("catalogGrid").scrollIntoView({behavior:"smooth",block:"start"});});
function addToCart(id){
 const product=products.find(p=>String(p.id)===String(id));
 if(!product){console.error("Produto não encontrado:",id);return}
 const found=cart.find(x=>String(x.id)===String(id));
 if(found)found.qty=Number(found.qty||0)+1;else cart.push({id:product.id,qty:1});
 save(CART,cart);render();renderCart();
 const status=$("cartFeedback");if(status){status.textContent=product.name+" adicionado à sacola";status.classList.add("visible");}
}
document.addEventListener("click",e=>{
 const fav=e.target.closest("[data-fav]"),add=e.target.closest("[data-add]");
 if(fav){e.preventDefault();e.stopPropagation();const id=fav.dataset.fav;favorites.has(id)?favorites.delete(id):favorites.add(id);save("verena_favs_v1",[...favorites]);render();return;}
 if(add){e.preventDefault();e.stopPropagation();addToCart(add.dataset.add);}
},true);
$("showFavorites").addEventListener("click",()=>{window.onlyFavorites=true;category="Todos";currentPage=1;$("productSearch").value="";document.querySelectorAll(".filter-chip").forEach((x,i)=>x.classList.toggle("active",i===0));render();document.body.classList.add("products-only");$("cardapio").scrollIntoView({behavior:"smooth"});});
function show(id){$(id).hidden=false;document.body.classList.add("modal-open")}
function hide(id){$(id).hidden=true;if(document.querySelectorAll(".overlay:not([hidden])").length===0)document.body.classList.remove("modal-open")}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>hide(b.dataset.close)));
document.querySelectorAll(".overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)hide(o.id)}));
$("openCart").addEventListener("click",()=>{renderCart();show("cartOverlay")});$("openCartProducts")?.addEventListener("click",()=>{renderCart();show("cartOverlay")});
function renderCart(){cart=normalizeCart(cart).filter(x=>products.some(p=>String(p.id)===String(x.id)));$("cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(p=>String(p.id)===String(x.id));return p?'<div class="cart-line"><div><strong>'+escapeHtml(p.name)+'</strong><small>'+money(p.price)+'</small></div><div class="qty-control"><button data-qty="'+p.id+'" data-delta="-1">−</button><b>'+x.qty+'</b><button data-qty="'+p.id+'" data-delta="1">+</button><button class="remove-line" data-remove="'+p.id+'">×</button></div></div>':''}).join(""):'<p class="empty-state">Sua sacola está vazia. Escolha algo no cardápio!</p>'}
$("cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const x=cart.find(v=>String(v.id)===String(q.dataset.qty));if(x){x.qty=Math.min(99,x.qty+Number(q.dataset.delta));if(x.qty<=0)cart=cart.filter(v=>String(v.id)!==String(q.dataset.qty))}}if(r)cart=cart.filter(v=>v.id!==r.dataset.remove);save(CART,cart);render();renderCart()});
const orderMode=$("orderMode"),addressWrap=$("deliveryAddressWrap"),deliveryEstimator=$("deliveryEstimator"),deliveryZone=$("deliveryZone");
function updateDeliveryEstimate(){
 const result=$("deliveryEstimateResult");if(!result||!deliveryZone)return;
 const ranges={near:[30,45],medium:[40,60],far:[50,75]};
 if(deliveryZone.value==="outside"){result.textContent="Não há previsão para essa região. Consulte a unidade para verificar a cobertura.";return;}
 const [min,max]=ranges[deliveryZone.value],now=Date.now();
 const fmt=ms=>new Date(ms).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
 result.innerHTML='<strong>'+min+'–'+max+' min</strong><span>Chegada estimada entre '+fmt(now+min*60000)+' e '+fmt(now+max*60000)+'</span>';
}
if(orderMode&&addressWrap)orderMode.addEventListener("change",()=>{
 const isDelivery=orderMode.value.startsWith("Entrega");
 addressWrap.hidden=!isDelivery;if(deliveryEstimator)deliveryEstimator.hidden=!isDelivery;
 if(isDelivery)updateDeliveryEstimate();
});
deliveryZone?.addEventListener("change",updateDeliveryEstimate);
$("sendOrder").addEventListener("click",()=>{if(!requestLogin("Entre ou crie uma conta para enviar seu pedido.","order"))return;if(!cart.length){alert("Adicione pelo menos um produto à sacola.");return}const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return p?x.qty+"x "+p.name:""}).filter(Boolean);const mode=orderMode?.value||"Retirada no balcão";const address=$("deliveryAddress")?.value.trim()||"";if(mode.startsWith("Entrega")&&!address){alert("Informe o endereço para consultar a disponibilidade da entrega.");$("deliveryAddress")?.focus();return}const notes=$("orderNotes")?.value.trim()||"";const msg="Olá! Gostaria de consultar este pedido:\n"+lines.join("\n")+"\n\nModalidade: "+mode+(address?"\nEndereço: "+address:"")+(notes?"\nObservações: "+notes:"")+"\n\nPodem confirmar disponibilidade, valores, prazo e condições?";window.open("https://wa.me/5531990905985?text="+encodeURIComponent(msg),"_blank","noopener");});
const fb=window.verenaFirebase||null;
const db=fb?.db||null,auth=fb?.auth||null;
const ADMIN_UID="A4N9gGjLF4WKwY6N1Uzz0jyPWns2";
let isVerenaAdmin=false;

 // Login opcional para navegar; exigido somente para avaliar e enviar pedidos.
 const authScreen=$("verenaAuthScreen"),authForm=$("verenaAuthForm");
 let authMode="login",pendingProtectedAction=null;
 function requestLogin(message,action){
  if(auth?.currentUser)return true;
  pendingProtectedAction=action||null;
  setAuthMode("login");
  $("verenaAuthMessage").textContent=message||"Entre ou crie sua conta para continuar.";
  $("verenaAuthStatus").textContent="";
  authScreen.hidden=false;
  $("verenaAuthEmail").focus();
  return false;
 }
 $("verenaAuthCancel").addEventListener("click",()=>{pendingProtectedAction=null;authScreen.hidden=true;});
 function setAuthMode(mode){
  authMode=mode;
  $("verenaAuthTitle").textContent=mode==="signup"?"Crie sua conta":"Bem-vindo à Verena";
  $("verenaAuthMessage").textContent=mode==="signup"?"Cadastre-se para acessar o site da Padaria Verena.":"Entre na sua conta para acessar o site.";
  $("verenaAuthSubmit").textContent=mode==="signup"?"Criar conta":"Entrar";
  $("verenaAuthSwitch").textContent=mode==="signup"?"Já tem conta? Entrar":"Não tem conta? Criar conta";
  $("verenaAuthPassword").autocomplete=mode==="signup"?"new-password":"current-password";
  $("verenaAuthForgot").hidden=mode==="signup";
  $("verenaAuthStatus").textContent="";
 }
 $("verenaAuthSwitch").addEventListener("click",()=>setAuthMode(authMode==="login"?"signup":"login"));
 $("verenaAuthForgot").addEventListener("click",async()=>{
  const email=$("verenaAuthEmail").value.trim();
  if(!email){$("verenaAuthStatus").textContent="Digite seu e-mail para receber o link de recuperação.";return;}
  if(!auth){$("verenaAuthStatus").textContent="Serviço de autenticação indisponível. Atualize a página.";return;}
  try{await auth.sendPasswordResetEmail(email);$("verenaAuthStatus").textContent="Enviamos um link de recuperação para seu e-mail.";}
  catch(error){$("verenaAuthStatus").textContent="Não foi possível enviar: "+(error.message||"verifique o e-mail.");}
 });
 authForm.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!auth){$("verenaAuthStatus").textContent="Firebase indisponível. Atualize a página e tente novamente.";return;}
  const email=$("verenaAuthEmail").value.trim(),password=$("verenaAuthPassword").value;
  const button=$("verenaAuthSubmit");
  button.disabled=true;button.textContent=authMode==="signup"?"Criando conta...":"Entrando...";
  $("verenaAuthStatus").textContent="";
  try{
   if(authMode==="signup") await auth.createUserWithEmailAndPassword(email,password);
   else await auth.signInWithEmailAndPassword(email,password);
  }catch(error){
   const messages={
    "auth/email-already-in-use":"Este e-mail já possui uma conta. Entre nela.",
    "auth/invalid-email":"Digite um endereço de e-mail válido.",
    "auth/weak-password":"A senha precisa ter pelo menos 6 caracteres.",
    "auth/user-not-found":"Não encontramos uma conta com este e-mail.",
    "auth/wrong-password":"Senha incorreta. Confira e tente novamente.",
    "auth/invalid-credential":"E-mail ou senha incorretos."
   };
   $("verenaAuthStatus").textContent=messages[error.code]||error.message||"Não foi possível concluir o acesso.";
  }finally{button.disabled=false;button.textContent=authMode==="signup"?"Criar conta":"Entrar";}
 });
 $("siteLogout").addEventListener("click",async()=>{
  if(auth) await auth.signOut();
 });
 if(auth) auth.onAuthStateChanged(user=>{
  isVerenaAdmin=!!(user&&user.uid===ADMIN_UID);
  $("siteLogout").hidden=!user;
  if(user){
   authScreen.hidden=true;
   $("verenaAuthStatus").textContent="";
   const action=pendingProtectedAction;pendingProtectedAction=null;
   if(action==="review") reviewForm?.requestSubmit();
   else if(action==="order") $("sendOrder")?.click();
  }
 });

async function loadPublicProducts(){
 if(!db)return;
 try{
  const snap=await db.collection("produtos").where("ativo","==",true).get();
  if(!snap.empty){
   const remote=snap.docs.map(d=>({id:d.id,...d.data()}));
   const names=new Set(remote.map(p=>String(p.name||"").toLocaleLowerCase("pt-BR")));
   products=[...remote,...seed.filter(p=>!names.has(p.name.toLocaleLowerCase("pt-BR")))].filter(p=>productPhoto(p));
  }else{
   products=seed.slice();
  }
  save(KEY,products);
  render();
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
 products=all.docs.map(d=>({id:d.id,...d.data()})).filter(p=>productPhoto(p));
 save(KEY,products);
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
// O listener de autenticação principal também atualiza o acesso administrativo.
// Contas comuns permanecem conectadas e não recebem permissões administrativas.
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

/* Avaliações públicas: leitura para visitantes e moderação antes da publicação. */
const REVIEW_KEY="verena_reviews_prototype_v1";
let publicReviews=[];
function renderReviews(){
 const list=$("reviewList"),count=$("reviewCount"),filter=$("reviewCategoryFilter");
 if(!list||!count)return;
 count.textContent="Carregando avaliações...";
 list.innerHTML='<div class="review-empty"><p>Carregando avaliações...</p></div>';
 if(!db){count.textContent="Avaliações indisponíveis";list.innerHTML='<p class="empty-state">Não foi possível conectar ao serviço de avaliações.</p>';return;}
 db.collection("avaliacoes").where("status","==","aprovada").get().then(snap=>{
  publicReviews=snap.docs.map(doc=>({id:doc.id,...doc.data()}));
  drawPublicReviews();
 }).catch(error=>{console.error("Erro ao carregar avaliações públicas:",error);count.textContent="Avaliações";list.innerHTML='<p class="empty-state">Não foi possível carregar as avaliações. Verifique se a leitura pública da coleção avaliações está permitida nas regras do Firebase.</p>'});
}
function drawPublicReviews(){
 const list=$("reviewList"),count=$("reviewCount"),filter=$("reviewCategoryFilter");
 if(!list||!count)return;
 const selected=filter?.value||"Todos";
 const visible=selected==="Todos"?publicReviews:publicReviews.filter(r=>(r.categoria||"Geral")===selected);
 count.textContent=selected==="Todos"
  ?publicReviews.length+" "+(publicReviews.length===1?"avaliação":"avaliações")
  :visible.length+" de "+publicReviews.length+" avaliações";
 list.innerHTML=visible.length?visible.map(r=>{
  const rating=Math.max(0,Math.min(5,Number(r.nota)||0));
  const category=r.categoria||"Geral";
  return '<article class="review-item"><div class="review-item-top"><span class="review-item-name">'+escapeHtml(r.nome||"Visitante")+'</span><time class="review-item-date">'+escapeHtml(r.data||"")+'</time></div><span class="review-category-tag">'+escapeHtml(category)+'</span><div class="review-item-stars" aria-label="'+rating+' de 5 estrelas">'+("★".repeat(rating))+("☆".repeat(5-rating))+'</div><p>'+escapeHtml(r.comentario||"")+'</p></article>';
 }).join(""):'<div class="review-empty"><span>✦</span><strong>'+(publicReviews.length?"Nenhuma avaliação neste assunto":"Seja a primeira pessoa a avaliar")+'</strong><p>'+(publicReviews.length?"Escolha outro assunto no filtro para ver mais opiniões.":"As avaliações aprovadas aparecerão aqui para todos os visitantes.")+'</p></div>';
}
$("reviewCategoryFilter")?.addEventListener("change",drawPublicReviews);
const reviewForm=$("reviewForm");
if(reviewForm){
 reviewForm.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!requestLogin("Entre ou crie uma conta para enviar sua avaliação.","review"))return;
  const name=$("reviewName").value.trim(),comment=$("reviewComment").value.trim(),rating=Number($("reviewRating").value),categoria=$("reviewCategory").value;
  const submit=reviewForm.querySelector('button[type="submit"]');
  if(!name||!comment||rating<1||rating>5||!categoria)return;
  if(!db){$("reviewFeedback").textContent="Serviço temporariamente indisponível. Atualize a página e tente novamente.";return;}
  if(submit){submit.disabled=true;submit.dataset.originalText=submit.textContent;submit.textContent="Enviando...";}
  try{
   await db.collection("avaliacoes").add({nome:name,comentario:comment,nota:rating,categoria,data:new Date().toLocaleDateString("pt-BR"),status:"pendente"});
   reviewForm.reset();$("reviewFeedback").textContent="Avaliação enviada para análise. Ela aparecerá publicamente após aprovação da equipe. Obrigado por compartilhar sua experiência.";
  }catch(error){console.error("Falha ao enviar avaliação:",error);$("reviewFeedback").textContent="Falha ao enviar ("+(error?.code||"erro")+"): "+(error?.message||"Tente novamente.")}
  finally{if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalText||"Enviar avaliação ↗";}}
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
    return '<article class="admin-message"><div class="admin-message-head"><strong>'+escapeHtml(d.nome||"Visitante")+' · '+Number(d.nota||0)+'/5 · '+escapeHtml(d.categoria||"Geral")+'</strong><small>'+escapeHtml(d.data||"")+'</small></div><p>'+escapeHtml(d.comentario||"")+'</p><div class="admin-message-actions"><button type="button" data-review-approve="'+doc.id+'">Aprovar publicação</button><button type="button" data-review-reject="'+doc.id+'">Rejeitar</button></div></article>';
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
 const target=e.target instanceof Element?e.target:null;
 const approve=target?.closest("[data-review-approve]"),reject=target?.closest("[data-review-reject]");
 const button=approve||reject;
 if(!button)return;
 const user=auth?.currentUser;
 if(!user||user.uid!==ADMIN_UID){
  isVerenaAdmin=false;
  alert("Sua sessão administrativa não está ativa. Saia do painel e entre novamente com a conta administradora.");
  return;
 }
 const reviewId=approve?button.dataset.reviewApprove:button.dataset.reviewReject;
 if(!reviewId)return;
 const nextStatus=approve?"aprovada":"rejeitada";
 const originalText=button.textContent;
 button.disabled=true;
 button.textContent=approve?"Aprovando...":"Rejeitando...";
 try{
  const reviewRef=db.collection("avaliacoes").doc(reviewId);
  await reviewRef.update({status:nextStatus});
  const updated=await reviewRef.get();
  if(!updated.exists||updated.data().status!==nextStatus){
   throw new Error("O Firebase não confirmou a alteração do status.");
  }
  await loadAdminInbox();
  if(approve)renderReviews();
  alert(approve?"Avaliação aprovada e publicada!":"Avaliação rejeitada.");
 }catch(error){
  console.error("Falha ao moderar avaliação:",error);
  alert("Não foi possível "+(approve?"aprovar":"rejeitar")+" a avaliação.\nCódigo: "+(error.code||"não informado")+"\nDetalhe: "+(error.message||"Erro desconhecido"));
  button.disabled=false;
  button.textContent=originalText;
 }
});
$("refreshAdminInbox")?.addEventListener("click",loadAdminInbox);
$("refreshAdminReviews")?.addEventListener("click",loadAdminInbox);

/* Assistente Verena: mecanismo contextual com consulta ao conteúdo real da página e ao catálogo carregado. */
(function(){
 const panel=$("assistantPanel"),launcher=$("assistantLauncher"),messages=$("assistantMessages"),form=$("assistantForm"),input=$("assistantInput");
 if(!panel||!launcher||!messages||!form||!input)return;
 const phone="(31) 99090-5985",address="Praça José Lino da Silva, 101, Brasiléia, Betim–MG";
 const norm=v=>String(v||"").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
 const stop=new Set(["qual","quais","como","onde","quando","quanto","para","pela","pelo","tem","ter","uma","uns","umas","que","dos","das","com","sem","site","padaria","verena","produto","produtos","quero","saber","sobre","isso","essa","esse","mais","pode","vocês","voces","preco","precos","valor"]);
 let busy=false,lastTopic="",history=[];
 function toggle(open){panel.hidden=!open;launcher.setAttribute("aria-expanded",String(open));if(open)input.focus()}
 launcher.addEventListener("click",()=>toggle(panel.hidden));
 $("openVirtualAssistant")?.addEventListener("click",()=>{toggle(true);$("virtualAssistant").scrollIntoView({behavior:"smooth",block:"end"})});
 $("closeAssistant")?.addEventListener("click",()=>toggle(false));
 function persist(){try{sessionStorage.setItem("verena_assistant_chat_v2",JSON.stringify(history.slice(-30)))}catch(e){}}
 function bubble(text,who){
  const p=document.createElement("p");p.className="assistant-bubble"+(who==="user"?" user":"");
  p.textContent=text;messages.appendChild(p);messages.scrollTop=messages.scrollHeight;
 }
 function welcome(){
  messages.innerHTML='<div class="assistant-welcome"><span>✦</span><strong>Olá! Como posso ajudar?</strong><p>Posso pesquisar produtos, consultar informações da padaria e explicar como usar o site.</p></div>';
 }
 function restore(){
  try{const saved=JSON.parse(sessionStorage.getItem("verena_assistant_chat_v2")||"[]");if(Array.isArray(saved)){history=saved.slice(-30);if(history.length){messages.innerHTML="";history.forEach(x=>bubble(x.text,x.who));}}}catch(e){history=[]}
 }
 function add(text,who){bubble(text,who);history.push({text,who});history=history.slice(-30);persist()}
 function allProducts(){return Array.isArray(products)?products.filter(p=>p&&p.name):[]}
 function findProducts(question){
  const words=norm(question).split(" ").filter(w=>w.length>2&&!stop.has(w));
  if(!words.length)return [];
  return allProducts().map(p=>{
   const name=norm(p.name),cat=norm(p.category),desc=norm(p.description),hay=name+" "+cat+" "+desc;
   let score=0;
   words.forEach(w=>{if(name.includes(w))score+=5;else if(cat.includes(w))score+=3;else if(desc.includes(w))score+=1;});
   if(words.length===1&&name===words[0])score+=5;
   return {p,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).map(x=>x.p);
 }
 function siteSections(){
  return [...document.querySelectorAll("main section[id]")].map(el=>({id:el.id,title:el.querySelector("h1,h2,h3")?.innerText?.replace(/\s+/g," ").trim()||el.id,text:el.innerText.replace(/\s+/g," ").trim()}));
 }
 function money(p){return p.price&&String(p.price).trim()?"R$ "+String(p.price).trim():"preço a consultar"}
 function productSummary(list){
  return list.slice(0,8).map(p=>"• "+p.name+" ("+(p.category||"Produtos")+") — "+money(p)).join("\n");
 }
 function answer(question){
  const q=norm(question),raw=String(question||"").trim();
  if(!q)return "Escreva sua pergunta para eu consultar as informações do site.";
  if(/^(oi|ola|bom dia|boa tarde|boa noite|e ai|tudo bem)$/.test(q))return "Olá! ☕ Sou o Assistente Verena. Posso pesquisar o cardápio, explicar pedidos e sacola, informar endereço, horários, avaliações e os recursos deste site. O que você gostaria de saber?";
  if(/\b(obrigado|obrigada|valeu|agradecido)\b/.test(q))return "Por nada! Se precisar, posso procurar produtos ou explicar alguma parte do site.";
  if(/\b(outras unidades|outras lojas|outras filiais|filiais|outros estabelecimentos|outras padarias verena|unidades da verena|tem outra unidade|tem outras unidades)\b/.test(q)){
   lastTopic="outras unidades";
   return "Além da Unidade Brasiléia, encontrei cadastros públicos de estabelecimentos com o nome Padaria Verena em outros bairros de Betim:\n\n• Nossa Senhora das Graças — Rua Maria dos Anjos Ribeiro de Jesus, 221.\n• Vila Recreio — Avenida Bandeirantes, 475.\n• Cachoeira — Avenida Amazonas, 5501.\n\nAtenção: esses endereços aparecem em diretórios e registros públicos, mas o site ainda não tem confirmação oficial de que todos pertencem à mesma administração ou continuam funcionando como unidades da Verena. Para confirmar endereço e atendimento, fale com a equipe pelo "+phone+".";
  }
  if(/\b(endereco|localizacao|onde fica|como chegar|mapa|rota)\b/.test(q)){lastTopic="endereco";return "A Padaria Verena – Unidade Brasiléia fica na "+address+". Use a seção “Como chegar” para abrir o mapa e consultar a rota.";}
  if(/\b(telefone|whatsapp|contato|numero|falar com|atendente)\b/.test(q)){lastTopic="contato";return "O telefone/WhatsApp divulgado no site é "+phone+". O botão de WhatsApp abre uma conversa com a equipe.";}
  if(/\b(horario|abre|aberto|fecha|funcionamento|domingo|sabado|feriado)\b/.test(q)){lastTopic="horarios";return "Conforme as informações cadastradas no site, o funcionamento é de segunda a sábado, das 06h às 21h20, e domingo, das 06h às 13h30. Em feriados, confirme diretamente pelo "+phone+".";}
  if(/\b(instagram|rede social|perfil)\b/.test(q))return "O Instagram divulgado é @verenabrasileia: https://www.instagram.com/verenabrasileia/.";
  if(/\b(cardapio|catalogo|categorias|o que vende|o que tem|lista de produtos|produtos disponiveis)\b/.test(q)){
   lastTopic="catalogo";const list=allProducts(),cats=[...new Set(list.map(p=>p.category).filter(Boolean))];
   return "Consultei o catálogo carregado agora: encontrei "+list.length+" itens cadastrados, organizados nas categorias "+cats.join(", ")+".\n\nAlguns itens e fotos são ilustrativos; isso não confirma estoque ou disponibilidade de hoje. Se quiser, diga o nome de um produto ou uma categoria.";
  }
  if(/\b(preco|precos|valor|quanto custa|custa quanto)\b/.test(q)){
   const found=findProducts(raw);
   if(found.length===1){lastTopic=found[0].name;return "No catálogo, "+found[0].name+" aparece com "+money(found[0])+". "+(found[0].description||"")+" "+(found[0].price&&String(found[0].price).trim()?"Confirme se o valor continua atualizado pelo WhatsApp "+phone+".":"O preço ainda não foi informado no site; confirme com a equipe pelo "+phone+".");}
   if(found.length>1)return "Encontrei estes produtos relacionados:\n"+productSummary(found)+"\n\nQual deles você quer consultar?";
   return "Não encontrei um preço cadastrado que corresponda à sua pergunta. Não vou inventar valores. Diga o nome exato do produto ou confirme pelo WhatsApp "+phone+".";
  }
  if(/\b(entrega|delivery|entregador|prazo|frete|taxa de entrega|retirada)\b/.test(q)){lastTopic="entrega";return "O site oferece uma simulação de entrega e permite preparar uma consulta pelo WhatsApp. A simulação não confirma cobertura, taxa, prazo real ou disponibilidade. Informe o endereço no fluxo do pedido e aguarde a confirmação da equipe pelo "+phone+".";}
  if(/\b(pedido|comprar|sacola|adicionar|finalizar|carrinho)\b/.test(q)){lastTopic="pedido";return "Para consultar um pedido pelo site:\n1. Abra a aba Produtos/Cardápio.\n2. Pesquise ou escolha uma categoria.\n3. Toque em “Adicionar +” nos itens desejados.\n4. Abra “Minha sacola” e confira os itens.\n5. Use a opção de contato para enviar a consulta pelo WhatsApp.\n\nO pedido só fica confirmado depois que a equipe responder.";}
  if(/\b(encomenda|festa|cento|antecedencia|bolo personalizado)\b/.test(q)){lastTopic="encomendas";const list=findProducts("encomendas");return "O catálogo possui uma categoria Encomendas"+(list.length?":\n"+productSummary(list):".")+"\n\nQuantidade, sabores, antecedência, preço e disponibilidade precisam ser confirmados com a equipe pelo "+phone+".";}
  if(/\b(self service|selfservice|buffet|almoco|refeicao)\b/.test(q)){lastTopic="refeicoes";return "Há itens cadastrados na categoria Refeições, mas isso não confirma que o self-service esteja disponível hoje. Consulte a unidade pelo "+phone+" para confirmar dias, horários e valores.";}
  if(/\b(avaliacao|avaliar|estrelas|comentario|nota|google)\b/.test(q)){lastTopic="avaliacoes";return "Na seção “Avaliações”, informe seu nome, escolha uma nota, escreva um comentário e envie. As avaliações passam por análise antes da publicação. Elas são avaliações enviadas pelo próprio site e não representam automaticamente as avaliações do Google.";}
  if(/\b(sugestao|reclamacao|elogio|mensagem|feedback|atendimento)\b/.test(q)){lastTopic="atendimento";return "Na seção “Canal de atendimento”, escolha Sugestão, Reclamação ou Elogio, escreva sua mensagem e envie. Esse formulário é separado das avaliações públicas.";}
  if(/\b(foto|imagem|fotografia)\b/.test(q))return "As imagens do catálogo são ilustrativas e representam o tipo de produto. Não são necessariamente fotografias dos itens preparados nesta unidade.";
  if(/\b(admin|administrador|painel|cadastrar produto|editar produto)\b/.test(q))return "A área administrativa é destinada à equipe autorizada para gerenciar o conteúdo do site. O acesso é restrito à conta administradora.";
  if(/\b(ajuda|como funciona|funcoes|recursos|usar o site)\b/.test(q))return "Posso orientar sobre:\n• Produtos, categorias, pesquisa e favoritos.\n• Sacola e consulta de pedidos pelo WhatsApp.\n• Endereço, mapa, telefone e horários.\n• Avaliações e canal de sugestões/reclamações.\n• Encomendas e informações sobre entrega.\n\nQual dessas partes você quer conhecer melhor?";
  const found=findProducts(raw);
  if(found.length===1){const p=found[0];lastTopic=p.name;return "Encontrei este item no catálogo:\n"+p.name+"\nCategoria: "+(p.category||"Produtos")+"\nPreço: "+money(p)+"\n"+(p.description||"")+"\n\nA presença no catálogo não confirma estoque de hoje. Quer saber preço, categoria ou como adicionar à sacola?";}
  if(found.length>1){lastTopic="produtos";return "Encontrei alguns itens relacionados à sua busca:\n"+productSummary(found)+"\n\nQual deles você quer conhecer melhor?";}
  const sections=siteSections(),section=sections.find(s=>norm(s.title).includes(q)||q.includes(norm(s.title)));
  if(section){lastTopic=section.id;return "Encontrei a seção “"+section.title+"” no site. Ela contém estas informações:\n"+section.text.slice(0,650)+(section.text.length>650?"…":"")+"\n\nVocê pode abrir essa seção pelo menu do site.";}
  if(/\b(esse|essa|ele|ela|dele|dela|e esse|e essa|mais detalhes|me explica melhor|qual deles)\b/.test(q)&&lastTopic){
   if(lastTopic==="catalogo")return "Posso filtrar o catálogo por nome ou categoria. Escreva o produto que procura, como pão de queijo, café, bebida ou bolo.";
   if(lastTopic==="pedido")return "Na sacola, você consegue revisar os itens e preparar uma mensagem para a equipe. A confirmação final é feita pela padaria no WhatsApp "+phone+".";
   return "Você está perguntando sobre "+lastTopic+". Pode me dizer qual detalhe deseja saber? Posso consultar as informações cadastradas, mas não vou presumir dados que não aparecem no site.";
  }
  return "Não encontrei essa informação nas informações cadastradas do site. Para evitar uma resposta incorreta, não vou inventar. Posso pesquisar produtos e categorias, preços cadastrados, pedidos, entrega, encomendas, horários, endereço, avaliações e funções do site. Para confirmação da operação da padaria, fale com a equipe pelo "+phone+".";
 }
 function send(question){
  const clean=String(question||"").trim();if(!clean||busy)return;
  add(clean,"user");input.value="";busy=true;form.classList.add("is-thinking");
  const button=form.querySelector("button");if(button)button.disabled=true;
  const typing=document.createElement("div");typing.className="assistant-typing";typing.textContent="Consultando o site…";messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
  window.setTimeout(()=>{
   typing.remove();
   try{add(answer(clean),"bot")}catch(error){console.error("Assistente Verena:",error);add("Tive um problema ao consultar as informações. Tente novamente ou fale com a equipe pelo "+phone+".","bot")}
   finally{busy=false;form.classList.remove("is-thinking");if(button)button.disabled=false;input.focus()}
  },180);
 }
 $("clearAssistant")?.addEventListener("click",()=>{history=[];lastTopic="";try{sessionStorage.removeItem("verena_assistant_chat_v2")}catch(e){}welcome();});
 form.addEventListener("submit",e=>{e.preventDefault();send(input.value)});
 document.querySelectorAll("[data-assistant-question]").forEach(button=>button.addEventListener("click",()=>send(button.dataset.assistantQuestion)));
 restore();
})(); 
document.querySelectorAll("[data-menu-jump]").forEach(link=>link.addEventListener("click",()=>{const categoryName=link.dataset.menuJump;const chip=document.querySelector('[data-category="'+categoryName+'"]');if(chip)chip.click()}));
