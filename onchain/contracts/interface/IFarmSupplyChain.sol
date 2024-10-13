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
        string qualityGrade;
        SupplyState state;
    }

    struct ProcessedBatch {
        uint256 id;
        uint256 bulkSupplyId;
        address processor;
        uint256 quantity;
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
        uint256 _suppylId,
        string memory _name,
        uint256 _quantity,
        string memory _unit,
        uint256 _pricePerUnit,
        string memory _originLocation
    ) external;

    function processBatch(
        uint256 _batchId,
        uint256 _bulkSupplyId,
        uint256 _quantity
    ) external;

    function reportSupplyQuality(uint256 _supplyId, string memory _qualityGrade) external;

    function reportBatchQuality(uint256 _batchId, string memory _qualityGrade) external;

    function distributeBatch(uint256 _batchId) external;

    function createRetailUnits(uint256 _retailId, uint256 _batchId, uint256 _quantity, uint256 _pricePerUnit) external;

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
        uint256 processingDate,
        string memory qualityGrade
    );

    function getBatchUnits(uint256 _batchId) external view returns (uint256[] memory);

    function getBulkSupplyBatches(uint256 _bulkSupplyId) external view returns (uint256[] memory);

    function getFarmerSupplies(address _farmer) external view returns (uint256[] memory);

    function getProcessorBatches(address _processor) external view returns (uint256[] memory);

    function getRetailerUnits(address _retailer) external view returns (uint256[] memory);

    // create and manage participants

    function createRole (address _account, string memory _role) external;
    function removeRole (address _account) external;

    function role (address account) external view returns (string memory);

    // Events
    event BulkSupplyRegistered(uint256 indexed id, string name, address indexed farmer, uint256 quantity, string unit, uint256 pricePerUnit);
    event BatchProcessed(uint256 indexed id, uint256 indexed bulkSupplyId, address indexed processor, uint256 quantity);
    event BatchQualityChecked(uint256 indexed id, address indexed inspector, string indexed qualityGrade);
    event BatchDistributed(uint256 indexed id, address indexed distributor);
    event UnitRetailed(uint256 indexed id, uint256 indexed batchId, address indexed retailer, uint256 price);
    event UnitSold(uint256 indexed id, address indexed consumer);
    event ReportSuplyQuality(uint indexed _supplyId, address indexed processor, string _qualityGrade);
}