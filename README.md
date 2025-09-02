<h1 align="center">
  <img alt="React DashGrid Logo" title="React DashGrid" src="./img/rino.png"   />
</h1>

<h3 align="center">
Uma biblioteca de componentes React leve e poderosa para criar dashboards com grid dinâmico e arrastável.
</h3>

<p align="center">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/react-draggrid-library">
  <img alt="NPM License" src="https://img.shields.io/npm/l/react-draggrid-library">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/matheuslemess/react-draggrid-library?color=%2304D361">
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/matheuslemess/react-draggrid-library">
  <a href="https://github.com/matheuslemess/react-draggrid-library/commits/main">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/matheuslemess/react-draggrid-library">
  </a>
  <a href="https://github.com/matheuslemess/react-draggrid-library/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/matheuslemess/react-draggrid-library?style=social">
  </a>
</p>

<p align="center">
  <a href="#-por-que-react-draggrid-library">Por que React DragGrid Library?</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-instalação">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-usar">Como Usar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-api">API</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-demonstração-online">Demonstração</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-contribuições">Contribuições</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">Licença</a>
</p>

---

## 🚀 Por que React DragGrid Library?

- 📦 **Layout Inteligente**: Organiza os cards automaticamente para preencher os espaços da melhor forma, sem deixar "buracos".
- ↔️ **Leve e Sem Dependências**: Construído com React puro, sem bibliotecas externas pesadas.
- 👁️ **Totalmente Customizável**: Você controla 100% o conteúdo e a aparência dos seus cards.
- ✨ **Responsivo**: O grid se adapta fluidamente ao tamanho do container.

---

## 📦 Instalação

```bash
npm install react-draggrid-library
# ou
yarn add react-draggrid-library

---

## 🛠️ Como Usar

A react-draggrid-library exporta um componente principal: <Droppable />.
Você deve gerenciar o estado dos seus cards e passar para o componente, junto com uma função que renderiza seus cards customizados.

```jsx
import React, { useState } from 'react';
import { Droppable } from 'react-draggrid-library';

// IMPORTANTE: Importe os estilos base da biblioteca para o drag-and-drop funcionar.
import 'react-draggrid-library/dist/style.css';

// 1. Defina o seu componente de Card customizado
const MyCard = ({ card, onRemove }) => (
  <div style={{
    width: '100%',
    height: '100%',
    backgroundColor: card.color,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    position: 'relative',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }}>
    <h3>{card.title}</h3>
    <button
      onClick={() => onRemove(card.id)}
      style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
    >
      ×
    </button>
  </div>
);

function App() {
  // 2. Gerencie o estado dos seus cards
  const [cards, setCards] = useState([
    { id: '1', title: 'Card 1', size: 'sm', color: '#ef4444' },
    { id: '2', title: 'Card 2', size: 'md', color: '#3b82f6' },
    { id: '3', title: 'Card 3', size: 'lg', color: '#22c55e' },
  ]);

  const removeCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <div style={{ width: '100%', height: '500px', backgroundColor: '#334155', padding: '16px', borderRadius: '8px' }}>
      <Droppable
        cards={cards}
        onCardsChange={setCards}
        renderCard={(card) => <MyCard card={card} onRemove={removeCard} />}
      />
    </div>
  );
}
```

---

## 📚 API

### Props do `<Droppable />`

| Prop            | Tipo                                     | Obrigatório | Descrição |
|-----------------|------------------------------------------|-------------|-----------|
| `cards`         | `CardData[]`                             | ✅ Sim      | Lista de objetos representando os cards |
| `onCardsChange` | `(cards: CardData[]) => void`            | ✅ Sim      | Função chamada quando a ordem ou tamanho dos cards muda |
| `renderCard`    | `(card: CardData) => React.ReactNode`    | ✅ Sim      | Função que renderiza cada card |
| `baseUnitWidth` | `number`                                 | ❌ Não      | Largura base em px (padrão: `160`) |
| `baseUnitHeight`| `number`                                 | ❌ Não      | Altura base em px (padrão: `100`) |
| `gap`           | `number`                                 | ❌ Não      | Espaçamento entre os cards (padrão: `16`) |
| `sizes`         | `Record<string, {w: number, h: number}>` | ❌ Não      | Objeto com definições de tamanhos customizados |

### Estrutura do Objeto `CardData`
Cada objeto no array `cards` deve conter, no mínimo, as seguintes propriedades:

| Chave   | Tipo                 | Obrigatório | Descrição                                      |
|---------|----------------------|-------------|------------------------------------------------|
| `id`    | `string` ou `number` | ✅ Sim      | Identificador único e estável para o card.     |
| `size`  | `string`             | ✅ Sim      | Chave de um tamanho definido na prop `sizes`. |

---

## 🖼️ Demonstração Online

👉 *Veja a biblioteca em ação na [Vercel]!*(https://dashboard-interativo-livid.vercel.app/)

---

## 🏗️ Contribuições

Contribuições são bem-vindas!
Se encontrou um bug ou tem uma sugestão, por favor, abra uma [issue](https://github.com/matheuslemess/react-dashgrid/issues).

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

<p align="center">
Feito por Matheus Lemes
</p>

<p align="center">
<a href="https://www.linkedin.com/ibn/4matheuslemes">
<img alt="Conecte-se comigo no LinkedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white">
</a>
<a href="https://github.com/matheuslemess">
<img alt="Siga-me no GitHub" src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white">
</a>
</p>