import { IVerifiedUserAdded } from '../events'
import { User } from '../models/users'

export const addVerifiedUser = async (user: IVerifiedUserAdded) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(user.userName)
            console.log(user.verifiedUserAccount.toString())
            const verifiedUser = await User.findOne({
                user_github: user.userName,
            })
            console.log(verifiedUser)
            verifiedUser.updateOne({
                user_phantom_address: user.userPubkey.toString(),
            })
            verifiedUser.save()
            resolve(verifiedUser)
        } catch (err) {
            reject(err)
        }
    })
}
