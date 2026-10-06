import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const formatChannelToConversation = (ch, currentUser = null) => {
  // Inherit owner user's profile photo as the dynamic source of truth
  let dynamicAvatar = ch.owner_avatar;
  if (currentUser && (ch.owner_user_id === currentUser.id || !ch.owner_user_id) && currentUser.avatar_url) {
    dynamicAvatar = currentUser.avatar_url;
  }
  if (!dynamicAvatar) {
    dynamicAvatar = ch.avatar_url || currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  }

  return {
    id: ch.channel_id,
    channel_id: ch.channel_id,
    numeric_id: ch.id,
    partner_id: ch.channel_id,
    partner_name: ch.name,
    partner_username: ch.name ? ch.name.toLowerCase().replace(/\s+/g, '_') : 'channel',
    partner_avatar: dynamicAvatar,
    owner_avatar: dynamicAvatar,
    is_channel: true,
    isChannel: true,
    is_group: true,
    isGroup: true,
    pinned: Boolean(ch.is_pinned),
    showOnProfile: Boolean(ch.show_on_profile),
    allowReplies: Boolean(ch.allow_replies),
    theme_type: ch.theme_type || 'default',
    theme_color: ch.theme_color || null,
    wallpaper_url: ch.wallpaper_url || null,
    custom_wallpaper: ch.custom_wallpaper || null,
    invite_code: ch.invite_code || ch.channel_id,
    description: ch.description || '',
    stats: ch.stats || {
      total_members: (ch.members || []).length,
      total_messages: 0,
      active_contributors: 0,
      created_at: ch.created_at
    },
    members: ch.members || [],
    last_message: ch.last_message || (ch.allow_replies ? 'Channel open for community discussion' : 'Broadcast established: announcements only'),
    last_message_time: ch.last_message_time || 'Just now',
    unread_count: 0,
    owner_user_id: ch.owner_user_id,
    owner_name: ch.owner_name,
    owner_username: ch.owner_username,
    created_at: ch.created_at,
    updated_at: ch.updated_at
  };
};

export const AppProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('splash'); // App launch starts on Splash Screen
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem('soulsync_token');
      const saved = localStorage.getItem('soul_sync_current_user');
      return (token && saved) ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [feedPosts, setFeedPosts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [persistentChannels, setPersistentChannels] = useState([]);
  const [profileChannels, setProfileChannels] = useState([]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [activeChatMessages, setActiveChatMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [exploreItems, setExploreItems] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [tempRegisterEmail, setTempRegisterEmail] = useState('christon@gmail.com');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fluid Liquid Transition State
  const [fluidTransition, setFluidTransition] = useState({
    active: false,
    phase: 'idle', // 'entering' | 'exiting'
    target: null
  });

  // Soul Moments State
  const [soulMoments, setSoulMoments] = useState([]);
  const [soulMomentsPreview, setSoulMomentsPreview] = useState([]);
  const [momentCollections, setMomentCollections] = useState([]);
  const [activeMomentDetail, setActiveMomentDetail] = useState(null);

  const fetchChannels = async (user = currentUser) => {
    try {
      const res = await api.getChannels();
      if (res && res.success && Array.isArray(res.channels)) {
        setPersistentChannels(res.channels);
        const formattedChannels = res.channels.map((c) => formatChannelToConversation(c, user));
        const onProfile = formattedChannels.filter((c) => c.showOnProfile);
        setProfileChannels(onProfile);

        setConversations((prev) => {
          const directConvs = prev.filter((c) => !c.is_channel && !c.isChannel);
          return [...formattedChannels, ...directConvs];
        });
      }
    } catch (e) {
      console.error('Failed to fetch persistent channels from SQL:', e);
    }
  };

  const fetchMoments = async (params = {}) => {
    try {
      const res = await api.getMoments(params);
      if (res.success && res.moments) {
        setSoulMoments(res.moments);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMomentsPreview = async () => {
    try {
      const res = await api.getMomentsPreview();
      if (res.success && res.preview) {
        setSoulMomentsPreview(res.preview);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMomentCollections = async () => {
    try {
      const res = await api.getMomentCollections();
      if (res.success && res.collections) {
        setMomentCollections(res.collections);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load initial data from backend SQL
  useEffect(() => {
    // 1. Current user (respect existing authenticated session)
    const token = localStorage.getItem('soulsync_token');
    if (token) {
      api.getMe().then((res) => {
        if (res.success && res.user) {
          setCurrentUser(res.user);
        }
      }).catch(console.error);
    }

    // 2. Feed posts
    api.getPosts().then((res) => {
      if (res.success && res.posts) {
        setFeedPosts(res.posts);
      }
    }).catch(console.error);

    // 3. Conversations & Persistent Channels
    Promise.all([
      api.getConversations().catch(() => ({ success: false, conversations: [] })),
      api.getChannels().catch(() => ({ success: false, channels: [] }))
    ]).then(([convRes, chanRes]) => {
      const directConvs = (convRes && convRes.success && Array.isArray(convRes.conversations)) ? convRes.conversations : [];
      let formattedChannels = [];
      if (chanRes && chanRes.success && Array.isArray(chanRes.channels)) {
        setPersistentChannels(chanRes.channels);
        formattedChannels = chanRes.channels.map((c) => formatChannelToConversation(c, currentUser));
        const onProfile = formattedChannels.filter((c) => c.showOnProfile);
        setProfileChannels(onProfile);
      }
      setConversations([...formattedChannels, ...directConvs]);
    }).catch(console.error);

    // 4. Notifications
    api.getNotifications().then((res) => {
      if (res.success && res.notifications) {
        setNotifications(res.notifications);
      }
    }).catch(console.error);

    // 5. Explore
    api.getExplore().then((res) => {
      if (res.success && res.explore) {
        setExploreItems(res.explore);
      }
    }).catch(console.error);

    // 6. Suggested users
    api.getSuggested().then((res) => {
      if (res.success && res.suggested) {
        setSuggestedUsers(res.suggested);
      }
    }).catch(console.error);

    // 7. Saved posts
    api.getSavedPosts().then((res) => {
      if (res.success && res.saved) {
        setSavedPosts(res.saved);
      }
    }).catch(console.error);

    // 8. Soul Moments initial load
    fetchMoments();
    fetchMomentsPreview();
    fetchMomentCollections();
  }, []);

  // Fetch messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      api.getMessages(activeChatId).then((res) => {
        if (res.success && res.messages) {
          setActiveChatMessages(res.messages);
        }
      }).catch(console.error);
    }
  }, [activeChatId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navigateTo = (route) => {
    // If already transitioning, ignore rapid consecutive clicks
    if (fluidTransition.active) return;

    const isEnteringFluid = (route === 'create' || route === 'notifications') && currentRoute === 'home';
    const isExitingFluid = route === 'home' && (currentRoute === 'create' || currentRoute === 'notifications');

    if (isEnteringFluid) {
      setFluidTransition({
        active: true,
        phase: 'entering',
        target: route
      });

      // Brief atmospheric swell: liquid glass wave sweeps across
      setTimeout(() => {
        setCurrentRoute(route);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 140);

      setTimeout(() => {
        setFluidTransition({
          active: false,
          phase: 'idle',
          target: null
        });
      }, 500);
    } else if (isExitingFluid) {
      setFluidTransition({
        active: true,
        phase: 'exiting',
        target: 'home'
      });

      // Allow exit dissolve/morph animation to play on current component
      setTimeout(() => {
        setCurrentRoute('home');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 300);

      setTimeout(() => {
        setFluidTransition({
          active: false,
          phase: 'idle',
          target: null
        });
      }, 500);
    } else {
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Like post
  const handleLikePost = async (postId) => {
    setFeedPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes_count: p.likes_count + 1, is_liked: true } : p))
    );
    try {
      await api.likePost(postId);
    } catch (e) {
      console.error(e);
    }
  };

  // Save post
  const handleSavePost = async (postId) => {
    setFeedPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, is_saved: !p.is_saved } : p))
    );
    try {
      const res = await api.savePost(postId);
      showToast(res.message || 'Updated saved collection');
      // Refresh saved collection
      const savedRes = await api.getSavedPosts();
      if (savedRes.success) setSavedPosts(savedRes.saved);
    } catch (e) {
      console.error(e);
    }
  };

  // Add comment
  const handleAddComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await api.addComment(postId, text);
      if (res.success) {
        setFeedPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments_count: p.comments_count + 1, comments: [...(p.comments || []), res.comment] }
              : p
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send message
  const handleSendMessage = async (text, media_url = null, targetChatId = null) => {
    const convId = targetChatId || activeChatId;
    if (!convId || (!text && !media_url)) return;
    try {
      const activeUser = currentUser || JSON.parse(localStorage.getItem('soul_sync_current_user') || '{}');
      const senderId = activeUser?.id || parseInt(localStorage.getItem('soulsync_user_id') || '1', 10);
      const res = await api.sendMessage(convId, text, media_url, senderId);
      if (res.success && res.message) {
        const enrichedMsg = {
          ...res.message,
          sender_name: activeUser?.name || res.message.sender_name || 'Owner',
          sender_username: activeUser?.username || res.message.sender_username || 'owner',
          sender_avatar: activeUser?.avatar_url || res.message.sender_avatar
        };
        setActiveChatMessages((prev) => [...prev, enrichedMsg]);
        // Update conversation last message in list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId || c.channel_id === convId
              ? { ...c, last_message: text || 'Sent a photo', last_message_time: 'Just now' }
              : c
          )
        );
        return { success: true, message: enrichedMsg };
      } else {
        showToast(res.message || 'Could not send message');
        return res;
      }
    } catch (e) {
      console.error('Send message error:', e);
      showToast('Error sending message');
      return { success: false };
    }
  };

  // Publish Post / Story / Reel
  const handleCreatePost = async (postData) => {
    try {
      const res = await api.createPost(postData);
      if (res.success) {
        showToast(res.message || 'Shared successfully!');
        if (res.post) {
          setFeedPosts((prev) => [res.post, ...prev]);
        }
        navigateTo('home');
      }
      return res;
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Failed to share' };
    }
  };

  // Soul Moments Actions
  const handleSaveMoment = async (momentData) => {
    try {
      const res = await api.saveMoment(momentData);
      if (res.success) {
        showToast('Saved to Soul Moments ✨');
        fetchMoments();
        fetchMomentsPreview();
        fetchMomentCollections();
      }
      return res;
    } catch (e) {
      console.error(e);
      showToast('Could not save to Moments');
    }
  };

  const handleUpdateMomentNote = async (id, private_note) => {
    try {
      const res = await api.updateMomentNote(id, private_note);
      if (res.success) {
        showToast('Private memory note saved');
        setSoulMoments((prev) =>
          prev.map((m) => (m.id === id ? { ...m, private_note } : m))
        );
        if (activeMomentDetail && activeMomentDetail.id === id) {
          setActiveMomentDetail((prev) => ({ ...prev, private_note }));
        }
      }
      return res;
    } catch (e) {
      console.error(e);
    }
  };

  const handleSetMomentCollection = async (id, collection_id) => {
    try {
      const res = await api.setMomentCollection(id, collection_id);
      if (res.success) {
        showToast('Memory collection updated');
        fetchMoments();
        fetchMomentCollections();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveMoment = async (id) => {
    try {
      const res = await api.removeMoment(id);
      if (res.success) {
        showToast('Removed from Soul Moments');
        setSoulMoments((prev) => prev.filter((m) => m.id !== id));
        setSoulMomentsPreview((prev) => prev.filter((m) => m.id !== id));
        if (activeMomentDetail && activeMomentDetail.id === id) {
          setActiveMomentDetail(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserProfile = async (profileFields) => {
    // 1. Immediately update local state
    setCurrentUser((prev) => {
      const next = { ...(prev || {}), ...profileFields };
      try {
        localStorage.setItem('soul_sync_current_user', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // 2. Persist to SQLite backend
    try {
      const activeId = currentUser?.id || parseInt(localStorage.getItem('soulsync_user_id') || '1', 10);
      const res = await api.updateProfile({
        ...profileFields,
        user_id: activeId
      });
      if (res && res.success && res.user) {
        setCurrentUser(res.user);
        try {
          localStorage.setItem('soul_sync_current_user', JSON.stringify(res.user));
        } catch (e) {}
        await fetchChannels(res.user);
      } else {
        await fetchChannels();
      }
      return res;
    } catch (err) {
      console.error('Failed to persist user profile:', err);
    }
  };

  // When currentUser changes (e.g. login, logout, account switch, or avatar change), refresh and synchronize channels
  useEffect(() => {
    if (currentUser) {
      fetchChannels(currentUser);
      if (currentUser.avatar_url) {
        setConversations((prev) =>
          prev.map((c) => {
            if ((c.is_channel || c.isChannel) && (c.owner_user_id === currentUser.id || !c.owner_user_id)) {
              return {
                ...c,
                partner_avatar: currentUser.avatar_url,
                owner_avatar: currentUser.avatar_url
              };
            }
            return c;
          })
        );
        setProfileChannels((prev) =>
          prev.map((c) => {
            if (c.owner_user_id === currentUser.id || !c.owner_user_id) {
              return {
                ...c,
                partner_avatar: currentUser.avatar_url,
                owner_avatar: currentUser.avatar_url
              };
            }
            return c;
          })
        );
        setFeedPosts((prev) =>
          prev.map((post) => {
            const isUserPost = post.user_id === currentUser.id || post.author_username === currentUser.username;
            const updatedComments = (post.comments || []).map((comm) => {
              if (comm.user_id === currentUser.id || comm.username === currentUser.username) {
                return { ...comm, avatar_url: currentUser.avatar_url };
              }
              return comm;
            });
            if (isUserPost) {
              return {
                ...post,
                author_avatar: currentUser.avatar_url,
                comments: updatedComments
              };
            }
            return {
              ...post,
              comments: updatedComments
            };
          })
        );
      }
    }
  }, [currentUser, currentUser?.avatar_url]);

  const handleDeleteChannel = async (channelId) => {
    try {
      const res = await api.deleteChannel(channelId);
      if (res && res.success) {
        setPersistentChannels((prev) => prev.filter((c) => c.channel_id !== channelId && c.id !== channelId));
        setConversations((prev) => prev.filter((c) => c.channel_id !== channelId && c.id !== channelId));
        setProfileChannels((prev) => prev.filter((c) => c.channel_id !== channelId && c.id !== channelId));
        showToast(res.message || 'Channel deleted successfully');
        return true;
      } else {
        showToast((res && res.message) || 'Could not delete channel');
        return false;
      }
    } catch (e) {
      console.error('Error deleting channel:', e);
      showToast('Error communicating with server to delete channel');
      return false;
    }
  };

  const handleCreateCollection = async (name, icon = '✨') => {
    try {
      const res = await api.createMomentCollection(name, icon);
      if (res.success) {
        showToast(`Created collection "${name}"`);
        fetchMomentCollections();
      }
      return res;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        currentUser,
        setCurrentUser,
        updateUserProfile,
        feedPosts,
        handleLikePost,
        handleSavePost,
        handleAddComment,
        conversations,
        setConversations,
        persistentChannels,
        setPersistentChannels,
        fetchChannels,
        handleDeleteChannel,
        profileChannels,
        setProfileChannels,
        activeChatId,
        setActiveChatId,
        activeChatMessages,
        setActiveChatMessages,
        handleSendMessage,
        notifications,
        savedPosts,
        exploreItems,
        suggestedUsers,
        handleCreatePost,
        tempRegisterEmail,
        setTempRegisterEmail,
        reportModalOpen,
        setReportModalOpen,
        toastMessage,
        showToast,
        fluidTransition,
        // Soul Moments Exports
        soulMoments,
        soulMomentsPreview,
        momentCollections,
        activeMomentDetail,
        setActiveMomentDetail,
        fetchMoments,
        fetchMomentsPreview,
        fetchMomentCollections,
        handleSaveMoment,
        handleUpdateMomentNote,
        handleSetMomentCollection,
        handleRemoveMoment,
        handleCreateCollection
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
