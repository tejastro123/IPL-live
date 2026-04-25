import { useParams, Link } from 'react-router-dom';
import { useNewsArticle, useNews } from '../hooks/useData';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Clock, User, Share2, Newspaper } from 'lucide-react';

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading } = useNewsArticle(slug || '');
  const { articles: related } = useNews();

  if (loading) return <LoadingSpinner />;
  if (!article) return <div className="page-container text-center py-20 text-gray-500">Article not found</div>;

  const relatedArticles = related
    .filter((a: any) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="page-container">
      <Link to="/news" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to News
      </Link>

      <article className="max-w-3xl mx-auto">
        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider text-ipl-gold font-medium">{article.category.replace('-', ' ')}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.author}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {article.image_url && (
          <div className="rounded-xl overflow-hidden mb-8 bg-ipl-surface">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-64 sm:h-80 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 leading-relaxed space-y-4">
            {article.content.split('\n').filter(Boolean).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ipl-border flex items-center justify-between">
          <div className="flex gap-2">
            {article.category && (
              <span className="badge bg-ipl-gold/10 text-ipl-gold border border-ipl-gold/20">
                {article.category.replace('-', ' ')}
              </span>
            )}
          </div>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-ipl-gold transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-orange-400" />
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((a: any) => (
              <Link key={a.id} to={`/news/${a.slug}`} className="card-hover block p-4">
                <span className="text-[10px] uppercase tracking-wider text-ipl-gold font-medium">{a.category.replace('-', ' ')}</span>
                <h3 className="text-sm font-semibold text-white mt-1 line-clamp-2 leading-snug">{a.title}</h3>
                <p className="text-xs text-gray-500 mt-2">{new Date(a.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
