import { useSearchParams } from 'react-router-dom';
import CatalogGrid from '../catalog/CatalogGrid';
export default function Search() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  return <main className="max-w-7xl mx-auto px-4 pt-32 pb-12"><h1 className="text-3xl mb-8">Search results for “{query}”</h1><CatalogGrid query={query} /></main>;
}
