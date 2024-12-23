const baseUrl ="http://localhost:3030/";

let user ={
    "email": "",
    "password": "123456"
};

let lastCreatedAlbum ='';

let myAlbum ={

    name : "",
    artist : "Ivo",
    description : "",
    genre : "Random genre",
    imgUrl : "/images/pinkFloyd.jpg",
    price : "15.25",
    releaseDate: "29 June 2024", 

}

let token = "";
let userId = "";

QUnit.config.reorder = false;

QUnit.module("user functionalities", ()=>{
    QUnit.test("registration",  async(assert) =>{
        //arrange
        let path = "users/register";

        let random = Math.floor(Math.random() * 10000);
        let email = `abv${random}@abv.bg`;

        user.email = email;

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let json = await response.json();

        console.log(json)

        //assert
        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), "email exists");
        assert.equal(json['email'], user.email, 'expected email');
        assert.strictEqual(typeof json.email, 'string', "email has correct type");
        assert.ok(json.hasOwnProperty('password'), "password exists");
        assert.equal(json['password'], user.password, 'expected password');
        assert.strictEqual(typeof json.password, 'string', "password has correct type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "password has correct type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id has correct type");

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exists");
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has correct type");

        token = json['accessToken'];
        userId = json['_id'];

        sessionStorage.setItem('event-user', JSON.stringify(user));

    } )

    QUnit.test("login", async (assert)=>{
        //arrange
        let path = 'users/login';

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        let json = await response.json();
        
        //assert
        assert.ok(response.ok);

        assert.ok(json.hasOwnProperty('email'), "email exists");
        assert.equal(json['email'], user.email, 'expected email');
        assert.strictEqual(typeof json.email, 'string', "email has correct type");

        assert.ok(json.hasOwnProperty('password'), "password exists");
        assert.equal(json['password'], user.password, 'expected password');
        assert.strictEqual(typeof json.password, 'string', "password has correct type");

        assert.ok(json.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "password has correct type");

        assert.ok(json.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof json._id, 'string', "_id has correct type");

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exists");
        assert.strictEqual(typeof json.accessToken, 'string', "accessToken has correct type");

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('event-user', JSON.stringify(user));
        
    })

})    

QUnit.module("Event functionalities", () =>{
    QUnit.test("get all album", async (assert)=>{
       // arrange
        let path = 'data/albums';
        let queryParams = '?sortBy=_createdOn%20desc&distinct=name';

        //act
        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();
    
        console.log(json)

        //assert
        assert.ok(response.ok);
        assert.ok(Array.isArray(json), "response is array");

        json.forEach(jsonData => {

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

            assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
            assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");
           
            assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

            assert.ok(jsonData.hasOwnProperty('artist'), "artist exists");
            assert.strictEqual(typeof jsonData.artist, 'string', "artist is from correct type");
            

            assert.ok(jsonData.hasOwnProperty('description'), "description exists");
            assert.strictEqual(typeof jsonData.description, 'string', "description is from correct type");

            assert.ok(jsonData.hasOwnProperty('genre'), "genre exists");
            assert.strictEqual(typeof jsonData.genre, 'string', "genre is from correct type"); 
            
            assert.ok(jsonData.hasOwnProperty('imgUrl'), "imgUrl exists");
            assert.strictEqual(typeof jsonData.imgUrl, 'string', "imgUrl is from correct type");

            assert.ok(jsonData.hasOwnProperty('name'), "name exists");
            assert.strictEqual(typeof jsonData.name, 'string', "name is from correct type");

            assert.ok(jsonData.hasOwnProperty('price'), "price exists");
            assert.strictEqual(typeof jsonData.price, 'string', "price is from correct type");


            assert.ok(jsonData.hasOwnProperty('releaseDate'), "releaseDate exists");
            assert.strictEqual(typeof jsonData.releaseDate, 'string', "releaseDate is from correct type");


        });

       
    

    });
    QUnit.test("create  album", async (assert)=>{
        // arrange
        let path = 'data/albums';
        let random = Math.floor(Math.random() * 10000);
       
        myAlbum.name = `Random Name: ${random}`;
        myAlbum.description =`Random description: ${random}`;
       

        // act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(myAlbum)
        })
        let jsonData = await response.json();
        
        console.log(jsonData)

        //assert
        assert.ok(response.ok, "Response is ok");

        assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
        assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

        assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
        assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");
       
        assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
        assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

        assert.ok(jsonData.hasOwnProperty('artist'), "artist exists");
        assert.strictEqual(typeof jsonData.artist, 'string', "artist is from correct type");
        assert.strictEqual(jsonData.artist, myAlbum.artist, "Artist is expected" )

        assert.ok(jsonData.hasOwnProperty('description'), "description exists");
        assert.strictEqual(typeof jsonData.description, 'string', "description is from correct type");

        assert.ok(jsonData.hasOwnProperty('genre'), "genre exists");
        assert.strictEqual(typeof jsonData.genre, 'string', "genre is from correct type"); 
        assert.strictEqual(jsonData.genre, myAlbum.genre, "genre is expected" )
        
        assert.ok(jsonData.hasOwnProperty('imgUrl'), "imgUrl exists");
        assert.strictEqual(typeof jsonData.imgUrl, 'string', "imgUrl is from correct type");
        assert.strictEqual(jsonData.imgUrl, myAlbum.imgUrl, "imgUrl is expected" )

        assert.ok(jsonData.hasOwnProperty('name'), "name exists");
        assert.strictEqual(typeof jsonData.name, 'string', "name is from correct type");
        assert.strictEqual(jsonData.name, myAlbum.name, "name is expected" )

        assert.ok(jsonData.hasOwnProperty('price'), "price exists");
        assert.strictEqual(typeof jsonData.price, 'string', "price is from correct type");
        assert.strictEqual(jsonData.price, myAlbum.price, "price is expected" )


        assert.ok(jsonData.hasOwnProperty('releaseDate'), "releaseDate exists");
        assert.strictEqual(typeof jsonData.releaseDate, 'string', "releaseDate is from correct type");
        assert.strictEqual(jsonData.releaseDate, myAlbum.releaseDate, "releaseDate is expected" );

        lastCreatedAlbum = jsonData._id;

    }) ;

    QUnit.test("Album editing" , async(assert)=>{
        //arrange
        let path = 'data/albums';
        let random = Math.floor(Math.random() * 10000);
        myAlbum.name = `Edit name : ${random}`;

               //act
    let response = await fetch(baseUrl + path + `/${lastCreatedAlbum}`, {
        method: "PUT",
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(myAlbum)
    })
    let jsonData = await response.json();

    // assert
    assert.ok(response.ok, "Response is ok");
    assert.ok(jsonData.hasOwnProperty('_createdOn'), "_createdOn exists");
    assert.strictEqual(typeof jsonData._createdOn, 'number', "_createdOn is from correct type");

    assert.ok(jsonData.hasOwnProperty('_id'), "_id exists");
    assert.strictEqual(typeof jsonData._id, 'string', "_id is from correct type");
   
    assert.ok(jsonData.hasOwnProperty('_ownerId'), "_ownerId exists");
    assert.strictEqual(typeof jsonData._ownerId, 'string', "_ownerId is from correct type");

    assert.ok(jsonData.hasOwnProperty('artist'), "artist exists");
    assert.strictEqual(typeof jsonData.artist, 'string', "artist is from correct type");
    assert.strictEqual(jsonData.artist, myAlbum.artist, "Artist is expected" )

    assert.ok(jsonData.hasOwnProperty('description'), "description exists");
    assert.strictEqual(typeof jsonData.description, 'string', "description is from correct type");

    assert.ok(jsonData.hasOwnProperty('genre'), "genre exists");
    assert.strictEqual(typeof jsonData.genre, 'string', "genre is from correct type"); 
    assert.strictEqual(jsonData.genre, myAlbum.genre, "genre is expected" )
    
    assert.ok(jsonData.hasOwnProperty('imgUrl'), "imgUrl exists");
    assert.strictEqual(typeof jsonData.imgUrl, 'string', "imgUrl is from correct type");
    assert.strictEqual(jsonData.imgUrl, myAlbum.imgUrl, "imgUrl is expected" )

    assert.ok(jsonData.hasOwnProperty('name'), "name exists");
    assert.strictEqual(typeof jsonData.name, 'string', "name is from correct type");
    assert.strictEqual(jsonData.name, myAlbum.name, "name is expected" )

    assert.ok(jsonData.hasOwnProperty('price'), "price exists");
    assert.strictEqual(typeof jsonData.price, 'string', "price is from correct type");
    assert.strictEqual(jsonData.price, myAlbum.price, "price is expected" )


    assert.ok(jsonData.hasOwnProperty('releaseDate'), "releaseDate exists");
    assert.strictEqual(typeof jsonData.releaseDate, 'string', "releaseDate is from correct type");
    assert.strictEqual(jsonData.releaseDate, myAlbum.releaseDate, "releaseDate is expected" );
    });

    QUnit.test("Delete album", async(assert)=>{
        //arrange
        let path = 'data/albums';

        //act
        let response = await fetch(baseUrl + path + `/${lastCreatedAlbum}`,
           { method : "DELETE",
            headers : {
                'X-Authorization' : token
            }
            })
        
         // assert
         assert.ok(response.ok);

        


    })


})
   
        
    