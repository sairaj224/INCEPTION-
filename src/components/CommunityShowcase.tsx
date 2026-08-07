import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { Heart, MessageSquare, ShieldCheck, Plus, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { validateAndProcessFileUpload } from '../lib/fileUpload';
import { ImageChangeModal } from './ImageChangeModal';

interface CommunityShowcaseProps {
  posts: CommunityPost[];
  onLikePost: (postId: string) => void;
  onAddPost: (newPost: CommunityPost) => void;
  onUpdatePostPhoto?: (postId: string, newPhotoUrl: string) => void;
}

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({
  posts,
  onLikePost,
  onAddPost,
  onUpdatePostPhoto,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newBudget, setNewBudget] = useState<number>(650);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');

  // Change Photo Modal Target State
  const [targetPost, setTargetPost] = useState<CommunityPost | null>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const post: CommunityPost = {
      id: 'post-' + Date.now(),
      projectId: 'proj-smoke-detector',
      studentName: 'Student Developer',
      studentCollege: 'IIT Bombay - Engineering Student',
      studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      title: newTitle,
      description: newDesc,
      budgetSpent: newBudget,
      timeTaken: '2 hours',
      photoUrl: newPhotoUrl,
      likes: 1,
      commentsCount: 0,
      verifiedBuilt: true,
      postedAt: 'Just now',
    };

    onAddPost(post);
    setShowModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Community Projects Showcase</h2>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
              Verified Builders
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real hardware builds created by engineering students across India. Share your photo & get store credits!
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload My Project Build</span>
        </button>
      </div>

      {/* Grid of Student Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4 text-slate-800"
          >
            {/* Header User info */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.studentAvatar}
                  alt={post.studentName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center space-x-1">
                    <span>{post.studentName}</span>
                    {post.verifiedBuilt && (
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" title="Built with Inception Verified" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">{post.studentCollege}</div>
                </div>
              </div>

              <span className="text-[11px] text-slate-400">{post.postedAt}</span>
            </div>

            {/* Photo */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden group/post">
              <img
                src={post.photoUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-[11px] font-bold">
                <span className="px-2 py-0.5 bg-slate-900/80 text-emerald-400 border border-slate-700 rounded">
                  Spent: ₹{post.budgetSpent}
                </span>
                <span className="px-2 py-0.5 bg-slate-900/80 text-slate-300 border border-slate-700 rounded">
                  {post.timeTaken}
                </span>
              </div>

              {onUpdatePostPhoto && (
                <button
                  type="button"
                  onClick={() => setTargetPost(post)}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-[10px] rounded-lg backdrop-blur-md border border-slate-700/80 flex items-center space-x-1 transition-all"
                  title="Change Post Photo"
                >
                  <ImageIcon className="w-3 h-3 text-blue-400" />
                  <span>Change Photo</span>
                </button>
              )}
            </div>

            {/* Title & Desc */}
            <div className="px-4 space-y-1.5 flex-1">
              <h3 className="font-bold text-slate-900 text-sm">{post.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{post.description}</p>
            </div>

            {/* Footer Likes & Comments */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => onLikePost(post.id)}
                className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors font-medium"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                <span>{post.likes} Likes</span>
              </button>

              <div className="flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{post.commentsCount} Peer Comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <form onSubmit={handlePostSubmit} className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xl text-slate-800">
            <h3 className="text-lg font-bold text-slate-900">Share Your Hardware Build</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., My Smart IoT Plant System"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Description & Tips for Peers</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="How did you build it? What issues did you resolve?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Actual Amount Spent (₹)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Project Build Photo</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const dataUrl = await validateAndProcessFileUpload(file);
                            setNewPhotoUrl(dataUrl);
                          } catch (err: any) {
                            alert(err.message || 'Image processing failed');
                          }
                        }
                      }}
                      className="text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                  </div>
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Or enter Image URL"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-800 placeholder-slate-400 font-mono"
                  />
                  {newPhotoUrl && (
                    <div className="relative h-24 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={newPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                <span>Publish to Showcase</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Change Modal for Post Card Photo */}
      {targetPost && onUpdatePostPhoto && (
        <ImageChangeModal
          isOpen={!!targetPost}
          onClose={() => setTargetPost(null)}
          title={`Change Photo for "${targetPost.title}"`}
          currentImageUrl={targetPost.photoUrl}
          onSaveImage={(newUrl) => {
            onUpdatePostPhoto(targetPost.id, newUrl);
            setTargetPost(null);
          }}
        />
      )}
    </div>
  );
};
