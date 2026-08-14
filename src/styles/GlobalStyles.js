import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
* {
    margin: 0; /*removes all default spacing outside elements*/
    padding: 0; /*removes all default spacing insides elements*/
    box-sizing: border-box; /*makes it so padding and borders don't add to an element's width, so a width: 100px element stays 100px even with padding*/
    font-family: 'Inter', sans-serif;
}
/*font-family is on * instead of body because some elements like input and button don't inherit font from body by default, so * forces it on them*/

/* PAGE LAYOUT */
/*applies to the entire page, it's the parent container that wraps everything visible on the screen.*/
body {
    background-color: #faf8f5;          /* warm off-white */
    padding: 24px;
    color: #3d3530;                     /* warm dark brown */
    line-height: 1.6;
}

#applications { /*Same as card layout, I just didn't want to mess anything with the javascript up*/
    display: flex; /*Allows multiple cards to fit next to eachother horizontally*/
    gap: 20px;         /* space between cards */
    flex-wrap: wrap; /* allows wrapping to next line */
}

/* BUTTON STYLING*/
button { /*No dot or hastag needed because it's a built in HTML element (effects all button styling)*/
    padding: 10px 20px;
    background-color: #d97756;          /* warm terracotta */
    border: none;
    color: white;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;          /* smooth hover animation */
}

button:hover {
    background-color: #c4613f;
    transform: translateY(-1px);        /* subtle lift effect */
    box-shadow: 0 4px 12px rgba(217, 119, 86, 0.3);
}

/* Changing the form elements */
input, select { /*Allows you to effect mutiple classes/ids/elements at with the same styling*/
    text-align: left;
    padding: 10px 14px;
    margin-top: 6px;
    margin-bottom: 12px;
    width: 100%;
    background-color: #fff;
    border: 1.5px solid #e0dbd5;        /* warm border */
    border-radius: 10px;
    color: #3d3530;
    font-size: 0.95rem;
    transition: border-color 0.2s ease;
}

input:focus, select:focus {
    outline: none;
    border-color: #d97756;              /* accent color on focus */
    box-shadow: 0 0 0 3px rgba(217, 119, 86, 0.15);
}

/*style for any expandable text*/
details {
    cursor: pointer;
}

/*Job information within a card formatting*/
#jobText {
    padding: 8px;
}

/*Centered text for anything important on the screen*/
#titleText {
    text-align: center;
    padding: 12px;
    margin-bottom: 20px;
}

a {
    transition: opacity 0.2s ease;
}

a:hover {
    text-decoration: underline;
}

#jobsPage a:visited { /*After a link on jobsPage has been clicked, turn the text gray*/
    color: #999;
}

#jobsPage nav a:visited {
    color: white;
}

/* REMOVED: #background_image::before — the stock photo background.
   Removing it actually looks more professional. */
`;

export default GlobalStyles;