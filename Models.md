## Models and Schemas
Each of these models represent a collection in the database. If you come from a MVC background, then you can think of these Models as the MVC models. Each of these models, has a unique `_id` field. If you come of a SQL background, then you can think of `_id` as the primary key.

### Model `api_access`
- Records each API access
- Collection name : `api_accesses`
- Schema :

    {
      user: {
        _id: ObjectId,
        social_id: String
      },
      app{
          _id : ObjectId,
          social_id : String
      },
      api: {
          name : String,
          method : {type: String, "default": 'GET'}
      },
      access :{
          time : {type: Date, "default": Date.now},
          device : {type: String, "default": 'undefined'}
      }
    }

- Additional Info:
  - `_id` is used for identifying each document.
  - Needed for analytics and does not affect normal the operations of Hint
  - Added an entry to this collection every time a api end point is accessed.
  - Heavy write operations and low read operations (only happens for analytics).


### Model `user`
- The User info
- Collection name : `users`
- Schema :

    {
      /*_id : ObjectId,*/
      social_id : { type: String, index: { unique: true}},
      name : String,
      contact: {
        email : String,
        phone : String
      },
      hair_color : String,
      gender : String,
      interested_in : [String],
      status : String,
      black_list : [String]
    }

- Additional Info:
  - `social_id` is used for identifying each	document.
  -	Low read and write operations.

### Model `app`
- The App info
- Collection name : `apps`
- Schema :

    {
      /*_id : ObjectId,*/
      social_id : { type: String, index: { unique: true}},
      name : String,
      social_secret : String
    }

- Additional Info:
  - `social_id` is used for identifying each	document.
  -	Medium read and vary low write operations.


### Model `venue_category`
- Records of types of venues and corresponding flirt options
- Collection name : `venue_categories`
- Schema :

    {
      /*_id : ObjectId,*/
      social_id : { type: String, index: { unique: true}},
      name : String,
      flirt_options : {
        simple : String,
        forward : String,
        risky : String
      },
      image: String
    }

- Additional Info:
  - `social_id` is used for identifying each document.
  - For each `GET /api/venue` call,  search the collection with a list of `social_id` and add the result to the response.
  - Heavy read operations.
  - Low write operations (normal), and medium write operations (when `enum_flags.collect_venue_category` is true).


### Model `checkin`
- Records of user's checkin to places
- Collection name : `checkins`
- Schema :

    {
        /*_id : ObjectId,*/
        user : {
            _id : ObjectId,
            social_id : String,
            name : String,
            hair_color : String,
            gender : String,
            interested_in : [String],
            current_look : {
                image : String,
                identifier: {
                    type : String,
                    brand : String,
                    color : String
                }
            }
        },
        event : {
            _id : ObjectId,
            social_id : String,
            name : String
        },
        venue : {
            social_id : String,
            name : String,
            address : String,
            lat : Number,
            lng : Number,
            category: {
              image: String
            }
        },
        flirt_options : {
            simple : String,
            forward : String,
            risky : String
        },
        time : {type: Date, "default": Date.now},
        expiry : Date,
        flirts : {
          type: [{
              user:{
                  _id : ObjectId,
                  social_id : String
              }
          }],
          "default": []
      },
      hints : {
          type: [{
              user:{
                  _id : ObjectId,
                  social_id : String
              }
          }],
          "default": []
      }
    }

- Additional Info:
  -	`_id` is used for identifying each document.
  -	Heavy read and write operations.


### Model `event`
- the event info and its flirt options
- Collection name : `events`
- Schema :

    {
      /*_id : ObjectId,*/
      social_id: { type: String, index: { unique: true}},
      name : String,
      description: String,
      venue: {
        social_id: String,
        name : String,
        address : String,
        lat : Number,
        lng : Number,
        category: {
          image: String
        }
      },
      owners:[{
        user :{
          _id : ObjectId,
          social_id : String
        }
      }],
      start : Date,
      expiry : Date,
      flirt_options : {
        simple : String,
        forward : String,
        risky : String
      },
      privacy : String
    }

- Additional Info:
  -	`social_id` is used for identifying each document.
  -	Low write operations, and medium read operations.  



### Model `hint`
- Records of sent hints and their status
- Collection name : `hints`
- Schema :

    {
      /*_id : ObjectId,*/
      checkin : {
        _id: ObjectId
      },
      user_from : {
        _id: ObjectId,
        social_id : String,
        name : String,
        hair_color : String,
        gender : String,
        interested_in : [String],
        current_look : {
          image : String,
          identifier: {
            type : String,
            brand : String,
            color : String
          }
        }
      },
      user_to : {
        _id : ObjectId,
        social_id : String,
        name : String,
        hair_color : String,
        gender : String,
        interested_in : [String],
        current_look : {
          image : String,
          identifier: {
            type : String,
            brand : String,
            color : String
          }
        }
      },
      social_venue : {
        social_id : String,
        name : String,
        address : String,
        lat : Number,
        lng : Number,
        category: {
          image: String
        }
      },
      status : String,
      time : {type: Date, "default": Date.now},
      expiry : Date
    }

- Additional Info:
  -	`_id` is used for identifying each document.
  - Heavy write operations and medium read operations.

### Model `flirt`
- Records of sent flirts and their status
- Collection name : `flirts`
- Schema :

    {
      /*_id : ObjectId,*/
      checkin : {
        _id: ObjectId
      },
      user_from : {
        _id : ObjectId,
        social_id : String,
        name : String,
        hair_color : String,
        gender : String,
        interested_in : [String],
        current_look : {
          photo_url : String,
          identifier: {
            type : String,
            brand : String,
            color : String
          }
        }
      },
      user_to : {
        _id : ObjectId,
        social_id : String,
        name : String,
        hair_color : String,
        gender : String,
        interested_in : [String],
        current_look : {
          photo_url : String,
          identifier: {
            type : String,
            brand : String,
            color : String
          }
        }
      },
      social_venue : {
        social_id : String,
        name : String,
        address : String,
        lat : Number,
        lng : Number,
        category: {
          image: String
        }
      },
      flirt_options : {
        type: String,
        text: String
      },
      status : String,
      time : {type: Date, "default": Date.now},
      expiry : Date
    }

- Additional Info:
  -	`_id` is used for identifying each document.
  - Heavy write operations and medium read operations.


### Model `connection`
- Records of created connections and messages in those connections.
- Collection name : `connections`
- Schema :

    {
      /*_id : ObjectId,*/
      users: [{
        _id : ObjectId,
        social_id : String,
        name : String,
        hair_color : String,
        gender : String,
        interested_in : [String],
        current_look : {
          photo_url : String,
          identifier: {
            type : String,
            brand : String,
            color : String
          }
        }
      }],
      social_venue : {
        social_id : String,
        name : String,
        address : String,
        lat : Number,
        lng : Number,
        category: {
          image: String
        }
      },
      messages : [{
        user :{
          _id : ObjectId,
          social_id : String
        },
        text: String,
        time: Date
      }],
      keep_alive : {
        flag : Boolean,
        user :{
          _id :ObjectId,
          social_id : String
        }
      },
      time : Date,
      expiry : Date
    }

- Additional Info:
  -	`_id` is used for identifying each document.
  - Heavy read and write operations.
