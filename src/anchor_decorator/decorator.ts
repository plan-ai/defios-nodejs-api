import { sign } from 'crypto'
import dotenv from 'dotenv'
import findConfig from 'find-config'

dotenv.config({ path: findConfig('../.env') })
const handledSignatures = new Set<string>()

/**
 * @throws {Error}
 */
function checkTransactionSignature(signature: string) {
    // checks if simulated transaction log
    if (
        signature ==
        '1111111111111111111111111111111111111111111111111111111111111111'
    ) {
        throw Error('Simulated transaction')
    }
    //checks if signature in handled signatured
    // if (handledSignatures.has(signature))
    //     throw Error('Duplicated equivalent event')

    // //adds signature to set
    // handledSignatures.add(signature)
    // //check if max set length exceeded
    // let maxSignatures: number = parseInt(process.env.maxSignatures)
    // if (handledSignatures.size > maxSignatures) {
    //     handledSignatures.delete(handledSignatures.values().next().value)
    // }
}
export { checkTransactionSignature }
