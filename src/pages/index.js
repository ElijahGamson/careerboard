import {LargeCard} from '../styles/cardStyles'; // ./ (look in same folder), ../ (go up a folder)
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import QuoteBox from '../components/Quote'; //Quote API

export default function HomePage(){
    return (
    <div id="background_image">
        <GlobalStyles/>
        <Nav></Nav>
            <h2 style={{textAlign: 'center', padding: '10px', marginBottom: '15px'}}>Why Use NextRound?</h2>
            <LargeCard>
            <ul>
                <li>Find Jobs</li>
                <li>Track applications</li>
                <li>Organize your job search</li>
                <li>Keep all the information in one place</li>
                <li>Get to the "NextRound" of interviews</li>
            </ul>
            <h3 style={{paddingTop: '10px'}}>Today's motivational quote to get you through the current state of the job market is:</h3>
            <QuoteBox/>
            </LargeCard>
    </div>
    );
}