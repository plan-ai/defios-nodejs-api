import mongoose from 'mongoose'

export interface IToken {
    token_name: mongoose.Schema.Types.String
    token_symbol: mongoose.Schema.Types.String
    token_spl_addr: mongoose.Schema.Types.String
    token_decimals: mongoose.Schema.Types.Number
    token_image_url: mongoose.Schema.Types.String
    token_new: mongoose.Schema.Types.Boolean
}

export const TokenSchema = new mongoose.Schema<IToken>(
    {
        token_name: {
            type: mongoose.Schema.Types.String,
        },
        token_symbol: {
            type: mongoose.Schema.Types.String,
        },
        token_spl_addr: {
            type: mongoose.Schema.Types.String,
            required: true,
            unique: true,
        },
        token_decimals: {
            type: mongoose.Schema.Types.Number,
        },
        token_image_url: {
            type: mongoose.Schema.Types.String,
        },
        token_new: {
            type: mongoose.Schema.Types.Boolean,
        },
    },
    { versionKey: false }
)

export const Token = mongoose.model<IToken>('Token', TokenSchema)
