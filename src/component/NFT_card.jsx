import { useState, useEffect } from 'react';
import { useStateContext } from '../context/index';
import Nftdetails from './NFTdetaile';
import axios from 'axios';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';

export default function NFTcard({ account }) {
  const { MyNFT, connectWallet, setopenNFtdetail, openNFTdetail, setimgurl, imgurl, SelectedAccount } = useStateContext();
  const [NFTArry, setNFTArry] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({});

  const navigate = (NFT) => {
    setimgurl(NFT);
    setopenNFtdetail(true);
  };

  useEffect(() => {
    const AllMyNFT = async () => {
      try {
        await connectWallet();
        if (account) {
          const NFTList = await MyNFT(account);
          setNFTArry(NFTList || []);

          const data = await Promise.all(
            NFTList.map(async (NFT) => {
              try {
                const res = await axios.post('http://localhost:3000/api/nft/getnft', { nftId: NFT });
                return { id: NFT, ...res.data };
              } catch (error) {
                console.error(`Failed to fetch data for NFT ${NFT}:`, error.message);
                return { id: NFT, likes: 0, comments: [] };
              }
            })
          );

          const likesData = {};
          const commentsData = {};
          data.forEach(({ id, likes, comments }) => {
            likesData[id] = likes || 0;
            commentsData[id] = comments || [];
          });

          setLikes(likesData);
          setComments(commentsData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    AllMyNFT();
  }, [account, MyNFT]);

  const handleLike = async (nftId) => {
    try {
      const res = await axios.post("http://localhost:3000/api/nft/like", {
        nftId,
        user: SelectedAccount,
      });
      setLikes(prev => ({ ...prev, [nftId]: res.data.likes }));
    } catch (error) {
      console.error("Error liking NFT:", error);
    }
  };

  const handleAddComment = async (nftId) => {
    try {
      const text = newComment[nftId]?.trim();
      if (!text) return;

      const res = await axios.post("http://localhost:3000/api/nft/comment", {
        nftId,
        user: SelectedAccount,
        text,
      });

      setComments(prev => ({
        ...prev,
        [nftId]: res.data.comments
      }));
      
      setNewComment(prev => ({ ...prev, [nftId]: "" }));
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  return (
    <>
      <div>{openNFTdetail && <Nftdetails imgurls={imgurl} />}</div>
      {NFTArry.length > 0 ? (
        <div className="grid grid-cols-3 gap-5 p-5 justify-center ">
          {NFTArry.map((NFT, index) => (
            <div key={index} className="bg-black text-white rounded-xl overflow-hidden shadow-xl max-w-sm w-full border border-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="relative">
                <img 
                  src={NFT} 
                  alt="NFT" 
                  className="w-full h-64 object-cover cursor-pointer"
                  onClick={() => navigate(NFT)}
                />
                <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full">
                  <MoreHorizontal size={20} className="text-white cursor-pointer" />
                </div>
              </div>

              <div className="p-4">
                {/* <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">NFT #{index + 1}</h3>
                  <span className="text-green-400 font-bold">0.1 ETH</span>
                </div> */}
                <p className="text-gray-400 text-sm mb-3">Created by <span className="text-purple-400">@user</span></p>

                <div className="flex justify-between items-center py-3 border-t border-b border-gray-800">
                  <button 
                    className="flex items-center gap-1 text-gray-400"
                    onClick={() => handleLike(NFT)}
                  >
                    <Heart size={20} fill={likes[NFT] > 0 ? "#ef4444" : "none"} /> 
                    <span>{likes[NFT] || 0}</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-1 text-gray-400"
                    onClick={() => setShowComments(prev => ({ ...prev, [NFT]: !prev[NFT] }))}
                  >
                    <MessageCircle size={20} /> 
                    <span>{(comments[NFT] || []).length}</span>
                  </button>
                  
                  <button className="flex items-center gap-1 text-gray-400">
                    <Share2 size={20} />
                  </button>
                </div>

                {showComments[NFT] && (
                  <div className="mt-3">
                    <div className="max-h-32 overflow-y-auto mb-3">
                      {(comments[NFT] || []).map((comment, idx) => (
                        <div key={idx} className="mb-2">
                          <span className="font-bold text-purple-400">@{comment.user}: </span>
                          <span className="text-gray-300">{comment.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment[NFT] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [NFT]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-900 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <button 
                        onClick={() => handleAddComment(NFT)}
                        className="bg-purple-600 hover:bg-purple-700 rounded-full p-2"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white p-5">No NFTs Owned</div>
      )}
    </>
  );
}