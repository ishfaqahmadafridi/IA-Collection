import { Link } from 'react-router-dom';
export default function Footer() {
  return <footer className="bg-background text-foreground py-10 px-6 border-t border-border">
    <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6">
      <p>© {new Date().getFullYear()} AFRIDI’S</p>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
        <Link to="/home">Shop</Link><Link to="/tracking">Track order</Link><Link to="/profile">My account</Link>
      </nav>
    </div>
  </footer>;
}
