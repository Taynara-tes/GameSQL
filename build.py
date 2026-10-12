from pathlib import Path
import json
p=Path(__file__).resolve().parent
# Os nomes existentes são preservados, cada um exclusivo.
raw=(p/'dist/dados.js').read_text().removeprefix('const ANIMAIS = ').strip().removesuffix(';')
animals=json.loads(raw)
ages=[ [5,7,9,6,8,10,11,12,13,14], [6,8,10,7,9,11,12,13,14,15], [18,23,29,35,41,47,52,33,26,38], [4,6,8,5,7,9,10,11,12,13], [5,7,9,6,8,10,11,12,13,14], [1,5,7,9,11,6,8,10,12,14], [6,11,16,21,26,31,36,41,46,51], [3,5,7,9,11,6,8,10,12,14], [7,11,15,19,23,27,31,35,39,43], [40,45,50,55,60,65,70,73,87,96] ]
# Faixas de trabalho fictícias baseadas nas referências documentadas em dados-referencias.md.
weights=[(125,245),(600,1250),(2800,5900),(220,400),(90,290),(4,9),(0.85,1.25),(2.3,4.6),(12,38),(105,220)]
for a in animals:
 s=(a['id']-1)//10;j=(a['id']-1)%10;a['idade']=ages[s][j];a['kg']=round(weights[s][0]+(weights[s][1]-weights[s][0])*j/9,2)
 # Dois juvenis: id51 com um ano, id31 com dois anos. Pinguim id71 tem três.
 if a['id']==51:a['kg']=2.1
 if a['id']==31:a['idade']=2;a['kg']=219.5
assert len(animals)==100 and len({a['animal'] for a in animals})==100
assert len({a['kg'] for a in animals})==100
assert sum(a['vezes_alimentado']==0 for a in animals)==1
(p/'dist/dados.js').write_text('const ANIMAIS = '+json.dumps(animals,ensure_ascii=False)+';\n')
sql='CREATE TABLE animais (id INTEGER PRIMARY KEY, animal TEXT NOT NULL UNIQUE, especie TEXT NOT NULL, vezes_alimentado INTEGER NOT NULL CHECK (vezes_alimentado BETWEEN 0 AND 3), idade INTEGER NOT NULL CHECK (idade > 0), kg REAL NOT NULL UNIQUE CHECK (kg > 0));\n'
for a in animals:
 sql+='INSERT INTO animais VALUES (%d, %s, %s, %d, %d, %s);\n'%(a['id'],"'"+a['animal']+"'","'"+a['especie']+"'",a['vezes_alimentado'],a['idade'],a['kg'])
(p/'zoologico.sql').write_text(sql)
print('Base gerada: 100 nomes, 100 pesos distintos, 6 colunas, 1 contador zero.')
