import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '/Users/bhavanachunduri/Downloads/blockchain_project copy/frontend/src/components/ClaimComponent.css';

const CLAIM_CONTRACT_ADDRESS = '0x002B6faD5f7ad6406900837Bd2A1789Fc19455CB';
const ClaimABI=[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "claimId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "policyId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "claimant",
          "type": "address"
        }
      ],
      "name": "ClaimSubmitted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_policyId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_claimId",
          "type": "uint256"
        }
      ],
      "name": "approveClaim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_policyId",
          "type": "uint256"
        }
      ],
      "name": "getClaimsByPolicyId",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "claimId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "policyId",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "claimant",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isApproved",
              "type": "bool"
            }
          ],
          "internalType": "struct Claim.ClaimDetail[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_policyId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        }
      ],
      "name": "submitClaim",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const ClaimComponent = () => {
    const [policyId, setPolicyId] = useState('');
    const [description, setDescription] = useState('');
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const initializeContract = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            return new ethers.Contract(CLAIM_CONTRACT_ADDRESS, ClaimABI, signer);
        } catch (error) {
            console.error("Error initializing contract:", error);
            return null;
        }
    };

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const contract = await initializeContract();
            if (contract && policyId) {
                const claimsArray = await contract.getClaimsByPolicyId(policyId);
                const formattedClaims = claimsArray.map((claim) => ({
                    claimId: claim.claimId.toNumber(),
                    description: claim.description,
                    claimant: claim.claimant,
                    isApproved: claim.isApproved
                }));

                setClaims(formattedClaims);
            }
        } catch (error) {
            console.error("Error fetching claims:", error);
            setMessage("Failed to load claims. Check the policy ID.");
        }
        setLoading(false);
    };

    const submitClaim = async () => {
        setLoading(true);
        setMessage('');
        try {
            const contract = await initializeContract();
            if (contract) {
                const transaction = await contract.submitClaim(policyId, description);
                await transaction.wait();
                setMessage('Claim submitted successfully!');
                setDescription('');
                const updatedClaims = await contract.getClaimsByPolicyId(policyId);
                const formattedUpdatedClaims = updatedClaims.map((claim) => ({
                    claimId: claim.claimId.toNumber(),
                    description: claim.description,
                    claimant: claim.claimant,
                    isApproved: claim.isApproved
                }));
                setClaims(formattedUpdatedClaims);
            }
        } catch (error) {
            console.error("Error submitting claim:", error);
            setMessage("Failed to submit claim. Ensure the policy ID is correct.");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (policyId) {
            fetchClaims();
        }
    }, [policyId]);

    return (
        <div className="claim-container">
            <h2>Submit a New Claim</h2>
            <div className="form-group">
                <label>Policy ID:</label>
                <input
                    type="text"
                    value={policyId}
                    onChange={(e) => setPolicyId(e.target.value)}
                    placeholder="Enter Policy ID"
                    required
                />
            </div>
            <div className="form-group">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the claim"
                    required
                />
            </div>
            <button className="submit-button" onClick={submitClaim} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
            {message && <p className="message">{message}</p>}

            <h2>Existing Claims for Policy ID {policyId}</h2>
            {loading ? (
                <p>Loading claims...</p>
            ) : claims.length > 0 ? (
                <ul className="claims-list">
                    {claims.map((claim, index) => (
                        <li key={index} className="claim-item">
                            <p><strong>Claim ID:</strong> {claim.claimId}</p>
                            <p><strong>Description:</strong> {claim.description}</p>
                            <p><strong>Claimant:</strong> {claim.claimant}</p>
                            <p><strong>Status:</strong> {claim.isApproved ? "Approved" : "Pending"}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No claims found for this policy ID.</p>
            )}
        </div>
    );
};

export default ClaimComponent;