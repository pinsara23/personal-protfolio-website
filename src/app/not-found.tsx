import Link from "next/link";
export default function NotFound() { return <section className="section"><div className="container"><div className="eyebrow">404</div><h1>That page is not in the registry.</h1><p className="lead">The project or route you requested could not be found.</p><Link className="button primary" href="/">Return home</Link></div></section>; }
