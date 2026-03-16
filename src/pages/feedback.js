import {LargeCard} from '../styles/cardStyles'; // ./ (look in same folder), ../ (go up a folder)
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import Head from 'next/head'; // tab header
import Link from 'next/link'; //built-in Next.js <a> html element

export default function TimelinePage(){
    return (
    <div>
        <Head>
            <title>Feedback</title>
        </Head>
        <GlobalStyles/>
        <Nav/>
        <div id="titleText">
            <h1>Encountered a Problem or Want to See a Feature Added?</h1>
            <button 
                style={{
                    fontSize: '1.1rem',
                    padding: '10px 20px',
                    marginTop: '15px'
                }}onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLScT8y6Pcpv_6peKHlkPOEVgYaBfmVuUdJR2gITmtTCCEVALnw/viewform?usp=publish-editor", "_blank")}>
                Fill out this form
            </button> {/*padding makes button bigger (top/bottom spacing, right/left spacing*/}
        </div>
    </div>
    );
}