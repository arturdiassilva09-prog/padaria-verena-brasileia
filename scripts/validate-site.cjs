const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync("index.html", "utf8");
const js = fs.readFileSync("script.js", "utf8");
const css = fs.readFileSync("style.css", "utf8");

const fail = (message) => { console.error("FALHA:", message); process.exitCode = 1; };
const ids = [...html.matchAll(/\\bid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) fail("IDs HTML duplicados: " + [...new Set(duplicateIds)].join(", "));

const idSet = new Set(ids);
const missingAnchors = [...html.matchAll(/href=["']#([^"']+)["']/g)]
  .map((match) => match[1]).filter((id) => !idSet.has(id));
if (missingAnchors.length) fail("Links internos sem destino: " + [...new Set(missingAnchors)].join(", "));

const missingScriptIds = [...js.matchAll(/\\$\\(["']([^"']+)["']\\)/g)]
  .map((match) => match[1]).filter((id) => !idSet.has(id));
if (missingScriptIds.length) fail("IDs usados no JavaScript e ausentes do HTML: " + [...new Set(missingScriptIds)].join(", "));

const localAssets = [...html.matchAll(/(?:src|href)=["']([^"'#]+\\.(?:js|css))(?:\\?[^"']*)?["']/g)]
  .map((match) => match[1]).filter((asset) => !/^https?:\\/\\//.test(asset));
for (const asset of localAssets) {
  if (!fs.existsSync(path.join(process.cwd(), asset))) fail("Arquivo local não encontrado: " + asset);
}

const productIds = [...js.matchAll(/\\{id:"([^"]+)",name:/g)].map((match) => match[1]);
const duplicateProducts = productIds.filter((id, index) => productIds.indexOf(id) !== index);
if (duplicateProducts.length) fail("IDs de produtos duplicados no catálogo inicial: " + [...new Set(duplicateProducts)].join(", "));

for (const required of ["catalogGrid", "productSearch", "categoryFilters", "cartItems", "sendOrder", "adminLoginForm", "feedbackForm", "reviewForm"]) {
  if (!idSet.has(required)) fail("Elemento essencial ausente do HTML: " + required);
}

if (!css.includes("@media")) fail("Não foram encontradas regras responsivas no CSS.");
if (!js.includes("function addToCart")) fail("Função de adicionar à sacola ausente.");
if (!js.includes("function renderCart")) fail("Função de renderizar a sacola ausente.");

if (process.exitCode) process.exit(process.exitCode);
console.log("VERIFICAÇÃO ESTÁTICA APROVADA: IDs, links internos, arquivos locais, catálogo, funções principais e responsividade.");
