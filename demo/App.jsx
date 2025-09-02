import React, { useState } from 'react';
import { Droppable } from '../src/index.js';

// Os dados que antes estavam no HTML, agora ficam na aplicação de exemplo.
const initialCards = [
    { id: 1, title: "Card 1", color: 'bg-red-500', size: 'sm' },
    { id: 2, title: "Card 2", color: 'bg-blue-500', size: 'md' },
    { id: 3, title: "Card 3", color: 'bg-green-500', size: 'lg' },
    { id: 4, title: "Card 4", color: 'bg-yellow-500', size: 'sm' },
    { id: 5, title: "Card 5", color: 'bg-purple-500', size: 'xl' },
    { id: 6, title: "Card 6", color: 'bg-pink-500', size: 'sm' },
];

// O CSS da nossa biblioteca precisa ser importado pela aplicação que a consome.
import '../src/styles.css';

// Para o Tailwind funcionar no ambiente de demo, precisamos de um link no HTML.
// Em uma aplicação real, o Tailwind já estaria configurado no projeto do usuário.

const App = () => {
    const [cards, setCards] = useState(initialCards);

    return (
        <div className="w-screen h-screen p-4 md:p-8 bg-slate-900 text-white">
             <h1 className="text-3xl font-bold text-white mb-6 text-center">Dashboard Interativo (Demo)</h1>
             <div className="w-full h-[calc(100vh-100px)] bg-slate-800 rounded-xl p-4">
                {/* Aqui usamos nossa biblioteca! */}
                <Droppable cards={cards} setCards={setCards} />
             </div>
        </div>
    );
};

export default App;