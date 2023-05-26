import * as express from 'express'
import { Express, Request, Response } from 'express'
import * as ed from '@noble/ed25519'
import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Defios, IDL } from './type-file/defios'
import * as cors from 'cors'
import { addEventListener } from './src/listeners'
import * as bs58 from 'bs58'
import { PublicKey } from '@solana/web3.js'
import { connectToDatabase } from './src/database'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import findConfig from 'find-config'
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction,
    createMintToCheckedInstruction,
    getAssociatedTokenAddress,
    MintLayout,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

dotenv.config({ path: findConfig('.env') })

const app: Express = express()
const port = process.env.PORT

app.use(express.json())
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3002',
            'https://defi-os.com',
            'https://www.defi-os.com',
        ],
    })
)

const { web3 } = anchor

const PROGRAM_ID = new web3.PublicKey(process.env.DEFIOS_PROGRAM_ID as string)

let authSecretKey = bs58.decode(process.env.AUTH_KEY as string)
let authKeyPair = web3.Keypair.fromSecretKey(authSecretKey)
console.log(`Authorised creator: ${authKeyPair.publicKey.toString()}`)
anchor.setProvider(anchor.AnchorProvider.env())

const program = new anchor.Program(IDL, PROGRAM_ID) as Program<Defios>

const {
    provider: { connection },
} = program

async function get_pda_from_seeds(seeds: any) {
    return await web3.PublicKey.findProgramAddressSync(seeds, program.programId)
}

const createDefaultSchedule = async () => {
    const [defaultVestingSchedule] = await get_pda_from_seeds([
        Buffer.from('isGodReal?'),
        Buffer.from('DoULoveMe?'),
        Buffer.from('SweetChick'),
    ])

    await program.methods
        .setDefaultSchedule(4, new anchor.BN(2500), new anchor.BN(1000))
        .accounts({
            authority: authKeyPair.publicKey,
            defaultSchedule: defaultVestingSchedule,
            systemProgram: web3.SystemProgram.programId,
        })
        .signers([authKeyPair])
        .rpc({ skipPreflight: false })
}

const createCommunalAccount = async (mintKeypair: string) => {
    let mintKeypairKey = new web3.PublicKey(mintKeypair)
    const [communal_account] = await get_pda_from_seeds([
        Buffer.from('are_we_conscious'),
        Buffer.from('is love life ?  '),
        Buffer.from('arewemadorinlove'),
        mintKeypairKey.toBuffer(),
    ])

    const communalTokenAccount = await getAssociatedTokenAddress(
        mintKeypairKey,
        communal_account,
        true
    )

    await program.methods
        .createCommunalAccount()
        .accounts({
            authority: authKeyPair.publicKey,
            communalDeposit: communal_account,
            communalTokenAccount: communalTokenAccount,
            systemProgram: web3.SystemProgram.programId,
            rewardsMint: mintKeypair,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([authKeyPair])
        .rpc({ skipPreflight: true })
}

const createNamesRouter = async (
    signingName: string,
    signatureVersion: number
) => {
    console.log(`Router creator: ${authKeyPair.publicKey.toString()}`)

    const nameRouterAccount = await getNameRouterAccount()
    await program.methods
        .createNameRouter(signingName, signatureVersion)
        .accounts({
            nameRouterAccount,
            routerCreator: authKeyPair.publicKey,
            systemProgram: web3.SystemProgram.programId,
        })
        .signers([authKeyPair])
        .rpc({ commitment: 'processed' })

    const {
        routerCreator,
        signatureVersion: fSignatureVersion,
        signingDomain,
        bump,
        totalVerifiedUsers,
    } = await program.account.nameRouter.fetch(nameRouterAccount)

    console.log(
        routerCreator.toString(),
        fSignatureVersion,
        signingDomain,
        bump,
        totalVerifiedUsers.toNumber()
    )
}

const getNameRouterAccount = async () => {
    const signatureVersion = 1
    const signingName = 'defios.com'
    const [nameRouterAccount] = await web3.PublicKey.findProgramAddress(
        [
            Buffer.from(signingName),
            Buffer.from(signatureVersion.toString()),
            authKeyPair.publicKey.toBuffer(),
        ],
        PROGRAM_ID
    )
    return nameRouterAccount
}

const getVerifiedUserAccount = async (
    userName: string,
    userPubkey: PublicKey
) => {
    const nameRouterAccount = await getNameRouterAccount()
    const [verifiedUserAccount] = await web3.PublicKey.findProgramAddress(
        [
            Buffer.from(userName),
            userPubkey.toBuffer(),
            nameRouterAccount.toBuffer(),
        ],
        program.programId
    )
    return verifiedUserAccount
}

const checkRouter = async () => {
    const nameRouterAccount = await getNameRouterAccount()
    const data = await program.account.nameRouter
        .fetch(nameRouterAccount)
        .catch(() => {
            return undefined
        })

    if (data !== undefined) {
        return { ...data, nameRouterAccount: nameRouterAccount }
    } else {
        return false
    }
}

const addUser = async (github_uid: string, user_public_key: string) => {
    const userName: string = github_uid
    const userPubkey = new web3.PublicKey(user_public_key)
    const verifiedUserAccount = await getVerifiedUserAccount(
        userName,
        userPubkey
    )
    const data = await program.account.verifiedUser
        .fetch(verifiedUserAccount)
        .catch(() => {
            console.log('Creating New Account')
        })
    if (data && data != undefined) {
        return { ...data, verifiedUserAccount: verifiedUserAccount }
    }

    const nameRouterAccount = await getNameRouterAccount()

    const message = Uint8Array.from(
        Buffer.from(`DefiOS(${userName}, ${userPubkey.toString()})`)
    )

    const signature = await ed.sign(
        message,
        authKeyPair.secretKey.slice(0, 32)
    )

    const createED25519Ix = web3.Ed25519Program.createInstructionWithPublicKey({
        message: message,
        publicKey: authKeyPair.publicKey.toBytes(),
        signature,
    })

    await program.methods
        .addVerifiedUser(
            //@ts-ignore
            userName,
            userPubkey,
            Buffer.from(message),
            Buffer.from(signature)
        )
        .accounts({
            nameRouterAccount,
            verifiedUserAccount,
            routerCreator: authKeyPair.publicKey,
            sysvarInstructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
            systemProgram: web3.SystemProgram.programId,
        })
        .signers([authKeyPair])
        .preInstructions([createED25519Ix])
        .rpc({ commitment: 'processed' })

    const verifiedData = await program.account.verifiedUser.fetch(
        verifiedUserAccount
    )
    if (verifiedData && verifiedData != undefined) {
        return { ...verifiedData, verifiedUserAccount: verifiedUserAccount }
    }
    return false
}

app.get('/namesrouter', async (req: Request, res: Response) => {
    const checkIfAvailable = await checkRouter()
    if (checkIfAvailable) {
        res.send(checkIfAvailable)
    } else {
        await createNamesRouter('defios.com', 1)
        res.send('Created Names router.')
    }
})

app.post('/createUserMapping', async (req: Request, res: Response) => {
    if (
        req.body.pub_key === undefined ||
        req.body.github_access_token === undefined ||
        req.body.github_uid === undefined
    ) {
        res.status(401).send({ error: 'Invalid Body JSON' })
    }

    //verifying github_uid with github_access_token
    const userResponse = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${req.body.github_access_token}`,
        },
    })
        .then((response: any) => {
            return response.json()
        })
        .catch((err: any) => {
            res.status(401).send(err)
        })

    if (userResponse.id != parseInt(req.body.github_uid)) {
        res.status(401).send({ error: 'github_uid verification failed' })
        return
    }

    const success = await addUser(
        req.body.github_uid.toString(),
        req.body.pub_key.toString()
    )

    if (success) {
        res.status(200).send(success)
    } else {
        res.status(401).send('Mapping Failed')
    }
})

app.get('/', async (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
})

app.post('/createDefaultSchedule', async (req: Request, res: Response) => {
    await createDefaultSchedule()
    res.send('Default Schedule Created')
})

app.post('/createCommunalAccount', async (req: Request, res: Response) => {
    await createCommunalAccount(req.body.mintKeypair)
    res.send('Communal account created')
})

app.listen(port, async () => {
    await connectToDatabase()
    addEventListener(program)
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
