import { useState, useEffect } from 'react';
import { useStateContext } from "../context/index";
import { useNavigate } from 'react-router-dom';
import Followlist from './followlist';
import Nftdetails from './NFTdetaile';
import { Search, Users, X } from 'lucide-react';

export default function Home() {
  const { 
    getProfilebyName, 
    Follow, 
    Unfollow, 
    FollowingList,
    SelectedAccount, 
    getMyProfile, 
    FollowingStatus,
    setopenNFtdetail,
    setimgurl,
    imgurl,
    openNFTdetail 
  } = useStateContext(); 

  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProfiles, setSearchedProfiles] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [listFollow, setListFollow] = useState([]);
  const [followStatuses, setFollowStatuses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowingList = async () => {
      if (SelectedAccount) {
        const List = await FollowingList();
        setListFollow(List || []);
      }
    };
    fetchFollowingList();
  }, [SelectedAccount]);

  const handleSearch = async () => {
    let matchingProfiles;
    if (searchQuery.startsWith("0x") && searchQuery.length === 42) {
      const profile = await getMyProfile(searchQuery);
      matchingProfiles = profile ? [profile] : [];
    } else {
      matchingProfiles = await getProfilebyName(searchQuery);
    }
    
    setSearchedProfiles(matchingProfiles);
    setShowSearchResults(true);

    const statusPromises = matchingProfiles.map(profile => 
      FollowingStatus(profile.Address)
    );
    const statuses = await Promise.all(statusPromises);
    
    const statusObj = matchingProfiles.reduce((acc, profile, index) => {
      acc[profile.Address] = statuses[index];
      return acc;
    }, {});
    setFollowStatuses(statusObj);
  };

  const handleProfileClick = (profile) => {
    navigate(`/profile/${profile.Address}`);
  };

  const handleFollowClick = async (event, profile) => {
    event.stopPropagation();
    try {
      if (followStatuses[profile.Address]) {
        await Unfollow(profile.Address);
      } else {
        await Follow(profile.Address);
      }
      const updatedStatus = await FollowingStatus(profile.Address);
      setFollowStatuses(prev => ({
        ...prev,
        [profile.Address]: updatedStatus
      }));
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            NFT Social Hub
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Connect, collect, and engage with the NFT community. Find other collectors and showcase your digital assets.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-xl py-4 px-6 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-lg transition-all"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="bg-black rounded-2xl p-6 border border-gray-800 mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="text-purple-500" />
                Search Results
              </h2>
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {searchedProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchedProfiles.map((profile, index) => (
                  <div
                    key={index}
                    onClick={() => handleProfileClick(profile)}
                    className="bg-gray-800/50 rounded-xl p-6 cursor-pointer hover:bg-gray-800 transition-all border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl mb-1">{profile.name}</h3>
                        <p className="text-gray-400 text-sm font-mono">
                          {`${profile.Address?.slice(0, 6)}...${profile.Address?.slice(-4)}`}
                        </p>
                      </div>
                      <button
                        onClick={(event) => handleFollowClick(event, profile)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          followStatuses[profile.Address]
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {followStatuses[profile.Address] ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">No profiles found</p>
                <p className="text-sm">Try searching with a different name or address</p>
              </div>
            )}
          </div>
        )}

        {/* NFT Details Modal */}
        {openNFTdetail && <Nftdetails imgurls={imgurl} />}

       {/* Following List */}
        <div className="bg-black max-w-2xl mx-auto rounded-2xl p-6 border border-gray-800 overflow-y-auto" style={{ maxHeight: '1000px' }}>
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 ">
            <Users className="text-purple-500" />
              Following
          </h2>
           <Followlist followlist={listFollow} />
        </div>
      </div>
    </div>
  );
}