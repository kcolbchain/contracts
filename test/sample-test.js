const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("Marketplace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    // let listingPrice = await market.getListingPrice();
    // listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('1', 'ether');

    // sample test image
    await nft.createToken("https://www.logo.wine/a/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.svg");
    await nft.createToken("https://www.logo.wine/a/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.svg");
    await nft.createToken("https://www.logo.wine/a/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.svg");

    // await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice });
    await market.createMarketItem(nftContractAddress, 1, auctionPrice);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice);
    const [_, buyerAddress] = await ethers.getSigners();

    var items = await market.fetchMarketItems()
    // console.log(items);
    // items = await Promise.all(items.map(async i => {
    //   const tokenUri = await nft.tokenURI(i.tokenId)
    //   let item = {
    //     price: i.price.toString(),
    //     tokenId: i.tokenId.toString(),
    //     seller: i.seller,
    //     owner: i.owner,
    //     tokenUri
    //   }
    // }))
    console.log("items before sale", items);

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    items = await market.fetchMarketItems()
    console.log("after sale: ", items);

    items = await market.fetchMyNFTs()
    console.log("My items: ", items);
  });
});