import {LargeCard} from '../styles/cardStyles'; // ./ (look in same folder), ../ (go up a folder)
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import Auth from '../components/Auth';

export default function LoginPage(){
    return (
    <div>
        <GlobalStyles/>
        <Nav/>
        <LargeCard>
            <h2 id="titleText" style={{marginBottom: '0px'}}>Profile</h2>
            <Auth/>
            {/* <label>Name:</label>
            <input type="text" id="name" placeholder="Name"/> 
            /* The /> at the end just means I don't need a </input> at the end (it saves space and words)

            <label>Email:</label>
            <input type="email" id="email" placeholder="Email"/>

            <label>Password:</label>
            <input type="password" id="password" placeholder="********"/>

            <button>Save</button> */}
        </LargeCard>
    </div>
    );
}