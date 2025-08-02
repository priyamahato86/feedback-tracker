import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, Trash2, User, Mail, MessageSquare, Calendar } from 'lucide-react';
import { Feedback } from '../types';
import { feedbackAPI } from '../services/api';

interface FeedbackListProps {
  feedback: Feedback[];
  onFeedbackUpdated: (updatedFeedback: Feedback) => void;
  onFeedbackDeleted: (id: string) => void;
}

export const FeedbackList: React.FC<FeedbackListProps> = ({ 
  feedback, 
  onFeedbackUpdated, 
  onFeedbackDeleted 
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getStatusIcon = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewed':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeColor = (type: Feedback['type']) => {
    switch (type) {
      case 'general':
        return 'bg-blue-500';
      case 'bug':
        return 'bg-red-500';
      case 'feature':
        return 'bg-green-500';
      case 'complaint':
        return 'bg-orange-500';
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: Feedback['status']) => {
    setUpdatingId(id);
    try {
      const response = await feedbackAPI.update(id, newStatus);
      onFeedbackUpdated(response.data);
    } catch (error) {
      console.error('Failed to update feedback:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await feedbackAPI.delete(id);
      onFeedbackDeleted(id);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (feedback.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedback yet</h3>
        <p className="text-gray-500">Feedback submissions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Feedback Management</h2>
        <span className="ml-auto bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {feedback.length} items
        </span>
      </div>

      <div className="space-y-4">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getTypeColor(item.type)}`} />
                <div>
                  <h3 className="font-semibold text-gray-800 capitalize">{item.type} Feedback</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {item.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  {item.status}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{item.message}</p>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              {['pending', 'reviewed', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(item.id, status as Feedback['status'])}
                  disabled={updatingId === item.id || item.status === status}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    item.status === status
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {updatingId === item.id ? (
                    <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    status
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};