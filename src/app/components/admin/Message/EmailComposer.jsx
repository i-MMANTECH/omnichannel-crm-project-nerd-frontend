import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Undo2,
  Redo2,
  Send
} from 'lucide-react';

const EmailComposer = ({ onSendMessage, selectedChannel }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const ToolbarButton = ({ onClick, isActive = false, disabled = false, title, children }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'text-white'
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
      style={{
        backgroundColor: isActive ? '#3EBF0F' : 'transparent'
      }}
    >
      {children}
    </button>
  );

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleSend = () => {
    if (!subject.trim() && !message.trim() && selectedImages.length === 0 && selectedFiles.length === 0) {
      return;
    }

    const messagePayload = {
      subject: subject.trim(),
      text: message.trim(),
      channel_id: selectedChannel?.value,
      file: selectedFiles.length > 0 ? selectedFiles : null,
      image: selectedImages.length > 0 ? selectedImages : null,
    //   type: 'email'
    };

    onSendMessage(messagePayload);
    setSubject('');
    setMessage('');
    setSelectedImages([]);
    setSelectedFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        setSelectedImages(prev => [...prev, file]);
      } else {
        setSelectedFiles(prev => [...prev, file]);
      }
    });
  };

  const removeFile = (type, index) => {
    if (type === 'image') {
      setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
    } else {
      setSelectedFiles(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const getCharacterCount = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = message;
    return tempDiv.textContent?.length || 0;
  };

  return (
    <div className="bg-white  border-gray-200 rounded">
      {/* Subject */}
      <div className="px-4 py-3 border-gray-200">
        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full text-base text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent"
        />
      </div>

      <div className="pr-4 py-3 ">
        <div className="flex items-center ">
          {/* Attachment Icon */}
          <div className="attach-icon bg-white rounded-full " onClick={() => fileInputRef.current?.click()}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M17 7.75C11.8914 7.75 7.75 11.8914 7.75 17C7.75 22.1086 11.8914 26.25 17 26.25C22.1086 26.25 26.25 22.1086 26.25 17C26.25 11.8914 22.1086 7.75 17 7.75ZM6.25 17C6.25 11.0629 11.0629 6.25 17 6.25C22.9371 6.25 27.75 11.0629 27.75 17C27.75 22.9371 22.9371 27.75 17 27.75C11.0629 27.75 6.25 22.9371 6.25 17ZM14.6514 12.628C16.5129 10.7783 19.5165 10.7758 21.3704 12.6297L21.372 12.6314C23.2217 14.4929 23.2242 17.4965 21.3704 19.3503L19.1503 21.5703C18.0774 22.6432 16.3325 22.6432 15.2596 21.5703C14.1867 20.4974 14.1867 18.7525 15.2596 17.6796L16.6697 16.2696C16.9626 15.9767 17.4375 15.9768 17.7303 16.2697C18.0232 16.5625 18.0232 17.0374 17.7303 17.3303L16.3203 18.7403C15.8332 19.2274 15.8332 20.0226 16.3203 20.5097C16.8074 20.9968 17.6026 20.9968 18.0897 20.5097L20.3097 18.2897C21.5756 17.0238 21.5783 14.9679 20.3088 13.6895C19.0428 12.4244 16.9876 12.422 15.7094 13.6912L13.2903 16.1103C12.2432 17.1574 12.2432 18.8525 13.2903 19.8996C13.5832 20.1925 13.5832 20.6674 13.2903 20.9603C12.9974 21.2532 12.5226 21.2532 12.2297 20.9603C10.5968 19.3274 10.5968 16.6825 12.2297 15.0496L14.6514 12.628Z" fill="#0D0D12" />
            </svg>
          </div>

          <div className="flex-1 relative">
            {message === '' && (
              <div
                className="absolute top-3 left-3 text-gray-400 pointer-events-none text-sm"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: '1.4',
                }}
              >
                Write message here...
              </div>
            )}

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setMessage(e.target.innerHTML)}
              onKeyDown={handleKeyDown}
              className="min-h-[85px] max-h-[300px] overflow-y-auto p-3 rounded-lg text-sm"
              style={{
                fontSize: '14px',
                lineHeight: '1.4',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                outline: 'none',
                boxShadow: '0 0 0 2px transparent',
                transition: 'box-shadow 0.2s ease-in-out'
              }}
              onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #3EBF0F')}
              onBlur={(e) => (e.target.style.boxShadow = 'none')}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!subject.trim() && !message.trim() && selectedImages.length === 0 && selectedFiles.length === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              (subject.trim() || message.trim() || selectedImages.length > 0 || selectedFiles.length > 0)
                ? 'text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={{
              backgroundColor:
                subject.trim() || message.trim() || selectedImages.length > 0 || selectedFiles.length > 0
                  ? '#3EBF0F'
                  : undefined
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-1">
            <ToolbarButton onClick={() => formatText('undo')} title="Undo"><Undo2 size={14} /></ToolbarButton>
            <ToolbarButton onClick={() => formatText('redo')} title="Redo"><Redo2 size={14} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <select
              onChange={(e) => formatText('fontName', e.target.value)}
              className="text-sm border-none bg-transparent text-gray-600 focus:outline-none hover:bg-gray-200 rounded px-2 py-1"
              title="Font Family"
            >
              <option value="Arial">Epilogue</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times</option>
              <option value="Georgia">Georgia</option>
            </select>
            <select
              onChange={(e) => formatText('fontSize', e.target.value)}
              className="text-sm border-none bg-transparent text-gray-600 focus:outline-none hover:bg-gray-200 rounded px-2 py-1"
              title="Font Size"
            >
              <option value="3">24</option>
              <option value="2">16</option>
              <option value="4">18</option>
              <option value="5">24</option>
            </select>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <ToolbarButton onClick={() => formatText('bold')} title="Bold"><Bold size={14} /></ToolbarButton>
            <ToolbarButton onClick={() => formatText('italic')} title="Italic"><Italic size={14} /></ToolbarButton>
            <ToolbarButton onClick={() => formatText('underline')} title="Underline"><Underline size={14} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <ToolbarButton onClick={() => formatText('justifyLeft')} title="Align Left"><AlignLeft size={14} /></ToolbarButton>
            <ToolbarButton onClick={() => formatText('justifyCenter')} title="Align Center"><AlignCenter size={14} /></ToolbarButton>
            <ToolbarButton onClick={() => formatText('justifyRight')} title="Align Right"><AlignRight size={14} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <ToolbarButton onClick={() => formatText('insertUnorderedList')} title="Bullet List"><List size={14} /></ToolbarButton>
          </div>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        style={{ display: 'none' }}
      />
      
      {(selectedImages.length > 0 || selectedFiles.length > 0) && (
        <div className="mx-4 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h4>
          <div className="space-y-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                <span className="text-sm text-gray-600">🖼️ {image.name}</span>
                <button onClick={() => removeFile('image', index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
            ))}
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                <span className="text-sm text-gray-600">📄 {file.name}</span>
                <button onClick={() => removeFile('file', index)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailComposer;
