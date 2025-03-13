import { Link, useLocation } from "react-router-dom";
import { Home, PlusSquare, User, Wallet } from 'lucide-react';
const Navigation = () =>{
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path;
      };
    
 return(
    <div className="flex justify-center gap-2 mb-12 text-center">
        <Link
              to="/"
              className={`relative group px-4 py-2 rounded-lg transition-all duration-200 text-center ${
                isActive('/') 
                  ? 'bg-purple-600 text-white text-center' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 text-center'
              }`}
            >
              <div className="flex items-center text-center gap-2">
                <Home size={20} />
                <span className="hidden sm:block">Home</span>
              </div>
              {!isActive('/') && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              )}
            </Link>
            <Link
              to="/MintNFT"
              className={`relative group px-4 py-2 rounded-lg transition-all duration-200 text-center${
                isActive('/MintNFT')
                  ? 'bg-purple-600 text-white text-center'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 text-center'
              }`}
            >
              <div className="flex items-center text-center gap-2 ">
                <PlusSquare size={20} />
                <span className="hidden sm:block">Mint NFT</span>
              </div>
              {!isActive('/MintNFT') && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              )}
            </Link>

            <Link
              to="/Profile"
              className={`relative group px-4 py-2 rounded-lg transition-all duration-200 text-center ${
                isActive('/Profile')
                  ? 'bg-purple-600 text-white text-center'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800 text-center'
              }`}
            >
              <div className="flex items-center text-center gap-2">
                <User size={20} />
                <span className="hidden sm:block">Profile</span>
              </div>
              {!isActive('/Profile') && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              )}
            </Link>
        </div>
   
   
 )
}
export default Navigation;