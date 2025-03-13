import { useStateContext } from "../context/index";
import { useState, useEffect } from "react";
import { X, Send, ShieldAlert, Wallet } from 'lucide-react';

export default function Nftdetails({ imgurls }) {
  const { NFTdetail, SelectedAccount, setopenNFtdetail, transferNFt } = useStateContext();
  const [nftdeatile, setnftdeatile] = useState(null);
  const [transferto, settransferto] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const fetchNftDetails = async () => {
    try {
      if (imgurls) {
        const NFT = await NFTdetail(imgurls);
        setnftdeatile(NFT || {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNftDetails();
  }, [imgurls]);

  const handleTransfer = async () => {
    if (!transferto.trim()) return;
    
    setIsTransferring(true);
    try {
      await transferNFt(transferto, imgurls);
      setopenNFtdetail(false);
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsTransferring(false);
    }
  };

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      setopenNFtdetail(false);
    }
  };

  const isOwner = SelectedAccount && nftdeatile?.owner && 
    SelectedAccount.toLowerCase() === nftdeatile.owner.toLowerCase();

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div className="bg-black w-full max-w-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-12 flex items-center justify-center border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">NFT Details</h2>
          <button
            onClick={() => setopenNFtdetail(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {nftdeatile && nftdeatile.id ? (
          <div>
            {/* Image */}
            <div className="relative aspect-square">
              <img
                src={imgurls}
                alt="NFT"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              {/* NFT Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ID</span>
                  <span className="text-white font-mono">{nftdeatile.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Owner</span>
                  <span className="text-white font-mono">
                    {`${nftdeatile.owner.slice(0, 6)}...${nftdeatile.owner.slice(-4)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span className="text-white font-mono">
                    {`${nftdeatile.creator.slice(0, 6)}...${nftdeatile.creator.slice(-4)}`}
                  </span>
                </div>
              </div>

              {/* Transfer Section */}
              {isOwner ? (
                <div className="pt-4 border-t border-gray-800">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter recipient's wallet address"
                      value={transferto}
                      onChange={(e) => settransferto(e.target.value)}
                      className="w-full bg-gray-900 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  </div>
                  <button
                    onClick={handleTransfer}
                    disabled={isTransferring || !transferto.trim()}
                    className={`
                      mt-3 w-full py-3 px-4 rounded-lg font-medium
                      flex items-center justify-center gap-2
                      transition-all duration-200
                      ${isTransferring || !transferto.trim()
                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }
                    `}
                  >
                    <Send size={18} />
                    {isTransferring ? 'Transferring...' : 'Transfer NFT'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-4 rounded-lg">
                  <ShieldAlert size={20} />
                  <p className="text-sm">You are not the owner of this NFT</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-400">This NFT does not exist</p>
          </div>
        )}
      </div>
    </div>
  );
}