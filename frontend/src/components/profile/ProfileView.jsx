import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import CosmicEnergyStream from './CosmicEnergyStream';
import CoverEnergyStream from './CoverEnergyStream';
import { useApp } from '../../context/AppContext';
import {
  Grid,
  Film,
  Tag,
  MapPin,
  Calendar,
  Sparkles,
  MessageCircle,
  UserPlus,
  Camera,
  Upload,
  Check,
  X,
  Edit3,
  Music,
  Link as LinkIcon,
  Lock,
  Globe,
  Trash2,
  Plus,
  AlertCircle,
  ArrowLeft,
  Users,
  UserCheck,
  Search,
  Compass,
  Radio
} from 'lucide-react';

const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result);
      img.src = e.target?.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

const coverPresets = [
  { id: 'sunset', name: 'Tropical Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80' },
  { id: 'aurora', name: 'Cosmic Aurora', url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80' },
  { id: 'horizon', name: 'Ocean Horizon', url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&auto=format&fit=crop&q=80' },
  { id: 'neon', name: 'Neon Cyber', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { id: 'mountain', name: 'Alpine Solitude', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80' },
  { id: 'nebula', name: 'Deep Space', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80' }
];

const avatarPresets = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
];

const musicPresets = [
  { title: 'Cosmic Resonance (432Hz)', artist: 'Soul Frequency' },
  { title: 'Sunset Waves & Chill', artist: 'Kerala Dreamers' },
  { title: 'Midnight Starlight', artist: 'Aether Echo' },
  { title: 'Neon Horizon Reverie', artist: 'Cyber Soul' }
];

// 36 Pre-calculated Particles along boundaries and face of Edit Profile Side-Panel
const DISSOLVE_PARTICLES = [
  // Top boundary particles
  { id: 1, top: '1%', left: '15%', tx: '-12px', ty: '-42px', color: '#B98CFF', size: 5, delay: '0.02s', isStar: false },
  { id: 2, top: '2%', left: '35%', tx: '8px', ty: '-50px', color: '#B83268', size: 6, delay: '0.05s', isStar: true },
  { id: 3, top: '0.5%', left: '55%', tx: '-5px', ty: '-45px', color: '#F5F3F7', size: 4, delay: '0.08s', isStar: false },
  { id: 4, top: '2%', left: '75%', tx: '18px', ty: '-52px', color: '#B83268', size: 5, delay: '0.03s', isStar: false },
  { id: 5, top: '1%', left: '90%', tx: '25px', ty: '-38px', color: '#B98CFF', size: 7, delay: '0.07s', isStar: true },

  // Right boundary particles
  { id: 6, top: '12%', left: '98%', tx: '45px', ty: '-15px', color: '#B83268', size: 5, delay: '0.04s', isStar: false },
  { id: 7, top: '24%', left: '97%', tx: '52px', ty: '6px', color: '#B98CFF', size: 6, delay: '0.09s', isStar: true },
  { id: 8, top: '38%', left: '99%', tx: '48px', ty: '-8px', color: '#F5F3F7', size: 4, delay: '0.02s', isStar: false },
  { id: 9, top: '50%', left: '97%', tx: '56px', ty: '14px', color: '#B83268', size: 5, delay: '0.06s', isStar: false },
  { id: 10, top: '65%', left: '98%', tx: '44px', ty: '8px', color: '#B83268', size: 7, delay: '0.11s', isStar: true },
  { id: 11, top: '78%', left: '97%', tx: '50px', ty: '-10px', color: '#B98CFF', size: 5, delay: '0.05s', isStar: false },
  { id: 12, top: '90%', left: '98%', tx: '46px', ty: '18px', color: '#F5F3F7', size: 6, delay: '0.08s', isStar: false },

  // Bottom boundary particles
  { id: 13, top: '99%', left: '85%', tx: '16px', ty: '48px', color: '#B83268', size: 5, delay: '0.03s', isStar: false },
  { id: 14, top: '98%', left: '65%', tx: '-8px', ty: '52px', color: '#B98CFF', size: 7, delay: '0.07s', isStar: true },
  { id: 15, top: '99%', left: '45%', tx: '12px', ty: '44px', color: '#B83268', size: 4, delay: '0.02s', isStar: false },
  { id: 16, top: '97%', left: '25%', tx: '-18px', ty: '50px', color: '#F5F3F7', size: 6, delay: '0.09s', isStar: false },
  { id: 17, top: '98%', left: '10%', tx: '-22px', ty: '42px', color: '#B98CFF', size: 5, delay: '0.04s', isStar: true },

  // Left boundary particles
  { id: 18, top: '88%', left: '1%', tx: '-46px', ty: '14px', color: '#B83268', size: 6, delay: '0.06s', isStar: false },
  { id: 19, top: '74%', left: '2%', tx: '-52px', ty: '-8px', color: '#B83268', size: 5, delay: '0.02s', isStar: false },
  { id: 20, top: '60%', left: '1%', tx: '-48px', ty: '12px', color: '#B98CFF', size: 7, delay: '0.08s', isStar: true },
  { id: 21, top: '46%', left: '2%', tx: '-55px', ty: '-6px', color: '#F5F3F7', size: 4, delay: '0.04s', isStar: false },
  { id: 22, top: '32%', left: '1%', tx: '-44px', ty: '10px', color: '#B83268', size: 6, delay: '0.10s', isStar: false },
  { id: 23, top: '18%', left: '2%', tx: '-50px', ty: '-12px', color: '#B98CFF', size: 5, delay: '0.05s', isStar: true },
  { id: 24, top: '6%', left: '1%', tx: '-42px', ty: '-20px', color: '#B83268', size: 6, delay: '0.07s', isStar: false },

  // Glass surface luminous particles
  { id: 25, top: '15%', left: '30%', tx: '-14px', ty: '-22px', color: '#B98CFF', size: 4, delay: '0.04s', isStar: false },
  { id: 26, top: '22%', left: '60%', tx: '18px', ty: '-16px', color: '#B83268', size: 5, delay: '0.08s', isStar: true },
  { id: 27, top: '30%', left: '40%', tx: '-10px', ty: '18px', color: '#F5F3F7', size: 3, delay: '0.02s', isStar: false },
  { id: 28, top: '42%', left: '70%', tx: '22px', ty: '-14px', color: '#B83268', size: 5, delay: '0.06s', isStar: false },
  { id: 29, top: '52%', left: '25%', tx: '-18px', ty: '20px', color: '#B98CFF', size: 6, delay: '0.10s', isStar: true },
  { id: 30, top: '62%', left: '55%', tx: '14px', ty: '18px', color: '#B83268', size: 4, delay: '0.05s', isStar: false },
  { id: 31, top: '72%', left: '35%', tx: '-16px', ty: '-12px', color: '#F5F3F7', size: 3, delay: '0.09s', isStar: false },
  { id: 32, top: '82%', left: '65%', tx: '20px', ty: '16px', color: '#B83268', size: 5, delay: '0.03s', isStar: false },
  { id: 33, top: '28%', left: '80%', tx: '16px', ty: '-25px', color: '#B98CFF', size: 5, delay: '0.07s', isStar: true },
  { id: 34, top: '48%', left: '45%', tx: '-8px', ty: '-18px', color: '#B83268', size: 4, delay: '0.01s', isStar: false },
  { id: 35, top: '68%', left: '80%', tx: '22px', ty: '-10px', color: '#F5F3F7', size: 4, delay: '0.08s', isStar: false },
  { id: 36, top: '85%', left: '40%', tx: '-12px', ty: '22px', color: '#B98CFF', size: 6, delay: '0.04s', isStar: true }
];

// 28 Particles around perimeter and glass face of Edit Cover Modal Dialog
const COVER_DISSOLVE_PARTICLES = [
  // Top boundary particles
  { id: 1, top: '2%', left: '12%', tx: '-10px', ty: '-35px', cx: '35%', cy: '-20px', color: '#B98CFF', size: 5, delay: '0.01s', isStar: false },
  { id: 2, top: '1%', left: '30%', tx: '-5px', ty: '-42px', cx: '42%', cy: '-30px', color: '#F5F3F7', size: 4, delay: '0.03s', isStar: true },
  { id: 3, top: '3%', left: '50%', tx: '0px', ty: '-48px', cx: '50%', cy: '-35px', color: '#B83268', size: 6, delay: '0.05s', isStar: false },
  { id: 4, top: '1.5%', left: '72%', tx: '12px', ty: '-40px', cx: '58%', cy: '-28px', color: '#B83268', size: 5, delay: '0.02s', isStar: true },
  { id: 5, top: '3%', left: '88%', tx: '20px', ty: '-32px', cx: '64%', cy: '-18px', color: '#B98CFF', size: 4, delay: '0.04s', isStar: false },

  // Right boundary particles
  { id: 6, top: '15%', left: '98%', tx: '36px', ty: '-10px', cx: '70%', cy: '5%', color: '#B83268', size: 5, delay: '0.03s', isStar: false },
  { id: 7, top: '32%', left: '97%', tx: '42px', ty: '5px', cx: '68%', cy: '12%', color: '#B98CFF', size: 6, delay: '0.06s', isStar: true },
  { id: 8, top: '50%', left: '99%', tx: '38px', ty: '12px', cx: '65%', cy: '20%', color: '#F5F3F7', size: 4, delay: '0.02s', isStar: false },
  { id: 9, top: '68%', left: '97%', tx: '40px', ty: '18px', cx: '62%', cy: '28%', color: '#B83268', size: 5, delay: '0.05s', isStar: false },
  { id: 10, top: '85%', left: '98%', tx: '34px', ty: '24px', cx: '60%', cy: '35%', color: '#B83268', size: 5, delay: '0.07s', isStar: true },

  // Bottom boundary particles
  { id: 11, top: '98%', left: '85%', tx: '16px', ty: '38px', cx: '58%', cy: '45%', color: '#B83268', size: 4, delay: '0.02s', isStar: false },
  { id: 12, top: '97%', left: '65%', tx: '8px', ty: '44px', cx: '55%', cy: '40%', color: '#B98CFF', size: 6, delay: '0.06s', isStar: true },
  { id: 13, top: '99%', left: '50%', tx: '0px', ty: '46px', cx: '50%', cy: '38%', color: '#F5F3F7', size: 5, delay: '0.04s', isStar: false },
  { id: 14, top: '98%', left: '32%', tx: '-12px', ty: '40px', cx: '46%', cy: '40%', color: '#B83268', size: 4, delay: '0.07s', isStar: false },
  { id: 15, top: '97%', left: '15%', tx: '-22px', ty: '34px', cx: '42%', cy: '44%', color: '#B98CFF', size: 5, delay: '0.03s', isStar: true },

  // Left boundary particles
  { id: 16, top: '85%', left: '2%', tx: '-34px', ty: '18px', cx: '38%', cy: '35%', color: '#B83268', size: 5, delay: '0.05s', isStar: false },
  { id: 17, top: '68%', left: '1%', tx: '-40px', ty: '8px', cx: '40%', cy: '26%', color: '#B83268', size: 4, delay: '0.02s', isStar: true },
  { id: 18, top: '50%', left: '2%', tx: '-38px', ty: '-4px', cx: '42%', cy: '18%', color: '#B98CFF', size: 6, delay: '0.06s', isStar: false },
  { id: 19, top: '32%', left: '1%', tx: '-36px', ty: '-12px', cx: '44%', cy: '10%', color: '#F5F3F7', size: 4, delay: '0.04s', isStar: false },
  { id: 20, top: '15%', left: '2%', tx: '-30px', ty: '-22px', cx: '46%', cy: '4%', color: '#B83268', size: 5, delay: '0.07s', isStar: true },

  // Internal Glass Surface Particles & Star Sparkles
  { id: 21, top: '22%', left: '25%', tx: '-14px', ty: '-16px', cx: '46%', cy: '12%', color: '#B98CFF', size: 4, delay: '0.03s', isStar: false },
  { id: 22, top: '25%', left: '75%', tx: '18px', ty: '-14px', cx: '54%', cy: '14%', color: '#B83268', size: 5, delay: '0.06s', isStar: true },
  { id: 23, top: '45%', left: '30%', tx: '-12px', ty: '12px', cx: '47%', cy: '22%', color: '#F5F3F7', size: 3, delay: '0.01s', isStar: false },
  { id: 24, top: '42%', left: '70%', tx: '16px', ty: '10px', cx: '53%', cy: '20%', color: '#B83268', size: 5, delay: '0.05s', isStar: false },
  { id: 25, top: '60%', left: '40%', tx: '-10px', ty: '16px', cx: '48%', cy: '28%', color: '#B98CFF', size: 6, delay: '0.08s', isStar: true },
  { id: 26, top: '62%', left: '60%', tx: '14px', ty: '14px', cx: '52%', cy: '28%', color: '#B83268', size: 4, delay: '0.04s', isStar: false },
  { id: 27, top: '78%', left: '35%', tx: '-12px', ty: '20px', cx: '47%', cy: '34%', color: '#F5F3F7', size: 4, delay: '0.07s', isStar: false },
  { id: 28, top: '80%', left: '65%', tx: '15px', ty: '18px', cx: '53%', cy: '35%', color: '#B83268', size: 5, delay: '0.02s', isStar: true }
];

const SUGGESTED_SOULS = [
  { id: '1', name: 'Arjun Nair', username: '@arjun_travels', subtitle: 'Mutual with Sahana • Photography', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Sahana Varma', username: '@sahana_art', subtitle: 'Mutual with Vikram • Digital Art', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Vikram Joshi', username: '@vikram_beats', subtitle: '432Hz Sound Designer • Mumbai', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' }
];

const SUGGESTED_CREATORS = [
  { id: '4', name: 'Kavya Sharma', username: '@kavya_astro', subtitle: 'Deep Space Astrophotography ✨', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Rohan Sen', username: '@rohan_ambient', subtitle: 'Ambient Nature Recording • Kerala', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80' },
  { id: '6', name: 'Ananya Roy', username: '@ananya_vibes', subtitle: 'Sunset Chaser & Visual Poet', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' }
];

const ProfileView = () => {
  const { navigateTo, showToast, profileChannels, currentUser, setCurrentUser, updateUserProfile } = useApp();
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  // Dedicated Followers & Following Screens with Origin-Based Bloom Expansion
  const followersCardRef = useRef(null);
  const followingCardRef = useRef(null);
  const [statsView, setStatsView] = useState(null); // null | 'followers' | 'following'
  const [statsOrigin, setStatsOrigin] = useState({ x: 0, y: 0 });
  const [isClosingStats, setIsClosingStats] = useState(false);
  const [statsBloom, setStatsBloom] = useState(null); // null | { x, y, type }
  const [searchStatsQuery, setSearchStatsQuery] = useState('');
  const [statsActiveTab, setStatsActiveTab] = useState('all');
  const [followingMap, setFollowingMap] = useState({});

  // Dynamic Profile Data state with localStorage persistence and canonical currentUser sync
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('soul_sync_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          name: currentUser?.name || parsed.name,
          username: currentUser?.username || parsed.username,
          bio: currentUser?.bio || parsed.bio,
          avatar: currentUser?.avatar_url || parsed.avatar,
          stats: {
            ...parsed.stats,
            posts: 6,
            followers: 0,
            following: 0
          }
        };
      } catch (e) {
        console.warn('Failed to parse saved profile');
      }
    }
    return {
      name: currentUser?.name || 'Christon Thomas',
      username: currentUser?.username || 'christon',
      bio: currentUser?.bio || 'Creating experiences • Soul Sync explorer',
      location: currentUser?.location || 'Bangalore, India',
      joined: 'Joined March 2024',
      avatar: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      caption: 'Resonating across cosmic frequencies, capturing golden moments & sunset dreams ✨',
      music: {
        title: 'Cosmic Resonance (432Hz)',
        artist: 'Soul Frequency'
      },
      links: [
        { id: '1', title: 'Portfolio', url: 'https://meghaphotography.com' },
        { id: '2', title: 'Instagram', url: 'https://instagram.com/megha_official' }
      ],
      contact: {
        email: currentUser?.email || 'christon@gmail.com',
        phone: '+91 98765 43210',
        isPrivate: true
      },
      stats: {
        posts: 6,
        followers: 0,
        following: 0
      }
    };
  });

  // Keep profileData strictly synchronized with the canonical currentUser
  React.useEffect(() => {
    if (currentUser) {
      setProfileData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        username: currentUser.username || prev.username,
        bio: currentUser.bio || prev.bio,
        location: currentUser.location || prev.location,
        avatar: currentUser.avatar_url || prev.avatar
      }));
    }
  }, [currentUser]);

  // Cover image customization state
  const [coverUrl, setCoverUrl] = useState(() => {
    return localStorage.getItem('soul_sync_cover') || profileData.cover;
  });
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [isClosingCoverModal, setIsClosingCoverModal] = useState(false);
  const [previewCover, setPreviewCover] = useState(coverUrl);
  const fileInputRef = useRef(null);

  // Cover Save Transition States
  const editCoverBtnRef = useRef(null);
  const coverModalRef = useRef(null);
  const [coverSaveState, setCoverSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [showCoverShimmer, setShowCoverShimmer] = useState(false);
  const [isCoverDissolving, setIsCoverDissolving] = useState(false);
  const [isCoverStreaming, setIsCoverStreaming] = useState(false);
  const [isCoverAbsorbing, setIsCoverAbsorbing] = useState(false);
  const [isCoverRevealing, setIsCoverRevealing] = useState(false);
  const [coverStreamCoords, setCoverStreamCoords] = useState({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });

  // Edit Profile Workspace & Side-Panel States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isClosingEdit, setIsClosingEdit] = useState(false);
  const [saveButtonState, setSaveButtonState] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [isDissolving, setIsDissolving] = useState(false);
  const [showFinalSparkle, setShowFinalSparkle] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Energy Stream & Absorption States
  const editProfileBtnRef = useRef(null);
  const [streamCoordinates, setStreamCoordinates] = useState({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [isEnergyStreaming, setIsEnergyStreaming] = useState(false);
  const [isEnergyAbsorbing, setIsEnergyAbsorbing] = useState(false);

  // Form draft state for Edit Profile
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    bio: '',
    caption: '',
    avatar: '',
    location: '',
    musicTitle: '',
    musicArtist: '',
    hasMusic: true,
    email: '',
    phone: '',
    isContactPrivate: true,
    links: []
  });

  const [initialSnapshot, setInitialSnapshot] = useState(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const avatarInputRef = useRef(null);

  // Followers / Following Origin Handlers
  const handleOpenFollowers = () => {
    if (followersCardRef.current) {
      const rect = followersCardRef.current.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      setStatsOrigin({ x: originX, y: originY });
      setStatsBloom({ x: originX, y: originY, type: 'followers' });
      setTimeout(() => setStatsBloom(null), 380);
    } else {
      setStatsOrigin({ x: window.innerWidth * 0.45, y: window.innerHeight * 0.6 });
    }
    setStatsActiveTab('all');
    setSearchStatsQuery('');
    setIsClosingStats(false);
    setStatsView('followers');
  };

  const handleOpenFollowing = () => {
    if (followingCardRef.current) {
      const rect = followingCardRef.current.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      setStatsOrigin({ x: originX, y: originY });
      setStatsBloom({ x: originX, y: originY, type: 'following' });
      setTimeout(() => setStatsBloom(null), 380);
    } else {
      setStatsOrigin({ x: window.innerWidth * 0.55, y: window.innerHeight * 0.6 });
    }
    setStatsActiveTab('all');
    setSearchStatsQuery('');
    setIsClosingStats(false);
    setStatsView('following');
  };

  const handleCloseStats = () => {
    if (isClosingStats) return;
    setIsClosingStats(true);
    setTimeout(() => {
      setStatsView(null);
      setIsClosingStats(false);
    }, 240);
  };

  const handleToggleFollowUser = (user) => {
    setFollowingMap((prev) => {
      const nextState = !prev[user.id];
      if (nextState) {
        showToast(`Now following ${user.name} ✨`);
      } else {
        showToast(`Unfollowed ${user.name}`);
      }
      return { ...prev, [user.id]: nextState };
    });
  };

  // Cover Handlers
  const handleOpenCoverModal = () => {
    setPreviewCover(coverUrl);
    setIsClosingCoverModal(false);
    setCoverSaveState('idle');
    setIsCoverDissolving(false);
    setIsCoverStreaming(false);
    setIsCoverAbsorbing(false);
    setIsCoverRevealing(false);
    setShowCoverShimmer(false);
    setShowCoverModal(true);
  };

  const handleCloseCoverModal = () => {
    if (isCoverDissolving || isCoverStreaming) return;
    setIsClosingCoverModal(true);
    setTimeout(() => {
      setShowCoverModal(false);
      setIsClosingCoverModal(false);
    }, 220);
  };

  const handleSelectPreset = (url) => {
    setPreviewCover(url);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1600, 900, 0.82);
      if (compressed) {
        setPreviewCover(compressed);
        showToast('Selected image loaded & optimized for preview');
      }
    } catch (err) {
      console.warn('Cover upload processing failed:', err);
    }
  };

  // Master Edit Cover Save Transition Choreography
  const handleSaveCover = () => {
    if (coverSaveState !== 'idle') return;

    // 1. Initial Response (0.00s):
    // Immediate, subtle Liquid Glass press response on Save Cover button
    setCoverSaveState('saving');

    // Calculate coordinates for stream (from modal center/upper to Edit Cover button)
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight * 0.38;
    if (coverModalRef.current) {
      const rect = coverModalRef.current.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height * 0.32;
    }

    let endX = window.innerWidth - 120;
    let endY = 80;
    if (editCoverBtnRef.current) {
      const rect = editCoverBtnRef.current.getBoundingClientRect();
      endX = rect.left + rect.width / 2;
      endY = rect.top + rect.height / 2;
    }

    setCoverStreamCoords({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    });

    // 2. Cover Micro-Shimmer (0.05s–0.25s):
    // Extremely subtle luminous shimmer travels smoothly across cover banner
    setTimeout(() => {
      setShowCoverShimmer(true);
    }, 50);

    // 3. Editing State Dissolve (0.15s–0.45s):
    // Modal dialog dissolves into luminous particles and star sparkles
    setTimeout(() => {
      setCoverSaveState('saved');
      setIsCoverDissolving(true);
    }, 150);

    // 4 & 5. Converging particles form Signature Liquid Energy Flow (0.50s):
    setTimeout(() => {
      setIsCoverStreaming(true);
    }, 500);
  };

  const handleCoverStreamComplete = () => {
    // 6. Flow enters Edit Cover button & absorbs
    setIsCoverStreaming(false);
    setIsCoverDissolving(false);
    setShowCoverModal(false);
    setCoverSaveState('idle');

    // 7. Edit Cover Button Micro-Interaction (pulse & halo)
    setIsCoverAbsorbing(true);

    // 8. Updated Cover Reveal (locks into place smoothly)
    setCoverUrl(previewCover);
    try {
      localStorage.setItem('soul_sync_cover', previewCover);
    } catch (e) {
      console.warn('LocalStorage cover quota notice:', e);
    }
    setIsCoverRevealing(true);
    showToast('Cover updated ✨');

    // Async sync with backend
    try {
      fetch('/api/users/profile/cover', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cover_url: previewCover, user_id: 2 })
      }).catch((err) => console.warn('Cover API sync note:', err));
    } catch (err) {
      console.warn('Cover API sync note:', err);
    }

    // 9. Settle: remaining particles fade away; pristine state restored
    setTimeout(() => {
      setIsCoverAbsorbing(false);
      setIsCoverRevealing(false);
      setShowCoverShimmer(false);
    }, 380);
  };

  // Edit Profile Side-Panel Workspace Handlers
  const handleOpenEditProfile = () => {
    const draft = {
      name: profileData.name || '',
      username: profileData.username || '',
      bio: profileData.bio || '',
      caption: profileData.caption || '',
      avatar: currentUser?.avatar_url || profileData.avatar || '',
      location: profileData.location || '',
      musicTitle: profileData.music?.title || 'Cosmic Resonance (432Hz)',
      musicArtist: profileData.music?.artist || 'Soul Frequency',
      hasMusic: Boolean(profileData.music),
      email: currentUser?.email || profileData.contact?.email || 'christon@gmail.com',
      phone: profileData.contact?.phone || '+91 98765 43210',
      isContactPrivate: profileData.contact?.isPrivate ?? true,
      links: profileData.links ? [...profileData.links] : []
    };
    setEditForm(draft);
    setInitialSnapshot(JSON.stringify(draft));
    setIsClosingEdit(false);
    setShowDiscardConfirm(false);
    setIsEditingProfile(true);
  };

  const hasUnsavedChanges = () => {
    return initialSnapshot && JSON.stringify(editForm) !== initialSnapshot;
  };

  const handleAttemptCloseEdit = () => {
    if (hasUnsavedChanges()) {
      setShowDiscardConfirm(true);
    } else {
      executeCloseEditModal();
    }
  };

  const executeCloseEditModal = () => {
    setShowDiscardConfirm(false);
    setIsClosingEdit(true);
    setTimeout(() => {
      setIsEditingProfile(false);
      setIsClosingEdit(false);
      setSaveButtonState('idle');
      setIsDissolving(false);
    }, 320);
  };

  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 500, 500, 0.85);
      if (compressed) {
        setEditForm((prev) => ({ ...prev, avatar: compressed }));
        showToast('Custom profile photo loaded & optimized');
      }
    } catch (err) {
      console.warn('Avatar upload processing failed:', err);
    }
  };

  const handleAddLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      showToast('Please provide both link title and URL');
      return;
    }
    const newLink = {
      id: Date.now().toString(),
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim()
    };
    setEditForm((prev) => ({ ...prev, links: [...prev.links, newLink] }));
    setNewLinkTitle('');
    setNewLinkUrl('');
    setShowAddLinkForm(false);
    showToast(`Added link: ${newLink.title}`);
  };

  const handleRemoveLink = (id) => {
    setEditForm((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id)
    }));
  };

  const handleSaveProfileChanges = async () => {
    if (!editForm.name.trim()) {
      showToast('Name cannot be empty');
      return;
    }
    if (!editForm.username.trim()) {
      showToast('Username cannot be empty');
      return;
    }

    const cleanUsername = editForm.username.replace(/^@/, '').trim();
    setSaveButtonState('saving');

    const updatedProfile = {
      ...profileData,
      name: editForm.name.trim(),
      username: cleanUsername,
      bio: editForm.bio,
      caption: editForm.caption,
      avatar: editForm.avatar,
      location: editForm.location,
      music: editForm.hasMusic
        ? {
            title: editForm.musicTitle,
            artist: editForm.musicArtist
          }
        : null,
      links: editForm.links,
      contact: {
        email: editForm.email,
        phone: editForm.phone,
        isPrivate: editForm.isContactPrivate
      }
    };

    // 1. Instantly update local profile state
    setProfileData(updatedProfile);
    try {
      localStorage.setItem('soul_sync_profile', JSON.stringify(updatedProfile));
    } catch (e) {
      console.warn('LocalStorage profile quota notice:', e);
    }

    // Persist globally across application and to backend SQLite
    try {
      if (updateUserProfile) {
        await updateUserProfile({
          name: updatedProfile.name,
          username: updatedProfile.username,
          bio: updatedProfile.bio,
          avatar_url: updatedProfile.avatar,
          location: updatedProfile.location,
          caption: updatedProfile.caption,
          music: updatedProfile.music,
          links: updatedProfile.links,
          contact_email: updatedProfile.contact.email,
          contact_phone: updatedProfile.contact.phone,
          contact_privacy: updatedProfile.contact.isPrivate ? 'private' : 'public',
          user_id: currentUser?.id || 1
        });
      }
    } catch (err) {
      console.warn('Backend SQLite sync notice:', err);
    }

    // Calculate exact arrival coordinates at the [ Edit Profile ] button
    const btnRect = editProfileBtnRef.current?.getBoundingClientRect();
    const endX = btnRect ? btnRect.left + btnRect.width / 2 : window.innerWidth / 2;
    const endY = btnRect ? btnRect.top + btnRect.height / 2 : window.innerHeight * 0.58;

    // Launch origin at the left-center focal point of the dissolving side panel
    const startX = Math.max(window.innerWidth - 400, window.innerWidth * 0.72);
    const startY = window.innerHeight * 0.44;

    setStreamCoordinates({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    });

    // 1. Button micro-interaction: Transition Save button to "✓ Saved" with subtle glow
    setSaveButtonState('saved');

    // 2. After brief delay (~240ms), begin simultaneous Sparkle Dissolve of side-panel + Profile Restoration
    setTimeout(() => {
      setIsDissolving(true);

      // 3. Sparkles gather together (ஒன்று சேரும்) and launch the thin luminous energy stream after ~360ms
      setTimeout(() => {
        setIsEnergyStreaming(true);
      }, 360);
    }, 240);
  };

  const handleStreamComplete = () => {
    // 4. Energy stream enters the Edit Profile button!
    setIsEnergyStreaming(false);
    setIsDissolving(false);
    setIsEditingProfile(false);
    setSaveButtonState('idle');

    // 5. Button receives energy stream: triggers subtle glow/pulse and ripple halo
    setIsEnergyAbsorbing(true);
    showToast('Profile synchronized ✨');

    // 6. Everything settles
    setTimeout(() => {
      setIsEnergyAbsorbing(false);
      setShowFinalSparkle(true);
      setTimeout(() => {
        setShowFinalSparkle(false);
      }, 360);
    }, 380);
  };

  const highlights = [
    { label: 'Travel', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=80' },
    { label: 'Friends', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { label: 'Sunsets', img: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=150&auto=format&fit=crop&q=80' },
    { label: 'Vibes', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80' }
  ];

  // 9 photographs for the 3x3 grid matching Screen 07
  const photosGrid = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="profile-workspace-container">
      {/* Main Profile Stage (Shifts left when editing is active; restores simultaneously on dissolve) */}
      <div
        className={`profile-stage-wrapper ${
          isEditingProfile && !isDissolving ? 'editing-shifted' : ''
        } ${isDissolving ? 'restoring-centered' : ''}`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: '1.5rem', width: '100%' }}>
      {/* Center Profile Column (Screen 07 exact representation) */}
      <div>
        {/* Cover Banner with Subtle Overlay & Customization Control (Entrance Step 1) */}
        <div className="profile-cover-banner-wrap animate-cover">
          <img
            src={coverUrl}
            alt="Profile cover"
            className={`profile-cover-banner ${isCoverRevealing ? 'cover-revealing' : ''}`}
          />
          <div className="profile-cover-gradient-overlay" />
          {showCoverShimmer && <div className="cover-luminous-shimmer" aria-hidden="true" />}
          <button
            ref={editCoverBtnRef}
            className={`cover-edit-btn ${isCoverAbsorbing ? 'cover-btn-absorb-pulse' : ''}`}
            onClick={handleOpenCoverModal}
            title="Customize Profile Cover"
          >
            <Camera size={15} />
            <span>Edit Cover</span>
            {isCoverAbsorbing && <div className="cover-btn-absorb-halo" aria-hidden="true" />}
          </button>
        </div>

        {/* Header Glass Card with Layered Dark Navy Depth */}
        <div className="liquid-glass-panel profile-header-card" style={{ textAlign: 'center' }}>
          {/* Internal Specular Glow (Safely contained inside card) */}
          <div className="profile-card-ambient-glow" aria-hidden="true" />

          {/* Profile Card Content (High Z-Index, Fully Visible) */}
          <div className="profile-card-content">
            {/* Avatar Section - Floating Smoothly & Fully Visible Above Cover & Card */}
            <div className="profile-avatar-wrapper">
              <div className="profile-square-frame animate-avatar">
                <img src={profileData.avatar} alt={profileData.name} className="profile-avatar-square" />

                {/* Top-Right Curved Edge Sparkle */}
                <div className="avatar-sparkle sparkle-top-right" aria-hidden="true">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="sparkleGradTR" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#B98CFF" />
                        <stop offset="50%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#B83268" />
                      </linearGradient>
                    </defs>
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="url(#sparkleGradTR)" />
                  </svg>
                </div>

                {/* Bottom-Left Curved Edge Sparkle */}
                <div className="avatar-sparkle sparkle-bottom-left" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="sparkleGradBL" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#B83268" />
                        <stop offset="50%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#B98CFF" />
                      </linearGradient>
                    </defs>
                    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="url(#sparkleGradBL)" />
                  </svg>
                </div>

                {/* Optional Final Confirmation Sparkle on restored Profile */}
                {showFinalSparkle && (
                  <div className="profile-final-success-sparkle" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id="finalSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#B98CFF" />
                          <stop offset="50%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#B83268" />
                        </linearGradient>
                      </defs>
                      <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" fill="url(#finalSparkleGrad)" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Display Name & Username (Entrance Step 3) */}
            <div className="profile-title-group animate-title" style={{ marginBottom: '1.1rem' }}>
              <h2 className="profile-display-name">
                {profileData.name}
              </h2>
              <span style={{ fontSize: '0.88rem', color: '#B98CFF' }}>@{profileData.username}</span>
            </div>

            {/* Bio / Location (Entrance Step 4) */}
            <p className="profile-bio-text animate-bio" style={{ whiteSpace: 'pre-line', color: '#F5F3F7', fontSize: '0.94rem', lineHeight: 1.55, marginBottom: profileChannels?.length > 0 ? '0.9rem' : '1.5rem', maxWidth: '420px' }}>
              {profileData.bio}
            </p>

            {/* Featured Broadcast Channels */}
            {profileChannels && profileChannels.length > 0 && (
              <div
                className="profile-channels-row animate-actions"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.6rem',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  maxWidth: '440px'
                }}
              >
                {profileChannels.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => navigateTo('messages')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      background: 'rgba(121, 217, 255, 0.12)',
                      border: '1px solid rgba(121, 217, 255, 0.35)',
                      color: '#79D9FF',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                    }}
                    title="Open broadcast channel in Messages"
                  >
                    <Radio size={12} />
                    <span>{ch.partner_name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons: Follow & Message (Entrance Step 5) */}
            <div
              className="profile-actions-row animate-actions"
              style={{
                display: 'flex',
                gap: '0.85rem',
                justifyContent: 'center',
                marginBottom: isOwnProfile ? '0.75rem' : '1.8rem',
                width: '100%'
              }}
            >
              <button
                className={isFollowing ? 'btn-secondary-glass' : 'btn-primary-gradient'}
                onClick={() => {
                  setIsFollowing(!isFollowing);
                  showToast(isFollowing ? `Unfollowed ${profileData.name}` : `Following ${profileData.name}`);
                }}
                style={{ minWidth: '130px' }}
              >
                <UserPlus size={16} />
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>

              <button
                className="btn-secondary-glass"
                onClick={() => navigateTo('messages')}
                style={{ minWidth: '130px' }}
              >
                <MessageCircle size={16} />
                <span>Message</span>
              </button>
            </div>

            {/* Secondary Liquid Glass Edit Profile Button (Own Profile Only - Centered below Follow + Message) */}
            {isOwnProfile && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.8rem', width: '100%' }}>
                <button
                  ref={editProfileBtnRef}
                  className={`btn-edit-profile-secondary ${isEnergyAbsorbing ? 'energy-absorb-pulse' : ''}`}
                  onClick={handleOpenEditProfile}
                  title="Edit Profile Information"
                  style={{ position: 'relative' }}
                >
                  <Edit3 size={15} />
                  <span>Edit Profile</span>
                  {isEnergyAbsorbing && (
                    <span className="btn-absorb-sparkle-halo" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}

            {/* Profile Bottom Split Section: Stats on Left | Subtle Vertical Divider | Highlights Column on Right */}
            <div className="profile-bottom-split-section animate-stats">
              {/* Left: Main Stats Area (Posts / Followers / Following) */}
              <div className="profile-stats-row">
                <button
                  type="button"
                  className="profile-stat-card"
                  onClick={() => showToast('Viewing Posts (6)')}
                  title="6 Posts"
                >
                  <span className="profile-stat-number">{profileData.stats.posts}</span>
                  <span className="profile-stat-label">Posts</span>
                </button>

                <button
                  ref={followersCardRef}
                  type="button"
                  className="profile-stat-card"
                  onClick={handleOpenFollowers}
                  title="0 Followers"
                >
                  <span className="profile-stat-number">{profileData.stats.followers}</span>
                  <span className="profile-stat-label">Followers</span>
                </button>

                <button
                  ref={followingCardRef}
                  type="button"
                  className="profile-stat-card"
                  onClick={handleOpenFollowing}
                  title="0 Following"
                >
                  <span className="profile-stat-number">{profileData.stats.following}</span>
                  <span className="profile-stat-label">Following</span>
                </button>
              </div>

              {/* Subtle Vertical Divider Line */}
              <div className="profile-section-vdivider" aria-hidden="true" />

              {/* Right: Dedicated Highlights Column */}
              <div className="profile-highlights-column" aria-label="Highlights Section">
                <div className="profile-highlights-header">
                  <span className="profile-highlights-title">Highlights</span>
                </div>

                <div className="profile-highlights-grid animate-highlights">
                  {highlights.map((h, i) => (
                    <div
                      key={i}
                      className="highlight-card-item"
                      onClick={() => showToast(`Viewing ${h.label} highlight`)}
                      title={h.label}
                    >
                      {/* Highlight Image (Primary Content) */}
                      <img src={h.img} alt={h.label} className="highlight-card-img" />

                      {/* Gradient overlay for readability */}
                      <div className="highlight-card-overlay" />

                      {/* Inner Label with Dot indicator */}
                      <div className="highlight-card-inner-label">
                        <span className="highlight-dot" />
                        <span>{h.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Tabs: Posts / Reels / Tagged */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'posts', label: 'Posts', icon: Grid },
            { id: 'reels', label: 'Reels', icon: Film },
            { id: 'tagged', label: 'Tagged', icon: Tag }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? '#B83268' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  paddingBottom: '0.4rem',
                  borderBottom: isActive ? '2px solid #B83268' : '2px solid transparent'
                }}
              >
                <Icon size={17} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3x3 Photo Grid */}
        <div className="profile-media-grid">
          {photosGrid.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Megha gallery ${i}`}
              className="profile-grid-photo"
              onClick={() => showToast('Opened photo details')}
            />
          ))}
        </div>
      </div>

      {/* Right Column: About Panel (Screen 07 representation) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="liquid-glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '1.1rem' }}>
            About
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.86rem', color: '#A9ADBC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <MapPin size={16} color="#B98CFF" />
              <span>{profileData.location || 'Kerala, India'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={16} color="#B98CFF" />
              <span>{profileData.joined}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={16} color="#B98CFF" />
              <span>Resonance Frequency: 432 Hz</span>
            </div>
          </div>
        </div>

        {/* Mutual connections */}
        <div className="liquid-glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F5F3F7', marginBottom: '1rem' }}>
            Mutual Frequencies
          </h4>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Followed by Arjun, Sahana, and 14 other souls you know.
          </p>
        </div>
      </div>
    </div>

        {/* Subtle Scrim over the shifted profile (fades simultaneously on dissolve) */}
        {isEditingProfile && (
          <div
            className={`profile-stage-scrim ${isDissolving ? 'scrim-fading' : ''}`}
            onClick={!isDissolving ? handleAttemptCloseEdit : undefined}
            title="Click to return to full profile"
          />
        )}
      </div>

      {/* Cover Customization Modal */}
      {(showCoverModal || isCoverDissolving) &&
        createPortal(
          <div
            className={`cover-modal-backdrop ${isClosingCoverModal ? 'closing' : ''} ${
              isCoverDissolving ? 'cover-dissolving' : ''
            }`}
            onClick={!isCoverDissolving ? handleCloseCoverModal : undefined}
          >
          <div
            ref={coverModalRef}
            className={`cover-modal-dialog ${isClosingCoverModal ? 'closing' : ''} ${
              isCoverDissolving ? 'cover-dissolving' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cover-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={18} color="#B98CFF" />
                <span className="cover-modal-title">Customize Profile Cover</span>
              </div>
              <button
                onClick={handleCloseCoverModal}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="cover-modal-body">
              {/* Live Preview */}
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.45rem', fontWeight: 600 }}>
                  Live Cover Preview
                </div>
                <div className="cover-preview-box">
                  <img src={previewCover} alt="Cover preview" className="cover-preview-img" />
                  <div className="profile-cover-gradient-overlay" />
                </div>
              </div>

              {/* Presets Grid */}
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.45rem', fontWeight: 600 }}>
                  Choose Curated Cosmic Cover
                </div>
                <div className="cover-preset-grid">
                  {coverPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className={`cover-preset-thumb ${previewCover === preset.url ? 'active' : ''}`}
                      onClick={() => handleSelectPreset(preset.url)}
                    >
                      <img src={preset.url} alt={preset.name} />
                      <span className="cover-preset-name">{preset.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload from Device */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  className="btn-secondary-glass"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '100%', borderRadius: '12px', padding: '0.65rem', justifyContent: 'center' }}
                >
                  <Upload size={16} />
                  <span>Upload Custom Image from Device</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'flex-end', marginTop: '0.2rem', flexShrink: 0 }}>
              <button
                className="btn-secondary-glass"
                onClick={handleCloseCoverModal}
                style={{ minWidth: '95px' }}
              >
                Cancel
              </button>
              <button
                className={`btn-primary-gradient btn-save-cover ${
                  coverSaveState === 'saving' ? 'saving' : ''
                } ${coverSaveState === 'saved' ? 'saved' : ''}`}
                onClick={coverSaveState === 'idle' ? handleSaveCover : undefined}
                style={{ minWidth: '120px' }}
              >
                <Check size={16} />
                <span>{coverSaveState === 'saved' ? 'Saved' : 'Save Cover'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Cover Dissolve Particles Field */}
      {isCoverDissolving &&
        createPortal(
          <div className="cover-dissolve-particles-field" aria-hidden="true">
            <div className="cover-dissolve-particles-wrap">
              {COVER_DISSOLVE_PARTICLES.map((p) => {
                if (p.isStar) {
                  return (
                    <div
                      key={p.id}
                      className="cover-dissolve-particle-star"
                      style={{
                        top: p.top,
                        left: p.left,
                        '--tx': p.tx,
                        '--ty': p.ty,
                        '--cx': p.cx,
                        '--cy': p.cy,
                        '--pcolor': p.color,
                        animationDelay: p.delay
                      }}
                    >
                      <svg width={p.size * 2.4} height={p.size * 2.4} viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 0L14 9.5L24 12L14 14.5L12 24L10 14.5L0 12L10 9.5L12 0Z"
                          fill={p.color}
                        />
                      </svg>
                    </div>
                  );
                }
                return (
                  <div
                    key={p.id}
                    className="cover-dissolve-particle-dot"
                    style={{
                      top: p.top,
                      left: p.left,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      backgroundColor: p.color,
                      '--tx': p.tx,
                      '--ty': p.ty,
                      '--cx': p.cx,
                      '--cy': p.cy,
                      '--pcolor': p.color,
                      animationDelay: p.delay
                    }}
                  />
                );
              })}
            </div>
          </div>,
          document.body
        )}

      {/* Signature Liquid Energy Particle Flow toward Edit Cover Button */}
      {isCoverStreaming && (
        <CoverEnergyStream
          start={coverStreamCoords.start}
          end={coverStreamCoords.end}
          onComplete={handleCoverStreamComplete}
        />
      )}

      {/* Origin Bloom Ring Indicator at the clicked Stat Card */}
      {statsBloom &&
        createPortal(
          <div
            className="stats-origin-bloom-ring"
            style={{
              left: `${statsBloom.x}px`,
              top: `${statsBloom.y}px`,
              borderColor: statsBloom.type === 'followers' ? '#B98CFF' : '#B83268',
              color: statsBloom.type === 'followers' ? '#B98CFF' : '#B83268'
            }}
            aria-hidden="true"
          />,
          document.body
        )}

      {/* Dedicated Followers / Following Screen (Origin-Point Expansion) */}
      {statsView &&
        createPortal(
          <div
            className={`stats-screen-backdrop ${isClosingStats ? 'closing' : ''}`}
            onClick={handleCloseStats}
          >
            <div
              className={`stats-screen-dialog ${statsView === 'followers' ? 'followers-theme' : 'following-theme'} ${
                isClosingStats ? 'closing' : ''
              }`}
              style={{
                '--origin-x': `${statsOrigin.x}px`,
                '--origin-y': `${statsOrigin.y}px`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="stats-screen-header">
                <div className="stats-header-left">
                  <button
                    type="button"
                    className="stats-screen-close-btn"
                    onClick={handleCloseStats}
                    title="Go back"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="stats-header-icon-badge">
                    {statsView === 'followers' ? (
                      <Users size={18} color="#B98CFF" />
                    ) : (
                      <UserCheck size={18} color="#B98CFF" />
                    )}
                  </div>
                  <div className="stats-header-titles">
                    <span className="stats-header-title">
                      {statsView === 'followers' ? 'Followers' : 'Following'}
                    </span>
                    <span className="stats-header-count-badge">
                      {statsView === 'followers' ? '0 Followers' : '0 Following'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="stats-screen-close-btn"
                  onClick={handleCloseStats}
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Controls: Search & Tabs */}
              <div className="stats-screen-controls">
                <div className="stats-search-input-wrap">
                  <Search size={14} />
                  <input
                    type="text"
                    className="stats-search-input"
                    placeholder={
                      statsView === 'followers' ? 'Search followers...' : 'Search following...'
                    }
                    value={searchStatsQuery}
                    onChange={(e) => setSearchStatsQuery(e.target.value)}
                  />
                </div>

                <div className="stats-tabs-row">
                  {statsView === 'followers' ? (
                    <>
                      <button
                        type="button"
                        className={`stats-tab-pill ${statsActiveTab === 'all' ? 'active' : ''}`}
                        onClick={() => setStatsActiveTab('all')}
                      >
                        All Followers (0)
                      </button>
                      <button
                        type="button"
                        className={`stats-tab-pill ${statsActiveTab === 'mutual' ? 'active' : ''}`}
                        onClick={() => setStatsActiveTab('mutual')}
                      >
                        Mutual (0)
                      </button>
                      <button
                        type="button"
                        className={`stats-tab-pill ${statsActiveTab === 'recent' ? 'active' : ''}`}
                        onClick={() => setStatsActiveTab('recent')}
                      >
                        Recent
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`stats-tab-pill following-pill ${statsActiveTab === 'all' ? 'active' : ''}`}
                        onClick={() => setStatsActiveTab('all')}
                      >
                        All Following (0)
                      </button>
                      <button
                        type="button"
                        className={`stats-tab-pill following-pill ${statsActiveTab === 'topics' ? 'active' : ''}`}
                        onClick={() => setStatsActiveTab('topics')}
                      >
                        Topics & Tags (0)
                      </button>
                      <button
                        type="button"
                        className={`stats-tab-pill following-pill ${statsActiveTab === 'creators' ? 'active' : ''}`}
                        onClick={() => setStatsActiveTab('creators')}
                      >
                        Creators
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="stats-screen-scroll-body">
                {/* Empty State Box */}
                <div className="stats-empty-state-box">
                  <div
                    className={`stats-beacon-ring ${
                      statsView === 'followers' ? 'followers-beacon' : 'following-beacon'
                    }`}
                  >
                    {statsView === 'followers' ? (
                      <Users size={28} color="#B98CFF" />
                    ) : (
                      <UserPlus size={28} color="#B98CFF" />
                    )}
                  </div>
                  <h4 className="stats-empty-title">
                    {statsView === 'followers' ? 'No Followers Yet' : 'Not Following Anyone Yet'}
                  </h4>
                  <p className="stats-empty-desc">
                    {statsView === 'followers'
                      ? 'When souls resonate with your frequency, they will appear here. Share your profile to start connecting across cosmic frequencies.'
                      : 'Explore photographers, ambient creators, and kindred spirits across the collective to tune in to their feed.'}
                  </p>
                  <button
                    type="button"
                    className="btn-secondary-glass"
                    onClick={() => {
                      handleCloseStats();
                      navigateTo('explore');
                    }}
                    style={{ fontSize: '0.82rem', padding: '0.45rem 1.15rem' }}
                  >
                    <Compass size={14} />
                    <span>{statsView === 'followers' ? 'Explore Souls' : 'Discover Creators'}</span>
                  </button>
                </div>

                {/* Suggested Connections Section */}
                <div className="stats-suggested-section">
                  <span className="stats-suggested-title">
                    {statsView === 'followers'
                      ? 'Recommended Connections'
                      : 'Inspiring Creators to Follow'}
                  </span>
                  <div className="stats-suggested-list">
                    {(statsView === 'followers' ? SUGGESTED_SOULS : SUGGESTED_CREATORS).map((user) => (
                      <div key={user.id} className="stats-user-item">
                        <div className="stats-user-left">
                          <img src={user.avatar} alt={user.name} className="stats-user-avatar" />
                          <div className="stats-user-names">
                            <span className="stats-user-fullname">{user.name}</span>
                            <span className="stats-user-subtext">{user.subtitle}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className={`stats-follow-btn ${followingMap[user.id] ? 'is-following' : ''}`}
                          onClick={() => handleToggleFollowUser(user)}
                        >
                          {followingMap[user.id] ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ===================================================
          INLINE EDIT PROFILE STUDIO SIDE-PANEL TRANSFORMATION
      =================================================== */}
      {(isEditingProfile || isClosingEdit || isDissolving) && (
        <>
          <div
            className={`profile-edit-side-panel ${
              isEditingProfile && !isClosingEdit && !isDissolving ? 'open' : ''
            } ${isClosingEdit ? 'closing' : ''} ${isDissolving ? 'sparkle-dissolving' : ''}`}
          >
          {/* Fixed Header */}
          <div className="edit-panel-header">
            <div className="edit-panel-title-wrap">
              <div className="edit-panel-badge">
                <Edit3 size={14} color="#B98CFF" />
                <span>Profile Studio</span>
              </div>
              <h3 className="edit-panel-title">Edit Profile</h3>
              <p className="edit-panel-subtitle">Refine your cosmic presence & details</p>
            </div>
            <button
              type="button"
              className="edit-panel-close-btn"
              onClick={handleAttemptCloseEdit}
              title="Close Editor"
            >
              <X size={18} />
            </button>
          </div>

          {/* Dedicated Scrollable Form Body with Staggered Animations */}
          <div className="edit-panel-scroll-body">
            {/* Section 1: Profile Photo (stagger-1) */}
            <div className="edit-photo-card stagger-item stagger-1">
              <div className="edit-avatar-thumb-wrap">
                <img src={editForm.avatar} alt="Edit Avatar" className="edit-avatar-thumb" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>Profile Photo</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Signature Soul Sync square curvature preview.
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="btn-secondary-glass"
                    onClick={() => avatarInputRef.current?.click()}
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    <Camera size={14} />
                    <span>Change Photo</span>
                  </button>
                  {avatarPresets.map((preset, index) => (
                    <img
                      key={index}
                      src={preset}
                      alt={`Preset ${index}`}
                      onClick={() => setEditForm((prev) => ({ ...prev, avatar: preset }))}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: editForm.avatar === preset ? '2px solid #B83268' : '1px solid rgba(185, 140, 255, 0.18)',
                        objectFit: 'cover'
                      }}
                      title="Choose avatar preset"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Name (stagger-2) */}
            <div className="edit-field-group stagger-item stagger-2">
              <div className="edit-field-label-row">
                <label className="edit-field-label">Name</label>
              </div>
              <input
                type="text"
                className="edit-input-field"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Your full display name"
              />
            </div>

            {/* Section 3: Username (stagger-3) */}
            <div className="edit-field-group stagger-item stagger-3">
              <div className="edit-field-label-row">
                <label className="edit-field-label">Username</label>
                <span className="edit-char-counter">soul-sync.me/{editForm.username.replace(/^@/, '')}</span>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '1rem', color: '#B98CFF', fontWeight: 600 }}>@</span>
                <input
                  type="text"
                  className="edit-input-field"
                  style={{ paddingLeft: '2.2rem' }}
                  value={editForm.username.replace(/^@/, '')}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '')
                    }))
                  }
                  placeholder="username"
                />
              </div>
            </div>

            {/* Section 4: Bio (stagger-4) */}
            <div className="edit-field-group stagger-item stagger-4">
              <div className="edit-field-label-row">
                <label className="edit-field-label">Bio</label>
                <span className="edit-char-counter">{editForm.bio.length} / 150</span>
              </div>
              <textarea
                className="edit-textarea-field"
                value={editForm.bio}
                maxLength={150}
                onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Describe your frequency, passions & soul journey..."
              />
            </div>

            {/* Section 5: Caption / Personal Tagline (stagger-5) */}
            <div className="edit-field-group stagger-item stagger-5">
              <div className="edit-field-label-row">
                <label className="edit-field-label">Cosmic Caption / Tagline</label>
              </div>
              <input
                type="text"
                className="edit-input-field"
                value={editForm.caption}
                onChange={(e) => setEditForm((prev) => ({ ...prev, caption: e.target.value }))}
                placeholder="Short personal quote or resonance note..."
              />
            </div>

            {/* Section 6: Profile Soundtrack (stagger-6) */}
            <div className="edit-field-group stagger-item stagger-6">
              <div className="edit-field-label-row">
                <label className="edit-field-label">Profile Soundtrack</label>
                <button
                  type="button"
                  onClick={() => setEditForm((prev) => ({ ...prev, hasMusic: !prev.hasMusic }))}
                  style={{ background: 'none', border: 'none', color: '#B98CFF', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  {editForm.hasMusic ? 'Disable Music' : 'Enable Music'}
                </button>
              </div>

              {editForm.hasMusic ? (
                <div className="edit-music-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(185, 140, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#B98CFF'
                      }}
                    >
                      <Music size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>{editForm.musicTitle}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{editForm.musicArtist}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-secondary-glass"
                      onClick={() => setShowMusicPicker(!showMusicPicker)}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem' }}
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm((prev) => ({ ...prev, hasMusic: false }))}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                      title="Remove track"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-secondary-glass"
                  onClick={() => {
                    setEditForm((prev) => ({
                      ...prev,
                      hasMusic: true,
                      musicTitle: 'Cosmic Resonance (432Hz)',
                      musicArtist: 'Soul Frequency'
                    }));
                  }}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
                >
                  <Plus size={15} />
                  <span>Add Profile Soundtrack</span>
                </button>
              )}

              {/* Music Presets Dropdown */}
              {showMusicPicker && editForm.hasMusic && (
                <div
                  style={{
                    background: 'rgba(15, 20, 38, 0.95)',
                    border: '1px solid rgba(185, 140, 255, 0.18)',
                    borderRadius: '12px',
                    padding: '0.6rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    marginTop: '0.4rem'
                  }}
                >
                  {musicPresets.map((track, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setEditForm((prev) => ({
                          ...prev,
                          musicTitle: track.title,
                          musicArtist: track.artist
                        }));
                        setShowMusicPicker(false);
                        showToast(`Selected track: ${track.title}`);
                      }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: editForm.musicTitle === track.title ? 'rgba(184, 50, 104, 0.2)' : 'transparent'
                      }}
                    >
                      <span style={{ fontSize: '0.84rem', color: '#fff' }}>{track.title}</span>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{track.artist}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 7: External Links (stagger-7) */}
            <div className="edit-field-group stagger-item stagger-7">
              <div className="edit-field-label-row">
                <label className="edit-field-label">External Links</label>
                <button
                  type="button"
                  onClick={() => setShowAddLinkForm(!showAddLinkForm)}
                  style={{ background: 'none', border: 'none', color: '#B98CFF', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="edit-links-list">
                {editForm.links.map((link) => (
                  <div key={link.id} className="edit-link-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <LinkIcon size={14} color="#B98CFF" />
                      <span style={{ fontWeight: 600, color: '#fff' }}>{link.title}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>({link.url})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(link.id)}
                      style={{ background: 'none', border: 'none', color: '#B83268', cursor: 'pointer' }}
                      title="Delete link"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {showAddLinkForm && (
                <div
                  style={{
                    background: 'rgba(15, 20, 38, 0.85)',
                    border: '1px solid rgba(185, 140, 255, 0.18)',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  <input
                    type="text"
                    className="edit-input-field"
                    placeholder="Title (e.g. Portfolio, Instagram)"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                  />
                  <input
                    type="url"
                    className="edit-input-field"
                    placeholder="URL (https://...)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-secondary-glass"
                      onClick={() => setShowAddLinkForm(false)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn-primary-gradient"
                      onClick={handleAddLink}
                      style={{ padding: '0.4rem 0.95rem', fontSize: '0.78rem' }}
                    >
                      Save Link
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section 8: Contact Information (stagger-8) */}
            <div className="edit-field-group stagger-item stagger-8">
              <div className="edit-field-label-row">
                <label className="edit-field-label">Contact Information</label>
                <div
                  className={`privacy-toggle-pill ${editForm.isContactPrivate ? 'private' : 'public'}`}
                  onClick={() => setEditForm((prev) => ({ ...prev, isContactPrivate: !prev.isContactPrivate }))}
                  title="Click to toggle Public / Private visibility"
                >
                  {editForm.isContactPrivate ? <Lock size={12} /> : <Globe size={12} />}
                  <span>{editForm.isContactPrivate ? 'Private' : 'Public'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="edit-input-field"
                    value={editForm.email}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="name@email.com"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>
                    Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    className="edit-input-field"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: editForm.isContactPrivate ? '#B98CFF' : 'var(--text-muted)' }}>
                {editForm.isContactPrivate
                  ? '🔒 Private: Only you can view your contact details.'
                  : '🌐 Public: Visible on your profile page.'}
              </span>
            </div>

            {/* Section 9: Additional Details (stagger-9) */}
            <div className="edit-field-group stagger-item stagger-9">
              <div className="edit-field-label-row">
                <label className="edit-field-label">Additional Details</label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    className="edit-input-field"
                    value={editForm.location}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'block' }}>
                    Resonance Frequency
                  </label>
                  <input
                    type="text"
                    className="edit-input-field"
                    defaultValue="432 Hz"
                    readOnly
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="edit-panel-footer">
            <button
              type="button"
              className="btn-secondary-glass"
              onClick={handleAttemptCloseEdit}
              style={{ minWidth: '95px' }}
              disabled={saveButtonState !== 'idle'}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn-primary-gradient ${saveButtonState === 'saved' ? 'btn-save-success-glow' : ''}`}
              onClick={handleSaveProfileChanges}
              style={{ minWidth: '135px' }}
              disabled={saveButtonState !== 'idle'}
            >
              {saveButtonState === 'saving' ? (
                <span>Saving...</span>
              ) : saveButtonState === 'saved' ? (
                <>
                  <Check size={16} />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>

          {/* Unsaved Changes Discard Confirmation Dialog */}
          {showDiscardConfirm && (
            <div className="discard-dialog-backdrop" onClick={() => setShowDiscardConfirm(false)}>
              <div className="discard-dialog-box" onClick={(e) => e.stopPropagation()}>
                <AlertCircle size={32} color="#B83268" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                  Discard changes?
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.45 }}>
                  You have unsaved edits in your profile. Are you sure you want to discard them?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn-secondary-glass"
                    onClick={() => setShowDiscardConfirm(false)}
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    Keep Editing
                  </button>
                  <button
                    type="button"
                    onClick={executeCloseEditModal}
                    style={{
                      padding: '0.5rem 1.15rem',
                      borderRadius: '9999px',
                      background: 'rgba(184, 50, 104, 0.22)',
                      border: '1px solid rgba(184, 50, 104, 0.55)',
                      color: '#F5F3F7',
                      fontWeight: 600,
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Elegant Sparkle Dissolve Particle Field following Panel Shape */}
        {isDissolving && (
          <div className="dissolve-sparkles-field" aria-hidden="true">
            {DISSOLVE_PARTICLES.map((p) => {
              const style = {
                top: p.top,
                left: p.left,
                '--tx': p.tx,
                '--ty': p.ty,
                '--p-color': p.color,
                animationDelay: p.delay
              };

              if (p.isStar) {
                return (
                  <div
                    key={p.id}
                    className="dissolve-sparkle-star"
                    style={{ ...style, width: `${p.size * 2}px`, height: `${p.size * 2}px` }}
                  >
                    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
                      <path
                        d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                        fill={p.color}
                      />
                    </svg>
                  </div>
                );
              }

              return (
                <div
                  key={p.id}
                  className="dissolve-sparkle-dot"
                  style={{
                    ...style,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    background: `radial-gradient(circle, ${p.color} 0%, rgba(255,255,255,0.85) 35%, transparent 75%)`,
                    boxShadow: `0 0 ${p.size * 1.5}px ${p.color}`
                  }}
                />
              );
            })}
          </div>
        )}
      </>
    )}

    {/* Thin Luminous Cosmic Energy Stream Traveling Across Profile Area */}
    {isEnergyStreaming && (
      <CosmicEnergyStream
        start={streamCoordinates.start}
        end={streamCoordinates.end}
        onComplete={handleStreamComplete}
      />
    )}
    </div>
  );
};

export default ProfileView;
