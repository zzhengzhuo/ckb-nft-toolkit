import CKB from '@nervosnetwork/ckb-sdk-core'
import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { secp256k1LockScript, secp256k1Dep } from '../account'
import { getCells, collectInputs, getLiveCell } from '../collector'
import { FEE, IssuerTypeScript, ClassTypeScript, IssuerTypeDep, ClassTypeDep } from '../constants/script'
import { CKB_NODE_RPC, PRIVATE_KEY } from '../utils/config'
import { u32ToBe, utf8ToHex, remove0x } from '../utils/hex'
import Issuer from '../models/issuer'
import TokenClass from '../models/class'

const ckb = new CKB(CKB_NODE_RPC)
const CLASS_CELL_CAPACITY = BigInt(300) * BigInt(100000000)

export const generateClassOutputs = async (inputCapacity: bigint, classTypeScripts) => {
  const lock = await secp256k1LockScript()
  let outputs = classTypeScripts.map(classTypeScript => ({
    capacity: `0x${CLASS_CELL_CAPACITY.toString(16)}`,
    lock,
    type: classTypeScript,
  }))
  const changeCapacity = inputCapacity - FEE - CLASS_CELL_CAPACITY * BigInt(classTypeScripts.length)
  outputs.push({
    capacity: `0x${changeCapacity.toString(16)}`,
    lock,
  })
  return outputs
}

export const createClassCells = async (issuerTypeArgs: Hex, classCount = 1) => {
  const lock = await secp256k1LockScript()
  const liveCells = await getCells(lock)
  const { inputs, capacity } = collectInputs(liveCells, CLASS_CELL_CAPACITY * BigInt(classCount))

  const issuerType = { ...IssuerTypeScript, args: issuerTypeArgs }
  const issuerCells = await getCells(lock, issuerType)
  const issuerOutPoint = { txHash: issuerCells[0].outPoint.txHash, index: issuerCells[0].outPoint.index }
  const issuerInput = {
    previousOutput: issuerOutPoint,
    since: '0x0',
  }

  const issuerCell = await getLiveCell(issuerOutPoint)
  const issuer = Issuer.fromString(issuerCell.data.content)
  const issuerOutput = issuerCell.output
  let classTypeScripts = []
  let tokenClasses = []
  const tokenClass = TokenClass.fromProps({
    version: 0,
    total: 1000000000,
    issued: 0,
    configure: '0x00',
    name: utf8ToHex('First NFT'),
    description: utf8ToHex('Description'),
    renderer: utf8ToHex('https://goldenlegend.oss-cn-hangzhou.aliyuncs.com/production/1620983974245.jpeg'),
    extinfoData:
      '0x7b226964223a22706f222c2268617368223a22307832653637343864633165306433653335623164626133383766346364646338393331323733336234227d',
  }).toString()
  const issuerId = remove0x(scriptToHash(issuerType)).slice(0, 40)
  for (let i = 0; i < classCount; i++) {
    classTypeScripts.push({
      ...ClassTypeScript,
      args: `0x${issuerId}${u32ToBe(issuer.classCount + i)}`,
    })
    tokenClasses.push(tokenClass)
  }

  const outputIssuer = Issuer.fromString(issuerCell.data.content)
  outputIssuer.updateClassCount(issuer.classCount + classCount)

  const outputs = await generateClassOutputs(capacity, classTypeScripts)
  const cellDeps = [await secp256k1Dep(), IssuerTypeDep, ClassTypeDep]

  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs: [issuerInput, ...inputs],
    outputs: [issuerOutput, ...outputs],
    outputsData: [outputIssuer.toString(), ...tokenClasses, '0x'],
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  rawTx.witnesses.push(
    '0x7b2274797065223a7b22656e756d223a5b5d7d2c2264617461223a5b7b226e616d65223a22726172697479222c2274797065223a2255496e7438222c22706f736974696f6e223a307d5d7d',
  )
  const signedTx = ckb.signTransaction(PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  const txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Creating class cells tx has been sent with tx hash ${txHash}`)
  return txHash
}

export const destroyClassCell = async classOutPoint => {
  const inputs = [
    {
      previousOutput: classOutPoint,
      since: '0x0',
    },
  ]
  const classCell = await getLiveCell(classOutPoint)
  const output = classCell.output
  output.capacity = `0x${(BigInt(output.capacity) - FEE).toString(16)}`
  output.type = null
  const outputs = [output]
  const outputsData = ['0x']

  const cellDeps = [await secp256k1Dep(), ClassTypeDep]

  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  const signedTx = ckb.signTransaction(PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  const txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Destroy class cell tx has been sent with tx hash ${txHash}`)
  return txHash
}

export const updateClassCell = async classOutPoint => {
  const inputs = [
    {
      previousOutput: classOutPoint,
      since: '0x0',
    },
  ]

  const classCell = await getLiveCell(classOutPoint)
  const outputs = [classCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - FEE).toString(16)}`

  let tokenClass = TokenClass.fromString(classCell.data.content)
  tokenClass.updateName(utf8ToHex('Second NFT'))
  let outputsData = [tokenClass.toString()]

  const cellDeps = [await secp256k1Dep(), ClassTypeDep]

  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }))
  const signedTx = ckb.signTransaction(PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  const txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Update class cell tx has been sent with tx hash ${txHash}`)
  return txHash
}
