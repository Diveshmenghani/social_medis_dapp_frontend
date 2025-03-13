import { useState, useRef } from "react";
import { useStateContext } from "../context";
import axios from "axios";
import toast from "react-hot-toast";
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function Mintnft() {
  const { MintNFT, NFTdetail } = useStateContext();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const UploadFileToIPFS = async (file) => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    setIsUploading(true);

    const loading = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        const config = {
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          }
        };

        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          config
        );

        const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        const mintnft = await MintNFT(url);
        const nftdetail = await NFTdetail(url);
        
        await axios.post("http://localhost:3000/api/nft/create", {
          nftId: url,
          nftcode: nftdetail.id
        });

        console.log("NFT uploaded to database:", url, nftdetail.id);
        resolve(mintnft);
      } catch (error) {
        console.error("Upload error:", error);
        reject(error);
      } finally {
        setIsUploading(false);
      }
    });

    toast.promise(loading, {
      loading: "Minting your NFT...",
      success: "NFT minted successfully! 🎉",
      error: "Failed to mint NFT 😔"
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-black rounded-2xl p-10 border-2 border-gray-800 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <Upload className="text-purple-500 w-8 h-8" />
            Mint Your NFT
          </h2>
          
          <div className="space-y-8 p-30">
            {/* File Upload Area */}
            <div 
              onClick={triggerFileInput}
              className={`
                border-2 border-dashed rounded-xl p-35
                ${preview ? 'border-purple-500' : 'border-gray-700'}
                hover:border-purple-500 transition-colors duration-200
                cursor-pointer text-center
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              
              {preview ? (
                <div className="space-y-4">
                  <img 
                    src={preview} 
                    alt="NFT Preview" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-gray-400 text-sm">
                    Click to change image
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-600" />
                  <div>
                    <p className="text-gray-300 font-medium">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Supports JPG, PNG, GIF (Max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mint Button */}
            <button
              onClick={() => UploadFileToIPFS(file)}
              disabled={!file || isUploading}
              className={`
                w-full py-4 px-8 rounded-xl font-bold text-lg font-medium
                flex items-center justify-center gap-2
                transition-all duration-200
                ${isUploading || !file
                  ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Mint NFT
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
//old secrtkeys and api = 
//454f6f7bce1504d9fa21
//939cb4596c0335d756f00b4a0726deaefd67bd4d307c1c07950b281fa6f0f135