const {
    HardhatRuntimeEnvironment
} = require('hardhat/types');

const {
    DRE,
    setDRE,
} = require('./helpers');


task(`set-DRE`, `Inits the DRE, to have access to all the plugins' objects`)
  .setAction(async (_, _DRE) => {
    if (!DRE) {
        console.log('- Enviroment');
        console.log('  - Network :', _DRE.network.name);
        setDRE(_DRE);
    };
})
