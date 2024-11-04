// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Claim {

    // Structure to store claim details
    struct ClaimDetail {
        uint256 claimId;
        uint256 policyId;
        string description;
        address claimant;
        bool isApproved;
    }

    // Mapping to store claims by policy ID
    mapping(uint256 => ClaimDetail[]) private claims;
    // Counter for generating unique claim IDs
    uint256 private nextClaimId = 1;

    // Event to signal that a new claim has been created
    event ClaimSubmitted(uint256 claimId, uint256 policyId, string description, address claimant);

    // Modifier to ensure the claim is created by the claimant
    modifier onlyClaimant(address _claimant) {
        require(_claimant == msg.sender, "Not the claimant.");
        _;
    }

    // Function to submit a new claim
    function submitClaim(uint256 _policyId, string memory _description) public returns (uint256) {
        uint256 claimId = nextClaimId++;

        // Create and store the claim
        ClaimDetail memory newClaim = ClaimDetail({
            claimId: claimId,
            policyId: _policyId,
            description: _description,
            claimant: msg.sender,
            isApproved: false
        });

        claims[_policyId].push(newClaim);

        // Emit the ClaimSubmitted event
        emit ClaimSubmitted(claimId, _policyId, _description, msg.sender);

        return claimId;
    }

    // Function to retrieve all claims for a specific policy ID
    function getClaimsByPolicyId(uint256 _policyId) public view returns (ClaimDetail[] memory) {
        return claims[_policyId];
    }

    // Function to approve a claim (can be restricted in real scenarios)
    function approveClaim(uint256 _policyId, uint256 _claimId) public {
        ClaimDetail[] storage policyClaims = claims[_policyId];
        for (uint256 i = 0; i < policyClaims.length; i++) {
            if (policyClaims[i].claimId == _claimId) {
                policyClaims[i].isApproved = true;
                break;
            }
        }
    }
}
