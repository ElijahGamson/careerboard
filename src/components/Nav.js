import Link from 'next/link';
import NavStyle from '../styles/navStyles'

export default function Nav(){
    return (
    <NavStyle>
        <nav>
            <Link href="/home">Home</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/tracker">Tracker</Link>
            <Link href="/profile">Profile</Link>
        </nav>
    </NavStyle>
    );
}