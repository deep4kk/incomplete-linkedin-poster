import { useEffect, useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { NicheSelector } from './components/NicheSelector';
import { PostCard } from './components/PostCard';
import { Dashboard } from './components/Dashboard';
import { LogsTable } from './components/LogsTable';
import { api } from './lib/api';
import { Niche, Post, PostLog, Stats } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [logs, setLogs] = useState<PostLog[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    generated: 0,
    approved: 0,
    posted: 0,
    rejected: 0,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'dashboard'>('generate');

  useEffect(() => {
    checkAuthStatus();
    loadPosts();
    loadStats();
    loadLogs();
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      api
        .linkedInCallback(code)
        .then(() => {
          setIsAuthenticated(true);
          window.history.replaceState({}, document.title, '/');
        })
        .catch((err) => {
          setError('Failed to authenticate with LinkedIn');
          console.error(err);
        });
    }
  };

  const checkAuthStatus = async () => {
    try {
      const result = await api.getAuthStatus();
      setIsAuthenticated(result.authenticated);
    } catch (err) {
      console.error('Failed to check auth status:', err);
    }
  };

  const loadPosts = async () => {
    try {
      const result = await api.getPosts();
      if (result.success) {
        setPosts(result.posts);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  };

  const loadStats = async () => {
    try {
      const result = await api.getStats();
      if (result.success) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadLogs = async () => {
    try {
      const result = await api.getLogs();
      if (result.success) {
        setLogs(result.logs);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      return;
    }

    try {
      const result = await api.getLinkedInAuthUrl();
      if (result.authUrl) {
        window.location.href = result.authUrl;
      }
    } catch (err) {
      setError('Failed to initiate LinkedIn authentication');
      console.error(err);
    }
  };

  const handleGeneratePosts = async () => {
    if (!selectedNiche) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await api.generatePosts(selectedNiche);

      if (result.success) {
        await loadPosts();
        await loadStats();
        await loadLogs();
        setSelectedNiche(null);
      } else {
        setError(result.error || 'Failed to generate posts');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate posts');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (postId: string) => {
    setIsLoading(true);
    try {
      const result = await api.approvePost(postId);
      if (result.success) {
        await loadPosts();
        await loadStats();
        await loadLogs();
      }
    } catch (err) {
      setError('Failed to approve post');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (postId: string) => {
    setIsLoading(true);
    try {
      const result = await api.rejectPost(postId);
      if (result.success) {
        await loadPosts();
        await loadStats();
        await loadLogs();
      }
    } catch (err) {
      setError('Failed to reject post');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePost = async (post: Post) => {
    if (!isAuthenticated) {
      setError('Please connect your LinkedIn account first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.postToLinkedIn(post.id, post.content);

      if (result.success) {
        await loadPosts();
        await loadStats();
        await loadLogs();
      } else {
        setError(result.error || 'Failed to post to LinkedIn');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to post to LinkedIn');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatedPosts = posts.filter((p) => p.status === 'generated');
  const approvedPosts = posts.filter((p) => p.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated={isAuthenticated} onAuthClick={handleAuthClick} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'generate'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Generate Posts
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard & Logs
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {activeTab === 'generate' ? (
          <div className="space-y-8">
            <NicheSelector
              selectedNiche={selectedNiche}
              onSelect={setSelectedNiche}
              disabled={isGenerating}
            />

            <div className="flex justify-center">
              <button
                onClick={handleGeneratePosts}
                disabled={!selectedNiche || isGenerating}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl font-medium text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Posts...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate 3 Posts
                  </>
                )}
              </button>
            </div>

            {generatedPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Review Generated Posts ({generatedPosts.length})
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {generatedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onPost={handlePost}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}

            {approvedPosts.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Approved Posts ({approvedPosts.length})
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {approvedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onPost={handlePost}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <Dashboard stats={stats} />
            <LogsTable logs={logs} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
