import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Database, Zap } from 'lucide-react';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { AIChat } from './components/AIChat';
import { Feedback } from './types';
import { feedbackAPI } from './services/api';

function App() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [activeTab, setActiveTab] = useState<'submit' | 'manage' | 'chat'>('submit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await feedbackAPI.getAll();
      setFeedback(response.data);
    } catch (err) {
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmitted = (newFeedback: Feedback) => {
    setFeedback(prev => [newFeedback, ...prev]);
    setActiveTab('manage');
  };

  const handleFeedbackUpdated = (updatedFeedback: Feedback) => {
    setFeedback(prev => 
      prev.map(item => 
        item.id === updatedFeedback.id ? updatedFeedback : item
      )
    );
  };

  const handleFeedbackDeleted = (id: string) => {
    setFeedback(prev => prev.filter(item => item.id !== id));
  };

  const tabs = [
    { id: 'submit' as const, label: 'Submit Feedback', icon: MessageSquare, color: 'from-blue-500 to-teal-500' },
    { id: 'manage' as const, label: 'Manage Feedback', icon: Database, color: 'from-purple-500 to-pink-500' },
    { id: 'chat' as const, label: 'AI Assistant', icon: Sparkles, color: 'from-green-500 to-emerald-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Feedback Tracker</h1>
                <p className="text-gray-600">AI-powered feedback management system</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {feedback.length > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{feedback.length}</div>
                  <div className="text-sm text-gray-500">Total Feedback</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'bg-white/60 text-gray-600 hover:bg-white/80 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {tab.id === 'manage' && feedback.length > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {feedback.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'submit' && (
              <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
            )}
            
            {activeTab === 'manage' && (
              <FeedbackList
                feedback={feedback}
                onFeedbackUpdated={handleFeedbackUpdated}
                onFeedbackDeleted={handleFeedbackDeleted}
              />
            )}
            
            {activeTab === 'chat' && <AIChat />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Feedback</span>
                  <span className="font-semibold text-gray-900">{feedback.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">
                    {feedback.filter(f => f.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reviewed</span>
                  <span className="font-semibold text-blue-600">
                    {feedback.filter(f => f.status === 'reviewed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolved</span>
                  <span className="font-semibold text-green-600">
                    {feedback.filter(f => f.status === 'resolved').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Submit & Track Feedback</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">Manage All Submissions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">AI-Powered Assistant</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;