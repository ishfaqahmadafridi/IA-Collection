import type { FooterLinksProps } from '../../types/components/footer/footerInterface';

export default function FooterLinks({ title, links }: FooterLinksProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">{title}</h3>
            <ul className="space-y-3">
                {links.map(link => (
                    <li key={link}>
                        <span className="text-sm text-foreground/60 hover:text-foreground transition-colors font-medium">
                            {link}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
