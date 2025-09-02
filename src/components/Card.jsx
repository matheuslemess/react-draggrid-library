import React from 'react';
import { SIZES } from '../constants'; // Importa as definições de tamanho

const Card = ({ title, color, onHidden, onSizeChange, id, isMenuOpen, onMenuToggle }) => {

    const handleSizeSelect = (size) => {
        onSizeChange(id, size);
        onMenuToggle(id); // Fecha o menu após a seleção
    };

    return (
        <div className={`relative w-full h-full p-4 rounded-lg flex items-center justify-center text-center ${color}`}>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
                <button
                    onMouseDown={(e) => { e.stopPropagation(); onMenuToggle(id); }}
                    className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity text-xl"
                >
                    {/* Ícone de três pontos */}
                    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m-6 0a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2m12 0a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2z"/></svg>
                </button>
                {isMenuOpen && (
                    <div
                        className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-700 rounded-md shadow-lg p-2 flex flex-col items-center gap-1"
                        onMouseDown={e => e.stopPropagation()}
                        onTouchStart={e => e.stopPropagation()}
                    >
                        {Object.keys(SIZES).map(sizeKey => (
                            <button
                                key={sizeKey}
                                onClick={() => handleSizeSelect(sizeKey)}
                                className="w-full text-left px-4 py-1 text-sm text-white hover:bg-slate-600 rounded whitespace-nowrap"
                            >
                                Tamanho {sizeKey.toUpperCase()}
                            </button>
                        ))}
                        <hr className="w-full border-slate-600 my-1" />
                        <button
                            onClick={(e) => { e.stopPropagation(); onHidden(); }}
                            className="w-full text-left px-4 py-1 text-sm text-red-400 hover:bg-slate-600 rounded"
                        >
                            Ocultar Card
                        </button>
                    </div>
                )}
            </div>

            <h3 className="text-white font-bold text-lg select-none">{title}</h3>
        </div>
    );
};

export default Card;