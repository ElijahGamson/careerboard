import styled from 'styled-components';

// Define your styled elements
const NavStyle = styled.div`
nav {
    background-color: #3d3530;           /* warm charcoal */
    padding: 16px 24px;
    margin-bottom: 28px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

nav a { /*Targets any <a> element in a <nav> element*/
    color: rgba(255, 255, 255, 0.75);    /* slightly transparent by default */
    padding: 8px 16px;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: 8px;
    transition: all 0.2s ease;
}

nav a:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);  /* subtle highlight on hover */
    text-decoration: none;
}
`;

export default NavStyle;