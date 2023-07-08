import dotenv from 'dotenv'
import findConfig from 'find-config'

dotenv.config({ path: findConfig('../.env') })
const handledSignatures = new Set<string>()

function FunctionNameLogger() {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        descriptor.value = function (...args: any[]) {
            let signature = args[2]
            // checks if simulated transaction log
            if (
                signature ==
                '1111111111111111111111111111111111111111111111111111111111111111'
            ) {
                return
            }
            if (handledSignatures.has(signature)) return

            // do ur stuff

            handledSignatures.add(signature)
            let maxSignatures: number = parseInt(process.env.maxSignatures)
            if (handledSignatures.size > maxSignatures) {
                handledSignatures.delete(
                    handledSignatures.values().next().value
                )
            }
        }

        return descriptor
    }
}
