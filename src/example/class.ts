import { createClassCells, destroyClassCell, updateClassCell } from '../rpc/class'

const run = async () => {
  await createClassCells('0x40250b7d0dccc0824b02d7301370425de729fcd5', 2)
  // await destroyClassCell({ txHash: '0x41f68a210199bcce1d51e80829026f529b2edd80d4b85e8b7a00f8a3c321f42c', index: '0x0' })
  // await updateClassCell({ txHash: '0x41f68a210199bcce1d51e80829026f529b2edd80d4b85e8b7a00f8a3c321f42c', index: '0x0' })
}

run()
