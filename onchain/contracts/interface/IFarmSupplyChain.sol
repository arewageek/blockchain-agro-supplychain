// SPDX-License-Identifier: MIT

// new proposed model for contract interface

pragma solidity ^0.8.27;

interface IFarmSupplyChain {
    enum SupplyState { Registered, Processed, QualityChecked, Distributed, Retailed, Sold }

    struct BulkSupply {
        uint256 id;
        string name;
        address farmer;
        uint256 quantity;
        string unit;
        uint256 pricePerUnit;
        string originLocation;
        uint256 harvestDate;
        SupplyState state;
    }

    struct ProcessedBatch {
        uint256 id;
        uint256 bulkSupplyId;
        address processor;
        uint256 quantity;
        string batchNumber;
        uint256 processingDate;
        string qualityGrade;
        SupplyState state;
    }

    struct RetailUnit {
        uint256 id;
        uint256 batchId;
        address retailer;
        address consumer;
        uint256 price;
        SupplyState state;
    }

    function registerBulkSupply(
        string memory _name,
        uint256 _quantity,
        string memory _unit,
        uint256 _pricePerUnit,
        string memory _originLocation,
        uint256 _harvestDate
    ) external;

    function processBatch(
        uint256 _bulkSupplyId,
        uint256 _quantity,
        string memory _batchNumber
    ) external;

    function checkBatchQuality(uint256 _batchId, string memory _qualityGrade) external;

    function distributeBatch(uint256 _batchId) external;

    function createRetailUnits(uint256 _batchId, uint256 _quantity, uint256 _pricePerUnit) external;

    function sellUnit(uint256 _unitId) external payable;

    function getUnitHistory(uint256 _unitId) external view returns (
        uint256 unitId,
        uint256 batchId,
        uint256 bulkSupplyId,
        address farmer,
        address processor,
        address retailer,
        address consumer,
        string memory productName,
        string memory originLocation,
        uint256 harvestDate,
        uint256 processingDate,
        string memory qualityGrade
    );

    function getBatchUnits(uint256 _batchId) external view returns (uint256[] memory);

    function getBulkSupplyBatches(uint256 _bulkSupplyId) external view returns (uint256[] memory);

    function getFarmerSupplies(address _farmer) external view returns (uint256[] memory);

    function getProcessorBatches(address _processor) external view returns (uint256[] memory);

    function getRetailerUnits(address _retailer) external view returns (uint256[] memory);

    // Events
    event BulkSupplyRegistered(uint256 id, string name, address farmer, uint256 quantity, string unit, uint256 pricePerUnit);
    event BatchProcessed(uint256 id, uint256 bulkSupplyId, address processor, uint256 quantity, string batchNumber);
    event BatchQualityChecked(uint256 id, address inspector, string qualityGrade);
    event BatchDistributed(uint256 id, address distributor);
    event UnitRetailed(uint256 id, uint256 batchId, address retailer, uint256 price);
    event UnitSold(uint256 id, address consumer);
}