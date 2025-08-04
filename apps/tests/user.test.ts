import axios from 'axios';
import {describe, expect, it} from 'bun:test';
import { BACKEND_URL } from './config';

const USER_NAME = Math.random().toString();

describe("Test for sign up endpoints",()=>{

    it("Isnt able to signup",async ()=>{
        try {
            const data = await axios.post(`${BACKEND_URL}/user/signup`,
                {
                    username:"username"
                }
            );
            expect(false,"Control shouldnt reach here");
            
        } catch (error) {
            expect(true,"Throws correct error");
        }

    })
    it("Is able to signup",async ()=>{
        try {
            const data = await axios.post(`${BACKEND_URL}/user/signup`,
                {
                    username:USER_NAME,
                    password:"password"
                }
            );
            console.log(data);
            expect(data.status).toBe(200);
            expect(data.data.id).not.toBe(null);
            expect(data.data.id).toBeDefined();
        } catch (error) {
            expect(false,"Should not run as user should be able to sign up");
        }

    })
});
describe("Test for sign in endpoints",()=>{
    it("Isnt able to signin",async ()=>{
        try {
            const data = await axios.post(`${BACKEND_URL}/user/signin`,
                {
                    username:"username"
                }
            );
            expect(false,"Control shouldnt reach here");
            
        } catch (error) {
            expect(true,"Throws correct error");
        }

    })
    it("Is able to signin",async ()=>{
        try {
            const data = await axios.post(`${BACKEND_URL}/user/signin`,
                {
                    username:USER_NAME,
                    password:"password"
                }
            );
            expect(data.status).toBe(200);
            expect(data.data.jwt).toBeDefined();
            expect(data.data.jwt).not.toBe(null);
        } catch (error) {
            expect(false,"Control shouldnt reach here as user should be able to sign in");
        }

    })
});