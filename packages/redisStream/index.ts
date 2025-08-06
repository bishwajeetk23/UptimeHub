import { createClient } from "redis";
const STREAM_NAME: string = "uptimeHub:website";
const redisClient = await createClient({
    url: "redis://localhost:6379"
})
.on("error",(err)=> console.log("Redis Client error", err))
.connect();

type WebsiteEvent = {
    url: string,
    id: string
}
type MessageType = {
    id: string,
    message: {
        url: string,
        id: string
    }
}
async function xAdd({url,id}: WebsiteEvent){
    await redisClient.xAdd(STREAM_NAME,"*",{
        url,
        id
    });
}
// Fix this bulk request
export async function xBulkAdd(websites: WebsiteEvent[]){
    websites.forEach(async (webiste: WebsiteEvent) => {
        console.log(webiste);
        await xAdd({
            url: webiste.url,
            id:  webiste.id
        });
    });
}

export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined>{
    const res = await redisClient.xReadGroup(consumerGroup,workerId,{
            key: STREAM_NAME,
            id: '>'
        },{
            'COUNT': 5
        }   
    );
     //@ts-ignore
    let messages: MessageType[] | undefined = res?.[0]?.messages;

    return messages;
}

async function xAck(consumerGroup: string, eventId: string){
    const res = await redisClient.xAck(STREAM_NAME, consumerGroup, eventId);
    console.log(res);
}
export async function xBulkAck(consumerGroup: string, events: string[]){
    events.map(eventId => xAck(consumerGroup, eventId));
}