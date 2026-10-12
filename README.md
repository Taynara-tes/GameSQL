# GameSQL — Mistério no Zoológico 🐯
Jogo educativo em português criado a partir da ideia de Tes: 100 animais, 10 espécies e três refeições por dia. Uma falha no sistema deixou um animal sem alimentação. O jogador investiga com SQL real e ajuda o tratador.

## Jogar
Sirva a pasta `dist` com um servidor estático. Por exemplo, na raiz do projeto:

```sh
python -m http.server 8000 --directory dist
```
Abra http://localhost:8000. As dependências SQLite estão incluídas em `dist/vendor`; fontes externas são opcionais e têm fallback local.

## Experiência
Investigação livre com roteiro reduzido e duas pistas narrativas opcionais, sem consultas prontas. O jogador decide como usar `SELECT`, `FROM` e `WHERE`. Uma consulta que identifica somente o animal correto (pelo id ou nome, sem alias nessas colunas) dispara os parabéns imediatamente, com contagem de consultas e pistas. O animal sem refeições é sorteado a cada reinício, sempre com exatamente um contador zero. A introdução apresenta a tabela e suas quatro colunas. Consultas de escrita são bloqueadas no editor; o botão de alimentação atualiza o contador em uma unidade até três. Recomeçar restaura o cenário. O progresso dura enquanto a página permanecer aberta; recarregar reinicia o teste.

## Dados
Tabela `animais`: `id`, `animal`, `especie`, `vezes_alimentado`. Exatamente 100 registros fictícios; contador diário entre 0 e 3. Viveiros fazem parte do cenário narrativo e não adicionam colunas à tabela definida por Tes. `zoologico.sql` permite reproduzir a base em SQLite.

## Tecnologia e licença de terceiros
HTML, CSS, JavaScript e SQLite via sql.js 1.13.0. Dependências distribuídas sob licença MIT (ver `dist/vendor/LICENSE-sql.js`).

## Situação
Versão inicial para análise e teste privado. Sem publicação pública do site e sem GitHub Pages.
