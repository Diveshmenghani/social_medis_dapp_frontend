import { useState, useEffect } from 'react';
import { useStateContext } from "../context/index";
import Nftdetails from './NFTdetaile';
import { Users, ImageOff } from 'lucide-react';

export default function Followlist({ followlist }) {
  const { MyNFT, getMyProfile, setopenNFtdetail, openNFTdetail, setimgurl, imgurl } = useStateContext();
  const [followedProfiles, setFollowedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedProfiles = async () => {
      try {
        const profilesWithNFTs = await Promise.all(
          followlist.map(async (address) => {
            const profile = await getMyProfile(address);
            const nfts = await MyNFT(address);
            return {
              profile,
              latestNFT: nfts.length > 0 ? nfts[nfts.length - 1] : null,
            };
          })
        );
        setFollowedProfiles(profilesWithNFTs);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (followlist.length > 0) {
      fetchFollowedProfiles();
    } else {
      setLoading(false);
    }
  }, [followlist, getMyProfile, MyNFT]);

  const handleNFTClick = (nft) => {
    setimgurl(nft);
    setopenNFtdetail(!openNFTdetail);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin" />
          <p className="text-gray-400">Loading following list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gray-900/50 rounded-xl p-6">
      {openNFTdetail && <Nftdetails imgurls={imgurl} />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        {followedProfiles.length > 0 ? (
          followedProfiles.map((profileData, index) => (
            <div
              key={index}
              className="bg-black rounded-xl border border-gray-800 p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {profileData.profile.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {profileData.profile.name || 'Unnamed Profile'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {profileData.profile.Address?.slice(0, 6)}...
                    {profileData.profile.Address?.slice(-4)}
                  </p>
                </div>
              </div>

              {profileData.latestNFT ? (
                <div
                  onClick={() => handleNFTClick(profileData.latestNFT)}
                  className="relative group cursor-pointer"
                >
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={profileData.latestNFT}
                      alt={`Latest NFT by ${profileData.profile.name}`}
                      className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-medium">
                      Click to view NFT
                    </p>
                  </div>
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-800/50 flex flex-col items-center justify-center text-gray-500 gap-2">
                  <ImageOff size={32} />
                  <p className="text-sm">No NFTs yet</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12 text-center">
            <Users size={48} className="text-gray-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Following Yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Start following other creators to see their latest NFTs and updates here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}