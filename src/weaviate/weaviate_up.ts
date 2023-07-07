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

// We will create the class 'Question'
let issueObj = {
    class: 'Issue',
    description: 'Class that vectorises issues',
    properties: [
        {
            dataType: ['text'],
            description: 'The title of issue',
            name: 'issue_title',
        },
        {
            dataType: ['text'],
            description: 'Description of issue',
            name: 'issue_description',
        },
    ],
    vectorizer: 'text2vec-openai',
}

async function create_schema(classObj: object) {
    await client.schema.classCreator().withClass(classObj).do()
}

async function print_schema() {
    const result = await client.schema.getter().do()

    console.log(JSON.stringify(result, null, 2))
}

create_schema(issueObj)
print_schema()
