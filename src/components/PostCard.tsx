import { Check, X, Send, Clock } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onApprove: (postId: string) => void;
  onReject: (postId: string) => void;
  onPost: (post: Post) => void;
  isLoading?: boolean;
}

export function PostCard({ post, onApprove, onReject, onPost, isLoading }: PostCardProps) {
  const getStatusBadge = (status: Post['status']) => {
    const badges = {
      generated: { color: 'bg-blue-100 text-blue-800', text: 'Generated' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      posted: { color: 'bg-purple-100 text-purple-800', text: 'Posted' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
    };
    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full mb-2">
            {post.niche}
          </span>
        </div>
        {getStatusBadge(post.status)}
      </div>

      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <Clock className="w-3 h-3" />
        <span>Generated {new Date(post.generated_at).toLocaleString()}</span>
      </div>

      {post.status === 'generated' && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(post.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => onReject(post.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}

      {post.status === 'approved' && (
        <button
          onClick={() => onPost(post)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Send className="w-4 h-4" />
          Post to LinkedIn
        </button>
      )}

      {post.status === 'posted' && post.posted_at && (
        <div className="text-center text-sm text-gray-600">
          Posted on {new Date(post.posted_at).toLocaleString()}
        </div>
      )}
    </div>
  );
}
