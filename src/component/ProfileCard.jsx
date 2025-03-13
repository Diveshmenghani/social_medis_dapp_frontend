import { useStateContext } from "../context/index";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { User, PencilLine, Wallet } from 'lucide-react';
import NFTcard from "./NFT_card";

export default function Profile() {
  const { getMyProfile, connectWallet, Follow, Unfollow, FollowingStatus } = useStateContext();
  const [MyProfiles, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);  
  const { Address } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await connectWallet();  
        if (Address) {
          const profile = await getMyProfile(Address);  
          setProfile(profile || {});

          const status = await FollowingStatus(Address);  
          setIsFollowing(status);  
        } else {
          console.log("Connect your Wallet");
        }
      } catch (error) {
        console.log(error);
      }
    };  
    fetchProfile();
  }, [Address]);

 
  const handleFollowClick = async () => {
    if (isFollowing) {
      await Unfollow(Address);  
    } else {
      await Follow(Address);    
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div>
      {MyProfiles ? (
        <>
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
                <div className="flex justify-center gap-4 mt-6">
                <button onClick={handleFollowClick}>
                 {isFollowing ? "Unfollow" : "Follow"}
               </button>
                </div>
                
              </div>
            </div>
          </div>

          <h2>Owned NFTs</h2>
          <NFTcard account={Address} />
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
