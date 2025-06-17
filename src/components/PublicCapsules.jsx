import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const PublicCapsules = () => {
  const [publicCapsules, setPublicCapsules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicCapsules = async () => {
      try {
        const capsulesRef = collection(db, 'capsules');
        const q = query(capsulesRef, where("privacy", "==", "public"));
        const snapshot = await getDocs(q);
        const now = new Date();

        const capsules = snapshot.docs.map(doc => {
          const data = doc.data();
          const unlockTime = data.unlockDate?.seconds * 1000;
          return {
            id: doc.id,
            ...data,
            isUnlocked: now >= new Date(unlockTime),
          };
        });

        setPublicCapsules(capsules);
      } catch (error) {
        console.error('Error fetching public capsules:', error);
      }
    };

    fetchPublicCapsules();
  }, []);

  const handleViewCapsule = (capsule) => {
    if (!capsule.isUnlocked) return;
    navigate(`/capsule/${capsule.id}`, { state: { capsule } });
  };
  const backToHeroPage = () => {
    navigate('/');
  };
  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{
        background: 'linear-gradient(to bottom right, #fdf6e3, #f7e7d4)', // vintage paper background
      }}
    >
      {/* Back Button */}

      <div className="flex flex-col md:flex-row items-center justify-evenly gap-4 px-6 py-4 mb-6">
        {/* Back Button */}
        <button
          onClick={backToHeroPage}
          className="px-4 py-2 rounded-md font-semibold shadow hover:scale-105 transition-transform"
          style={{
            backgroundColor: 'var(--cta-color)',
            color: 'white',
            border: '1px solid var(--cta-color)',
          }}
        >
          ← Back to Home
        </button>

        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search by title or creator"
          className="px-4 py-2 border rounded-md w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      {/* Title */}
      <h1
        className="text-4xl font-extrabold text-center mb-10 tracking-wide"
        style={{ color: 'var(--text-color)' }}
      >
        🌐 Public Capsules
      </h1>

      {/* If no capsules */}
      {publicCapsules.length === 0 ? (
        <p className="text-center italic text-gray-500 text-md">📭 No public capsules available yet.</p>
      ) : (
        <div className="grid gap-8 max-w-5xl mx-auto">
          {publicCapsules.filter((capsule) =>
            capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            capsule.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
          )
            .map((capsule) => (

              <div
                key={capsule.id}
                className="rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 border"
                style={{
                  backgroundColor: 'var(--secondary-accent)', 
                  border: '2px solid var(--primary-accent)',
                  color: 'var(--bg-color)', 
                }}
              >
                <h2 className="text-2xl font-bold mb-2"
                  style={{
                    color: 'var(--bg-color)', 
                  }}
                >📦 {capsule.title}</h2>

                <p className="text-base mb-1"
                  style={{
                    color: 'var(--bg-color)', 
                  }}
                >⏰ Unlocks at: {new Date(capsule.unlockDate.seconds * 1000).toLocaleString()}</p>
                <p className="text-base italic text-white mb-4">
                  🧑 Created by: {capsule.userEmail || 'Unknown'}
                </p>

                <button
                  onClick={() => handleViewCapsule(capsule)}
                  disabled={!capsule.isUnlocked}
                  className={`px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 ${capsule.isUnlocked
                    ? 'bg-[var(--cta-color)] text-white'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                >
                  {capsule.isUnlocked ? '🔍 View Capsule' : '🔒 Locked'}
                </button>
              </div>
            ))
          }
        </div>
      )}
    </div>

  );
};

export default PublicCapsules;
