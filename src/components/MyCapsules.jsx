import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const MyCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate();
  const [sharedCapsules, setSharedCapsules] = useState([]);
  const [unlockedCapsules, setUnlockedCapsules] = useState([]);
  const [lockedCapsules, setLockedCapsules] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchCapsules = async () => {
          const now = new Date();
          const email = user.email;
          const userId = user.uid;

          const allDocs = await getDocs(collection(db, 'capsules'));

          const my = [], shared = [], unlocked = [], locked = [];

          allDocs.docs.forEach(docSnap => {
            const capsule = { id: docSnap.id, ...docSnap.data() };
            const unlockDate = new Date(capsule.unlockDate.seconds * 1000);
            const isOwner = capsule.userId === userId;
            const isTrusted = capsule.trustedContacts?.includes(email);
            const isUnlocked = now >= unlockDate;

            if (isOwner) my.push(capsule);
            else if (isTrusted) shared.push(capsule);

            if ((isOwner || isTrusted) && isUnlocked) unlocked.push(capsule);
            else if ((isOwner || isTrusted) && !isUnlocked) locked.push(capsule);
          });

          setCapsules(my);
          setSharedCapsules(shared);
          setUnlockedCapsules(unlocked);
          setLockedCapsules(locked);
        };

        fetchCapsules();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleViewMedia = (capsule) => {
    if (!capsule?.unlockDate) {
      console.error("Missing unlockDate in capsule:", capsule);
      return;
    }
    navigate(`/capsule/${capsule.id}`, { state: { capsule } });
  };

  const backToHeroPage = () => {
    navigate('/');
  };
  const Section = ({ title, capsules, handleViewMedia }) => {
    return (
      <div className="mb-12">
        <h3
          className="text-2xl font-bold mb-6 inline-block border-b-4 pb-2"
          style={{ borderColor: 'var(--cta-color)', color: 'var(--text-color)' }}
        >
          {title}
        </h3>

        {capsules.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No capsules found in this category 📭</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {capsules.map((capsule) => (
              <div
                key={capsule.id}
                className="rounded-2xl p-5 transition-transform hover:-translate-y-1 hover:shadow-xl duration-300"
                style={{
                  backgroundColor: 'var(--secondary-accent)', // darker contrast
                  border: '2px solid var(--primary-accent)',
                  color: 'var(--bg-color)', // softer white-ink text
                }}
              >
                <h4 className="text-xl font-bold mb-1">📦 {capsule.title}</h4>
                <p className="text-sm mb-2"
                style={{
                  color: 'var(--bg-color)', // softer white-ink text
                }}>
                  ⏰ Unlocks: {new Date(capsule.unlockDate.seconds * 1000).toLocaleString()}
                </p>
                <p className="text-sm italic text-white">
                  {capsule.userId === auth.currentUser?.uid
                    ? '🗝️ Your Capsule'
                    : `📨 Shared by: ${capsule.userEmail || 'Unknown'}`}
                </p>
                <button
                  onClick={() => handleViewMedia(capsule)}
                  className="mt-4 px-4 py-2 rounded-md text-sm font-semibold tracking-wide shadow-md hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: 'var(--cta-color)',
                    color: 'white',
                    border: '1px solid var(--text-color)',
                  }}
                >
                  🔍 View Capsule
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen pb-10"
      style={{
        background: 'linear-gradient(to bottom right, #fdf6e3, #f7e7d4)',
      }}
    >
      {/* Back Button */}
      <div className="p-6">
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
      </div>

      {/* Capsule Content */}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <h2
          className="text-4xl font-extrabold mb-10 text-center tracking-tight"
          style={{ color: 'var(--text-color)' }}
        >
          🗂️ Categorized Capsules
        </h2>

        <Section
          title="🔓 Unlocked Capsules"
          capsules={unlockedCapsules}
          handleViewMedia={handleViewMedia}
        />

        <Section
          title="🔒 Locked Capsules"
          capsules={lockedCapsules}
          handleViewMedia={handleViewMedia}
        />

        <Section
          title="🧳 My Capsules"
          capsules={capsules}
          handleViewMedia={handleViewMedia}
        />

        <Section
          title="🤝 Shared With Me"
          capsules={sharedCapsules}
          handleViewMedia={handleViewMedia}
        />
      </div>
    </div>
  );


};

export default MyCapsules;
