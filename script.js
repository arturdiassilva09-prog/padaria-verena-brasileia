const toggle=document.getElementById("menuToggle"),nav=document.getElementById("mainNav");
if(toggle&&nav){toggle.addEventListener("click",()=>{const opened=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(opened));toggle.textContent=opened?"×":"☰";});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰";}));}
const $=id=>document.getElementById(id),KEY="verena_catalog_v1",CART="verena_cart_v1",PROMO="verena_promo_v1";
const seed=[
{id:"p1",name:"Pão francês",category:"Pães",description:"Clássico para o café da manhã",price:"",emoji:"🥖"},
{id:"p2",name:"Pão de queijo",category:"Pães",description:"Um clássico mineiro",price:"",emoji:"🧀"},
{id:"p3",name:"Baguete",category:"Pães",description:"Opção tradicional para compartilhar",price:"",emoji:"🥖"},
{id:"p4",name:"Coxinha",category:"Salgados",description:"Consulte os sabores disponíveis",price:"",emoji:"🥟"},
{id:"p5",name:"Salgado do dia",category:"Salgados",description:"Consulte as opções no balcão",price:"",emoji:"🥐"},
{id:"p6",name:"Bolo",category:"Doces",description:"Consulte os sabores disponíveis",price:"",emoji:"🍰"},
{id:"p7",name:"Café",category:"Bebidas",description:"Para acompanhar seu lanche",price:"",emoji:"☕"}
];
let products=load(KEY,seed),cart=load(CART,[]),category="Todos",favorites=new Set(load("verena_favs_v1",[]));
function load(k,fallback){try{const v=JSON.parse(localStorage.getItem(k));return v??fallback}catch{return fallback}}
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
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
$("sendOrder").addEventListener("click",()=>{if(!cart.length){alert("Adicione pelo menos um produto à sacola.");return}const lines=cart.map(x=>{const p=products.find(p=>p.id===x.id);return p?x.qty+"x "+p.name:""}).filter(Boolean);const msg="Olá! Gostaria de consultar disponibilidade e valores para:\n"+lines.join("\n")+"\n\nPodem confirmar, por favor?";window.open("https://wa.me/5531990905985?text="+encodeURIComponent(msg),"_blank","noopener");});
$("openAdmin").addEventListener("click",()=>{renderAdmin();$("promoInput").value=load(PROMO,"");show("adminOverlay")});
$("savePromo").addEventListener("click",()=>{save(PROMO,$("promoInput").value.trim());$("promoText").textContent=$("promoInput").value.trim()||"Acompanhe os destaques e consulte a equipe sobre as ofertas disponíveis hoje.";alert("Destaque salvo neste navegador.")});
function renderAdmin(){$("adminProductCount").textContent=products.length+" itens";$("adminProductList").innerHTML=products.map(p=>'<div class="admin-product"><span><strong>'+escapeHtml(p.name)+'</strong><small>'+escapeHtml(p.category)+' · '+money(p.price)+'</small></span><span><button data-edit="'+p.id+'">Editar</button><button data-delete="'+p.id+'">Excluir</button></span></div>').join("")}
function resetForm(){$("productForm").reset();$("editProductId").value="";$("saveProduct").textContent="Adicionar produto";$("cancelEdit").hidden=true}
$("productForm").addEventListener("submit",e=>{e.preventDefault();const id=$("editProductId").value;const data={id:id||"p"+Date.now(),name:$("adminProductName").value.trim(),category:$("adminProductCategory").value,price:$("adminProductPrice").value.trim(),description:$("adminProductDescription").value.trim(),emoji:"🥐"};if(id)products=products.map(p=>p.id===id?data:p);else products.push(data);save(KEY,products);resetForm();render();renderAdmin()});
$("adminProductList").addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit){const p=products.find(x=>x.id===edit.dataset.edit);$("editProductId").value=p.id;$("adminProductName").value=p.name;$("adminProductCategory").value=p.category;$("adminProductPrice").value=p.price;$("adminProductDescription").value=p.description;$("saveProduct").textContent="Salvar alterações";$("cancelEdit").hidden=false}if(del&&confirm("Excluir este produto do catálogo local?")){products=products.filter(p=>p.id!==del.dataset.delete);cart=cart.filter(x=>x.id!==del.dataset.delete);save(KEY,products);save(CART,cart);render();renderAdmin();renderCart()}});
$("cancelEdit").addEventListener("click",resetForm);
const promo=load(PROMO,"");if(promo)$("promoText").textContent=promo;
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

/* Avaliações: protótipo local. Substituir localStorage por API/backend no futuro. */
const REVIEW_KEY="verena_reviews_prototype_v1";
function renderReviews(){
 const saved=load(REVIEW_KEY,[]),list=$("reviewList"),count=$("reviewCount");
 if(!list||!count)return;
 count.textContent=saved.length+" "+(saved.length===1?"avaliação":"avaliações");
 list.innerHTML=saved.length?saved.slice().reverse().map(r=>'<article class="review-item"><div class="review-item-top"><span class="review-item-name">'+escapeHtml(r.name)+'</span><time class="review-item-date">'+escapeHtml(r.date)+'</time></div><div class="review-item-stars" aria-label="'+r.rating+' de 5 estrelas">'+("★".repeat(r.rating))+("☆".repeat(5-r.rating))+'</div><p>'+escapeHtml(r.comment)+'</p></article>').join(""):'<div class="review-empty"><span>✦</span><strong>Seja a primeira pessoa a avaliar</strong><p>As avaliações enviadas neste protótipo aparecerão aqui neste dispositivo.</p></div>';
}
const reviewForm=$("reviewForm");
if(reviewForm){
 reviewForm.addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("reviewName").value.trim(),comment=$("reviewComment").value.trim(),rating=Number($("reviewRating").value);
  if(!name||!comment||rating<1||rating>5)return;
  const saved=load(REVIEW_KEY,[]);
  saved.push({name,comment,rating,date:new Date().toLocaleDateString("pt-BR")});
  save(REVIEW_KEY,saved);reviewForm.reset();
  $("reviewFeedback").textContent="Avaliação registrada apenas neste navegador (modo demonstração).";
  renderReviews();
 });
 renderReviews();
}

render();