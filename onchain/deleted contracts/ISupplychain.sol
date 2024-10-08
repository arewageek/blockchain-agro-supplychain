// // SPDX-License-Identifier: MIT

// // first model for contract interface

// pragma solidity ^0.8.27;

// interface ISupplychain {
    
//     enum Status {
//         CREATED,
//         SHIPPED,
//         DELIVERED
//     }
    
//     // a struct to for the product
//     struct Product {
//         uint productId;
//         uint batchId;
//         string name;
//         Status status;
//         string remark;
//         address currentHandler;
//         uint timestamp;
//     }

//     // a struct for the batch
//     struct Batch{
//         uint batchId;
//         uint supplyId;
//         uint[] productIds;
//         string name;
//         Status status;
//         string remark;
//         address currentHandler;
//         uint timestamp;
//     }

//     struct Supply {
//         uint supplyId;
//         string name;
//         uint[] batchIds;
//         address currentHandler;
//         Status status;
//         string remark;
//         uint timestamp;
//     }

//     event ProductCreated(uint indexed productId, uint indexed batchId, string name);
//     event ProductUpdated(uint indexed productId, Status status);

//     event BatchCreated(uint indexed batchId, uint indexed supplyid, string name);
//     event BatchUpdated(uint indexed batchId, Status status);

//     event SupplyCreated(uint indexed supplyId, string name);

//     function createProduct(string memory _name, uint  _batchId) external;
//     function updateProduct(uint _productId, Status _newStatus, string memory _remark) external;
//     function productInfo(uint _productId) external view returns (Product memory);
    
//     function createBatch(string memory _name, uint _supplyId) external;
//     function updateBatch(uint batchId, string memory remark, Status _status) external;
//     function batchInfo(uint _batchId) external view returns (Batch memory);

//     function createSupply(string memory _name) external;
//     function getSupplyInfo(uint supplyId) external;

//     function setRole(address _participant, string memory _role) external;
// }