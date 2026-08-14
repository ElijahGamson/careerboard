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
        return "#6bab73"; /*#00ff00*/
};

const Card = styled.div`
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 16px;                              /* rounded */
    box-shadow: 0 1px 3px rgba(61, 53, 48, 0.06),     /* layered shadow = depth */
                0 4px 12px rgba(61, 53, 48, 0.04);
    width: 32%;
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
        box-shadow: 0 2px 8px rgba(61, 53, 48, 0.1),
                    0 8px 24px rgba(61, 53, 48, 0.08);
        transform: translateY(-2px);
    }
`;

// A new component based on Card, but with some override styles
export const TrackCardStyle = styled(Card)`
    border-left: 5px solid ${props => changeBorderColor(props.status)};
    /* left border only instead of all-around, cleaner and shows status without overwhelming */
`;

// A new component based on Card, but with some override styles
export const LargeCard = styled(Card)`
    width: 100%;
    text-align: left;

    ul, ol {
        padding-left: 24px;
        line-height: 2;
    }
`;

export const CardLayout = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
`;

export default Card;