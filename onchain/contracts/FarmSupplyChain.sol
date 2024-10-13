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
        _setupRole(msg.sender, "ADMIN_ROLE");
    }

    modifier onlyRole(bytes32 _role) {
        require(roles[msg.sender] == _role, "unauthorized caller");
        _;
    }

    function pause() public onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function registerBulkSupply(
        uint256 _supplyId,
        string memory _name,
        uint256 _quantity,
        string memory _unit,
        uint256 _pricePerUnit,
        string memory _originLocation
        // uint256 _harvestDate
    ) public onlyRole(FARMER_ROLE) whenNotPaused {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_pricePerUnit > 0, "Price per unit must be greater than zero");
        // require(_harvestDate <= block.timestamp, "Harvest date cannot be in the future");

        // _bulkSupplyIds++;
        // uint256 newSupplyId = _bulkSupplyIds;

        BulkSupply storage newSupply = bulkSupplies[_supplyId];
        newSupply.id = _supplyId;
        newSupply.name = _name;
        newSupply.farmer = msg.sender;
        newSupply.quantity = _quantity;
        newSupply.unit = _unit;
        newSupply.pricePerUnit = _pricePerUnit;
        newSupply.originLocation = _originLocation;
        newSupply.qualityGrade = "Null";
        newSupply.state = SupplyState.Registered;

        bulkSupplies[_supplyId] = newSupply;
        farmerSupplies[msg.sender].push(_supplyId);

        emit BulkSupplyRegistered(_supplyId, _name, msg.sender, _quantity, _unit, _pricePerUnit);
    }

    function processBatch(
        uint256 _batchId,
        uint256 _bulkSupplyId,
        uint256 _quantity
    ) public onlyRole(PROCESSOR_ROLE) whenNotPaused {
        BulkSupply memory supply = bulkSupplies[_bulkSupplyId];

        require(supply.state == SupplyState.Registered, "Bulk supply must be in Registered state");
        require(supply.quantity >= _quantity, "Insufficient quantity in bulk supply");
        require(_quantity > 0, "Quantity must be greater than zero");

        // _batchIds++;
        // uint256 newBatchId = _batchIds;

        ProcessedBatch memory newBatch;
        newBatch.id = _batchId;
        newBatch.bulkSupplyId = _bulkSupplyId;
        newBatch.processor = msg.sender;
        newBatch.quantity = _quantity;
        newBatch.processingDate = block.timestamp;
        newBatch.state = SupplyState.Processed;

        supply.quantity -= _quantity;

        if (supply.quantity == 0) {
            supply.state = SupplyState.Processed;
        }

        bulkSupplyToBatches[_bulkSupplyId].push(_batchId);
        processorBatches[msg.sender].push(_batchId);

        processedBatches[_batchId] = newBatch;

        emit BatchProcessed(_batchId, _bulkSupplyId, msg.sender, _quantity);
    }

    function reportSupplyQuality(uint256 _supplyId, string memory _qualityGrade) external override onlyRole(PROCESSOR_ROLE) whenNotPaused {
        BulkSupply memory supply = bulkSupplies[_supplyId];
        require(supply.state == SupplyState.Registered, "Supplies must be registered");
        bulkSupplies[_supplyId].qualityGrade = _qualityGrade;

        emit ReportSuplyQuality(_supplyId, msg.sender, _qualityGrade);
    }

    function reportBatchQuality(uint256 _batchId, string memory _qualityGrade) public override onlyRole(QUALITY_INSPECTOR_ROLE) whenNotPaused {
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

    function createRetailUnits(uint256 _retailId, uint256 _batchId, uint256 _quantity, uint256 _pricePerUnit) public override onlyRole(RETAILER_ROLE) whenNotPaused {
        ProcessedBatch memory batch = processedBatches[_batchIds];
        require(batch.state == SupplyState.Distributed, "Batch must be in Distributed state");
        require(batch.quantity >= _quantity, "Insufficient quantity in batch");
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_pricePerUnit > 0, "Price per unit must be greater than zero");

        for (uint256 i = 0; i < _quantity; i++) {
            // _unitIds++;
            // uint256 newUnitId = _unitIds;

            RetailUnit memory newUnit = retailUnits[_retailId];
            newUnit.id = _retailId;
            newUnit.batchId = _batchId;
            newUnit.retailer = msg.sender;
            newUnit.price = _pricePerUnit;
            newUnit.state = SupplyState.Retailed;

            batchToUnits[_batchId].push(_retailId);
            retailerUnits[msg.sender].push(_retailId);

            emit UnitRetailed(_retailId, _batchId, msg.sender, _pricePerUnit);
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

    // create and manage participants

    function createRole (address _account, string memory _role) external onlyRole(ADMIN_ROLE){
        _setupRole(_account, _role);
    }

    function removeRole (address _account) external onlyRole(ADMIN_ROLE) {
        roles[_account] = keccak256("CUSTOMER_ROLE");
    }

    function role (address _account) external view returns (string memory) {
        // 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775 admin role
        // 0xfbd454f36a7e1a388bd6fc3ab10d434aa4578f811acbbcf33afb1c697486313c distributor role
        // 0x7c6181838a71a779e445600d4c6ecbe16bacf2b3c5bda69c29fada66d1b645d1 farmer role
        // 0xe61decff6e4a5c6b5a3d3cbd28f882e595173563b49353ce5f31dba2de7f05ee processor role
        // 0x66108bb9ee7f804cb1c563794e51989792a366e4b648e4b2b9189d9587e1880d quality inspector role
        // 0x2a5f906c256a5d799494fcd066e1f6c077689de1cdb65052a1624de4bace99bf retailer role
        
        
        bytes32 _role = roles[_account];
        if(_role == FARMER_ROLE){
            return "FARMER";
        }
        else if (_role == DISTRIBUTOR_ROLE){
            return "DISTRIBUTOR";
        }
        else if (_role == PROCESSOR_ROLE){
            return "PROCESSOR";
        }
        else if (_role == QUALITY_INSPECTOR_ROLE) {
            return "QUALITY INSPECTOR";
        }
        else if (_role == ADMIN_ROLE){
            return "ADMIN";
        }
        else{
            return "CUSTOMER";
        }
    }


    // internal functions
    function _setupRole(address _account, string memory _role) internal{
        roles[_account] = keccak256(abi.encodePacked(_role));
    }
}