import Link from 'next/link'; //built-in Next.js <a> html element
import NavStyle from '../styles/navStyles'

export default function Nav(){
    return (
    <NavStyle>
        <nav>
            <Link href="/home">Home</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/tracker">Tracker</Link>
            <Link href="/matcher">Resume Matcher</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/timeline">What's Next?</Link>
            <Link href="/feedback">Feedback</Link>
        </nav>
    </NavStyle>
    );
}