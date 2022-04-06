// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

import {Ownable} from '../dependencies/openzeppelin/contracts/Ownable.sol';
import "./VinciCollectAggregator.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * PLEASE DO NOT USE THIS CODE IN PRODUCTION.
 */
contract VinciChainlinkClient is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    struct Node {
        address oracle;
        bytes32 jobId;
        uint256 fee;
        string url;
        string path;
    }
    
    mapping(address => Node) internal nodes;
    mapping(bytes32 => address) private b_aggregators;

    /**
     * Network: Kovan
     * Oracle: 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8 (Chainlink Devrel   
     * Node)
     * Job ID: d5270d1c311941d0b08bead21fea7747
     * Fee: 0.1 LINK 0.1 * 10 ** 18
     */
    constructor() {
        setPublicChainlinkToken();
    }
    
    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData(address _aggregator) public onlyOwner returns (bytes32 requestId) 
    {
        require(nodes[_aggregator].oracle != address(0x0), "please update nodes");
        Chainlink.Request memory request = buildChainlinkRequest(nodes[_aggregator].jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", nodes[_aggregator].url);
        request.add("path", nodes[_aggregator].path);
        
        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);
        
        // Sends the request
        bytes32 Id = sendChainlinkRequestTo(nodes[_aggregator].oracle, request, nodes[_aggregator].fee);
        b_aggregators[Id] = _aggregator;
        return Id;
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, int256 _data) public recordChainlinkFulfillment(_requestId)
    {
        VinciCollectAggregator(b_aggregators[_requestId]).submit(_data);
        delete b_aggregators[_requestId];
    }

    function setNode(
        address _aggregator,
        address _oracle,
        bytes32 _jobId,
        uint256 _fee,
        string memory _url,
        string memory _path
        ) public onlyOwner {
        nodes[_aggregator].oracle = _oracle;
        nodes[_aggregator].jobId = _jobId;
        nodes[_aggregator].fee = _fee;
        nodes[_aggregator].url = _url;
        nodes[_aggregator].path = _path;
    }

    function getNode(address _aggregator) public view
        returns (
        address oracle,
        bytes32 jobId,
        uint256 fee,
        string memory url,
        string memory path
        )
    {
        Node memory n = nodes[_aggregator];
        return (
        n.oracle,
        n.jobId,
        n.fee,
        n.url,
        n.path
        );
    }

   function LinkBalanceOf() public view returns (uint256) {
       LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
       return link.balanceOf(address(this));
   }
}
