import {
  createNftCells,
  transferNftCells,
  destroyNftCells,
  lockNftCells,
  claimNftCells,
  addExtInfoToNftCells,
  destroyNftCellsWithIssuerLock,
  destroyNftCellsWithClassLock,
  updateNftCharacteristic,
  updateNftStateWithIssuer,
  updateNftStateWithClass,
} from '../rpc/nft'

const run = async () => {
  const txHash = await createNftCells('0x5846f62eba20a787d516f99198812f71df98138a00000001', 40)
  await new Promise(resolve => setTimeout(resolve, 60000))
  for (let j = 0; j < 2; j++) {
    let nftOutPoints = []
    for (let i = j * 20; i < j * 20 + 20; i++) {
      nftOutPoints.push({
        txHash,
        index: `0x${(i + 1).toString(16)}`,
      })
    }
    await transferNftCells(nftOutPoints)
  }
  // await destroyNftCells([
  //   { txHash: '0x58d8ea339a0e7e36af7a8e328298ad085298961898d6ed0e5df95362ae370f77', index: '0x0' },
  //   { txHash: '0x58d8ea339a0e7e36af7a8e328298ad085298961898d6ed0e5df95362ae370f77', index: '0x1' },
  // ])
  // await lockNftCell({ txHash: '0xbac38d5138debec6ddb1def5160da8fff16617f157ede41f13e52cd4d0745ee6', index: '0x1' })
  // await claimNftCell(
  //   { txHash: '0xf844937938829a072d369d209fb34c829f7d485c3e452c54d5bc3fe464e2ea12', index: '0x0' },
  //   true,
  // )
  // await addExtInfoToNftCell({
  //   txHash: '0x2f31a3bbd7688a37dbaa637bdcb9a7d89db4492821c885dd5e4ff8fd56e0d7bc',
  //   index: '0x1',
  // })
  // await updateNftCharacteristic([{
  //   txHash: '0x86a2c9c7909e43b5eb4795d04e83233e3b04f962a607bce9fa21217b82bc769d',
  //   index: '0x1',
  // }, {
  //   txHash: '0x86a2c9c7909e43b5eb4795d04e83233e3b04f962a607bce9fa21217b82bc769d',
  //   index: '0x2',
  // }])
  // await updateNftStateWithIssuer({
  //   nftOutPoint: {
  //     txHash: '0x6728ceaa8feff6866dae77d4f7ebdd3c14cae2a7baed63cfefb0d927026f07e1',
  //     index: '0x1',
  //   },
  //   issuerOutPoint: {
  //     txHash: '0x5efeb7bca93f90a38d7f60bae5db547b8122c58e6db37d00435998038fefd02a',
  //     index: '0x0',
  //   },
  // })
  // await updateNftStateWithClass({
  //   nftOutPoint: {
  //     txHash: '0x9c09f51bc4f4cc01e7c5a207524c5be1fed59aa2b1e9b96ecf75a8ab1dcf6ae5',
  //     index: '0x2',
  //   },
  //   classOutPoint: {
  //     txHash: '0x9c09f51bc4f4cc01e7c5a207524c5be1fed59aa2b1e9b96ecf75a8ab1dcf6ae5',
  //     index: '0x0',
  //   },
  // })
  // await destroyNftCellWithIssuerLock({
  //   issuerOutPoint: {
  //     txHash: '0x5efeb7bca93f90a38d7f60bae5db547b8122c58e6db37d00435998038fefd02a',
  //     index: '0x0',
  //   },
  //   nftOutPoint: { txHash: '0x6728ceaa8feff6866dae77d4f7ebdd3c14cae2a7baed63cfefb0d927026f07e1', index: '0x3' },
  // })
  // await destroyNftCellWithClassLock({
  //   classOutPoint: { txHash: '0x6728ceaa8feff6866dae77d4f7ebdd3c14cae2a7baed63cfefb0d927026f07e1', index: '0x0' },
  //   nftOutPoint: {
  //     txHash: '0x6728ceaa8feff6866dae77d4f7ebdd3c14cae2a7baed63cfefb0d927026f07e1',
  //     index: '0x4',
  //   },
  // })
}

run()
