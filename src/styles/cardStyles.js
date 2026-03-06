import { stringifyCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import styled from 'styled-components';

const changeBorderColor = (status) => {
    if (status === 'Applied') 
        return "#fff";
    if (status === 'Interview') 
        return "#ffff00";
    if (status === 'OA') 
        return "#00aaff";
    if (status === 'Awaiting Next Steps') 
        return "#cc00ff";
    if (status === 'Rejected after Interview, OA, etc.') 
        return "#ff7700";
    if (status === 'Cold Rejected') 
        return "#ff0000";
    if (status === 'Accepted') 
        return "#00ff00";
};

const Card = styled.div`
    text-align: center;
    background: white;
    padding: 15px;
    /* margin-bottom: 15px; */
    border-radius: 10px;
    box-shadow: 0px 2px 6px rgba(0,0,0,0.1); /*4th number defines transparency*/
    width: 32%;
    /* margin-left: 7.5px;
    margin-right: 7.5px; */
`;

export const TrackCardStyle = styled(Card)`
    border: 5px solid ${props => changeBorderColor(props.status)};
`;

// A new component based on Card, but with some override styles
export const LargeCard = styled(Card)`
    width: 100%;
`;

export const CardLayout = styled.div`
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
`;


export default Card;