import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useData';
import LoadingSpinner from '../components/LoadingSpinner';
import { Newspaper, Clock } from 'lucide-react';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'match-report', label: 'Match Reports' },
  { value: 'transfer', label: 'Transfers' },
  { value: 'breaking', label: 'Breaking' },
  { value: 'analysis', label: 'Analysis' },
];

export default function NewsPage() {
  const [category, setCategory] = useState<string>('all');
  const { articles, loading } = useNews(category === 'all' ? undefined : category);

  if (loading) return <LoadingSpinner />;

  const featured = articles.find((a: any) => a.is_featured);
  const rest = articles.filter((a: any) => a !== featured);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Newspaper className="w-7 h-7 text-orange-400" />
          News & Updates
        </h1>
        <p className="text-gray-400 mt-2">Latest IPL 2026 news, match reports, and analysis</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              category === c.value
                ? 'bg-ipl-gold/15 text-ipl-gold border border-ipl-gold/30'
                : 'text-gray-500 hover:text-white border border-transparent hover:border-ipl-border'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Featured Article */}
      {featured && (
        <Link to={`/news/${featured.slug}`} className="card-hover block mb-8 overflow-hidden group">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-48 md:h-auto bg-ipl-surface relative overflow-hidden">
              <img
                src={featured.image_url}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute top-3 left-3">
                <span className="badge bg-ipl-gold/20 text-ipl-gold border border-ipl-gold/30 text-xs">Featured</span>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider text-ipl-gold font-medium">{featured.category.replace('-', ' ')}</span>
              <h2 className="text-xl font-bold text-white mt-2 group-hover:text-ipl-gold transition-colors leading-snug">{featured.title}</h2>
              <p className="text-sm text-gray-400 mt-3 line-clamp-3">{featured.content}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                <span>{featured.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(featured.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rest.map((article: any) => (
          <Link key={article.id} to={`/news/${article.slug}`} className="card-hover block group overflow-hidden">
            <div className="h-40 bg-ipl-surface relative overflow-hidden">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="p-4">
              <span className="text-[10px] uppercase tracking-wider text-ipl-gold font-medium">{article.category.replace('-', ' ')}</span>
              <h3 className="text-sm font-semibold text-white mt-1 group-hover:text-ipl-gold transition-colors line-clamp-2 leading-snug">{article.title}</h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.content}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-600">
                <span>{article.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No articles found</p>
        </div>
      )}
    </div>
  );
}
