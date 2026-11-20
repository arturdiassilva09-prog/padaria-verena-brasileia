const menuButton=document.getElementById("menuToggle");
const nav=document.getElementById("mainNav");
if(menuButton&&nav){
 menuButton.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded",String(open));
  menuButton.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
  menuButton.textContent=open?"×":"☰";
 });
 nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded","false");
  menuButton.setAttribute("aria-label","Abrir menu");
  menuButton.textContent="☰";
 }));
}
