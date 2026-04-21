import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';

export default function BlogPage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    blogAPI.getAll({ search })
      .then(r => setPosts(r.data.data ?? r.data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="page blog">
      <h1>Blog</h1>

      <input
        type="text"
        placeholder="Search posts…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading…</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="blog-list">
          {posts.map(post => (
            <article key={post.id} className="blog-card">
              {post.cover_url && <img src={post.cover_url} alt={post.title} />}
              <div className="blog-card-body">
                <h2><Link to={`/blog/${post.id}`}>{post.title}</Link></h2>
                <p className="blog-meta">
                  By {post.author_name} · {new Date(post.published_at).toLocaleDateString()}
                </p>
                <p>{post.content?.slice(0, 200)}{post.content?.length > 200 ? '…' : ''}</p>
                <Link to={`/blog/${post.id}`}>Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
