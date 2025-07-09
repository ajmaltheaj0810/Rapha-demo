import React, { useState } from 'react';
import Navbar from '../components/dashboard/Navbar';
import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInputBox from '../components/chat/ChatInputBox';
import { Search } from 'lucide-react';

const PatientChat = () => {
  const [selectedPhysio, setSelectedPhysio] = useState('Dr. Afnan');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you feeling today?", isSent: false, timestamp: "9:00 AM" },
    { id: 2, text: "I'm doing better, thanks for asking!", isSent: true, timestamp: "9:05 AM" },
    { id: 3, text: "That's great to hear! How did the exercises go?", isSent: false, timestamp: "9:10 AM" },
    { id: 4, text: "They were challenging but I managed to complete them all", isSent: true, timestamp: "9:15 AM" },
    { id: 5, text: "Excellent work! Keep it up 💪", isSent: false, timestamp: "9:16 AM" }
  ]);

  const physiotherapists = [
    { name: 'Dr. Afnan', lastMessage: 'How are you feeling today?', time: '9:00 am', avatar: '👨‍⚕️' },
    { name: 'Dr. Sarah Johnson', lastMessage: 'Great progress on exercises', time: '8:30 am', avatar: '👩‍⚕️' },
    { name: 'Dr. Michael Chen', lastMessage: 'See you next session', time: '8:00 am', avatar: '👨‍⚕️' },
    { name: 'Dr. Emily Rodriguez', lastMessage: 'Keep up the good work', time: '7:45 am', avatar: '👩‍⚕️' },
    { name: 'Dr. James Wilson', lastMessage: 'Recovery looks promising', time: '7:30 am', avatar: '👨‍⚕️' }
  ];

  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: messages.length + 1,
      text: messageText,
      isSent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="h-[calc(100vh-80px)] flex">
        {/* Physiotherapist List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Chat</h2>
            <p className="text-sm text-gray-600 mb-4">Chat with your Physiotherapists</p>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {physiotherapists.map((physio) => (
              <button
                key={physio.name}
                onClick={() => setSelectedPhysio(physio.name)}
                className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                  selectedPhysio === physio.name ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {physio.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{physio.name}</h4>
                      <span className="text-xs text-gray-500">{physio.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{physio.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatHeader userName={selectedPhysio} isOnline={true} />
          
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message.text}
                isSent={message.isSent}
                timestamp={message.timestamp}
              />
            ))}
          </div>
          
          <ChatInputBox onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default PatientChat;