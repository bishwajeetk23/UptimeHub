import axios from "axios";
import { xBulkAck, xReadGroup } from "redisStream/client";
import { prismaClient } from "store/client";
const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

// check if region exist in database
if(!REGION_ID){
    throw new Error("Region not provided");
}
if(!WORKER_ID){
    throw new Error("Worker id needed");
}
// add redux and axios for state management
//  also create a seperate function 
//  find best practice for implementing this
async function main() {
    while(true){
        // Reading from queue
        const response = await xReadGroup(REGION_ID,WORKER_ID);
        if(!response)continue;
        console.log(response);
        // hitting the websites
        // as all websites need to be hit parallel so need to wrap into promise and use promise.all
        // extract the promise logic to seperate function
        let promise = response.map(({id,message})=>{
           return new Promise<void>((resolve,reject)=>{
             const url = message.url;
            const websiteId = message.id;
            const startTime = Date.now();
            axios.get(url).then(async () => {
                const endTime = Date.now(); 
                await prismaClient.website_tick.create({
                    data:{
                        response_time_ms: endTime-startTime,
                        status: "UP",
                        website_id: websiteId,
                        region_id: REGION_ID
                    }
                })
                resolve();
            }).catch(async ()=>{
                const endTime = Date.now(); 
                await prismaClient.website_tick.create({
                    data:{
                        response_time_ms: endTime-startTime,
                        status: "DOWN",
                        website_id: websiteId,
                        region_id: REGION_ID
                    }
                })
                resolve();
            });
           })
        });
        console.log(promise,promise.length);
        
        await Promise.all(promise);
        // ack back to the queue that this event has been processed
        xBulkAck(REGION_ID,response.map(({id}) => id));
    }
}

main();