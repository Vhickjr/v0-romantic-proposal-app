'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

const resetJokes = [
  'Reset? Please send Victor a mail first 😂',
  'Oops! Only Victor can reset. Try calling him maybe? 😜',
  'Resetting is a premium feature. Contact Victor! 😆',
  'No reset for you! Ask Victor nicely. 😁',
  "Reset? That's above your pay grade! 😂",
  'Try again after sending Victor a pizza! 🍕😂',
];

export default function VictorPortalPage() {
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [photos, setPhotos] = useState<BlobItem[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [joke, setJoke] = useState('');
  const [showJoke, setShowJoke] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = useCallback(async () => {
    setLoadingPhotos(true);
    try {
      const res = await fetch('/api/photos/list');
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } finally {
      setLoadingPhotos(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetch('/api/state')
      .then((r) => r.json())
      .then((data) => {
        if (data.accepted) {
          setAccepted(true);
          fetchPhotos();
        }
      })
      .catch(() => {});
  }, [fetchPhotos]);

  const handleFiles = (files: FileList | File[]) => {
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const newPreviews = images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0 || uploading) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      for (let i = 0; i < previews.length; i++) {
        const form = new FormData();
        form.append('file', previews[i].file);
        await fetch('/api/photos/upload', { method: 'POST', body: form });
        setUploadProgress(Math.round(((i + 1) / previews.length) * 100));
      }
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      await fetchPhotos();
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (url: string) => {
    setDeleting(url);
    try {
      await fetch('/api/photos/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      setPhotos((prev) => prev.filter((p) => p.url !== url));
    } finally {
      setDeleting(null);
    }
  };

  const handleReset = () => {
    const j = resetJokes[Math.floor(Math.random() * resetJokes.length)];
    setJoke(j);
    setShowJoke(true);
    setTimeout(() => setShowJoke(false), 2800);
  };

  const handleRealReset = async () => {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accepted: false, timestamp: null }),
    }).catch(() => {});
    window.location.href = '/';
  };

  if (!mounted) return null;

  if (!accepted) {
    return (
      <main className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center space-y-4 p-10 rounded-3xl border-2" style={{ borderColor: '#FFD6E0', background: 'rgba(255,240,245,0.7)' }}>
          <p className="text-5xl">🔒</p>
          <h1 className="font-syne text-2xl font-extrabold" style={{ color: '#4A1942' }}>Portal Locked</h1>
          <p className="font-inter text-sm" style={{ color: '#9C6080' }}>
            Joan needs to accept the proposal first!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-1 pt-4">
          <h1
            className="font-syne text-3xl md:text-4xl font-extrabold"
            style={{
              background: 'linear-gradient(90deg, #FF6B8A, #FFB347, #C084FC)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer-text 4s linear infinite',
            }}
          >
            Victor&apos;s Gallery 🌸
          </h1>
          <p className="font-inter text-sm" style={{ color: '#9C6080' }}>
            Photos you add here float around for Joan 💖
          </p>
        </div>

        {/* Upload card */}
        <div
          className="p-[2px] rounded-[2rem]"
          style={{
            background: 'linear-gradient(135deg, #FF6B8A, #FFD6E0, #FFB347, #FF9FAE)',
            backgroundSize: '300% 300%',
            animation: 'gradient-border 4s ease infinite',
            boxShadow: '0 16px 60px rgba(255,107,138,0.15)',
          }}
        >
          <div className="bg-white/92 backdrop-blur-xl rounded-[calc(2rem-2px)] p-6 space-y-5">
            <h2 className="font-syne font-bold text-base" style={{ color: '#4A1942' }}>
              Add Photos
            </h2>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 select-none"
              style={{
                borderColor: dragOver ? '#FF6B8A' : '#FFD6E0',
                background: dragOver ? 'rgba(255,107,138,0.06)' : 'rgba(255,240,245,0.4)',
                transform: dragOver ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <p className="text-4xl mb-2">📸</p>
              <p className="font-inter text-sm font-medium" style={{ color: '#9C6080' }}>
                Drag &amp; drop photos here
              </p>
              <p className="font-inter text-xs mt-1" style={{ color: '#C084A0' }}>
                or click to select
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {/* Selected previews */}
            <AnimatePresence>
              {previews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {previews.map((p, i) => (
                      <motion.div
                        key={p.url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square rounded-xl overflow-hidden group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: '#FF4D6D' }}
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  {uploading && (
                    <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: '#FFE4EC' }}>
                      <motion.div
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #FF6B8A, #FFB347)' }}
                      />
                    </div>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full py-3.5 rounded-full font-syne font-bold text-white text-sm transition-all disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #FF6B8A, #FFB347)',
                      boxShadow: '0 6px 24px rgba(255,107,138,0.4)',
                    }}
                  >
                    {uploading
                      ? `Uploading… ${uploadProgress}%`
                      : `Upload ${previews.length} photo${previews.length !== 1 ? 's' : ''} 🌸`}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Photos grid card */}
        <div
          className="p-[2px] rounded-[2rem]"
          style={{
            background: 'linear-gradient(135deg, #DDD6FE, #FFD6E0, #FFB347)',
            backgroundSize: '300% 300%',
            animation: 'gradient-border 6s ease infinite',
            boxShadow: '0 16px 60px rgba(192,132,252,0.12)',
          }}
        >
          <div className="bg-white/92 backdrop-blur-xl rounded-[calc(2rem-2px)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-bold text-base" style={{ color: '#4A1942' }}>
                Floating Memories
              </h2>
              <span
                className="font-inter text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: '#FFE4EC', color: '#FF6B8A' }}
              >
                {photos.length} photo{photos.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loadingPhotos ? (
              <div className="py-10 text-center">
                <motion.p
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-inter text-sm"
                  style={{ color: '#C084A0' }}
                >
                  Loading photos…
                </motion.p>
              </div>
            ) : photos.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-3xl">🍓</p>
                <p className="font-inter text-sm" style={{ color: '#C084A0' }}>
                  No photos yet — add some above!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <AnimatePresence>
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.url}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      transition={{ duration: 0.2 }}
                      className="relative aspect-square rounded-2xl overflow-hidden group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt="Memory"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200" style={{ background: 'rgba(0,0,0,0.25)' }}>
                        <button
                          onClick={() => handleDelete(photo.url)}
                          disabled={deleting === photo.url}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-110"
                          style={{ background: 'rgba(255,255,255,0.92)' }}
                        >
                          {deleting === photo.url ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Danger zone */}
        <div
          className="rounded-3xl p-6 text-center space-y-4 border-2"
          style={{ borderColor: '#FFD6E0', background: 'rgba(255,240,245,0.4)' }}
        >
          <p className="font-syne font-bold text-sm" style={{ color: '#4A1942' }}>
            Danger Zone
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full font-inter text-sm font-medium border-2 transition-all"
              style={{ borderColor: '#FFD6E0', color: '#9C6080', background: 'transparent' }}
            >
              Reset (joke) 😂
            </button>
            <button
              onClick={handleRealReset}
              className="px-6 py-2.5 rounded-full font-inter text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #FF6B8A, #FF4D6D)', boxShadow: '0 4px 16px rgba(255,77,109,0.35)' }}
            >
              Actually Reset Portal 🔄
            </button>
          </div>
        </div>

      </div>

      {/* Joke popup */}
      <AnimatePresence>
        {showJoke && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="rounded-3xl px-8 py-12 text-2xl md:text-3xl font-extrabold text-center max-w-xl mx-4 font-syne text-white"
              style={{
                background: 'linear-gradient(135deg, rgba(255,107,138,0.97), rgba(255,179,71,0.97))',
                border: '3px solid rgba(255,255,255,0.5)',
                boxShadow: '0 24px 80px rgba(255,107,138,0.5)',
              }}
            >
              {joke}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
