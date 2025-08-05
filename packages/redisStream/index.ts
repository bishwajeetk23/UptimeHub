import { createClient } from "redis";

const redisClient = await createClient({
    url: "redis://localhost:6379"
})
.on("error",(err)=> console.log("Redis Client error", err))
.connect();

type WebsiteEvent = {
    url: string,
    id: string
}
async function xAdd({url,id}: WebsiteEvent){
    await redisClient.xAdd('uptimeHub:website',"*",{
        url,
        id
    });
}
// Fix this bulk request
export async function xBulkAdd(websites: WebsiteEvent[]){
    websites.forEach(async (webiste: WebsiteEvent) => {
        await xAdd({
            url: webiste.url,
            id:  webiste.id
        });
    });
}