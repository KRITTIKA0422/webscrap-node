//import fs from "fs"
import request from "request-promise";
import * as cheerio from 'cheerio';
import express from "express"
import {MongoClient} from "mongodb"
//import { json2csv } from 'json-2-csv';
import dotenv from "dotenv";
dotenv.config();
 const app=express();
 const PORT=process.env.PORT;
 const MONGO_URL="mongodb://localhost";
let id=0;
const amazonphones = ["https://www.amazon.in/realme-Storage-Display-Charger-Variant/dp/B09WYVY8SJ?ref_=Oct_d_onr_d_1805560031&pd_rd_w=6tqWS&content-id=amzn1.sym.b08536cf-f878-4c12-89ee-75b9dc3e1be5&pf_rd_p=b08536cf-f878-4c12-89ee-75b9dc3e1be5&pf_rd_r=ZJ57NN4TXZD37MTSDQB6&pd_rd_wg=MCO1z&pd_rd_r=3b269cfc-28d6-4f9d-a33c-bdd5d304662d&pd_rd_i=B09WYVY8SJ&th=1","https://www.amazon.in/dp/B09QSBXK96/ref=sspa_dk_detail_0?pd_rd_i=B09QSBXK96&pd_rd_w=8xl7f&content-id=amzn1.sym.93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_p=93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_r=0WHFFCZBGDKS9N2KVRJ2&pd_rd_wg=kUIZK&pd_rd_r=1a1aad13-2599-41b1-88c4-4286dd4c8630&s=electronics&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFGSEtMRjBHRUtaQzgmZW5jcnlwdGVkSWQ9QTA3NDM2NDBVTTBGRE5QTTBSMVgmZW5jcnlwdGVkQWRJZD1BMDkwNzY2OE9BTzFQSzBIWU9VTCZ3aWRnZXROYW1lPXNwX2RldGFpbCZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU&th=1","https://www.amazon.in/Samsung-Galaxy-Storage-Additional-Exchange/dp/B09TKV4Q1Z/ref=sr_1_1?crid=3IHAMB7OKKWF8&keywords=SAMSUNG+Galaxy+J6+Plus+%28Red%2C+64+GB%29+%284+GB+RAM%29&qid=1658642126&sprefix=samsung+galaxy+j6+plus+red%2C+64+gb+4+gb+ram+%2Caps%2C988&sr=8-1","https://www.amazon.in/dp/B09TWH8YHM/ref=sspa_dk_detail_0?psc=1&pd_rd_i=B09TWH8YHM&pd_rd_w=NmkSb&content-id=amzn1.sym.93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_p=93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_r=T06FN5ENS70HQQZEAYXZ&pd_rd_wg=gJ3mm&pd_rd_r=87d913bf-173c-4c5d-a1cb-fc3b0648f789&s=electronics&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFWSlo0M0dOMzNWNk4mZW5jcnlwdGVkSWQ9QTA0NTI0ODQzN1JMSUhKRE43NFlWJmVuY3J5cHRlZEFkSWQ9QTA5Mjc1MTIzVkgyV01IQUlLVkFYJndpZGdldE5hbWU9c3BfZGV0YWlsJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==","https://www.amazon.in/dp/B08VB57558/ref=sspa_dk_detail_2?psc=1&pd_rd_i=B08VB57558&pd_rd_w=iIBwF&content-id=amzn1.sym.93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_p=93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_r=JHVBRPZ7DCEMX6G5GKM1&pd_rd_wg=4fSc4&pd_rd_r=f91f9446-3043-4795-90e6-8b04407bf47f&s=electronics&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzVjYwNk5RTTVNQlBVJmVuY3J5cHRlZElkPUEwODQyMzMyMkEzQkNYRTJEWVhFRSZlbmNyeXB0ZWRBZElkPUEwODgxMTMyMVJHR0NHMDdFQjg3UiZ3aWRnZXROYW1lPXNwX2RldGFpbCZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=",
"https://www.amazon.in/OnePlus-Mirror-Black-128GB-Storage/dp/B085J19V4P/ref=sr_1_2_sspa?keywords=oneplus&qid=1658610685&s=electronics&sprefix=one%2Celectronics%2C324&sr=1-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzNUlKMU84MFBDNDNFJmVuY3J5cHRlZElkPUEwNTg1NDg4M1RROVlGSkEzVVdCWCZlbmNyeXB0ZWRBZElkPUEwODY4ODQxMzdNMlhYRlVYUkdPNyZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=","https://www.amazon.in/dp/B09WRP2WXG/ref=syn_sd_onsite_desktop_182?psc=1&pd_rd_plhdr=t&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExWFhXNVhOSkswVEhSJmVuY3J5cHRlZElkPUExMDMyMjg2MTFLV0tYUVRHQkNUVyZlbmNyeXB0ZWRBZElkPUEwMTgzMTE5MUpWQTk0MUtRRkY4SCZ3aWRnZXROYW1lPXNkX29uc2l0ZV9kZXNrdG9wJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==","https://www.amazon.in/dp/B09CV6FJ62/ref=sspa_dk_detail_1?psc=1&pd_rd_i=B09CV6FJ62&pd_rd_w=T7ZMu&content-id=amzn1.sym.93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_p=93cf4d99-e9b9-496a-8c11-b758e79d2b72&pf_rd_r=84RPQP1B31RDTDJGSAXK&pd_rd_wg=MLshC&pd_rd_r=b1782b41-1153-40cd-8fc2-0c46b2ea01c2&s=electronics&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExTVRXVkhZVTFXQkk0JmVuY3J5cHRlZElkPUEwMjA0ODQ5MVRYTVhGRFlRNzVWUCZlbmNyeXB0ZWRBZElkPUEwNDY1OTQ3M0dWUEhGRFoyTzFHWCZ3aWRnZXROYW1lPXNwX2RldGFpbCZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=","https://www.amazon.in/MOTOROLA-e32s-Slate-Gray-Storage/dp/B0B752WGF4/ref=sr_1_omk_4?keywords=phone&qid=1658611424&sprefix=ph%2Caps%2C370&sr=8-4","https://www.amazon.in/realme-narzo-Carbon-Black-Storage/dp/B09FKB3446/ref=sr_1_omk_4?crid=247CORAA2NP9M&keywords=phone&qid=1658611617&sprefix=phone%2Caps%2C369&sr=8-4"];


(async()=>{
    let dbdataAmazon = [];
    for(let aphone of amazonphones){
    const response = await request({
        uri: aphone,
        headers: {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9"
        },
        gzip: true,
    })
    let $ = cheerio.load(response)
    id=id+1;
    let title= $('h1[class="a-size-large a-spacing-none"] > span').text().trim()
    let rating= $('a[href="#customerReviews"]>span').text().trim()
    let price= $('span[class="a-size-small a-color-secondary aok-align-center basisPrice"] > span').text().trim()
    let finalprice= $('span[class="a-price aok-align-center reinventPricePriceToPayMargin priceToPay"] > span').text().trim()
    dbdataAmazon.push({
        id,
        title,
        rating,
        price,
        finalprice,
    });
}
console.log(dbdataAmazon);
async function createConnection(){
    const client=new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected");
    return client;
}
const client=await createConnection();
app.post("/amazon", async function(request,response){
    const amazonData=await client.db("webscraping").collection("amazonCollection").insertMany(dbdataAmazon);
    console.log(amazonData);
    response.send(amazonData);
})
app.post("/amazon/:id", async function(request,response){
    const {id}=request.params;
    const amazonDataeach=await client.db("webscraping").collection("amazonCollection").findOne({id:id});
 
    amazonDataeach?response.send(amazonDataeach):response.send({msg:"mobile not found"});
})
})();
id=0;
const flikartphones = ["https://www.flipkart.com/realme-narzo-50a-oxygen-blue-64-gb/p/itm81d679403c2b4?pid=MOBG6MY4UGGFQWYY&lid=LSTMOBG6MY4UGGFQWYYUS85N8&marketplace=FLIPKART&q=realme+narzo+50a+prime&store=tyy%2F4io&srno=s_1_1&otracker=search&otracker1=search&fm=organic&iid=138f8665-4969-439b-889c-3de3c8c8084e.MOBG6MY4UGGFQWYY.SEARCH&ppt=hp&ppn=homepage&ssid=988u4ck4cg0000001658638807921&qH=2c95f8f4c18a628d","https://www.flipkart.com/redmi-note-11-horizon-blue-128-gb/p/itm2a388ca843b21?pid=MOBGBGAMRJGHTKUM&lid=LSTMOBGBGAMRJGHTKUMDR4PNP&marketplace=FLIPKART&q=redmi+note+11&store=tyy%2F4io&srno=s_1_1&otracker=AS_Query_HistoryAutoSuggest_1_2_na_na_na&otracker1=AS_Query_HistoryAutoSuggest_1_2_na_na_na&fm=organic&iid=62d14825-b32d-42f6-a7c1-236dc9683f3d.MOBGBGAMRJGHTKUM.SEARCH&ppt=pp&ppn=pp&ssid=24dof3yczk0000001658641680268&qH=9e3d85ac39947af3","https://www.flipkart.com/samsung-galaxy-a03-red-64-gb/p/itmd0ef5aa0f137f?pid=MOBGC2Q5HSSDGKTF&lid=LSTMOBGC2Q5HSSDGKTFOQSYYJ&marketplace=FLIPKART&q=Samsung+Galaxy+A03+Red%2C+4GB+RAM%2C+64GB&store=tyy%2F4io&srno=s_1_1&otracker=search&otracker1=search&fm=Search&iid=c3210ac5-e56f-4526-ae27-360808a5a0b8.MOBGC2Q5HSSDGKTF.SEARCH&ppt=pp&ppn=pp&ssid=j9wmvcfh4g0000001658642163477&qH=c4dfa0fe55dd39b1","https://www.flipkart.com/samsung-galaxy-m33-5g-deep-ocean-blue-128-gb/p/itm6fafe6189184d?pid=MOBGDC886NT7GAXR&lid=LSTMOBGDC886NT7GAXR2Y51BV&marketplace=FLIPKART&q=samsung+galaxy+m33+5g&store=tyy%2F4io&srno=s_1_1&otracker=search&otracker1=search&fm=Search&iid=4f3b15f7-c8ac-46b0-a1e4-38340040c203.MOBGDC886NT7GAXR.SEARCH&ppt=sp&ppn=sp&ssid=40wms0cd6o0000001658642343874&qH=db8ffb78899a08d4",
"https://www.flipkart.com/samsung-s20-fe-5g-cloud-mint-128-gb/p/itm45d522d270f0d?pid=MOBG8X8PTHRRHSKG&lid=LSTMOBG8X8PTHRRHSKGHOFCIY&marketplace=FLIPKART&q=samsung+galaxy+s20+fe+5g+mobile&store=tyy%2F4io&srno=s_1_1&otracker=AS_QueryStore_OrganicAutoSuggest_1_24_na_na_ps&otracker1=AS_QueryStore_OrganicAutoSuggest_1_24_na_na_ps&fm=search-autosuggest&iid=21be0328-6028-4a1a-9085-f3ffd31cba93.MOBG8X8PTHRRHSKG.SEARCH&ppt=sp&ppn=sp&ssid=ygaw8fvhhs0000001658642427254&qH=44fc703c79188b84","https://www.flipkart.com/oneplus-8t-5g-aquamarine-green-256-gb/p/itm1d675115d63ea?pid=MOBGDM2BTZX22QHC&lid=LSTMOBGDM2BTZX22QHCOOW9WM&marketplace=FLIPKART&q=OnePlus+8T+5G+%28Aquamarine+Green%2C+12GB+RAM%2C+256GB+Storage%29&store=tyy%2F4io&srno=s_1_1&otracker=search&otracker1=search&fm=search-autosuggest&iid=6a166b30-2025-498a-98c0-f37221c03515.MOBGDM2BTZX22QHC.SEARCH&ppt=sp&ppn=sp&ssid=nf6rcgyof40000001658642612203&qH=607983a99ad84f3c","https://www.flipkart.com/oneplus-10r-5g-sierra-black-256-gb/p/itmcf04b042a4332?pid=MOBGFSZ5KBX2AMVH&lid=LSTMOBGFSZ5KBX2AMVHGJYVD2&marketplace=FLIPKART&q=oneplus+10r5g+mobile&store=tyy%2F4io&srno=s_1_1&otracker=AS_QueryStore_OrganicAutoSuggest_2_16_na_na_ps&otracker1=AS_QueryStore_OrganicAutoSuggest_2_16_na_na_ps&fm=search-autosuggest&iid=8b35dbfb-d0a3-42fc-9407-639de83f723d.MOBGFSZ5KBX2AMVH.SEARCH&ppt=pp&ppn=pp&ssid=u1mgatj6340000001658642701787&qH=f674ac1ba9b30539",
"https://www.flipkart.com/samsung-galaxy-m52-5g-icy-blue-128-gb/p/itmae7eb598660a0?pid=MOBG7PF4X3SNB2EG&lid=LSTMOBG7PF4X3SNB2EG1MMGHF&marketplace=FLIPKART&q=samsung+galaxy+f52+5g&store=tyy%2F4io&srno=s_1_1&otracker=search&otracker1=search&fm=search-autosuggest&iid=28a718d6-9b0c-410b-9e51-add268d94a30.MOBG7PF4X3SNB2EG.SEARCH&ppt=sp&ppn=sp&ssid=g4j4jrpb9s0000001658642815539&qH=39841a72d9b993ab",
"https://www.flipkart.com/motorola-e32s-slate-gray-32-gb/p/itm2d976a0518e50?pid=MOBGDTTYNMWYFU2U&lid=LSTMOBGDTTYNMWYFU2UXAQEQN&marketplace=FLIPKART&q=moto+e+32+s&store=tyy%2F4io&srno=s_1_2&otracker=AS_QueryStore_OrganicAutoSuggest_1_14_sc_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_14_sc_na_na&fm=search-autosuggest&iid=b9ab0fa9-1047-40d5-a836-5353fbf4b504.MOBGDTTYNMWYFU2U.SEARCH&ppt=pp&ppn=pp&ssid=x8tsvjz40w0000001658643373750&qH=6c5f85a0221c4378","https://www.flipkart.com/realme-narzo-50i-carbon-black-32-gb/p/itm53fa214c23501?pid=MOBG6MY4QPAW6PQN&lid=LSTMOBG6MY4QPAW6PQN7E18VA&marketplace=FLIPKART&q=realme+narzo+50i&store=tyy%2F4io&srno=s_1_1&otracker=search&otracker1=search&fm=search-autosuggest&iid=db490a96-0479-45ea-9cc5-22cd69228afd.MOBG6MY4QPAW6PQN.SEARCH&ppt=pp&ppn=pp&ssid=chp1dnl9a80000001658643428539&qH=afcac939174786b3"];

(async()=>{
    let dbdataflipkart = [];
    for(let fphone of flikartphones){
    const response = await request({
        uri: fphone,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9"
        },
        gzip: true,
    })
    let $ = cheerio.load(response)
    id=id+1;
    let title= $('h1[class="yhB1nd"] > span').text().trim()
    let rating= $('span[class="_2_R_DZ"]>span').text().trim()
    let price= $('div[class="_3I9_wc _2p6lqe"]').text().trim()
    let finalprice= $('div[class="_30jeq3 _16Jk6d"]').text().trim()
    dbdataflipkart.push({
        id,
        title,
        rating,
        price,
        finalprice,
    });
}
console.log(dbdataflipkart);
async function createConnection(){
    const client=new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected");
    return client;
}
const client=await createConnection();
app.post("/flipkart", async function(request,response){
    const amazonData=await client.db("webscraping").collection("flipkartCollection").insertMany(dbdataflipkart);
    console.log(flipkartData);
    response.send(flipkartData);
})
app.post("/flipkart/:id", async function(request,response){
    const {id}=request.params;
    const flipkartDataeach=await client.db("webscraping").collection("flipkartCollection").findOne({id:id});
 
    flipkartDataeach?response.send(flipkartDataeach):response.send({msg:"mobile not found"});
})
})();
id=0;
const snapdealphones = ["https://www.snapdeal.com/product/fashionury-multicolor-silicon-printed-back/651266089484#bcrumbSearch:realme%20narzo%2050a%20prime%20mobile","https://www.snapdeal.com/product/fashionury-multicolor-printed-cover-compatible/650602404516#bcrumbSearch:redmi%20note%2011%20mobile%20phone","https://www.snapdeal.com/product/fashionury-printed-cover-for-samsung/642149637961",
"https://www.snapdeal.com/product/nbox-black-flip-cover-compatible/6917529694975649371#bcrumbSearch:samsung%20galaxy%20m33%20mobile","https://www.snapdeal.com/product/nbox-multicolor-polycarbonate-printed-back/628238020211#bcrumbSearch:samsung%20galaxy%20s20%20fe%205g%20mobile","https://www.snapdeal.com/product/fashionury-printed-cover-for-oneplus/619408557049#bcrumbSearch:oneplus%208t%205g%20back%20cover",
"https://www.snapdeal.com/product/fashionury-green-rubber-plain-cases/674856087141#bcrumbSearch:oneplus%2010r%20back%20cover","https://www.snapdeal.com/product/fashionury-black-hybrid-covers-for/619276783975#bcrumbSearch:samsung%20galaxy%20m52%20%20mobile","https://www.snapdeal.com/product/fashionury-printed-cover-for-motorola/662828325927#bcrumbSearch:moto%20g10%20cover",
"https://www.snapdeal.com/product/fashionury-printed-cover-for-realme/632494376541#bcrumbSearch:realme%20narzo%2050i%20back%20cover"];
(async()=>{
    let dbdatasnapdeal = [];
    for(let sphone of snapdealphones){
    const response = await request({
        uri: sphone,
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9"
        },
        gzip: true,
    })
    let $ = cheerio.load(response)
    id=id+1;
    let title= $('div[class="col-xs-22"] > h1').text().trim()
    let rating= $('div[class="review-wrapper writeRevieText"]>a').text().trim()
    let price= $('div[class="pdpCutPrice "] > div').text().trim()
    let finalprice= $('span[class="pdp-final-price"] > span').text().trim()
    dbdatasnapdeal.push({
        id,
        title,
        rating,
        price,
        finalprice,
    });
}
console.log(dbdatasnapdeal);
async function createConnection(){
    const client=new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected");
    return client;
}
const client=await createConnection();
app.post("/snapdeal", async function(request,response){
    const snapdealData=await client.db("webscraping").collection("snapdealCollection").insertMany(dbdatasnapdeal);
    console.log(snapdealData);
    response.send(snapdealData);
})
app.post("/snapdeal/:id", async function(request,response){
    const {id}=request.params;
    const snapdealDataeach=await client.db("webscraping").collection("snapdealCollection").findOne({id:id});
 
    snapdealDataeach?response.send(snapdealDataeach):response.send({msg:"mobile not found"});
})
})();
app.listen(PORT,()=>console.log(`App started in ${PORT}`));

