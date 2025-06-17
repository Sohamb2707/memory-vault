import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const CapsuleMediaView = () => {
  const { id } = useParams();
  const location = useLocation();
  const [capsule, setCapsule] = useState(location.state?.capsule || null);
  const [canView, setCanView] = useState(false);
  const [loading, setLoading] = useState(!capsule);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const docRef = doc(db, 'capsules', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCapsule(data);
          checkPermissions(data);
        } else {
          setCapsule(null);
        }
      } catch (error) {
        console.error('Error fetching capsule:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkPermissions = (data) => {
      const unlockTime = data.unlockDate?.seconds
        ? new Date(data.unlockDate.seconds * 1000)
        : new Date(data.unlockDate);
      const now = new Date();
      const isOwner = user?.uid === data.userId;
      const isTrusted = data.trustedContacts?.includes(user?.email);
      if (now >= unlockTime && (isOwner || isTrusted)) {
        setCanView(true);
      }
    };

    if (user && id && !capsule) {
      fetchCapsule();
    } else if (capsule) {
      checkPermissions(capsule);
    }
  }, [id, user, capsule]);

  const extractDriveId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
    return match ? (match[1] || match[2]) : null;
  };

  const renderMedia = (url, index) => {
    const id = extractDriveId(url);
    if (!id) return null;

    const embedUrl = `https://drive.google.com/file/d/${id}/preview`;

    return (
      <div key={index} className="w-full aspect-video mb-6 shadow-md rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          title={`media-${index}`}
          allow="autoplay"
          className="w-full h-full border-none"
        ></iframe>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 mt-12 px-6">
        <p className="text-lg">⏳ Loading capsule...</p>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="text-center text-gray-600 mt-12 px-6">
        <p className="text-lg">🚫 Capsule not found.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 underline mt-4">
          ← Back to Home
        </button>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="text-center text-gray-600 mt-12 px-6">
        <button onClick={() => navigate('/')} className="text-blue-600 underline mb-6 block">
          ← Back to Home
        </button>
        <p className="text-lg mb-2">🔒 This capsule is locked.</p>
        <p className="font-semibold">
          Unlock Date: {new Date(capsule.unlockDate.seconds * 1000).toLocaleString()}
        </p>
        <p className="mt-2 text-sm">Or you don't have permission to view it.</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-3xl mx-auto px-8 py-10 rounded-3xl shadow-lg"
      style={{
        backgroundColor: 'var(--bg-color)',
        color: 'var(--text-color)',
        border: '2px solid var(--primary-accent)',
      }}
    >
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 rounded-md font-semibold shadow hover:scale-105 transition-transform"
          style={{
            backgroundColor: 'var(--cta-color)',
            color: 'white',
            border: '1px solid var(--cta-color)',
          }}
      >
        ← Back to Home
      </button>

      {/* Title */}
      <h1
        className="text-4xl font-extrabold mb-3 tracking-wide"
        style={{ color: 'var(--text-color)' }}
      >
        📦 {capsule.title}
      </h1>

      {/* Description */}
      <p
        className="text-md italic mb-6 leading-relaxed"
        style={{ color: 'var(--text-color)' }}
      >
        {capsule.description}
      </p>

      {/* Unlock Date */}
      {capsule.unlockDate && (
        <div className="mb-2">
          <p
            className="text-sm font-medium flex items-center"
            style={{ color: 'var(--text-color)' }}
          >
            ⏰ <span className="ml-2">Unlock Date: {new Date(capsule.unlockDate.seconds * 1000).toLocaleString()}</span>
          </p>
        </div>
      )}

      {/* Trusted Contacts */}
      {capsule.trustedContacts?.length > 0 && (
        <div className="mb-6">
          <p
            className="text-sm font-medium flex items-center"
            style={{ color: 'var(--text-color)' }}
          >
            🧑‍🤝‍🧑 <span className="ml-2">Visible to: {capsule.trustedContacts.join(", ")}</span>
          </p>
        </div>
      )}

      {/* Media Section */}
      <div className="space-y-8">
        {capsule.mediaUrls &&
          capsule.mediaUrls.map((url, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden border border-[var(--secondary-accent)] shadow-md"
              style={{ backgroundColor: 'white' }}
            >
              {renderMedia(url, index)}
            </div>
          ))}
      </div>
    </div>


  );
};

export default CapsuleMediaView;
