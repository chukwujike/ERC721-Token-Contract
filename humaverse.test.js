const Humaverse = artifacts.require('Humaverse');


beforeEach(async () => {
  humaverse = await Humaverse.deployed();
});

contract('Humaverse', async (accounts) => {

    owner = accounts[0];

    it('should deploy smart contract properly', async () => {
        console.log(humaverse.address);
        assert(humaverse.address !== '');
    });

    it('should change state of setIsAllowListActive', async () => {
        await humaverse.setIsAllowListActive(true,{from: owner});
        const result = await humaverse.ViewisAllowList({from: owner});
        assert.equal(result,true);
    });

    it('only owner should change state of setIsAllowListActive', async () => {
        try {
            await humaverse.setIsAllowListActive("true",{from: accounts[1]});
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('should change state of setSaleState', async () => {
        await humaverse.setSaleState(true, {from: owner});
        const result = await humaverse.viewSaleState({from: owner});
        assert.equal(result,true);
    });

    it('only owner should change state of setSaleState', async () => {
        try {
            await humaverse.setSaleState("true",{from: accounts[1]});
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('should change state of setRevealed', async () => {
        await humaverse.setRevealed(true, {from: owner}); 
        const result = await humaverse.viewRevealed({from: owner});
        assert.equal(result,true);
    });

    it('only owner should change state of setRevealed', async () => {
        try {
            await humaverse.setRevealed("true",{from: accounts[1]});
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('should set provenance', async () => {
        await humaverse.setProvenance("boole", {from: owner});
        result = await humaverse.viewProvenance({from: owner});
        assert(result == "boole");
    });

    it('only owner set provenance', async () => {
        try {
            await humaverse.setProvenance("true",{from: accounts[1]});
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('should update whitelist and allow minting', async () => {
        await humaverse.setAllowList([
            "0x4d880201e5b9af0edd3e3d6226b4b1324b832f63",
            "0x392ce9b3709bdc79c92d41973c4733d9180778bd",
            "0xf749271affe5ecfeb118acf5ad4b2b39d5b0ff3c",
            "0x234c04d69ae0e59280727f938589417c8d35eaec"], 2, {from: owner});
        result = await humaverse.numAvailableToMint("0x4d880201e5b9af0edd3e3d6226b4b1324b832f63", {from: owner});
        console.log(result);
        assert.equal(result, 2);        

    });

    it('only owner should update whitelist', async () => {            
        try {
            await humaverse.setAllowList([
                "0x4d880201e5b9af0edd3e3d6226b4b1324b832f63",
                "0x392ce9b3709bdc79c92d41973c4733d9180778bd",
                "0xf749271affe5ecfeb118acf5ad4b2b39d5b0ff3c",
                "0x234c04d69ae0e59280727f938589417c8d35eaec"], 2, {from: accounts[1]}), 
            "Ownable: caller is not the owner"
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('should enable whitelisted candidates to mint', async () => {
        await humaverse.setAllowList([
            "0x4d880201e5b9af0edd3e3d6226b4b1324b832f63",
            "0x392ce9b3709bdc79c92d41973c4733d9180778bd",
            "0xf749271affe5ecfeb118acf5ad4b2b39d5b0ff3c",
            "0x234c04d69ae0e59280727f938589417c8d35eaec"], 2, {from: owner});
        await humaverse.mintAllowList(2, {
            from: owner, 
            value: web3.utils.toWei('0.02', 'ether')
        });
        result = await humaverse.ownerOf(0, {from: owner});
        result1 = await humaverse.ownerOf(1, {from: owner});
        assert.equal(result, result1,owner);
    });

    it('should set token id', async () => {
        await humaverse.setBaseURI(
            "https://ipfs.io/ipfs/QmYUuYPpK1kFh2BDXSocuBvJn8yHkXEcAhiSgVkyQiCE97/", 
            {from: owner}
            );
        await humaverse.setUriSuffix(".img", {from: owner});
        await humaverse.setRevealed(true, {from: owner});
        await humaverse.setSaleState(true, {from: owner});
        await humaverse.mint(1, {
            from: owner, 
            value: web3.utils.toWei('0.246','ether')});
        await humaverse.setTokenURI(0, {from: owner});
        result = await humaverse.tokenURI(0, {
            from: owner});
        assert.equal(result,"https://ipfs.io/ipfs/QmYUuYPpK1kFh2BDXSocuBvJn8yHkXEcAhiSgVkyQiCE97/0.img");

    });

    it('only owner should set token id', async () => {
        await humaverse.setSaleState(true, {from: owner});
        await humaverse.mint(2, {
            from: owner, 
            value: web3.utils.toWei('0.246','ether')});
        try {
            await humaverse.setTokenURI(0, {from: accounts[1]});
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('should set Hidden Metadata URI', async () => {
        await humaverse.setBaseURI(
            "https://ipfs.io/ipfs/QmYUuYPpK1kFh2BDXSocuBvJn8yHkXEcAhiSgVkyQiCE97/", 
            {from: owner}
            );
        await humaverse.setUriSuffix(".img", {from: owner});
        await humaverse.setSaleState(true, {from: owner});
        await humaverse.setRevealed(false, {from: owner});
        await humaverse.setHiddenMetadataUri("gbagada",{from: owner});
        await humaverse.mint(1, {
            from: owner, 
            value: web3.utils.toWei('0.246','ether')});
        await humaverse.setTokenURI(0, {from: owner});
        result = await humaverse.tokenURI(0, {
            from: owner});
        assert.equal(result,"gbagada");

    });

    it('only owner can set Hidden Metadata URI', async () => {
        try {
            await humaverse.setHiddenMetadataUri(
                "https://ipfs.io/ipfs/QmYUuYPpK1kFh2BDXSocuBvJn8yHkXEcAhiSgVkyQiCE97/", 
                {from: accounts[1]}
                );
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('only owner can set Base URI', async () => {
        try {
            await humaverse.setBaseURI(
                "https://ipfs.io/ipfs/QmYUuYPpK1kFh2BDXSocuBvJn8yHkXEcAhiSgVkyQiCE97/", 
                {from: accounts[1]}
                );
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('only owner can set URI suffix', async () => {
        try {
            await humaverse.setUriSuffix(
                "https://ipfs.io/ipfs/QmYUuYPpK1kFh2BDXSocuBvJn8yHkXEcAhiSgVkyQiCE97/", 
                {from: accounts[1]}
                );
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('should mint tokens', async () => {
        await humaverse.setSaleState(true, {from: owner});
        await humaverse.mint(1, {
            from: owner, 
            value: web3.utils.toWei('0.246','ether')});
        result = await humaverse.ownerOf(0, {from: owner});
        assert.equal(result, owner);
    });

    it('reserves tokens for the owner', async () => {
        await humaverse.reserve(3, {from: owner});
        result = await humaverse.ownerOf(0, {from: owner});
        result1 = await humaverse.ownerOf(1, {from: owner});
        result2 = await humaverse.ownerOf(2, {from: owner});
        assert.equal(result, result1, result2, owner);
    });

    it('only owner should reserve tokens', async () => {
        try {
            await humaverse.reserve(2, {from: accounts[1]});
        } catch (error) {
             assert(error, "Ownable: caller is not the owner");
        }
    });

    it('Withdraws successfully', async () => {
        const initialBalance = await web3.eth.getBalance(owner);
        await humaverse.setSaleState(true, {from: owner});
        await humaverse.mint(2, {
            from: owner, 
            value: web3.utils.toWei('0.246','ether')});
        await humaverse.withdraw({from: owner});
        const finalBalance = await web3.eth.getBalance(owner);
        const difference = finalBalance - initialBalance;
    
        assert(difference > web3.utils.toWei('0.243', 'ether'));
    });

    it('only the owner can withdraw funds', async () => {
        await humaverse.setSaleState(true, {from: owner});
        await humaverse.mint(2, {
            from: owner, 
            value: web3.utils.toWei('0.246','ether')});
        try {
            await humaverse.withdraw({from: accounts[1]});
        } catch (error) {
            assert(error, "Ownable: caller is not the owner");
        }
    });
});