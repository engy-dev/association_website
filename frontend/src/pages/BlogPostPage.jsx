import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';

export default function BlogPostPage() {
  const { id }              = useParams();
  const [post,    setPost]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getById(id)
      .then(r => setPost(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (!post)   return <p>Post not found.</p>;

  return (
    <div className="page blog-post">
      {post.cover_url && <img src={post.cover_url} alt={post.title} className="blog-hero" />}

      <h1>{post.title}</h1>
      <p className="blog-meta">
        By {post.author_name} · {new Date(post.published_at).toLocaleDateString()}
      </p>

      {/* Render rich-text HTML from the CMS/editor safely.
          Install DOMPurify: npm i dompurify, then:
          import DOMPurify from 'dompurify';
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }} />
      */}
      <div className="blog-body">
        <p>{post.content}</p>
      </div>

      <Link to="/blog">← Back to Blog</Link>
    </div>
  );
}
