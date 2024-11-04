// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsurancePolicy {

    // Structure to store policy details
    struct Policy {
        uint256 policyId;
        string firstName;
        string lastName;
        uint256 premiumAmount;
        uint256 coverageAmount;
        address owner;
    }

    // Mapping to store policies by policy ID
    mapping(uint256 => Policy) private policies;
    // Array to store all policy IDs for easy retrieval
    uint256[] private policyIds;

    // Counters for generating unique policy IDs
    uint256 private nextPolicyId = 1;

    // Premium and coverage options
    uint256[3] private premiumOptions = [1 ether, 2 ether, 3 ether];
    uint256[3] private coverageOptions = [10 ether, 20 ether, 30 ether];

    // Modifier to ensure only the policy owner can access certain functions
    modifier onlyOwner(uint256 _policyId) {
        require(policies[_policyId].owner == msg.sender, "Not the policy owner.");
        _;
    }

    // Event to signal that a new policy has been created
    event PolicyCreated(uint256 policyId, string firstName, string lastName, uint256 premiumAmount, uint256 coverageAmount, address owner);

    // Function to create a new insurance policy
    function createPolicy(string memory _firstName, string memory _lastName, uint8 _premiumIndex) public returns (uint256) {
        require(_premiumIndex < premiumOptions.length, "Invalid premium option selected.");

        // Generate unique policy ID
        uint256 policyId = nextPolicyId++;
        
        // Determine premium and coverage based on selected index
        uint256 premiumAmount = premiumOptions[_premiumIndex];
        uint256 coverageAmount = coverageOptions[_premiumIndex];

        // Create and store the policy
        policies[policyId] = Policy({
            policyId: policyId,
            firstName: _firstName,
            lastName: _lastName,
            premiumAmount: premiumAmount,
            coverageAmount: coverageAmount,
            owner: msg.sender
        });
        policyIds.push(policyId); // Add policy ID to list

        // Emit the PolicyCreated event
        emit PolicyCreated(policyId, _firstName, _lastName, premiumAmount, coverageAmount, msg.sender);

        return policyId;
    }

    // Function to retrieve a single policy by policy ID
    function getPolicy(uint256 _policyId) public view onlyOwner(_policyId) returns (Policy memory) {
        return policies[_policyId];
    }

    // Function to retrieve all policies
    function getAllPolicies() public view returns (Policy[] memory) {
        Policy[] memory allPolicies = new Policy[](policyIds.length);

        for (uint256 i = 0; i < policyIds.length; i++) {
            allPolicies[i] = policies[policyIds[i]];
        }
        return allPolicies;
    }

    // Function to get premium and coverage options
    function getPremiumOptions() public view returns (uint256[3] memory) {
        return premiumOptions;
    }
    
    function getCoverageOptions() public view returns (uint256[3] memory) {
        return coverageOptions;
    }
}
