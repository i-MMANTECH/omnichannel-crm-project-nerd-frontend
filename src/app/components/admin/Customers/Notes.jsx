import React, { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';
import Image from 'next/image';
import { useError } from '@/context/ErrorContext';
import { useApi } from '@/services/axiosConfig';
import { formatDateTime } from '@/utils/timeUtils';


const Notes = ({customerId}) => {
  const [comments, setComments] = useState([]);
  const { axiosInstance } = useApi();
  const { handleApiError } = useError();
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      await axiosInstance.post(`/comments/`, {
        model: "customer", 
        object_id: customerId, 
        content: newComment,
      });
  
      fetchComments()
      setNewComment("");
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/?model=customer&object_id=${customerId}`);
      setComments(response.data.comments);
    } catch (error) {
      handleApiError(error);
    }
  };

  const getAssigneeName = (assignee) => {
    if (assignee?.username) return assignee?.username;
    if (assignee?.name) return assignee?.name;
    if (assignee?.first_name && assignee?.last_name) {
      return `${assignee.first_name} ${assignee.last_name}`;
    }
    return assignee?.email || "--";
  };

  return (
    <div className="space-y-4 ">
      <div className="mb-7 flex flex-col gap-2 items-end">
        <textarea
          placeholder="Add a comment..."
          className="w-full border rounded-lg p-2 text-sm body-theme"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addComment();
            }
          }}
        />
        <button 
        onClick={addComment}
        className="primary-bg w-fit mt-2 px-4 py-2  text-white rounded-md">
          Save Note
        </button>
      </div>
      {comments.map((comment, index) => {
        const user = comment?.created_by
        const userName = getAssigneeName(user);
        return (
          <div key={index} className="flex p-3 items-start gap-3 self-stretch rounded-lg border border-[#DFE1E6] body-theme shadow-md">
            {user?.image ? (
              <Image
                alt="profile pic"
                width={32}
                height={32}
                className="rounded-full"
                src={user.image}
              />
            ) : (
              <UserAvatar 
                name={userName} 
                width="w-8" 
                height="h-8" 
              />
            )}
            
            <div className="flex-1">
              {comment.content}
            </div>
            <div className="flex-shrink-0 ">
              {formatDateTime(comment.created_at)}
            </div>
          </div>
          )
        })}
    </div>
  );
};

export default Notes;
