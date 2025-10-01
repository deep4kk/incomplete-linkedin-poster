const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  async generatePosts(niche: string) {
    const response = await fetch(`${API_BASE_URL}/perplexity/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche }),
    });
    return response.json();
  },

  async getPosts(status?: string) {
    const url = status
      ? `${API_BASE_URL}/posts?status=${status}`
      : `${API_BASE_URL}/posts`;
    const response = await fetch(url);
    return response.json();
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/posts/stats`);
    return response.json();
  },

  async getLogs() {
    const response = await fetch(`${API_BASE_URL}/posts/logs`);
    return response.json();
  },

  async approvePost(postId: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/approve`, {
      method: 'PATCH',
    });
    return response.json();
  },

  async rejectPost(postId: string) {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/reject`, {
      method: 'PATCH',
    });
    return response.json();
  },

  async getLinkedInAuthUrl() {
    const response = await fetch(`${API_BASE_URL}/linkedin/auth-url`);
    return response.json();
  },

  async linkedInCallback(code: string) {
    const response = await fetch(`${API_BASE_URL}/linkedin/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return response.json();
  },

  async getAuthStatus() {
    const response = await fetch(`${API_BASE_URL}/linkedin/auth-status`);
    return response.json();
  },

  async postToLinkedIn(postId: string, content: string) {
    const response = await fetch(`${API_BASE_URL}/linkedin/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content }),
    });
    return response.json();
  },
};
