import React from 'react';

const Draggable = ({
    id,
    children,
    onDragStart,
    onResizeStart,
    style,
    className
}) => {
    return (
        <div
            onMouseDown={(e) => onDragStart(e, id)}
            onTouchStart={(e) => onDragStart(e, id)}
            className={`draggable-item ${className}`}
            style={style}
        >
            {children}
            <div
                className="resize-handle"
                onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, id); }}
                onTouchStart={(e) => { e.stopPropagation(); onResizeStart(e, id); }}
            >
                {/* O ideal é usar um componente de ícone aqui, mas por enquanto o span funciona */}
                {/* Se você instalou iconify, pode usar: <span className="iconify" data-icon="mdi:resize-bottom-right"></span> */}
                <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 22h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0H8v-2h2v2zm-4 0H4v-2h2v2zm-2-4h2v-2H2v2zm0-4h2v-2H2v2zm0-4h2V8H2v2zm0-4h2V4H2v2zm4-2v2h2V2H6zm4 0v2h2V2h-2zm4 0v2h2V2h-2zm4 0v2h2V2h-2z"/></svg>
            </div>
        </div>
    );
};

export default Draggable;