// SPDX-License-Identifier: MIT

// new proposed model for contract

pragma solidity ^0.8.0;

import {IFarmSupplyChain} from "./interface/IFarmSupplyChain.sol";
// import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
// import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract FarmSupplyChain is IFarmSupplyChain, ReentrancyGuard, Pausable {
    uint private counters;

    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    bytes32 public constant QUALITY_INSPECTOR_ROLE = keccak256("QUALITY_INSPECTOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint private _bulkSupplyIds;
    uint private _batchIds;
    uint private _unitIds;

    mapping(uint256 => BulkSupply) public bulkSupplies;
    mapping(uint256 => ProcessedBatch) public processedBatches;
    mapping(uint256 => RetailUnit) public retailUnits;
    mapping(uint256 => uint256[]) public bulkSupplyToBatches;
    mapping(uint256 => uint256[]) public batchToUnits;

    // New mappings for enhanced tracking
    mapping(address => uint256[]) public farmerSupplies;
    mapping(address => uint256[]) public processorBatches;
    mapping(address => uint256[]) public retailerUnits;

    mapping(address => bytes32) private roles;

    constructor() {
        // _setupRole(", msg.sender);
        _setupRole("ADMIN_ROLE", msg.sender);
    }

    modifier onlyRole(bytes32 role) {
        require(roles[msg.sender] == role, "unauthorized caller");
        _;
    }

    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function registerBulkSupply(
        string memory _name,
        uint256 _quantity,
        string memory _unit,
        uint256 _pricePerUnit,
        string memory _originLocation,
        uint256 _harvestDate
    ) public override onlyRole(FARMER_ROLE) whenNotPaused {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_pricePerUnit > 0, "Price per unit must be greater than zero");
        require(_harvestDate <= block.timestamp, "Harvest date cannot be in the future");

        _bulkSupplyIds++;
        uint256 newSupplyId = _bulkSupplyIds;

        BulkSupply storage newSupply = bulkSupplies[newSupplyId];
        newSupply.id = newSupplyId;
        newSupply.name = _name;
        newSupply.farmer = msg.sender;
        newSupply.quantity = _quantity;
        newSupply.unit = _unit;
        newSupply.pricePerUnit = _pricePerUnit;
        newSupply.originLocation = _originLocation;
        newSupply.harvestDate = _harvestDate;
        newSupply.state = SupplyState.Registered;

        farmerSupplies[msg.sender].push(newSupplyId);

        emit BulkSupplyRegistered(newSupplyId, _name, msg.sender, _quantity, _unit, _pricePerUnit);
    }

    function processBatch(
        uint256 _bulkSupplyId,
        uint256 _quantity,
        string memory _batchNumber
    ) public override onlyRole(PROCESSOR_ROLE) whenNotPaused {
        require(bulkSupplies[_bulkSupplyId].state == SupplyState.Registered, "Bulk supply must be in Registered state");
        require(bulkSupplies[_bulkSupplyId].quantity >= _quantity, "Insufficient quantity in bulk supply");
        require(_quantity > 0, "Quantity must be greater than zero");

        _batchIds++;
        uint256 newBatchId = _batchIds;

        ProcessedBatch storage newBatch = processedBatches[newBatchId];
        newBatch.id = newBatchId;
        newBatch.bulkSupplyId = _bulkSupplyId;
        newBatch.processor = msg.sender;
        newBatch.quantity = _quantity;
        newBatch.batchNumber = _batchNumber;
        newBatch.processingDate = block.timestamp;
        newBatch.state = SupplyState.Processed;

        bulkSupplies[_bulkSupplyId].quantity -= _quantity;
        if (bulkSupplies[_bulkSupplyId].quantity == 0) {
            bulkSupplies[_bulkSupplyId].state = SupplyState.Processed;
        }

        bulkSupplyToBatches[_bulkSupplyId].push(newBatchId);
        processorBatches[msg.sender].push(newBatchId);

        emit BatchProcessed(newBatchId, _bulkSupplyId, msg.sender, _quantity, _batchNumber);
    }

    function checkBatchQuality(uint256 _batchId, string memory _qualityGrade) public override onlyRole(QUALITY_INSPECTOR_ROLE) whenNotPaused {
        require(processedBatches[_batchId].state == SupplyState.Processed, "Batch must be in Processed state");
        processedBatches[_batchId].qualityGrade = _qualityGrade;
        processedBatches[_batchId].state = SupplyState.QualityChecked;
        emit BatchQualityChecked(_batchId, msg.sender, _qualityGrade);
    }

    function distributeBatch(uint256 _batchId) public override onlyRole(DISTRIBUTOR_ROLE) whenNotPaused {
        require(processedBatches[_batchId].state == SupplyState.QualityChecked, "Batch must be in QualityChecked state");
        processedBatches[_batchId].state = SupplyState.Distributed;
        emit BatchDistributed(_batchId, msg.sender);
    }

    function createRetailUnits(uint256 _batchId, uint256 _quantity, uint256 _pricePerUnit) public override onlyRole(RETAILER_ROLE) whenNotPaused {
        require(processedBatches[_batchId].state == SupplyState.Distributed, "Batch must be in Distributed state");
        require(processedBatches[_batchId].quantity >= _quantity, "Insufficient quantity in batch");
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_pricePerUnit > 0, "Price per unit must be greater than zero");

        for (uint256 i = 0; i < _quantity; i++) {
            _unitIds++;
            uint256 newUnitId = _unitIds;

            RetailUnit storage newUnit = retailUnits[newUnitId];
            newUnit.id = newUnitId;
            newUnit.batchId = _batchId;
            newUnit.retailer = msg.sender;
            newUnit.price = _pricePerUnit;
            newUnit.state = SupplyState.Retailed;

            batchToUnits[_batchId].push(newUnitId);
            retailerUnits[msg.sender].push(newUnitId);

            emit UnitRetailed(newUnitId, _batchId, msg.sender, _pricePerUnit);
        }

        processedBatches[_batchId].quantity -= _quantity;
        if (processedBatches[_batchId].quantity == 0) {
            processedBatches[_batchId].state = SupplyState.Retailed;
        }
    }

    function sellUnit(uint256 _unitId) public payable override nonReentrant whenNotPaused {
        RetailUnit storage unit = retailUnits[_unitId];
        require(unit.state == SupplyState.Retailed, "Unit must be in Retailed state");
        require(msg.value >= unit.price, "Insufficient payment");

        unit.consumer = msg.sender;
        unit.state = SupplyState.Sold;

        // Transfer payment to the retailer
        payable(unit.retailer).transfer(msg.value);

        emit UnitSold(_unitId, msg.sender);
    }

    function getUnitHistory(uint256 _unitId) public view override returns (
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
    ) {
        RetailUnit storage unit = retailUnits[_unitId];
        ProcessedBatch storage batch = processedBatches[unit.batchId];
        BulkSupply storage supply = bulkSupplies[batch.bulkSupplyId];

        return (
            unit.id,
            unit.batchId,
            batch.bulkSupplyId,
            supply.farmer,
            batch.processor,
            unit.retailer,
            unit.consumer,
            supply.name,
            supply.originLocation,
            supply.harvestDate,
            batch.processingDate,
            batch.qualityGrade
        );
    }

    function getBatchUnits(uint256 _batchId) public view override returns (uint256[] memory) {
        return batchToUnits[_batchId];
    }

    function getBulkSupplyBatches(uint256 _bulkSupplyId) public view override returns (uint256[] memory) {
        return bulkSupplyToBatches[_bulkSupplyId];
    }

    // New functions for enhanced tracking
    function getFarmerSupplies(address _farmer) public view returns (uint256[] memory) {
        return farmerSupplies[_farmer];
    }

    function getProcessorBatches(address _processor) public view returns (uint256[] memory) {
        return processorBatches[_processor];
    }

    function getRetailerUnits(address _retailer) public view returns (uint256[] memory) {
        return retailerUnits[_retailer];
    }


    // internal functions
    function _setupRole(string memory role, address operator) internal{

    }
}