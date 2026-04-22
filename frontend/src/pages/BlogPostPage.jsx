import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function BlogPostPage() {
  const { id }              = useParams();
  const [post,    setPost]  = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    blogAPI.getById(id)
      .then(r => setPost(r.data))
      .finally(() => setLoading(false));
  }, [id, t]);

  if (loading) return <p>{t('nav.loading')}</p>;
  if (!post)   return <p>{t('blog.notFound')}</p>;

  return (
    <div className="page blog-post">
      {post.cover_url && <img src={post.cover_url} alt={post.title} className="blog-hero" />}

      <h1>{post.title}</h1>
      <p className="blog-meta">
        {t('blog.by')} {post.author_name} · {new Date(post.published_at).toLocaleDateString()}
      </p>

      
      <div className="blog-body">
        <p>{post.content}</p>
      </div>

      <Link to="/blog">← {t('blog.back')}</Link>
    </div>
  );
}
