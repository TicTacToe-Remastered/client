import { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimateSharedLayout } from 'framer-motion';

import { LanguageContext } from '../libs/context/languageContext';

import socket from '../connect';

const PieceSelector = ({ player, disabled }) => {
    const { language } = useContext(LanguageContext);

    const [team, setTeam] = useState('blue');
    const [pieces, setPieces] = useState({});
    const [activePiece, setActivePiece] = useState('medium');

    useEffect(() => {
        setTeam(player.team);
        setPieces(player.pieces);
        setActivePiece(player.activePiece);
    }, [player]);

    const handlePiece = (e) => {
        socket.emit('select-piece', team, e.target.id, function (error) {
            error && console.log(error);
        });
    }

    return (
        <Selector id={team}>
            <AnimateSharedLayout>
                {pieces && Object.keys(pieces).map((key) => (
                    <PieceItem onClick={handlePiece} className={key === activePiece && 'active'} id={key} key={key} disabled={disabled}>
                        <div className="piece-item-circle"></div>
                        <div className="piece-item-size">{(key === 'small' && language.room.small) || (key === 'medium' && language.room.medium) || (key === 'large' && language.room.large)}</div>
                        <div className="piece-item-number">x{pieces[key]}</div>
                        {key === activePiece && (
                            <SelectedPiece
                                layoutId="selected"
                            />
                        )}
                        <BackgroundPiece />
                    </PieceItem>
                ))}
            </AnimateSharedLayout>
        </Selector>
    );
}

export default PieceSelector;

const Selector = styled.ul`
    ${props => props.id === 'blue' && css`
        --gradient-color: ${({ theme }) => theme.gradientBlue};
    `}

    ${props => props.id === 'red' && css`
        --gradient-color: ${({ theme }) => theme.gradientRed};
    `}
`;

const SelectedPiece = styled(motion.div)`
    width: 100%;
    height: 100%;
    border-radius: 2vmin;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    background:${({ theme }) => theme.cardBackgroundActive};
    transition: background ${({ theme }) => theme.transition};
`;

const BackgroundPiece = styled(motion.div)`
    width: 100%;
    height: 100%;
    border-radius: 2vmin;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -3;
    background:${({ theme }) => theme.cardBackground};
    transition: background ${({ theme }) => theme.transition};
`;

const PieceItem = styled.li`
    position: relative;
    border-radius: 2vmin;
    padding: 16px 24px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    display: flex;
    align-items: center;
    width: 32vmin;
    margin: 16px 0;
    cursor: pointer;
    transition: box-shadow ${({ theme }) => theme.transition};

    ${props => props.disabled && css`
        pointer-events: none;
    `}

    .piece-item-circle {
        position: relative;
        width: 3vmin;
        height: 3vmin;
        padding: 0.3vmin;
        border-radius: 50%;
        margin-right: 1.5vmin;
        box-shadow: ${({ theme }) => theme.boxShadow};
        background: var(--gradient-color);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: destination-out;
        pointer-events: none;
        transition: box-shadow ${({ theme }) => theme.transition};
    }
    
    .piece-item-size,
    .piece-item-number {
        font-size: 2vmin;
        font-weight: bold;
        pointer-events: none;
    }
    
    .piece-item-size {
        text-transform: capitalize;
    }
    
    .piece-item-number {
        margin-left: auto;
    }
`;