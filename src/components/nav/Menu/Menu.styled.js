// Menu.styled.js
import styled from 'styled-components';

export const StyledMenu = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.menuBg};
  height: 100vh;
  padding: 2rem 1rem;
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease-in-out;
  z-index: 100;
  
  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 50%;
  }

  a {
    font-size: 16px;
    text-transform: uppercase;
    padding: 1rem 0;
    font-weight: bold;
    letter-spacing: 0.25rem;
    color: ${({ theme }) => theme.menuFg};
    text-decoration: none;
    transition: color 0.3s linear;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 12px;
    }

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }
`;

