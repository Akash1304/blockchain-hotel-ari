// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract UserContract{
    enum accessor { default_val,inventory_partner, ota_partner }
    mapping (address => accessor) public users;
    
    modifier validateUser{
        require(users[msg.sender] != accessor(0),"403:Unauthorized");
        _;
    }
    
    function onboardUser(accessor userType) external returns(accessor){
        require(users[msg.sender] == accessor(0),"400: User already exits");
        users[msg.sender] = userType;
        return users[msg.sender];
    }
    
}

contract HouseContract is UserContract{

    mapping (uint256 => address) public house_owner_map;
    
    function createHouse(uint256 house_id) public validateUser returns (bool){
        require(users[msg.sender] == accessor(1),"403:Unauthorized");
        require(house_owner_map[house_id] == address(0),"400: House already exists!");
        house_owner_map[house_id] = msg.sender;
        return true;
    }
    
    function deleteHouse(uint256 house_id) public validateUser returns (bool){
        require(users[msg.sender] == accessor(1),"403:Unauthorized");
        require(house_owner_map[house_id] != address(0),"404: House not found!");
        house_owner_map[house_id] = address(0);
    }
    
}

contract ARIContract is HouseContract{
    
    struct Range{
        uint256 from_date;
        uint256 to_date;
        int256 price;
        bool available;
        uint256 block_timestamp;
        address modifying_entity;
    }
    
    mapping(uint256 => mapping(bytes32 => Range)) public houseAriMap;
    
    //In order to fetch and display all ARI
    mapping(uint256 => bytes32[]) public houseArikeyMap;
    
    function createARIForHouseByRange(uint256 house_id, uint256 _from_date, uint256 _to_date, int256 _price) public validateUser returns (bytes32){
        require(users[msg.sender] == accessor(1),"403:Unauthorized");
        require(house_owner_map[house_id] != address(0),"House not created");
        Range memory newRange;
        newRange.from_date = _from_date;
        newRange.to_date = _to_date;
        newRange.price = _price;
        newRange.available = true;
        bytes32 rangeHash = sha256(abi.encode(_from_date,_to_date));
        houseAriMap[house_id][rangeHash] = newRange;
        houseArikeyMap[house_id].push(rangeHash);
        return rangeHash;
    }
    
    function blockARI(uint256 house_id,uint256 _from_date, uint256 _to_date) public validateUser returns(bytes32){
        bytes32 rangeHash = sha256(abi.encode(_from_date,_to_date));
        require(house_owner_map[house_id] != address(0),"404:House not created");
        require(houseAriMap[house_id][rangeHash].from_date != 0,"404:Range not found");
        require(houseAriMap[house_id][rangeHash].available != false,"404:Range is not available");
        require(houseAriMap[house_id][rangeHash].block_timestamp < block.timestamp,"410: Range is booked earlier.");
        houseAriMap[house_id][rangeHash].available = false;
        houseAriMap[house_id][rangeHash].block_timestamp = block.timestamp;
        houseAriMap[house_id][rangeHash].modifying_entity = msg.sender;
        return rangeHash;
        
    }
    
    function releaseARI(uint256 house_id,uint256 _from_date, uint256 _to_date) public validateUser returns(bytes32){
        bytes32 rangeHash = sha256(abi.encode(_from_date,_to_date));
        require(house_owner_map[house_id] != address(0),"404:House not created");
        require(houseAriMap[house_id][rangeHash].from_date != 0,"404:Range not found");
        require(houseAriMap[house_id][rangeHash].available != true,"404:Range is not blocked");
        require(houseAriMap[house_id][rangeHash].modifying_entity == msg.sender,"403: Not your blocking to release!");
        houseAriMap[house_id][rangeHash].available = true;
        houseAriMap[house_id][rangeHash].block_timestamp = 0;
        houseAriMap[house_id][rangeHash].modifying_entity = address(0);
        return rangeHash;
        
    }
    
}