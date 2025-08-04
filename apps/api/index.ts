import express from 'express';
import { prismaClient } from 'store/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { AuthInput } from './types';
import { authMiddleware } from './middleware';
const app = express();
app.use(express.json());
app.use(cors());
app.post('/website', authMiddleware ,async (req,res)=>{
    if(!req.body.url){
        res.status(411).json({});
        return;
    }
    const website = await prismaClient.website.create({
        data:{
            url:req.body.url,
            timeAdded:new Date(),
            userId: req.userId!,
        }
    });
    console.log(`Website created with ID: ${website.id}`);
    
    res.json({
        id: website.id,
    });
});

app.get('/status/:websiteId', authMiddleware ,async (req,res)=>{
    const website = await prismaClient.website.findFirst({
        where:{
            userId: req.userId!,
            id: req.params.websiteId
        },
        include:{
            ticks:{
                orderBy:[{
                    createdAt: 'desc',
                }],
                take: 1
            }
        }
    });
    if(!website){
        res.status(409).json({
            message: "Not Found",
        });
        return;
    }
    res.status(200).json({
        url:website.url,
        userId: website.userId,
        id: website.id
    });

});

app.post('/user/signup', async (req,res)=>{
    // check req structure using zod
    // check pre exit user
    // create new user
    // any error occur then return specific status code
    const data = AuthInput.safeParse(req.body.data);
    if(!data.success){
        res.status(403).send("");
        return;
    }
    try{
        let user = await prismaClient.user.create({
            data:{
                username:data.data.username,
                password: data.data.password
            }
        })
        res.status(200).json({
            id: user.id
        });
    }catch(e){
        res.status(403).send("");
    }
});

app.post('/user/signin',async (req,res)=>{
    // check req structure using zod
    // check password matching
    // send jwt token if matching
    const data = AuthInput.safeParse(req.body.data);
    if(!data.success){
        res.status(403).send("");
        return;
    }
    try {
        let userData = await prismaClient.user.findFirst({
            where: {
                username: data.data.username
            }
        });
        
        if(userData?.password !== data.data.password){
            res.status(403).send("");
            return;
        }
        let token = jwt.sign({
            sub: userData.id
        },process.env.JWT_SECRET!);

        res.status(200).json({
            jwt: token,
            message: "success"
        });
    } catch (e) {
        res.status(403).send("");
    }
});

app.listen(3000,()=>{
    console.log(`Server is running on http://localhost:${3000}`);
});