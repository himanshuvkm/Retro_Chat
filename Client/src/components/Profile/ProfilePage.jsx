import React, { useState, useRef } from 'react';

import { Save, Camera, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContetx';

const ProfilePage = () => {
    const { authUser, setAuthUser } = useAuthContext();
    const [fullName, setFullName] = useState(authUser.fullName);
    const [bio, setBio] = useState(authUser.bio || "");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size too large (Max 2MB)");
                return;
            }
            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Image = reader.result;
                // Immediate update locally for preview, essentially
                updateProfile(fullName, bio, base64Image);
            };
        }
    };

    const updateProfile = async (name, biography, pic) => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: name,
                    bio: biography,
                    profilePic: pic || authUser.profilePic
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Update Context/LocalStorage
            localStorage.setItem("chat-user", JSON.stringify(data.data));
            setAuthUser(data.data);
            toast.success("Profile Updated!");

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(fullName, bio);
    };

    return (
        <div className="h-full w-full flex flex-col bg-[var(--window-bg)] rounded-lg relative overflow-hidden">
            {/* Header */}
            <div className="window-header flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <span className="font-bold text-[var(--header-text)] tracking-wider">User_Profile.exe</span>
                </div>
                <Link to="/" className="p-1 hover:bg-black/10 rounded">
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
            </div>

            <div className="flex-1 overflow-auto p-8 flex flex-col items-center">

                {/* Avatar Section */}
                <div className="relative group mb-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                        <img
                            src={authUser.profilePic || "https://avatar.iran.liara.run/public/boy"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-[var(--accent-coral)] text-white p-2 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                    >
                        <Camera size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-[var(--text-main)] uppercase tracking-wide">Display Name</label>
                        <input
                            type="text"
                            className="w-full bg-white border-2 border-[var(--window-border)] text-[var(--text-main)] px-4 py-3 rounded-md focus:outline-none focus:border-[var(--accent-peach)] focus:ring-2 focus:ring-[var(--accent-peach)/50] transition-all font-sans shadow-inner text-lg"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-[var(--text-main)] uppercase tracking-wide">Bio / Status</label>
                        <textarea
                            className="w-full bg-white border-2 border-[var(--window-border)] text-[var(--text-main)] px-4 py-3 rounded-md focus:outline-none focus:border-[var(--accent-peach)] focus:ring-2 focus:ring-[var(--accent-peach)/50] transition-all font-sans shadow-inner min-h-[100px] resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Type something about yourself..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[var(--accent-mint)] hover:bg-[var(--accent-peach)] text-[var(--text-main)] font-bold rounded-md border-2 border-[var(--window-border)] shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                        >
                            <Save size={20} />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default ProfilePage;
