import styled from 'styled-components';

// Define your styled elements
const NavStyle = styled.div`
nav {
    background-color: #1e3a8a;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
}

nav a { /*Targets any <a> element in a <nav> element*/
    color: white;
    margin-right: 10%;
    text-decoration: none;
    font-weight: bold;
}

nav a:hover {
    text-decoration: underline;
}
`;

export default NavStyle;