import styled, { keyframes } from 'styled-components';

const Loader = () => {
    return (
        <Load>
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="62" stroke="url(#paint0_linear)" stroke-width="4"/>
                <circle cx="108" cy="108" r="30" stroke="url(#paint1_linear)" stroke-width="4"/>
                <defs>
                    <linearGradient id="paint0_linear" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00D2FF"/>
                        <stop offset="1" stop-color="#3A7BD5"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="108" y1="76" x2="108" y2="140" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FF512F"/>
                        <stop offset="1" stop-color="#DD2476"/>
                    </linearGradient>
                </defs>
            </svg>
            <h1>Tic Tac Toe 2.0</h1>
            <div>Connecting to the server</div>
        </Load>
    );
}

export default Loader;

const loadAnimation = keyframes`
    0% { content: ''; }
    25% { content: '.'; }
    50% { content: '..'; }
    75% { content: '...'; }
`;

const Load = styled.div`
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: var(--background-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    svg {
        height: 25vmin;
        width: 25vmin;
        margin: 6vmin;
    }

    h1 {
        font-size: 6vmin;
        margin: 3vmin;
    }

    div {
        font-size: 3vmin;

        &::after {
            content: '';
            animation: ${loadAnimation} 3s infinite;
        }
    }
`;