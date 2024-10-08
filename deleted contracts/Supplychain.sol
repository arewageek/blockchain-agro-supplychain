// // SPDX-License-Identifier: UNLICENSED

// // initial contract model

// pragma solidity ^0.8.27;

// // Uncomment this line to use console.log
// // import "hardhat/console.sol";

// import {ISupplychain} from './interface/ISupplychain.sol';

// contract Supplychain is ISupplychain {

//     mapping (uint  => Batch) public batches;
//     uint currentBatch;

//     mapping (uint => Product) public products;
//     uint currentProduct;

//     mapping (uint => Supply) public supplies;
//     uint currentSupply;

//     mapping (address => bytes) public roles;

//     modifier OnlyRole (string memory _role) {
//         require(keccak256((bytes(roles[msg.sender]))) == keccak256(bytes(_role)), "UNAUTHORIZED");
//         _;
//     }
//     modifier OnlyRoles (string[] memory _roles) {
//         for(uint _index; _index < _roles.length; _index ++){
//             require(keccak256((bytes(roles[msg.sender]))) == keccak256(bytes(_roles[_index])));
//         }
//         _;
//     }
    
//     function createProduct(string memory _name, uint  _batchId) external{
//         Product memory product = Product(currentProduct, _batchId, _name, Status.CREATED, "", msg.sender, block.timestamp);
//         products[currentProduct] = product;

//         emit ProductCreated(currentProduct, _batchId, _name);
//         currentProduct ++;
//     }
//     function updateProductStatus(uint _productId, Status _newStatus, string memory _remark) external{
//         Product memory product = products[_productId];
//         product.status = _newStatus;
//         product.remark = _remark;
//         products[_productId] = product;
//     }
//     function productInfo(uint _productId) external view returns (Product memory){
//         return products[_productId];
//     }
    
//     function createBatch(string memory _name, uint _supplyId) external{
//         uint256[] memory _prods;
//         Batch memory batch = Batch(currentBatch, _supplyId, _prods, _name, Status.CREATED, "", msg.sender, block.timestamp);
//         batches[currentBatch] = batch;
        
//         emit BatchCreated(currentBatch, _supplyId, _name);
//         currentBatch++;
//     }
//     function updateBatchStatus(uint _batchId, string memory _remark, Status _status) external{
//         Batch memory batch = batches[_batchId];
//         batch.status = _status;
//         batch.remark = _remark;
//         batches[_batchId] = batch;
//     }
//     function batchInfo(uint _batchId) external view returns (Batch memory){
//         return batches[_batchId];
//     }

//     function createSupply(string memory _name) external{
//         uint256[] memory _allBatches;
//         Supply memory supply = Supply(currentSupply, _name, _allBatches, msg.sender, Status.CREATED, "", block.timestamp);
//         supplies[currentSupply] = supply;

//         emit SupplyCreated(currentSupply, _name);
//         currentSupply++;
//     }
//     function getSupplyInfo(uint supplyId) external{}

//     function setRole(address _participant, string memory _role) external{}
// }
