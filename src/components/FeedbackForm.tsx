import React, { useState } from 'react';
import { Send, User, Mail, MessageSquare, Tag } from 'lucide-react';
import { feedbackAPI } from '../services/api';
import { Feedback } from '../types';

interface FeedbackFormProps {
  onFeedbackSubmitted: (feedback: Feedback) => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onFeedbackSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'general' as Feedback['type']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await feedbackAPI.create(formData);
      onFeedbackSubmitted(response.data);
      setFormData({ name: '', email: '', message: '', type: 'general' });
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: 'general', label: 'General Feedback', color: 'bg-blue-500' },
    { value: 'bug', label: 'Bug Report', color: 'bg-red-500' },
    { value: 'feature', label: 'Feature Request', color: 'bg-green-500' },
    { value: 'complaint', label: 'Complaint', color: 'bg-orange-500' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Submit Feedback</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4" />
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="w-4 h-4" />
            Feedback Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {typeOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.type === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={formData.type === option.value}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Feedback['type'] })}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${option.color}`} />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MessageSquare className="w-4 h-4" />
            Message
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Please describe your feedback in detail..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
};