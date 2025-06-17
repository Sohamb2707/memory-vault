import React from "react";
import HeroImg from "../images/HeroImg.jpg";
import { useNavigate } from 'react-router-dom';
import '../index.css'

const HeroPage = () => {
  const navigate = useNavigate();
  const createCapsule = () => {
    navigate('/create-capsule');
  };
  const viewCapsules = () => {
    navigate('/my-capsules');
  };
  return (
    <>
      <div
        className="flex flex-col md:flex-row items-center justify-between min-h-screen px-6 py-12"
        style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)'
        }}
      >
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Preserve Your Precious Memories!
          </h1>
          <p className="text-lg md:text-xl text-gray-800">
            Create Capsules to save your memories, emotions, and information safely.
          </p>
          <div className="space-x-4">
            <button
              onClick={createCapsule}
              className="px-6 py-3 btn-cta"
            >
              Create Capsule
            </button>
            <button
              onClick={viewCapsules}
              className="px-6 py-3 btn-cta"
            >
              View Capsules
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src={HeroImg}
            alt="Hero"
            className="w-full h-auto rounded-xl shadow-lg"
          />
        </div>
      </div>
    </>
  );
};

export default HeroPage;
