import { ethers } from "ethers";
import { useState, createContext, useContext } from "react";
import abi from '../contracts/abi.json'

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [SelectedAccount, setSelectedAccount] = useState();
  const [currentBal, setCurrentBal] = useState();
  const [profiles, setProfiles] = useState([]);
  const [openNFTdetail,setopenNFtdetail]= useState(false);
  const [imgurl,setimgurl]=useState();
  
  //ConnectWallet Function :- 
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setSelectedAccount(accounts[0]);

        if (accounts[0]) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);
          const formattedBalance = ethers.formatEther(balance);
          setCurrentBal(formattedBalance);
        }
      } else {
        alert("Please install MetaMask");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const Contarct = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Metamask is not installed");
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0x7Fa456d59783bbC06bA2656A3fE7797bf9ac5052";
      //0x214D2622eA65BB031Ede15E38Ecd7A4019734538
      //old address :- "0xbb69bf45e849cba878b8cdcf4c65456e81530393";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      return contract
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getProfilebyName = async(name) =>{
   try{
    const contract = await Contarct();
    if(contract){
      const Profiles = await contract.serchByName(name);
      const ProfilesArray = await Promise.all(Profiles.map(async (Profiles)=>{
       const { name ,Address ,age} = Profiles;
       return {
        name,
        Address : Address,
        age:Number(age),
       };
      })
    );
    return ProfilesArray;
    }
   }catch(error){
    console.log(error);
   }
  }
 
  const createProfile = async(name,age)=>{
   try{
     if(!name || !age) {
        throw new Error("Data is missing");
      }
      const contract = await Contarct();
      if(contract){
         const tx= await contract.createProfile(name,age);
         await tx.wait();
         console.log("Profile Create Successfully")
      }  
   }
   catch(error){
    console.log(error)
   }
  }
  const Follow = async(address)=>{
    try{
      const contract = await Contarct();
      if(contract){
        const tx = await contract.follow(address)
        await tx.wait()
        console.log("You follow Successfuly")
      } 
    }
    catch(error){
      console.log(error)
    }
  }
  const Unfollow = async(address)=>{
    try{
      const contract = await Contarct();
      if(contract){
        const tx = await contract.disfollow(address)
        await tx.wait()
        console.log("You unfollow Successfuly")
      } 
    }
    catch(error){
      console.log(error)
    }
  }
  
  const MyNFT = async(address) =>{
  try{
    const contract = await Contarct()
    if(contract){
      const NFTArray = await contract.getnfts(address);
      return NFTArray
    }
  }catch(error){
    console.log(error)
  }
  } 
  
  const getMyProfile = async (address) => {
    try {
      await connectWallet();
      const contract = await Contarct(); 
      if (contract) {
        const profile = await contract.profile(address); 
        return {
          name: profile[0],
          Address: profile[1],
          age:  Number(profile[2])
        };
      } else {
        throw new Error("Contract is not available");
      }
    } catch (error) {
      console.log("Error retrieving profile:", error);
      return null; 
    }
  };

  const MintNFT = async(hash) =>{
    try{
    await connectWallet();
    const contract = await Contarct();
    if(contract){
      const tx = await contract.minitnft(hash); 
      await tx.wait();
      console.log("NFT create Successfuly")
    }
  } catch(error){
    console.log("There is some thing wrong",error);
  }
  };

  const FollowingList = async() =>{
    try{
    await connectWallet();
    const contract = await Contarct();
    const address = SelectedAccount;
    if(contract && address){
      const followingList = await contract.getFollowers(address);
      return (followingList);
    }
   } catch(error){
    console.log("There is some thing wrong",error);
  }
}
const FollowingStatus = async (address) => {
  try {
    const contract = await Contarct();
    if (contract) {
      const status = await contract.following(SelectedAccount, address);
      return status;  
    }
  } catch (error) {
    console.log(error);
    return false;  
  }
};

const NFTdetail = async (hash) => {
  try{
    const contract = await Contarct();
    if (contract) {
      const detiale = await contract.nftdetail(hash);
      return{
        id : Number(detiale[0]),
        string : detiale[1],
        owner : detiale[2],
        creator : detiale[3]
      };
    }   
  }catch{
    console.log(error);
  }
}
const transferNFt = async(address,hash) =>{
  try{
    const contract = await Contarct();
    if(contract){
      const tx = await contract.transfernft(address,hash);
      await tx.wait();
      console.log("transfer successfuly")
    }
  }
  catch(error){
   console.log(error)
  }
}
  return (
    <StateContext.Provider value={{
    SelectedAccount,
    currentBal, 
    connectWallet, 
    Contarct, 
    getProfilebyName, 
    profiles, 
    createProfile,
    Follow,
    Unfollow,
    MyNFT,
    getMyProfile,
    MintNFT,
    FollowingList,
    FollowingStatus,
    NFTdetail,
    openNFTdetail,
    setopenNFtdetail,
    setimgurl,
    imgurl,
    transferNFt
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
