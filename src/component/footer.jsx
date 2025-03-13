import { createBrowserRouter } from "react-router-dom";
import Home from "./home";
import Mintnft from "./Mintnft";
import Profile from "./Profile";
import Navigation from "./Navigation"
import ProfileCard from './ProfileCard';
import Nftdetails from "./NFTdetaile";

export const routes = createBrowserRouter([
  {path:'/',element:(<div><Home/><Navigation/></div>)},
  {path:'/MintNFT',element:(<div><Mintnft/><Navigation/></div>)},
  {path:'/Profile',element:(<div><Profile/><Navigation/></div>)},
  {path:"/profile/:Address",element:(<div><ProfileCard/></div>)},
  {path:"/NFTdetail/:nfthsah",element:(<div><Nftdetails/></div>)},
])