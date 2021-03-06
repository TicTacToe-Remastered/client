import { useContext, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import ChevronRight from '../icons/ChevronRight';
import ChevronLeft from '../icons/ChevronLeft';

import { LanguageContext } from '../libs/context/languageContext';

import socket from '../connect';

const PlayerCard = ({ player, isActive }) => {
    const { language } = useContext(LanguageContext);

    const [name, setName] = useState('');
    const [score, setScore] = useState(0);

    const index = player.team === 'blue' ? 1 : 2;

    useEffect(() => {
        async function getUsername() {
            await new Promise(resolve => {
                socket.emit('get-username', player.id, function (username) {
                    resolve(username);
                });
            }).then(username => username ? setName(username) : setName(''));
        }
        getUsername();
    }, [player.id, name]);

    useEffect(() => {
        setScore(player.score)
    }, [player.score, score]);

    const displayActive = () => {
        if (!isActive) return;
        return (
            <>
                <ChevronRight />
                <ChevronLeft />
            </>
        )
    }

    return (
        <Card id={player.team}>
            <div className="player-logo">{displayActive()}</div>
            <div className="player-number">{language.room.player} {index}</div>
            <div className={`player-name ${!name && 'active'}`}>{name ? name : language.room.waiting_player}</div>
            <div className="player-score">{score}</div>
        </Card>
    );
}

export default PlayerCard;

const loadAnimation = keyframes`
    0% { content: ''; }
    25% { content: '.'; }
    50% { content: '..'; }
    75% { content: '...'; }
`;

const Card = styled.div`
    ${props => props.id === 'blue' && css`
        --gradient-color: ${({ theme }) => theme.gradientBlue};
    `}

    ${props => props.id === 'red' && css`
        --gradient-color: ${({ theme }) => theme.gradientRed};
    `}

    border-radius: 2vmin;
    padding: 16px;
    background-color: ${({ theme }) => theme.cardBackground};
    box-shadow: ${({ theme }) => theme.boxShadow};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32vmin;
    text-align: center;
    transition: background-color ${({ theme }) => theme.transition}, box-shadow ${({ theme }) => theme.transition};

    .player-logo {
        position: relative;
        width: 6vmin;
        height: 6vmin;
        border-radius: 6vmin;
        margin-bottom: 2vmin;
        box-shadow: ${({ theme }) => theme.boxShadow};
        background: var(--gradient-color);
        transition: background ${({ theme }) => theme.transition}, box-shadow ${({ theme }) => theme.transition};

        svg {
            position: absolute;
            height: 3vmin;
            top: 50%;
            transform: translateY(-50%);

            &:first-child {
                left: -4vmin;
            }

            &:last-child {
                right: -4vmin;
            }
        }
    }

    .player-number {
        font-size: 2vmin;
        font-weight: bold;
        opacity: 50%;
    }

    .player-name {
        font-size: 2.5vmin;
        font-weight: bold;
        margin: 1.5vmin 0;
        white-space: nowrap;

        &.active {
            &::after {
                content: '';
                animation: ${loadAnimation} 3s infinite;
            }
        }
    }

    .player-score {
        font-size: 5vmin;
        font-weight: bold;
    }
`;