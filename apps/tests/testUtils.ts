import axios from "axios";
import { BACKEND_URL } from "./config";

export async function createUser(): Promise<{
    id: string,
    jwt: string
}> {
    const USER_NAME = Math.random().toString();
    let res;
    try {
         res = await axios.post(`${BACKEND_URL}/user/signup`, {
            data:{
                username: USER_NAME,
                password: "123123123"
            }
        })
    } catch (error) {
        console.log("Not able to sign-Up");
    }
    
    // console.log(res);
    let signinRes;
    try {
        signinRes = await axios.post(`${BACKEND_URL}/user/signin`, {
        data:{
                username: USER_NAME,
                password: "123123123"
        }
    })
    } catch (error) {
        console.log("Not able to sign in nad generate token");
        
    }

    return {
        id: res!.data.id,
        jwt: signinRes!.data.jwt
    }
}