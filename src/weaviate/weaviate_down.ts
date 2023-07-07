import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client'
import dotenv from 'dotenv'
import findConfig from 'find-config'

dotenv.config({ path: findConfig('../.env') })
// Instantiate the client with the auth config
const client: WeaviateClient = weaviate.client({
    scheme: 'https',
    host: process.env.WEAVIATE_URL,
    apiKey: new ApiKey(process.env.WEAVIATE_API_KEY),
})

var className = 'Issue'

client.schema
    .classDeleter()
    .withClassName(className)
    .do()
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.error(err)
    })
