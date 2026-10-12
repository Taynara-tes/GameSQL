# GameSQL — Zoológico Aurora 🐾
Jogo educativo em português criado com Tes: 100 animais, 10 espécies e sete níveis de consultas SQL reais.

## Jogar
Na raiz do projeto:

```sh
python -m http.server 8000 --directory dist
```
Abra http://localhost:8000. SQLite/sql.js 1.13.0 está incluído; as fontes externas são opcionais, com fallback local.

## Níveis
1. Encontrar o único animal alimentado zero vezes.
2. Identificar o animal mais velho.
3. Identificar os três mais novos, em ordem crescente de idade.
4. Selecionar os três mais velhos e apresentar esse grupo em ordem crescente de idade.
5. Identificar os dois animais mais pesados (ordem livre).
6. Identificar espécies com idade média acima de 20 anos, mostrando espécie e média em ordem decrescente.
7. Identificar o animal mais pesado de cada espécie, ordenando os dez por peso decrescente.

Cada nível tem duas pistas opcionais e um botão vermelho **Resposta**, com a ordem de escrita dos comandos, traduções curtas em português e a consulta sugerida em uma seção expansível. Abrir a resposta não executa SQL nem conclui o nível; o painel é reiniciado ao avançar. O acerto depende do resultado, incluindo quantidade de animais e ordem quando exigida. O jogador deve incluir nome ou id para identificar os animais. O nível 6 pede espécie e média; admite arredondamento a duas casas decimais e aliases livres para essas colunas. Colunas extras são permitidas; nomes podem ter aliases. `id` aceita alias explícito com `AS`. São aceitas consultas com `SELECT`, subconsultas e `WITH`, sem exigir sintaxe idêntica à sugestão. Ao acertar, aparecem parabéns, uma consulta sugerida com explicação, tradução de cada comando no rodapé e o botão do próximo nível. A sugestão é uma forma clara de resolver, sem afirmar que existe uma única consulta ótima.

Os dados são preservados ao avançar. O registro de alimentação é opcional após vencer o nível 1. Recomeçar sorteia outro animal sem refeições, sempre mantendo exatamente um contador zero. Recarregar a página reinicia a partida; não há persistência do progresso.

## Dados
Tabela `animais`: `id`, `animal`, `especie`, `vezes_alimentado`, `idade` (anos), `kg` (quilogramas).

São 100 nomes exclusivos e 100 pesos individuais distintos. Os limites de idade dos desafios não têm empates: isso permite validar a resposta sem critérios de desempate extras. Idades e pesos são fictícios e plausíveis; as referências e os grupos usados estão em `dados-referencias.md`. Rótulos como Macaco e Tartaruga são simplificações didáticas, não nomes de espécies científicas. A rotina de três refeições pertence ao cenário do jogo.

`zoologico.sql` reproduz a base fixa em SQLite. No navegador, somente a identidade do animal com zero refeições é sorteada por partida. `build.py` regenera o SQL e os dados, preservando os nomes.

## Validação

```sh
node tests/niveis.cjs
```
Os testes exercitam todos os níveis, soluções alternativas, ordenações incorretas, contagem de animais, nomes/pesos únicos, sorteio, pistas, avanço e limite de refeições.

## Tecnologia
HTML, CSS, JavaScript e SQLite via sql.js 1.13.0, licença MIT (ver `dist/vendor/LICENSE-sql.js`). As consultas rodam em uma cópia da base. O editor aceita somente leitura; o registro de alimentação usa uma atualização controlada.

## Situação
Versão para análise e teste privado. Sem publicação pública do site e sem GitHub Pages.
