import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ThumbsUp, Share2, Send, Users, TrendingUp, Star, MapPin, Calendar } from 'lucide-react';

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
  tags: string[];
  timestamp: string;
  liked: boolean;
}

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 'p1',
    author: 'Julian Vane',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
    role: 'Gold Archivist',
    title: 'Best study spots on campus this semester?',
    content: 'Looking for quiet places with good wifi to study for finals. The library gets packed after 3pm. Anyone know hidden gems?',
    likes: 24,
    replies: 12,
    tags: ['Campus Life', 'Study Tips'],
    timestamp: '2 hours ago',
    liked: false,
  },
  {
    id: 'p2',
    author: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    role: 'Silver Archivist',
    title: 'Selling my Physics textbook set — barely used',
    content: 'I have the complete Halliday & Resnick set from last semester. Barely touched, minimal highlighting. Check my listing on the Exchange!',
    likes: 18,
    replies: 7,
    tags: ['For Sale', 'Books'],
    timestamp: '5 hours ago',
    liked: false,
  },
  {
    id: 'p3',
    author: 'Rahul Menon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    role: 'Bronze Archivist',
    title: 'Lab equipment sharing group — anyone interested?',
    content: 'Thinking of starting a shared pool for expensive lab gear that we only need occasionally. Could save everyone a lot of money. Who is in?',
    likes: 42,
    replies: 23,
    tags: ['Lab Gear', 'Collaboration'],
    timestamp: '1 day ago',
    liked: false,
  },
  {
    id: 'p4',
    author: 'Ananya Desai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    role: 'Gold Archivist',
    title: 'RetCom Loyalty Program — hidden perks you might not know',
    content: 'Did you know that Platinum tier archivists get early access to new listings 30 minutes before everyone else? Here are more tips to level up fast...',
    likes: 67,
    replies: 31,
    tags: ['Tips', 'Loyalty'],
    timestamp: '2 days ago',
    liked: false,
  },
  {
    id: 'p5',
    author: 'Karthik Nair',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    role: 'Silver Archivist',
    title: 'Vintage camera collectors — monthly meetup this Friday',
    content: 'Our vintage camera club is having its monthly meetup this Friday at the Student Center, Room 204 at 5pm. Bring your best finds! New members welcome.',
    likes: 29,
    replies: 15,
    tags: ['Events', 'Electronics'],
    timestamp: '3 days ago',
    liked: false,
  },
];

const TRENDING_TAGS = ['Campus Life', 'For Sale', 'Lab Gear', 'Books', 'Electronics', 'Events', 'Tips', 'Collaboration'];

const LEADERBOARD = [
  { name: 'Ananya Desai', points: 2450, tier: 'Platinum' },
  { name: 'Rahul Menon', points: 1890, tier: 'Gold' },
  { name: 'Julian Vane', points: 1240, tier: 'Gold' },
  { name: 'Priya Sharma', points: 780, tier: 'Silver' },
  { name: 'Karthik Nair', points: 620, tier: 'Silver' },
];

export default function Community() {
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_POSTS);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = selectedTag
    ? posts.filter(p => p.tags.includes(selectedTag))
    : posts;

  const handleLike = (postId: string) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleNewPost = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      addToast('Please fill in both title and content', 'warning');
      return;
    }
    const post: ForumPost = {
      id: `p${Date.now()}`,
      author: user?.name || 'Anonymous',
      avatar: user?.avatar || '',
      role: user?.loyaltyTier || 'Member',
      title: newPostTitle,
      content: newPostContent,
      likes: 0,
      replies: 0,
      tags: ['General'],
      timestamp: 'Just now',
      liked: false,
    };
    setPosts(prev => [post, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);
    addToast('Post published to the community', 'success');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display italic text-4xl lg:text-5xl text-[#F0E8D8] mb-2">Community</h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#6B6358] mb-1">THE ARCHIVIST FORUM</p>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-8" />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main feed */}
          <div className="xl:col-span-8">
            {/* New post button */}
            <div className="mb-6">
              {!showNewPost ? (
                <button onClick={() => {
                  if (!isAuthenticated) { navigate('/login'); return; }
                  setShowNewPost(true);
                }}
                  className="w-full bg-[#111116] border border-[#2A2A36] rounded-lg p-4 text-left text-sm text-[#6B6358] hover:border-[#D4A843]/30 transition-colors flex items-center gap-3">
                  <div className="size-8 rounded-full bg-[#2A2A36] flex items-center justify-center">
                    <Send className="size-4 text-[#D4A843]" />
                  </div>
                  Share something with the community...
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5">
                  <input
                    value={newPostTitle}
                    onChange={e => setNewPostTitle(e.target.value)}
                    placeholder="Post title..."
                    className="w-full bg-transparent text-lg font-display text-[#F0E8D8] placeholder-[#6B6358] outline-none mb-3"
                  />
                  <textarea
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={3}
                    className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none focus:border-[#D4A843] transition-colors resize-none mb-3"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setShowNewPost(false)}
                      className="px-4 py-2 text-xs font-mono text-[#6B6358] hover:text-[#A09888] transition-colors">
                      CANCEL
                    </button>
                    <button onClick={handleNewPost}
                      className="px-5 py-2 text-xs font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors">
                      PUBLISH
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tag filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider border rounded-sm transition-all ${!selectedTag ? 'bg-[#D4A843]/20 border-[#D4A843] text-[#D4A843]' : 'border-[#2A2A36] text-[#6B6358] hover:border-[#A09888]'}`}>
                ALL
              </button>
              {TRENDING_TAGS.map(tag => (
                <button key={tag} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider border rounded-sm transition-all ${selectedTag === tag ? 'bg-[#D4A843]/20 border-[#D4A843] text-[#D4A843]' : 'border-[#2A2A36] text-[#6B6358] hover:border-[#A09888]'}`}>
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post, idx) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5 hover:border-[#D4A843]/20 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <img src={post.avatar} alt={post.author} className="size-10 rounded-full object-cover border border-[#2A2A36]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#F0E8D8]">{post.author}</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono bg-[#D4A843]/15 text-[#D4A843] rounded">{post.role}</span>
                      </div>
                      <p className="text-[10px] text-[#6B6358] font-mono mt-0.5">{post.timestamp}</p>
                    </div>
                  </div>
                  <h3 className="font-display text-lg text-[#F0E8D8] mb-2">{post.title}</h3>
                  <p className="text-sm text-[#A09888] leading-relaxed mb-3">{post.content}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map(tag => (
                      <button key={tag} onClick={() => setSelectedTag(tag)}
                        className="px-2 py-0.5 text-[10px] font-mono text-[#6B6358] bg-[#1A1A22] rounded hover:text-[#D4A843] transition-colors">
                        #{tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-3 border-t border-[#1E1E2A]">
                    <button onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${post.liked ? 'text-[#D4A843]' : 'text-[#6B6358] hover:text-[#D4A843]'}`}>
                      <ThumbsUp className={`size-3.5 ${post.liked ? 'fill-[#D4A843]' : ''}`} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-[#6B6358] hover:text-[#D4A843] transition-colors">
                      <MessageCircle className="size-3.5" />
                      {post.replies} Replies
                    </button>
                    <button onClick={() => {
                      navigator.clipboard.writeText(`RetCom Community: ${post.title}`);
                      addToast('Link copied to clipboard', 'info');
                    }}
                      className="flex items-center gap-1.5 text-xs text-[#6B6358] hover:text-[#D4A843] transition-colors ml-auto">
                      <Share2 className="size-3.5" />
                      Share
                    </button>
                  </div>
                </motion.div>
              ))}
              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-display italic text-xl text-[#6B6358]">No posts found</p>
                  <p className="text-xs text-[#6B6358] mt-2">Try selecting a different tag</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            {/* Community Stats */}
            <div className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5">
              <h3 className="text-xs font-mono tracking-wider text-[#A09888] mb-4 flex items-center gap-2">
                <Users className="size-4 text-[#D4A843]" /> COMMUNITY STATS
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0B0B0F] rounded p-3 text-center">
                  <p className="text-2xl font-display font-bold text-[#D4A843]">1,247</p>
                  <p className="text-[10px] font-mono text-[#6B6358]">MEMBERS</p>
                </div>
                <div className="bg-[#0B0B0F] rounded p-3 text-center">
                  <p className="text-2xl font-display font-bold text-[#F0E8D8]">342</p>
                  <p className="text-[10px] font-mono text-[#6B6358]">ACTIVE TODAY</p>
                </div>
                <div className="bg-[#0B0B0F] rounded p-3 text-center">
                  <p className="text-2xl font-display font-bold text-[#F0E8D8]">89</p>
                  <p className="text-[10px] font-mono text-[#6B6358]">POSTS TODAY</p>
                </div>
                <div className="bg-[#0B0B0F] rounded p-3 text-center">
                  <p className="text-2xl font-display font-bold text-[#F0E8D8]">456</p>
                  <p className="text-[10px] font-mono text-[#6B6358]">TOTAL POSTS</p>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5">
              <h3 className="text-xs font-mono tracking-wider text-[#A09888] mb-4 flex items-center gap-2">
                <TrendingUp className="size-4 text-[#D4A843]" /> TRENDING TOPICS
              </h3>
              <div className="space-y-2">
                {TRENDING_TAGS.slice(0, 5).map((tag, i) => (
                  <button key={tag} onClick={() => setSelectedTag(tag)}
                    className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#6B6358]">{i + 1}</span>
                      <span className="text-sm text-[#A09888] group-hover:text-[#F0E8D8] transition-colors">#{tag}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B6358]">{Math.floor(Math.random() * 50 + 10)} posts</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5">
              <h3 className="text-xs font-mono tracking-wider text-[#A09888] mb-4 flex items-center gap-2">
                <Star className="size-4 text-[#D4A843]" /> TOP ARCHIVISTS
              </h3>
              <div className="space-y-3">
                {LEADERBOARD.map((lb, i) => (
                  <div key={lb.name} className="flex items-center gap-3">
                    <span className={`text-sm font-mono font-bold ${i === 0 ? 'text-[#D4A843]' : i === 1 ? 'text-[#C0C0C0]' : i === 2 ? 'text-[#CD7F32]' : 'text-[#6B6358]'}`}>
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#F0E8D8] truncate">{lb.name}</p>
                      <p className="text-[10px] font-mono text-[#6B6358]">{lb.tier} · {lb.points.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5">
              <h3 className="text-xs font-mono tracking-wider text-[#A09888] mb-4 flex items-center gap-2">
                <Calendar className="size-4 text-[#D4A843]" /> UPCOMING EVENTS
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Vintage Camera Meetup', date: 'Apr 11, 5:00 PM', location: 'Student Center, Rm 204' },
                  { name: 'RetCom Swap Meet', date: 'Apr 15, 10:00 AM', location: 'Main Quad' },
                  { name: 'Lab Gear Fair', date: 'Apr 20, 2:00 PM', location: 'Science Building Lobby' },
                ].map(event => (
                  <div key={event.name} className="bg-[#0B0B0F] rounded p-3">
                    <p className="text-sm text-[#F0E8D8] font-medium">{event.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="size-3 text-[#D4A843]" />
                      <span className="text-[10px] font-mono text-[#6B6358]">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 text-[#6B6358]" />
                      <span className="text-[10px] font-mono text-[#6B6358]">{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
