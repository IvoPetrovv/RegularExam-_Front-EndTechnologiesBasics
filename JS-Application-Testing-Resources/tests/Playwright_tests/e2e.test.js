const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

let albumName = "";

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test("register makes correct api call", async()=>{
            
            //arrange
            await page.goto(host);
            await page.click("text=Register");
            await page.waitForSelector('form');
            let random = Math.floor(Math.random() * 10000)
            user.email = `abv${random}@abv.bg`

            //act
            await page.locator("#email").fill(user.email)
            await page.locator("#password").fill(user.password)
            await page.locator("#conf-pass").fill(user.confirmPass)
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/register") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            //assert
            await expect(response.ok()).toBeTruthy;
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);

        })

        test("login makes correct API call", async()=>{
            //arrange
            await page.goto(host);
            await page.click("text=Login");
            await page.waitForSelector('form');

            //act
            await page.locator("#email").fill(user.email)
            await page.locator("#password").fill(user.password)
                let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/login") && response.status() == 200),
                page.click('[type="submit"]')
            ])
            let userData = await response.json();

            //assert
            await expect(response.ok()).toBeTruthy;
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);

        })

        test("'logout makes correct api call'", async ()=>{
            //arrange
            
            await page.goto(host);
            await page.click("text=Login");
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email)
            await page.locator("#password").fill(user.password)
            page.click('[type="submit"]')
            

            //act
           
            let [response] = await Promise.all([
               page.waitForResponse(response => response.url().includes("/users/logout") && response.status() == 204),
                page.click('text=Logout')
            ])

            //assert
            await expect(response.ok()).toBeTruthy;

        })

    });

    describe("navbar", () => {
        test("logged user should see correct navigation buttons", async()=>{
        // arrange
        

        //act
        await page.goto(host);
        await page.click("text=Login");
        await page.waitForSelector('form');
        await page.locator("#email").fill(user.email)
        await page.locator("#password").fill(user.password)
        await page.click('[type="submit"]')

        // assert

        await expect(page.locator('nav >> text=Catalog')).toBeVisible();
        await expect(page.locator('nav >> text=Search')).toBeVisible();
       //await expect(page.locator('nav >> text=Logout')).toBeVisible();
       // await expect(page.locator('nav >> text=Login')).toBeHidden();
        //await expect(page.locator('nav >> text=Register')).toBeHidden();

        });

        test("guest user should see correct navigation buttons", async ()=>{
            // act
            await page.goto(host);

            //assert
            await expect(page.locator('nav >> text=Catalog')).toBeVisible();
            await expect(page.locator('nav >> text=Search')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();
            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();




        })
    });

    describe("CRUD", () => {
        beforeEach(async () =>{
            await page.goto(host);
            await page.click("text=Login");
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email)
            await page.locator("#password").fill(user.password)
            await page.click('[type="submit"]')
        })

        test('Create makes correct API call', async ()=>{
            //arrange

            await page.click('text=Create Album'); 
            await page.waitForSelector('form');

            //act
            await page.fill('#name', "Random Album name")
            await page.fill('#imgUrl', "/images/pinkFloyd.jpg")
            await page.fill('#price', "Random price 1")
            await page.fill('#releaseDate', "Random releaseDate 1.1.2024")
            await page.fill('#artist', "Random artist Ivo")
            await page.fill('#genre', "Random genre name")
            await page.fill('.description', "Random description")

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/albums") && response.status() == 200 ),
                page.click('[type="submit"]')
            ]);
            let albumData = await response.json();
            

            //assert
            await expect(response.ok()).toBeTruthy;

        })


        test('edit makes correct API call', async ()=>{
             
            //arrange
            await page.click('text=Catalog') 
            await page.locator("text=Details").first().click();   
            await page.click("text=Edit");
            await page.waitForSelector('form');

            //act
            await page.fill('#name', "Edit Album name")

            let [response] = await Promise.all([
               page.waitForResponse(response => response.url().includes("/data/albums") && response.status() == 200 ),
               page.click('[type="submit"]')
           ]);

           let albumData = await response.json();

           //assert
           await expect(response.ok()).toBeTruthy;
           
           })

        test("delete makes correct API call", async ()=>{
             //arrange
             await page.click('text=Catalog') 
             await page.locator("text=Details").first().click(); 
             //await page.waitForSelector('form');  
             await page.click("text=Delete");
             
            
            //act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/albums") && response.status() == 200 ),
                page.on('dialog', dialog => dialog.accept()),
                page.click('text=delete')
            ]);

            //assert
            expect(response.ok()).toBeTruthy();

        })   


    });


});