const API_BASE = '/api';

const getAuthHeaders = (customHeaders = {}) => {
  const token = localStorage.getItem('soulsync_token');
  let userId = localStorage.getItem('soulsync_user_id');
  if (!userId) {
    try {
      const stored = localStorage.getItem('soul_sync_current_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.id) userId = String(u.id);
      }
    } catch (e) {}
  }
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(userId ? { 'x-user-id': String(userId) } : {}),
    ...customHeaders
  };
};

export const api = {
  // Auth
  async login(usernameOrEmail, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password })
    });
    const data = await res.json();
    if (data.success && data.user) {
      if (data.token) localStorage.setItem('soulsync_token', data.token);
      localStorage.setItem('soulsync_user_id', String(data.user.id));
      localStorage.setItem('soul_sync_current_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async verifyOtp(otp, email) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, email })
    });
    const data = await res.json();
    if (data.success && data.user) {
      if (data.token) localStorage.setItem('soulsync_token', data.token);
      localStorage.setItem('soulsync_user_id', String(data.user.id));
      localStorage.setItem('soul_sync_current_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success && data.user) {
      localStorage.setItem('soul_sync_current_user', JSON.stringify(data.user));
      localStorage.setItem('soulsync_user_id', String(data.user.id));
    }
    return data;
  },

  // Feed & Posts
  async getPosts() {
    const res = await fetch(`${API_BASE}/posts`);
    return res.json();
  },

  async createPost(postData) {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    return res.json();
  },

  async likePost(id) {
    const res = await fetch(`${API_BASE}/posts/${id}/like`, { method: 'POST' });
    return res.json();
  },

  async savePost(id) {
    const res = await fetch(`${API_BASE}/posts/${id}/save`, { method: 'POST' });
    return res.json();
  },

  async addComment(postId, text) {
    const res = await fetch(`${API_BASE}/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return res.json();
  },

  async getSavedPosts() {
    const res = await fetch(`${API_BASE}/posts/saved/all`);
    return res.json();
  },

  // Messaging
  async getConversations() {
    const res = await fetch(`${API_BASE}/messages/conversations`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getMessages(conversationId) {
    const res = await fetch(`${API_BASE}/messages/conversations/${conversationId}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async sendMessage(conversationId, text, media_url, senderId = null) {
    let resolvedSenderId = senderId;
    if (!resolvedSenderId) {
      try {
        const stored = localStorage.getItem('soul_sync_current_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u && u.id) resolvedSenderId = u.id;
        }
      } catch (e) {}
    }
    const res = await fetch(`${API_BASE}/messages/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ conversation_id: conversationId, text, media_url, sender_id: resolvedSenderId })
    });
    return res.json();
  },

  // Permanent Channels & Broadcasts
  async getChannels() {
    const res = await fetch(`${API_BASE}/channels`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getChannel(channelId) {
    const res = await fetch(`${API_BASE}/channels/${channelId}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createChannel(channelData) {
    const res = await fetch(`${API_BASE}/channels`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(channelData)
    });
    return res.json();
  },

  async updateChannel(channelId, channelData) {
    const res = await fetch(`${API_BASE}/channels/${channelId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(channelData)
    });
    return res.json();
  },

  async deleteChannel(channelId) {
    const res = await fetch(`${API_BASE}/channels/${channelId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // User Profile
  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/users/profile/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (data.success && data.user) {
      localStorage.setItem('soul_sync_current_user', JSON.stringify(data.user));
    }
    return data;
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`);
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
    return res.json();
  },

  // Users & Explore
  async getProfile(username) {
    const res = await fetch(`${API_BASE}/users/profile/${username}`);
    return res.json();
  },

  async getExplore() {
    const res = await fetch(`${API_BASE}/users/explore`);
    return res.json();
  },

  async getSuggested() {
    const res = await fetch(`${API_BASE}/users/suggested`);
    return res.json();
  },

  async followUser(id) {
    const res = await fetch(`${API_BASE}/users/${id}/follow`, { method: 'POST' });
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async saveSettings(settings) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Soul Moments
  async getMoments(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/moments${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getMomentsPreview() {
    const res = await fetch(`${API_BASE}/moments/preview`);
    return res.json();
  },

  async getMomentCollections() {
    const res = await fetch(`${API_BASE}/moments/collections`);
    return res.json();
  },

  async createMomentCollection(name, icon = '✨') {
    const res = await fetch(`${API_BASE}/moments/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, icon })
    });
    return res.json();
  },

  async saveMoment(momentData) {
    const res = await fetch(`${API_BASE}/moments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(momentData)
    });
    return res.json();
  },

  async updateMomentNote(id, private_note) {
    const res = await fetch(`${API_BASE}/moments/${id}/note`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ private_note })
    });
    return res.json();
  },

  async setMomentCollection(id, collection_id) {
    const res = await fetch(`${API_BASE}/moments/${id}/collection`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection_id })
    });
    return res.json();
  },

  async removeMoment(id) {
    const res = await fetch(`${API_BASE}/moments/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};

export default api;
