const { createNftCells, transferNftCells, destroyNftCell, lockNftCell, claimNftCell } = require('../src/rpc/nft')

const run = async () => {
  // await createNftCells('0xfea81f725af7a5f5b7d676f5f83ffe14b2bb8aa100000004', 1)
  // const nftOutPoints = [
  //   {
  //     txHash: '0x59db59be665b8ef80ff8fe8a01837ab70e352ff38111f16f846852e0ab274280',
  //     index: '0x1',
  //   },
  // ]
  // await transferNftCells(nftOutPoints)
  // await destroyNftCell({ txHash: '0x7f2cbef7b2d5e179dbf208a367beeb4fa2123c383fe8c448aac453f21deea212', index: '0x1' })
  // await lockNftCell({ txHash: '0xbac38d5138debec6ddb1def5160da8fff16617f157ede41f13e52cd4d0745ee6', index: '0x1' })
  await claimNftCell({ txHash: '0x81f7d60d0b401d504383d8867b3859449d9a33765624bf63ccd18783a2b40b52', index: '0x1' })
}

run()