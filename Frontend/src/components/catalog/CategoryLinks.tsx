import { Link } from 'react-router-dom';
import { useCategoryLinks } from '../../hooks/catalog/useCategoryLinks';
import type { CategoryLinksProps } from '../../types/catalog';
export default function CategoryLinks({ group, route, title }: CategoryLinksProps) {
  const { children, loading, error, retry } = useCategoryLinks(group);
  return <section className="max-w-7xl mx-auto px-4 py-12 space-y-6">
    <div className="flex justify-between gap-4"><h2 className="text-2xl font-semibold">{title}</h2><Link to={route} className="underline">View all</Link></div>
    {loading ? <p role="status">Loading categories…</p> : error ? <div role="alert"><p>{error}</p><button onClick={retry} className="underline">Try again</button></div> : children.length ?
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{children.map(category => <Link key={category.id} to={`${route}?category=${encodeURIComponent(category.slug)}`} className="block border border-border rounded-xl overflow-hidden focus-visible:outline focus-visible:outline-2">
        {(category.image || category.hero_image) && <img src={category.image || category.hero_image || ''} alt="" loading="lazy" className="w-full aspect-square object-cover" />}
        <span className="block p-4">{category.name}</span>
      </Link>)}</div> : <p>No categories available.</p>}
  </section>;
}
