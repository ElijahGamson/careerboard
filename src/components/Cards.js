import GlobalStyles from '@/styles/GlobalStyles';
import Card from '../styles/cardStyles';
import {TrackCardStyle} from '../styles/cardStyles';

//<button onClick={() => addApplication({title}, {company}, {description}, {link})}>Save</button>
export function JobCard({title, company, description, link, onAdd, status}){ //export default = Need to export so I can import it in other files
    return (
    <Card>
        <div id="jobText">
            {/*target = _blank opens the link in a new tab, rel = noopener noreferrer was a recommended security measure*/}
            <h3><a href={link} target="_blank" rel="noopener noreferrer">{title}</a></h3>
            <p>{company}</p>
            <small><details><summary>Job Description:</summary>{description}</details></small>
        </div>

        {/* Calls the addToTracker function in jobs.js when clicked */}
        <button onClick={onAdd}>Add to Tracker</button>
    </Card>
    );
}

export function TrackerCard({title, company, link, status, onStatusChange, onRemove}){ //React components MUST start with a capital letter
    return (
    <TrackCardStyle status={status}>
        <div id="jobText">
            <h3><a href={link} target="_blank" rel="noopener noreferrer">{title}</a></h3>
            <p>{company}</p>
            <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>OA</option>
                    <option>Awaiting Next Steps</option>
                    <option>Rejected after Interview, OA, etc.</option>
                    <option>Cold Rejected</option>
                    <option>Accepted</option>
                </select>
        </div>

        {/* Calls removeApplication in tracker.js when clicked */}
        <button onClick={onRemove}>Remove</button>
    </TrackCardStyle>
    );
}

// export default jobCard; //Need to export so I can import it in other files
// export default trackerCard;