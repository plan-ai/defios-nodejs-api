import { IVerifiedUserAdded } from '../events'
import { User } from '../models/users'

export const addVerifiedUser = async (user: IVerifiedUserAdded) => {
    return new Promise(async(resolve, reject) => {
        try {
            const verifiedUser = await User.findOne({
                user_github: user.user_name,
            })
            verifiedUser.updateOne({user_phantom_address:user.verified_user_account.toString()})
            verifiedUser.save()
            resolve(verifiedUser)
        } catch (err) {
            reject(err)
        }
    })
}
