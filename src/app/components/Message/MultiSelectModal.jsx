import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, Image as ImageIcon, Send, File, Plus } from 'lucide-react';

import UserAvatar from '../UserAvatar';

const MultiSelectModal = ({
  selectedImages = [],
  selectedFiles = [],
  onImageSelect,
  onFileSelect,
  onRemoveImage,
  onRemoveFile,
  onSend,
  message = "",
  onSendMessage,
  isOpen = false,
  onClose,
  activeUser,
}) => {

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [previewItem, setPreviewItem] = useState(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    const filtered = files.filter(f => validTypes.includes(f.type) && f.size <= maxSize);
    onImageSelect && onImageSelect(filtered);
    imageInputRef.current.value = null;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024;
    const filtered = files.filter(f => f.size <= maxSize);
    onFileSelect && onFileSelect(filtered);
    fileInputRef.current.value = null;
  };

  const lastTime = new Date(activeUser.lastMessageTime || activeUser.last_message_at);
  const now = new Date();
  const isToday = lastTime.toDateString() === now.toDateString();
  const formattedTime = isToday
    ? lastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    : lastTime.toLocaleDateString([], { month: "short", day: "numeric" });

  useEffect(() => {
    if ((selectedImages.length + selectedFiles.length) === 0) {
      setPreviewItem(null);
      return;
    }
    if (!previewItem || (previewItem.index >= (previewItem.type === 'image' ? selectedImages.length : selectedFiles.length))) {
      setPreviewItem(selectedImages.length > 0 ? { type: 'image', index: 0 } : { type: 'file', index: 0 });
    }
  }, [selectedImages, selectedFiles]);

  const canSend = !!message.trim() || selectedImages.length > 0 || selectedFiles.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              {activeUser.profileImage ? (
                <Image
                  loader={() => activeUser.profileImage}
                  src={activeUser.profileImage}
                  alt="User Profile"
                  width={70}
                  height={70}
                  className="w-9 h-9 rounded-full"
                />
              ) : (
                <UserAvatar name={activeUser.name || "Unknown"} width="w-9" height="h-9" />
              )}
              {activeUser.channel?.image && (
                <Image
                  loader={() => activeUser.channel?.image}
                  src={activeUser.channel?.image}
                  alt={`${activeUser.channel?.name} Icon`}
                  className="absolute -bottom-1 -right-1 rounded-full bg-white p-[3.5px]"
                  width={18}
                  height={18}
                />
              )}
            </div>
            <div className="flex flex-col justify-center gap-2 bottom-1">
              <div className="text-black">{activeUser.name || "Unknown User"}</div>
              <div className="title-4">Last Active {formattedTime}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-3 text-center">
            {selectedImages.length > 0 || selectedFiles.length > 0
              ? `${selectedImages.length + selectedFiles.length} file(s) selected: ${selectedFiles[0]?.name || selectedImages[0]?.name}`
              : ''
            }
          </p>
          <div className="mb-4">
            {previewItem ? (
              <div className="relative rounded-2xl overflow-hidden h-64 w-full flex items-center justify-center bg-gray-100">
                {previewItem.type === 'image' ? (
                  <img
                    src={URL.createObjectURL(selectedImages[previewItem.index])}
                    alt="Selected"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <File className="w-16 h-16 text-gray-400 mb-2" />
                    <span className="text-gray-600 text-sm">
                      {selectedFiles[previewItem.index]?.name || 'File Selected'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-12 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {selectedImages.length + selectedFiles.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image and File preview thumbnails */}
          {(selectedImages.length > 0 || selectedFiles.length > 0) && (
            <div className="flex gap-2 mt-4 mb-4 flex-wrap">
              {selectedImages.map((img, idx) => (
                <div
                  key={`img-${idx}`}
                  className="relative w-12 h-12 rounded bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() => setPreviewItem({ type: 'image', index: idx })}
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-10 h-10 object-cover rounded"
                  />
                  <button
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-md w-5 h-5 flex items-center justify-center hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage && onRemoveImage(idx);
                      if (previewItem?.type === 'image' && previewItem.index === idx) {
                        setPreviewItem(null);
                      }
                    }}
                  >
                    <X size={12} className="text-red-500" />
                  </button>
                </div>
              ))}

              {selectedFiles.map((file, idx) => (
                <div
                  key={`file-${idx}`}
                  className="relative w-12 h-12 rounded bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() => setPreviewItem({ type: 'file', index: idx })}
                >
                  <div className="w-10 h-10 bg-[#3EBF0F] rounded flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {file.name.split('.').pop()?.toUpperCase().slice(0, 3) || 'FILE'}
                    </span>
                  </div>
                  <button
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow-md w-5 h-5 flex items-center justify-center hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile && onRemoveFile(idx);
                      if (previewItem?.type === 'file' && previewItem.index === idx) {
                        setPreviewItem(null);
                      }
                    }}
                  >
                    <X size={12} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => onSendMessage && onSendMessage(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EBF0F] focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.zip"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />

              <button
                onClick={() => imageInputRef.current?.click()}
                className="relative w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#3EBF0F] hover:bg-[#3EBF0F1A]"
              >
                <ImageIcon size={20} className="text-gray-400" />
                <div className="absolute -top-1 -right-1 bg-white rounded-full shadow w-4 h-4 flex items-center justify-center">
                  <Plus size={10} style={{ color: '#3EBF0F' }} />
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#3EBF0F] hover:bg-[#3EBF0F1A]"
              >
                <File size={20} className="text-gray-400" />
                <div className="absolute -top-1 -right-1 bg-white rounded-full shadow w-4 h-4 flex items-center justify-center">
                  <Plus size={10} style={{ color: '#3EBF0F' }} />
                </div>
              </button>
            </div>

            {/* Send button */}
            <button
              onClick={canSend ? onSend : undefined}
              disabled={!canSend}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 
                ${canSend ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
              style={{ backgroundColor: '#3EBF0F' }}
            >
              <Send size={20} className="text-white ml-0.5" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export { MultiSelectModal };
