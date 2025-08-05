import { xBulkAdd } from "redisStream/client";
import { prismaClient } from "store/client";

async function  main(){
    let websites = await prismaClient.website.findMany({
        select:{
            url: true,
            id: true
        }
    });
    console.log("Added");
    await xBulkAdd(websites.map(website => ({
        url:website.url,
        id: website.id
    })));
}

setInterval(()=>{
    main();
},3000);

main();