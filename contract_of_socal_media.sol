// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract socialMedia {
   
    struct Profile {
        string name;
        address Address;
        uint age;
    }
    struct nft {
        uint id;
        string hash;
        address owner;
        address creator;
    }

    mapping(address => mapping(address => bool)) internal following;
    mapping(address => address[]) internal  followingHistory; 
    mapping(address => string[]) internal nftHistory;
    mapping(string => nft) public nftowner;
    mapping(address => Profile) public profile;
    address[] public allUserAddress;

    event createprofile(address indexed _address, uint age, string _name);
    event transferNft(address indexed _to, string hash);

    uint public allProfileCounter = 1;
    uint public nftid = 1000;
    
    function createProfile(string memory _name, uint _age) public {
        require(_age > 5, "You are under age");
        require(bytes(profile[msg.sender].name).length==0,"You already created profile");
        profile[msg.sender] = Profile({
            name: _name,
            Address: msg.sender,
            age: _age
        });
        allUserAddress.push(msg.sender);
        allProfileCounter++;
        emit createprofile(msg.sender, _age, _name);
    }
    function minitnft(string memory _hash) public {
      require(nftowner[_hash].owner == address(0), "This NFT is already minted");
      require(bytes(profile[msg.sender].name).length>0,"Profile not created");
      nft memory nfts = nft(nftid,_hash,msg.sender,msg.sender);
      nftowner[_hash] = nfts;
      nftHistory[msg.sender].push(_hash);
      nftid++;
    }
    function transfernft(address _to,string memory _hash) public {
      require(nftowner[_hash].owner == msg.sender,"You are not owner of this NFT");
      nftowner[_hash].owner = _to;
      nftHistory[_to].push(_hash);
      emit transferNft(_to,_hash);
     }

    function follow(address _address) public {
        require(profile[msg.sender].age != 0,"You Not Created The Profile");
        following[msg.sender][_address] = true;
        followingHistory[msg.sender].push(_address);
    }

    function unfollow(address _address) public {
        require(profile[msg.sender].age != 0,"You Not Created The Profile");
        following[msg.sender][_address] = false;
    }
    
   function getnfts(address _address) public view returns (string[] memory) {
    uint count = 0;
    
    // First loop to count unique NFTs currently owned by `_address`
    for (uint i = 0; i < nftHistory[_address].length; i++) {
        if (nftowner[nftHistory[_address][i]].owner == _address) {
            bool alreadyAdded = false;

            // Check for duplicates by comparing with earlier items, but also consider ownership
            for (uint j = 0; j < i; j++) {
                if (
                    keccak256(bytes(nftHistory[_address][j])) == keccak256(bytes(nftHistory[_address][i])) &&
                    nftowner[nftHistory[_address][j]].owner == _address
                ) {
                    alreadyAdded = true;
                    break;
                }
            }

            // If no duplicate and the address is the current owner, increase the count
            if (!alreadyAdded) {
                count++;
            }
        }
    }

    // Create an array to store unique NFTs
    string[] memory allNfts = new string[](count);
    uint index = 0;

    // Second loop to add unique NFTs currently owned by `_address` to the result array
    for (uint i = 0; i < nftHistory[_address].length; i++) {
        if (nftowner[nftHistory[_address][i]].owner == _address) {
            bool alreadyAdded = false;

            // Check for duplicates again, also considering ownership
            for (uint j = 0; j < i; j++) {
                if (
                    keccak256(bytes(nftHistory[_address][j])) == keccak256(bytes(nftHistory[_address][i])) &&
                    nftowner[nftHistory[_address][j]].owner == _address
                ) {
                    alreadyAdded = true;
                    break;
                }
            }

            // Add unique NFT to the result array
            if (!alreadyAdded) {
                allNfts[index] = nftHistory[_address][i];
                index++;
            }
        }
    }

    return allNfts;
}

    function getFollowers(address _address) public view returns(address[] memory) {
    require(profile[_address].age !=0,"You are not created profile");
      address[] memory followers = new address[](followingHistory[_address].length);
      for (uint i = 0; i < followingHistory[_address].length; i++) {
        if(following[_address][followingHistory[_address][i]] == true){
            followers[i] = followingHistory[_address][i];
        }
    }
    return followers;
    }
    function serchByName(string memory _name)public view returns(Profile[] memory){
     Profile[] memory _profiles = new Profile[](allProfileCounter);
     for (uint i = 0; i < allProfileCounter; i++) {
         if (bytes(_profiles[i].name).length > 0 && keccak256(bytes(_profiles[i].name)) == keccak256(bytes(_name))) {
             _profiles[i] = profile[allUserAddress[i]];
         }
     }
     return _profiles;
    }
}