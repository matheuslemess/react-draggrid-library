import React, { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';
import Draggable from './Draggable';
import Card from './Card';
import { BASE_UNIT_WIDTH, BASE_UNIT_HEIGHT, GAP, SIZES } from '../constants';
import '../styles.css';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const Droppable = ({ cards, setCards }) => {
    const [positions, setPositions] = useState({});
    const [dragging, setDragging] = useState(null);
    const [resizing, setResizing] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const containerRef = useRef(null);
    const lastTargetId = useRef(null);

    const calculateLayout = useCallback(() => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const columns = Math.floor((containerWidth + GAP) / (BASE_UNIT_WIDTH + GAP)) || 1;
        const grid = new Map();

        const isAreaFree = (x, y, w, h) => {
            if (x + w > columns) return false;
            for (let i = y; i < y + h; i++) {
                for (let j = x; j < x + w; j++) {
                    if (grid.has(`${j},${i}`)) return false;
                }
            }
            return true;
        };

        const placeInGrid = (x, y, w, h, id) => {
             for (let i = y; i < y + h; i++) {
                for (let j = x; j < x + w; j++) {
                    grid.set(`${j},${i}`, id);
                }
            }
        };

        const newPositions = {};
        let unplacedCards = [...cards];
        let y = 0;

        while(unplacedCards.length > 0) {
            let placedInRow = false;
            for(let x = 0; x < columns; x++) {
                if(!grid.has(`${x},${y}`)) {
                    let placedCardIndex = -1;
                    for (let i=0; i < unplacedCards.length; i++) {
                        const cardToTest = unplacedCards[i];
                        const size = SIZES[cardToTest.size];
                        if(isAreaFree(x, y, size.w, size.h)) {
                            placeInGrid(x, y, size.w, size.h, cardToTest.id);
                            newPositions[cardToTest.id] = {
                                x: x * (BASE_UNIT_WIDTH + GAP),
                                y: y * (BASE_UNIT_HEIGHT + GAP),
                                w: size.w * BASE_UNIT_WIDTH + (size.w - 1) * GAP,
                                h: size.h * BASE_UNIT_HEIGHT + (size.h - 1) * GAP,
                            };
                            placedCardIndex = i;
                            placedInRow = true;
                            break;
                        }
                    }
                    if(placedCardIndex !== -1) {
                        unplacedCards.splice(placedCardIndex, 1);
                    }
                }
            }
            if(!placedInRow && unplacedCards.length > 0) {
                y++;
                if (y > 100) { // Safety break to avoid infinite loops
                    console.error("Could not place all cards. Breaking layout calculation.");
                    break;
                }
            } else if (!placedInRow && unplacedCards.length === 0) {
                // All cards placed, exit loop
                break;
            }
        }
        setPositions(newPositions);
    }, [cards]);

    useLayoutEffect(() => {
        calculateLayout();
        const closeMenu = () => setActiveMenuId(null);
        window.addEventListener('resize', calculateLayout);
        window.addEventListener('mousedown', closeMenu);
        return () => {
            window.removeEventListener('resize', calculateLayout);
            window.removeEventListener('mousedown', closeMenu);
        }
    }, [cards, calculateLayout]);

    const handleDragStart = (e, id) => {
        if (activeMenuId !== null) return;
        lastTargetId.current = null;
        const pos = positions[id];
        if (!pos) return;

        const eventPos = e.touches ? e.touches[0] : e;
        setDragging({
            id,
            initialCardX: pos.x,
            initialCardY: pos.y,
            x: pos.x,
            y: pos.y,
            initialMouse: { x: eventPos.clientX, y: eventPos.clientY }
        });
    };

    const handleResizeStart = (e, id) => {
         const pos = positions[id];
        if (!pos) return;

        const eventPos = e.touches ? e.touches[0] : e;
        setResizing({
            id,
            initialW: pos.w,
            initialH: pos.h,
            initialMouse: { x: eventPos.clientX, y: eventPos.clientY }
        });
    };

    const handleReorder = useCallback((originId, destinyId) => {
        setCards(currentCards => {
            const originIndex = currentCards.findIndex(c => c.id === originId);
            const destinyIndex = currentCards.findIndex(c => c.id === destinyId);
            if (originIndex === -1 || destinyIndex === -1 || originIndex === destinyIndex) return currentCards;
            return reorder(currentCards, originIndex, destinyIndex);
        });
    }, [setCards]);

    const handleDragMove = useCallback((e) => {
        if (!dragging) return;
        e.preventDefault();
        const eventPos = e.touches ? e.touches[0] : e;
        const dx = eventPos.clientX - dragging.initialMouse.x;
        const dy = eventPos.clientY - dragging.initialMouse.y;

        const newX = dragging.initialCardX + dx;
        const newY = dragging.initialCardY + dy;

        setDragging(d => ({...d, x: newX, y: newY }));

        const originId = dragging.id;
        const originPos = positions[originId];
        if (!originPos) return;

        const draggedCenterX = newX + originPos.w / 2;
        const draggedCenterY = newY + originPos.h / 2;

        const targetCard = cards.find(card => {
            if (card.id === originId) return false;
            const pos = positions[card.id];
            return pos && (draggedCenterX > pos.x && draggedCenterX < pos.x + pos.w &&
                           draggedCenterY > pos.y && draggedCenterY < pos.y + pos.h);
        });

        const destinyId = targetCard ? targetCard.id : null;

        if (destinyId && destinyId !== lastTargetId.current) {
            lastTargetId.current = destinyId;
            handleReorder(originId, destinyId);
        }
    }, [dragging, cards, handleReorder, positions]);

     const handleResizeMove = useCallback((e) => {
        if (!resizing) return;
        e.preventDefault();
        const eventPos = e.touches ? e.touches[0] : e;
        const dx = eventPos.clientX - resizing.initialMouse.x;
        const dy = eventPos.clientY - resizing.initialMouse.y;

        const newWidth = resizing.initialW + dx;
        const newHeight = resizing.initialH + dy;

        setPositions(prev => ({
            ...prev,
            [resizing.id]: { ...prev[resizing.id], w: newWidth, h: newHeight }
        }))
    }, [resizing]);

    const handleResizeEnd = useCallback(() => {
        if(!resizing) return;
        const pos = positions[resizing.id];
        const newGridW = Math.max(1, Math.round(pos.w / (BASE_UNIT_WIDTH + GAP)));
        const newGridH = Math.max(1, Math.round(pos.h / (BASE_UNIT_HEIGHT + GAP)));

        let bestFit = 'sm';
        let minDiff = Infinity;

        for (const [sizeKey, sizeValue] of Object.entries(SIZES)) {
            const diff = Math.abs(sizeValue.w - newGridW) + Math.abs(sizeValue.h - newGridH);
            if (diff < minDiff) {
                minDiff = diff;
                bestFit = sizeKey;
            }
        }

        setCards(currentCards =>
            currentCards.map(c => c.id === resizing.id ? { ...c, size: bestFit } : c)
        );
        setResizing(null);
    }, [resizing, positions, setCards]);


    const handleDragEnd = useCallback(() => {
        setDragging(null);
        lastTargetId.current = null;
    }, []);

    useEffect(() => {
        const isInteracting = dragging || resizing;
        const handleMove = dragging ? handleDragMove : handleResizeMove;
        const handleEnd = dragging ? handleDragEnd : handleResizeEnd;

        if (isInteracting) {
            window.addEventListener('mousemove', handleMove, { passive: false });
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [dragging, resizing, handleDragMove, handleDragEnd, handleResizeMove, handleResizeEnd]);

    const handleHide = useCallback((idToHide) => {
        setCards(currentCards => currentCards.filter(c => c.id !== idToHide));
    }, [setCards]);

    const handleSizeChange = useCallback((id, newSize) => {
        setCards(currentCards => currentCards.map(c => c.id === id ? {...c, size: newSize} : c));
    }, [setCards]);

    const handleMenuToggle = useCallback((id) => {
        setActiveMenuId(prev => prev === id ? null : id);
    }, []);

    return (
        <div ref={containerRef} className="droppable-area">
            {cards.map((card) => {
                const isDragging = dragging?.id === card.id;
                const isResizing = resizing?.id === card.id;
                const isMenuOpen = activeMenuId === card.id;
                const cardPos = positions[card.id] || {x:0, y:0, w:0, h:0};

                let currentPos = { x: cardPos.x, y: cardPos.y };
                if (isDragging) {
                    currentPos = { x: dragging.x, y: dragging.y };
                }
                
                let currentSize = { w: cardPos.w, h: cardPos.h };
                if(isResizing) {
                    currentSize = {w: positions[resizing.id].w, h: positions[resizing.id].h };
                }

                return (
                    <Draggable
                        key={card.id}
                        id={card.id}
                        onDragStart={handleDragStart}
                        onResizeStart={handleResizeStart}
                        className={isDragging ? 'dragging' : ''}
                        style={{
                            width: `${currentSize.w}px`,
                            height: `${currentSize.h}px`,
                            transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
                            transition: isResizing || isDragging ? 'none' : undefined,
                            zIndex: isMenuOpen ? 50 : (isDragging || isResizing ? 40 : 10),
                        }}
                    >
                        <Card
                            title={card.title}
                            color={card.color}
                            onHidden={() => handleHide(card.id)}
                            onSizeChange={handleSizeChange}
                            id={card.id}
                            isMenuOpen={isMenuOpen}
                            onMenuToggle={handleMenuToggle}
                        />
                    </Draggable>
                );
            })}
        </div>
    );
};

export default Droppable;