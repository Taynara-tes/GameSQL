const $ = id => document.getElementById(id);
const missions = [
 {title:'Abra os registros',text:'O banco tem uma tabela chamada animais. Comece consultando todas as suas colunas para conhecer os 100 animais. No guia acima, você encontra a estrutura da primeira consulta.',hints:['SELECT escolhe as colunas. FROM indica a tabela.','O asterisco (*) significa todas as colunas.','SELECT * FROM animais;']},
 {title:'Siga a pista das listras',text:'O tratador lembra que o animal tem listras alaranjadas e pretas. Consulte todos os tigres e suas refeições. Nesta tabela, a espécie está escrita como Tigre.',hints:['WHERE permite filtrar os registros.','Textos devem ficar entre aspas simples: especie = \'Tigre\'.',"SELECT * FROM animais WHERE especie = 'Tigre';"]},
 {title:'Encontre as refeições pendentes',text:'Alguns animais receberam só uma ou duas refeições. Consulte todos os animais que receberam menos de 3 refeições, de qualquer espécie.',hints:['Uma alimentação incompleta significa um número menor que 3.','Use WHERE vezes_alimentado < 3.', 'SELECT * FROM animais WHERE vezes_alimentado < 3;']},
 {title:'Resolva o mistério',text:'Agora encontre somente o animal que não recebeu nenhuma refeição hoje. Mostre seu id, nome, espécie e contador.',hints:['Sem alimentação significa contador igual a zero.','Use WHERE vezes_alimentado = 0.', 'SELECT * FROM animais WHERE vezes_alimentado = 0;']},
 {title:'Confira o cuidado',text:'Registre uma alimentação por vez no botão abaixo. Depois das três refeições, consulte o animal pelo id para verificar que o contador chegou a 3.',hints:['O botão registra +1 refeição no banco. Você pode consultar a mudança a cada clique.','Filtre o id do animal que você encontrou.', 'SELECT * FROM animais WHERE id = 47;']}
];
let SQL,db,stage=0,hintIndex=0,passed=false,found=false;
function message(text,type=''){ $('feedback').textContent=text; $('feedback').className=type; }
function drawMission(){
 $('mission-number').textContent=`MISSÃO ${stage+1} DE 5`;
 $('mission-title').textContent=missions[stage].title; $('mission-text').textContent=missions[stage].text;
 $('hint-text').hidden=true;hintIndex=0;$('hint').textContent='💡 Preciso de uma pista';
 $('steps').replaceChildren();missions.forEach((m,i)=>{const div=document.createElement('div');div.className='step'+(i===stage?' active':'');const n=document.createElement('b');n.textContent=i<stage?'✓':i+1;const label=document.createElement('span');label.textContent=m.title;div.append(n,label);$('steps').append(div);});
 $('rescue').hidden=!passed&&!found;$('feed').hidden=stage<4;$('next').hidden=!passed||stage===4;
 if(stage===4){$('rescue').hidden=false;updateRescue();}
}
function updateRescue(){let n=db.exec('SELECT vezes_alimentado FROM animais WHERE id = 47')[0].values[0][0];$('rescue-text').textContent=`Âmbar · Tigre · ${n} de 3 refeições registradas hoje.`;$('feed').disabled=n>=3;$('feed').textContent=n>=3?'Três refeições registradas ✓':'Registrar uma alimentação (+1)';}
function render(result){$('results').replaceChildren();if(!result.length){$('row-count').textContent='0 registros';$('results').textContent='Nenhum registro encontrado. Revise o filtro e tente novamente.';return;}
 let r=result[0];$('row-count').textContent=`${r.values.length} registro${r.values.length===1?'':'s'}`;
 const table=document.createElement('table'),thead=document.createElement('thead'),head=document.createElement('tr');r.columns.forEach(c=>{const th=document.createElement('th');th.textContent=c;head.append(th);});thead.append(head);table.append(thead);const body=document.createElement('tbody');r.values.forEach(row=>{const tr=document.createElement('tr');row.forEach(v=>{const td=document.createElement('td');td.textContent=v===null?'NULL':String(v);tr.append(td);});body.append(tr);});table.append(body);$('results').append(table);
}
function validate(r){if(!r||!['id','animal','especie','vezes_alimentado'].every(c=>r.columns.includes(c)))return false;
 const idIndex=r.columns.indexOf('id'); const ids=r.values.map(v=>v[idIndex]);
 let expected=stage===0?ANIMAIS.map(a=>a.id):stage===1?ANIMAIS.filter(a=>a.especie==='Tigre').map(a=>a.id):stage===2?ANIMAIS.filter(a=>a.vezes_alimentado<3).map(a=>a.id):[47];
 if(ids.length!==expected.length||new Set(ids).size!==expected.length||!expected.every(id=>ids.includes(id)))return false;
 return stage!==4||r.values[0][r.columns.indexOf('vezes_alimentado')]===3;
}
function execute(){let query=$('query').value.trim();if(!query){message('Digite uma consulta para investigar os registros.','error');return;}
 let stmt;
 try {
  // O jogo permite uma única consulta SELECT. Escritas só pelo botão controlado de alimentação.
  if(!/^\s*SELECT\b/i.test(query))throw Error('Use uma consulta SELECT. Registre as refeições pelo botão de alimentação.');
  const forbidden=/\b(?:INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|ATTACH|DETACH|PRAGMA|REPLACE)\b/i;
  if(forbidden.test(query.replace(/'(?:''|[^'])*'/g,"''")))throw Error('Nesta investigação, use apenas SELECT para consultar.');
  const statements=db.iterateStatements(query);let count=0;for(const s of statements){count++;}if(count!==1)throw Error('Execute apenas uma consulta por vez.');
  const results=db.exec(query);render(results);
  if(validate(results[0])){passed=true;if(stage===3)found=true;message(stage===4?'Missão concluída! Você encontrou Âmbar e confirmou suas três refeições. 🐯':stage===3?'Encontrado! Âmbar não recebeu nenhuma refeição. Avance para registrar o cuidado.':'Boa investigação! Resultado correto. Avance para a próxima missão.','success');drawMission();}
  else message('Consulta executada. Compare o resultado com o pedido da missão; você pode ajustar e tentar novamente.');
 }catch(e){message('Vamos ajustar: '+e.message,'error');}
}
$('run').onclick=execute;
$('hint').onclick=()=>{let hints=missions[stage].hints;$('hint-text').hidden=false;$('hint-text').textContent=hints[Math.min(hintIndex++,hints.length-1)];$('hint').textContent=hintIndex>=hints.length?'💡 Rever a última pista':'💡 Mais uma pista';};
$('example').onclick=()=>{$('hint-text').hidden=false;$('hint-text').textContent='Estrutura: SELECT coluna FROM tabela WHERE condição; SELECT = selecionar, FROM = de qual tabela, WHERE = sob qual condição. O filtro WHERE é opcional.';};
$('next').onclick=()=>{if(passed&&stage<4){stage++;passed=false;drawMission();message('Nova pista liberada. Escreva sua próxima consulta.');}};
$('query').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();if(db)execute();}});
$('feed').onclick=()=>{db.run('UPDATE animais SET vezes_alimentado = vezes_alimentado + 1 WHERE id = 47 AND vezes_alimentado < 3');updateRescue();message('Alimentação registrada. Consulte o animal para verificar o contador.');};
function reset(){if(db)db.close();db=new SQL.Database();db.run('CREATE TABLE animais (id INTEGER PRIMARY KEY, animal TEXT NOT NULL UNIQUE, especie TEXT NOT NULL, vezes_alimentado INTEGER NOT NULL CHECK(vezes_alimentado BETWEEN 0 AND 3))');const stmt=db.prepare('INSERT INTO animais VALUES (?, ?, ?, ?)');for(const a of ANIMAIS)stmt.run([a.id,a.animal,a.especie,a.vezes_alimentado]);stmt.free();stage=0;passed=false;found=false;$('query').value='';$('results').innerHTML='<div class="empty">🔎<p>Sua próxima consulta começa a investigação.</p></div>';$('row-count').textContent='Nenhuma consulta ainda';drawMission();message('Banco pronto. O tratador conta com você!');}
$('restart').onclick=()=>{if(db&&confirm('Recomeçar a investigação? As refeições e o progresso deste teste serão reiniciados.'))reset();};
drawMission();initSqlJs({locateFile:file=>'vendor/'+file}).then(engine=>{SQL=engine;reset();$('run').disabled=false;$('run').textContent='Executar consulta →';}).catch(()=>{message('Não foi possível carregar o banco. Recarregue a página para tentar novamente.','error');});
