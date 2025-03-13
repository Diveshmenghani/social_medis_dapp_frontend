import { useStateContext } from "../context/index";
import { useEffect, useState } from "react";
import NFTcard from "./NFT_card";
import { User, PencilLine, Wallet } from 'lucide-react';

export default function Profile() {
  const { SelectedAccount, createProfile, getMyProfile, connectWallet } = useStateContext();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [MyProfiles, setProfile] = useState(null);

  useEffect(() => {
    const MyProfile = async () => {
      try {
        await connectWallet();
        if (SelectedAccount) {
          const Profile = await getMyProfile(SelectedAccount);
          setProfile(Profile || {});
        } else {
          console.log("Connect your Wallet");
        }
      } catch (error) {
        console.log(error);
      }
    };  
    MyProfile();
  }, [SelectedAccount]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!name || !age) return;
    await createProfile(name, age);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {MyProfiles && MyProfiles.name ? (
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Section */}
          <div className="bg-black rounded-2xl p-8 mb-8 border border-gray-800 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <User className="text-purple-500" size={32} />
                  Profile Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <span className="text-gray-400 block text-sm mb-1">Name</span>
                      <span className="text-xl font-semibold text-white">{MyProfiles.name}</span>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <span className="text-gray-400 block text-sm mb-1">Age</span>
                      <span className="text-xl font-semibold text-white">{MyProfiles.age}</span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <span className="text-gray-400 block text-sm mb-1">Wallet Address</span>
                    <span className="text-sm font-mono text-purple-400 break-all">
                      {MyProfiles.Address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Collection Section */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">My NFT Collection</h2>
            <NFTcard account={SelectedAccount} />
          </div>
        </div>
      ) : (
        /* Profile Creation Form */
        <div className="max-w-md mx-auto bg-black rounded-2xl p-8 border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <PencilLine className="text-purple-500" />
            Create Your Profile
          </h2>
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              <input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Age</label>
              <input
                placeholder="Enter your age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Wallet size={20} />
              Create Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
}