import { IVerifiedUserAdded } from '../events'
import { User } from '../models/users'

export const addVerifiedUser = async (user: IVerifiedUserAdded) => {
    return new Promise(async (resolve, reject) => {
        try {
            const verifiedUser: any = await User.findOne({
                user_github: user.userName,
            })
            verifiedUser.user_phantom_address = user.userPubkey.toString(),
            verifiedUser.save()
            resolve(verifiedUser)
        } catch (err) {
            reject(err)
        }
    })
}
