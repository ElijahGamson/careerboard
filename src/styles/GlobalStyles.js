import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
* {
    margin: 0; /*removes all default spacing outside elements*/
    padding: 0; /*removes all default spacing insides elements*/
    box-sizing: border-box; /*makes it so padding and borders don't add to an element's width, so a width: 100px element stays 100px even with padding*/
    font-family: Arial, sans-serif;
}
/*font-family is on * instead of body because some elements like input and button don't inherit font from body by default, so * forces it on them*/

/* PAGE LAYOUT */
/*applies to the entire page, it's the parent container that wraps everything visible on the screen.*/
body {
    background-color: #f4f6f9;
    padding: 20px; /*adds breathing room around all the page content so nothing is flush against the edges*/
    color: #333; /* sets the default text color to a dark gray instead of black*/
}


#applications { /*Same as card layout, I just didn't want to mess anything with the javascript up*/
  display: flex; /*Allows multiple cards to fit next to eachother horizontally*/
  gap: 17px;         /* space between cards */
  flex-wrap: wrap; /* allows wrapping to next line */
}

/* BUTTON STYLING*/
button { /*No dot or hastag needed because it's a built in HTML element (effects all button styling)*/
    padding: 8px 12px;
    background-color: #2563eb;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
}

button:hover {
    background-color: #1e40af;
}

/* Changing the form elements */
input, select { /*Allows you to effect mutiple classes/ids/elements at with the same styling*/
    text-align: left;
    padding: 8px;
    margin-top: 5px;
    margin-bottom: 10px;
    width: 100%;
    background-color: white;
    border: 1px solid #ccc;
    color: black;
}

/*style for any expandable text*/
details{
    cursor: pointer;
}

/*Job information within a card formatting*/
#jobText{
    padding: 5px;
}

/*Centered text for anything important on the screen*/
#titleText{
    text-align: center;
    padding: 10px;
    margin-bottom: 15px;
}


#background_image::before { /*Allows for the background image to be sepearte from the rest of the text and elements*/
    content: ""; /*required for pseudo-element*/
    position: fixed; /*background image stays in place while scrolling*/
    top: 0; /*Where the image starts on y-axis*/
    left: 0; /*Where the image starts on x-axis*/
    width: 100%; /*Width of image is 100% of parent(screen size)*/
    height: 100%; /*Height of image is 100% of parent(screen size)*/
    background-image: url(https://media.istockphoto.com/id/1916729901/photo/meeting-success-two-business-persons-shaking-hands-standing-outside.jpg?s=612x612&w=0&k=20&c=Zpa1CaJlGI4mYdzqJGjCIEWFRCkqo3DmHxLopdki-SE=); /*Displays an image as the background of the website*/
    background-repeat: no-repeat; /*The image won't repeat in the background*/
    background-size: cover; /*Image covers entire screen while keeping image scaling intact*/
    opacity: 0.75;
    z-index: -1; /*puts image behind content*/
}
`;
export default GlobalStyles;