import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const CreateCapsule = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: [''],
    trustedContacts: '',
    unlockDate: '',
    visibility: 'private',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? '',
    }));
  };

  const handleMediaChange = (index, value) => {
    const newMedia = [...formData.media];
    newMedia[index] = value;
    setFormData((prev) => ({ ...prev, media: newMedia }));
  };

  const addMediaField = () => {
    setFormData((prev) => ({ ...prev, media: [...prev.media, ''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trustedContactsArray = formData.trustedContacts
      ? formData.trustedContacts.split(',').map((email) => email.trim())
      : [];

    try {
      // Step 1: Save capsule to Firestore
      await addDoc(collection(db, 'capsules'), {
        title: formData.title,
        description: formData.description,
        mediaUrls: formData.media,
        unlockDate: new Date(formData.unlockDate),
        privacy: formData.visibility,
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        trustedContacts: trustedContactsArray,
      });

      try {
        // Step 2: Send invite emails via backend
        await axios.post('https://memory-vault-backend-cvze.onrender.com/send-invite', {
          trustedContacts: trustedContactsArray,
          userEmail: auth.currentUser.email,
          title: formData.title,
          unlockDate: formData.unlockDate,
        });

        alert('🎉 Capsule created and emails sent successfully!');
      } catch (emailErr) {
        console.error('Emails not sent:', emailErr.response?.data || emailErr.message);
        alert('Capsule created, but failed to send emails. Please check console for details.');
      }

      // Reset form after everything
      setFormData({
        title: '',
        description: '',
        media: [''],
        unlockDate: '',
        visibility: 'private',
        trustedContacts: '',
      });

    } catch (firestoreErr) {
      console.error('Error adding capsule to Firestore:', firestoreErr);
      alert('❌ Failed to create capsule. Please try again.');
    }
  };

  const backToHeroPage = () => {
    navigate('/');
  };
  return (
    <div className="flex flex-col md:flex-row items-start md:items-start p-4 sm:p-6">
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


      <div
        className="w-full max-w-lg mx-auto mt-4 md:mt-10 p-6 sm:p-8 rounded-2xl shadow-xl border"
        style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          borderColor: 'var(--secondary-accent)',
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6" style={{ color: 'var(--text-color)' }}>
          🚀 Create Your Capsule
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Capsule Title"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            style={{ borderColor: 'var(--secondary-accent)' }}
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your capsule..."
            className="w-full p-3 border rounded-md h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            style={{ borderColor: 'var(--secondary-accent)' }}
            required
          />

          <div className="space-y-2">
            <label className="block font-semibold">📎 Google Drive Media Links</label>
            {formData.media.map((url, index) => (
              <input
                key={index}
                type="text"
                value={url}
                onChange={(e) => handleMediaChange(index, e.target.value)}
                placeholder={`Media Link ${index + 1}`}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                style={{ borderColor: 'var(--secondary-accent)' }}
                required
              />
            ))}
            <button
              type="button"
              onClick={addMediaField}
              className="text-sm text-blue-500 hover:underline mt-1"
            >
              + Add Another Media Link
            </button>
          </div>

          <input
            type="datetime-local"
            name="unlockDate"
            value={formData.unlockDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            style={{ borderColor: 'var(--secondary-accent)' }}
            required
          />

          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            style={{ borderColor: 'var(--secondary-accent)' }}
          >
            <option value="private">🔒 Private</option>
            <option value="public">🌐 Public</option>
          </select>

          <input
            type="email"
            name="trustedContacts"
            placeholder="Trusted Contact Email(s)"
            value={formData.trustedContacts}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            style={{ borderColor: 'var(--secondary-accent)' }}
          />

          <button
            type="submit"
            className="w-full p-3 rounded-md text-white font-semibold shadow-md hover:scale-[1.02] transition-transform"
            style={{
              backgroundColor: 'var(--cta-color)',
              borderColor: 'var(--cta-color)',
            }}
          >
            🚀 Share Capsule
          </button>
        </form>
      </div>
    </div>
  );

};

export default CreateCapsule;


