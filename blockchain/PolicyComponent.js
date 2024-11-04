import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import '/Users/bhavanachunduri/Downloads/blockchain_project copy/frontend/src/components/PolicyComponent.css'
const insurancePolicyABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "firstName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "lastName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "premiumAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "coverageAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "PolicyCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_firstName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_lastName",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_premiumIndex",
        "type": "uint8"
      }
    ],
    "name": "createPolicy",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllPolicies",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "policyId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "firstName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "lastName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "premiumAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "coverageAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "internalType": "struct InsurancePolicy.Policy[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCoverageOptions",
    "outputs": [
      {
        "internalType": "uint256[3]",
        "name": "",
        "type": "uint256[3]"
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
      }
    ],
    "name": "getPolicy",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "policyId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "firstName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "lastName",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "premiumAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "coverageAmount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "internalType": "struct InsurancePolicy.Policy",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPremiumOptions",
    "outputs": [
      {
        "internalType": "uint256[3]",
        "name": "",
        "type": "uint256[3]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const insurancePolicyAddress = "0xe49602a08ACeCaceEe894e0e22Df5956a8Ab108A";

const PolicyComponent = () => {
  const [provider, setProvider] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [createdPolicyId, setCreatedPolicyId] = useState(null);
  const [policyData, setPolicyData] = useState(null);
  const [allPolicies, setAllPolicies] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [premiumIndex, setPremiumIndex] = useState(0);
  const [premiumOptions, setPremiumOptions] = useState([]);
  const [coverageOptions, setCoverageOptions] = useState([]);

  useEffect(() => {
      const init = async () => {
          const provider = await detectEthereumProvider();
          if (provider) {
              setProvider(provider);
              const web3 = new Web3(provider);
              setWeb3(web3);
              const accounts = await web3.eth.getAccounts();
              setAccount(accounts[0]);
              const insuranceContract = new web3.eth.Contract(insurancePolicyABI, insurancePolicyAddress);
              setContract(insuranceContract);

              // Fetch premium and coverage options
              const premiumOptions = await insuranceContract.methods.getPremiumOptions().call();
              const coverageOptions = await insuranceContract.methods.getCoverageOptions().call();
              setPremiumOptions(premiumOptions);
              setCoverageOptions(coverageOptions);
          } else {
              console.error('Please install MetaMask!');
          }
      };
      init();
  }, []);

  const createPolicy = async () => {
      if (contract) {
          try {
              const result = await contract.methods.createPolicy(firstName, lastName, premiumIndex).send({ from: account });
              const newPolicyId = result.events.PolicyCreated.returnValues.policyId;
              setCreatedPolicyId(newPolicyId);
              alert('Policy created successfully! ID: ' + newPolicyId);
          } catch (error) {
              console.error('Error creating policy:', error);
          }
      }
  };

  const getPolicy = async () => {
      if (contract && policyId) {
          try {
              const policy = await contract.methods.getPolicy(policyId).call({ from: account });
              setPolicyData(policy);
          } catch (error) {
              console.error('Error retrieving policy:', error);
          }
      }
  };

  const getAllPolicies = async () => {
      if (contract) {
          try {
              const policies = await contract.methods.getAllPolicies().call({ from: account });
              setAllPolicies(policies);
          } catch (error) {
              console.error('Error retrieving all policies:', error);
          }
      }
  };

  return (
      <div className="policy-container">
          <h1>Insurance Policy Management</h1>

          <div className="form-section">
              <h2>Create Policy</h2>
              <div className="form-group">
                  <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <select value={premiumIndex} onChange={(e) => setPremiumIndex(Number(e.target.value))}>
                      {premiumOptions.map((premium, index) => (
                          <option key={index} value={index}>
                              Premium Option {index + 1}: {web3 && web3.utils.fromWei(premium, 'ether')} ETH
                          </option>
                      ))}
                  </select>
                  {premiumOptions.length > 0 && (
                      <p>Selected Premium: {web3.utils.fromWei(premiumOptions[premiumIndex], 'ether')} ETH</p>
                  )}
                  {coverageOptions.length > 0 && (
                      <p>Coverage Amount: {web3.utils.fromWei(coverageOptions[premiumIndex], 'ether')} ETH</p>
                  )}
                  <button onClick={createPolicy}>Create Policy</button>
              </div>
              {createdPolicyId && <p>Created Policy ID: {createdPolicyId}</p>}
          </div>

          <div className="form-section">
              <h2>Get Policy</h2>
              <div className="form-group">
                  <input type="number" placeholder="Policy ID" value={policyId} onChange={(e) => setPolicyId(e.target.value)} />
                  <button onClick={getPolicy}>Retrieve Policy</button>
              </div>
              {policyData && (
                  <div className="policy-details">
                      <h3>Policy Details</h3>
                      <p>ID: {policyData.policyId}</p>
                      <p>Name: {policyData.firstName} {policyData.lastName}</p>
                      <p>Premium Amount: {web3.utils.fromWei(policyData.premiumAmount, 'ether')} ETH</p>
                      <p>Coverage Amount: {web3.utils.fromWei(policyData.coverageAmount, 'ether')} ETH</p>
                  </div>
              )}
          </div>

          <div className="form-section">
              <h2>Get All Policies</h2>
              <button onClick={getAllPolicies}>Retrieve All Policies</button>
              <ul className="policy-list">
                  {allPolicies.map((policy, index) => (
                      <li key={index}>
                          ID: {policy.policyId}, Name: {policy.firstName} {policy.lastName}, Premium: {web3.utils.fromWei(policy.premiumAmount, 'ether')} ETH, Coverage: {web3.utils.fromWei(policy.coverageAmount, 'ether')} ETH
                      </li>
                  ))}
              </ul>
          </div>
      </div>
  );
};

export default PolicyComponent;
