

const STORE_KEY = 'library_v1';
let store = JSON.parse(localStorage.getItem(STORE_KEY)) || {books:[], issued:[]};

function saveStore(){ localStorage.setItem(STORE_KEY, JSON.stringify(store)); }

const navButtons = document.querySelectorAll('.nav button');
const viewTitle = document.getElementById('view-title');
const viewContainer = document.getElementById('view-container');
const templates = {};
document.querySelectorAll('template').forEach(t=>templates[t.id.replace('tpl-','')]=t);

function setActiveView(view){
  navButtons.forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  viewTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
  renderView(view);
}

navButtons.forEach(b=>b.addEventListener('click', ()=> setActiveView(b.dataset.view)));

function renderView(view){
  viewContainer.innerHTML = '';
  const tpl = templates[view];
  if(!tpl) return viewContainer.textContent='Not available';
  viewContainer.appendChild(tpl.content.cloneNode(true));
  if(view==='dashboard') renderDashboard();
  if(view==='add') bindAdd();
  if(view==='display') bindDisplay();
  if(view==='search') bindSearch();
  if(view==='issue') bindIssue();
}

// Dashboard Stats
function renderDashboard(){
  document.getElementById('stat-total').textContent = store.books.length;
  document.getElementById('stat-issued').textContent = store.issued.length;
  document.getElementById('stat-available').textContent = store.books.length - store.issued.length;
}

// ADD BOOK
function bindAdd(){
  const form = document.getElementById('addForm');
  const resetBtn = document.getElementById('resetAdd');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const id=form.id.value.trim(), name=form.name.value.trim();
    if(store.books.find(b=>b.id===id)){ alert('Book ID already exists'); return; }
    store.books.push({id,name});
    saveStore(); alert('Book added'); form.reset(); renderDashboard();
  });
  resetBtn.addEventListener('click', ()=>form.reset());
}

// DISPLAY BOOKS
function bindDisplay(){
  const tbody = document.querySelector('#booksTable tbody');
  tbody.innerHTML='';
  store.books.forEach(b=>{
    const tr=document.createElement('tr');
    const status = store.issued.includes(b.id)?'Issued':'Available';
    tr.innerHTML=`<td>${b.id}</td><td>${b.name}</td><td>${status}</td><td class="actions"></td>`;
    const actions = tr.querySelector('.actions');
    if(!store.issued.includes(b.id)){
      const issueBtn=document.createElement('button'); issueBtn.className='btn primary'; issueBtn.textContent='Issue';
      issueBtn.addEventListener('click', ()=>{ store.issued.push(b.id); saveStore(); bindDisplay(); renderDashboard(); });
      actions.appendChild(issueBtn);
    }
    const delBtn=document.createElement('button'); delBtn.className='btn ghost'; delBtn.textContent='Delete';
    delBtn.addEventListener('click', ()=>{ if(confirm('Delete book?')){ store.books=store.books.filter(x=>x.id!==b.id); store.issued=store.issued.filter(x=>x!==b.id); saveStore(); bindDisplay(); renderDashboard(); } });
    actions.appendChild(delBtn);
    tbody.appendChild(tr);
  });
}

// SEARCH BOOK
function bindSearch(){
  const form = document.getElementById('searchForm');
  const result = document.getElementById('searchResult');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const id=form.id.value.trim();
    const book=store.books.find(b=>b.id===id);
    if(book) result.innerHTML=`✅ Found: ${book.name} (${store.issued.includes(book.id)?'Issued':'Available'})`;
    else result.innerHTML='❌ Not Found';
  });
}

// ISSUE BOOK
function bindIssue(){
  const form=document.getElementById('issueForm');
  const result=document.getElementById('issueResult');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const id=form.id.value.trim();
    if(!store.books.find(b=>b.id===id)){ result.innerHTML='❌ Book Not Found'; return; }
    if(store.issued.includes(id)){ result.innerHTML='⚠ Already Issued'; return; }
    store.issued.push(id); saveStore();
    result.innerHTML='✅ Book Issued Successfully'; renderDashboard(); bindDisplay();
  });
}

setActiveView('dashboard');
