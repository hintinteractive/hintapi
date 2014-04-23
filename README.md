This document is meant for the apps that are going to be built on Hint REST API. The document is intended for frontend developers to refer.

## Technologies and SDKs
Hint uses [MongoDB](https://www.mongodb.org/) as its data source and [Node.js](http://nodejs.org/) ([Express.js](http://expressjs.com/)) as the backend server. Hint backend is hosted on [Windows Azure](http://www.windowsazure.com/en-us/develop/mobile/). Hint backend is highly (horizontally) scalable, and secure (oAuth 2.0 flow).

If you are building the client using Windows Phone Native, iOS Native, Android Native, Xamarin.iOS, Xamarin.Android, Sencha, or PhoneGap please refer to the [officially supported SDKs](http://www.windowsazure.com/en-us/documentation/articles/mobile-services-android-get-started/) by Windows Azure. However, this document will give you sufficient information to build your app with any client side technology, if you do not want to use one of those SDKs.

## oAuth 2.0 Flow
Please refer to [oAuth 2.0 specifications](http://oauth.net/2/) for more info. Please refer to [this](http://blog.rfaisal.com/2014/03/01/oauth-flow-for-mobile-apps-with-an-external-identity-server/) blog post to know more about the oAuth flow that is used in Hint.

For Hint,
-	The user's identity is verified by Facebook, i.e., external authentication.
-	The user's access to a protected resource, i.e., an API endpoint, is determined by the Hint server, i.e., internal authorization. In other words, the resource server and the authorization server in the oAuth 2.0 specification is the same Hint server.

The details of the oAuth flow for Hint is described below,

-	The client, i.e., the mobile app, calls facebook native sdk and verifies the users identity. On a successful verification, it receives an token from facebook. We will call it authorization_grant.
-	The client sends the authorization_grant to the Hint server for authorization. The Hint server has a trust relationship with facebook. So, it sends the authorization_grant to facebook. If facebook cannot verify the authorization_grant, it sends back 401 unauthorized to the Hint server, which it propagates to the client. If, however, facebook successfully verifies the authorization_grant, then it sends back the user info to the Hint server. The Hint server checks the permissions of the user (by querying the database) and generates a token. We will call it the access_token. A typical access_token contains the user's identity, permissions, and an expiry time. The Hint server sends back this access_token to the client.
-	The client embed this access_token with each request for the protected resource, i.e., calling API endpoint. Depending on if the user is allowed to access the resource, he either gets it or receives 401 unauthorized.

![alt text](https://raw.githubusercontent.com/hintinteractive/hintapi/master/oauth_mobile_flow_hint.png "Hint oAuth 2.0 flow")



## Configurations
These application configurations are loaded at the start (or restart) of the Hint server. Any change in these configurations requires a restart of the server to take effect,  (TODO) additionally the admins can call `GET api/config` to reload these without a server restart.

### `enum_internal_error_codes` :

		{
			unregistered_app : 'H001',
			facebook_error : 'H002',
			db_access_error : 'H003',
			user_banned : 'H004',
			unregistered_user : 'H005',
			session_expired : 'H006',
			bad_request : 'H007'
		}



### `enum_devices` :

		{
			android : 'android',
			ios : 'ios',
			undefined : 'undefined'
		}

### `enum_user_genders` :

		{
			male : 'male',
			female : 'female',
			other : 'other',
			undefined : 'undefined'
		}

### `enum_user_hair_colors` :

		{
			light : 'light',
			dark : 'dark',
			undefined: 'undefined'
		}

### `enum_user_statuses` :

		{
			admin : 'admin',
			active : 'active',
			inactive : 'inactive',
			banned : 'banned',
			debug : 'debug',
			test : 'test'
		}

### `enum_hint_statuses` :

		{
			sent : 'sent',
			accepted : 'accepted'
		}

### `enum_flirt_statuses` :

		{
			sent : 'sent',
			accepted : 'accepted',
			rejected : 'rejected'
		}
		
### `enum_event_statuses` :

		{
			created : 'created',
			deleted : 'deleted'
		}

## `enum_event_privacies`:
		{
				open:'OPEN',
				secret: 'SECRET',
				friends:'FRIENDS'
		}


### `enum_expiries` :

		{
			current_look : 24,
			event: 24,
			connection: 24,
			checkin: 4,
			flirt: 24,
			hint: 24
		}

### `enum_flags` :

		{
			collect_venue_category : true
		}

### `enum_defaults` :

		{
			venue_categoty: {
				flirt_options : {
					simple:'',
					forward:'',
					risky:''
				},
				image:''
			},
			venue_search_results : 35,
			checkin_search_results : 20
		}




## API Specifications
As a frontend developer, you will be interested in this section. To start using these endpoints you need to have a valid `facebook_access_token` (or we call it `hint_authorization_grant`). You can get this access token by logging in the user through the facebook SDK of your client. However, if your facebook app is not registered with Hint, this `access_token` will be rejected.

Except for `POST /api/login/facebook` API, all the other API endpoints require a hint_access_token/hint_auth_token to be embedded in the header, i.e., this actually means that the user is logged into the system. The `POST /login/facebook` API will give you the hint_access_token/hint_auth_token.

To logoff, simply remove the hint_auth_token from the application cache and also trigger a facebook SDK logoff function. If you are using an Azure SDK then call the logoff function along with the facebook logoff function.

The following API endpoints are available to the public:

### Error Response:

1. Desc: any type of system error

2. Response:
		{
			code : 500, /*Standard HTTP error code*/
			error : "Internal Server Error", /*Standard HTTP error code details*/
			error_obj : { /*optional*/
					internal_error_code : 'H001', /*defined by enum_internal_error_codes*/
					message : 'Your facebook app is not registered with us.' /*the useful error msg*/
			}
		}

### API `POST /api/login/facebook`
1. Desc: login the user to our system

1. Trigger:
	- Login:
		-	click login button,
		-	fire up facebook sdk
		-	after successful login with basic permissions
		-	receives the access_token from facebook
		-	call this endpoint with the access_token.
2. Request param:

		{
		}

3. Request body:

		{
			access_token : "facebook_access_token",
			device : "enum_devices" /*to be filled by the client SDK*/
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json"
		}

5. Response:

		{
			user: {
				userId : "Facebook:fb_id"
			},
			authenticationToken: 'auth_token that can be used for subsequent calls'
		}

6. After Action :
	-	Call `GET /api/user `upon successful login, and from the response, update the current user info in the client (mobile app memory).
	-	Cache the authenticationToken, i.e., auth_token as it is required for each api call.

7. Additional Info:
	-	auth_token is valid for 30 days.
	-	When calling any api with auth_token, if you get 401 unauthorized then log off the user.
	-	Make sure you use basic permission only when log in with the facebook sdk.
	-	(Server Side) Get the user from database by facebook user id.
		-	If the user doesn't exists, call facebook with the access_token (embedded in the header) to get user's basic info and update the database with info from facebook.
		-	If the user exists but his status is inactive then update the database and make the status active.
		-	If the user exists but his status is banned then return 401.
		-	Return user's info.

### API `GET /api/user`
1. Desc: get the current user info

1. Trigger:
	-	After user login to the system (after action for `POST  /login/facebook` API call).
	-	User enters the user settings page (because a refresh to the user info happens on enter).
	-	User refresh his information (by pulling down the listview).

2. Request param:

		{
		}

3. Request body:

		{
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
		    "api_access": true,
		    "result": {
				"__v": 0,
				"_id": "532f56d3152d0d3032e5af4c",
				"social_id": "Facebook:100007978092636",
				"name": "James Amgighjibfcf Lauwitz",
				"contact": {
						"email": "",
						"phone": ""
				},
				"hair_color": "undefined",
				"gender": "male",
				"interested_in": []
				"status": "active",
				"black_list": []
		    }
		}

6. After Action :
	-	If the user status is `enum_user_statuses.banned`, show a message saying that he is banned from the app and log him out. (TODO: the server side validation of this is currently being built)
	-	If the user status is `enum_user_statuses.admin`, show the admin panel otherwise hide the admin panel (TODO: the admin panel features are being decided).
	-	Update the user's info in the app memory.

7. Additional Info:
	-	The info you are looking for will typically be available in the `result` property of the response.
	-	Igonre `api_access` and `result.__v` properties.
	-	`_id` is the unique id of the document (sql equivalent of primary key). For users, we do not care about this key (we only care about `social_id`) and can be ignored.


### API `PATCH /api/user`
1. Desc: update the user's info
1. Trigger:
	-	User updates his info in the user settings page.
	-	User uploads a photo (only if the url is different, trigger this call).

2. Request param:

		{
		}

3. Request body: (all of these properties are optional)

		{
			name : String,
			contact: {
				email : String,
				phone : String
			},
			hair_color : String,
			gender : String,
			interested_in : [String]
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response: (updated user)

		{
		    "api_access": true,
		    "result": {
				"__v": 0,
				"_id": "532f56d3152d0d3032e5af4c",
				"social_id": "Facebook:100007978092636",
				"name": "James Amgighjibfcf Lauwitz",
				"contact": {
						"email": "",
						"phone": ""
				},
				"hair_color": "undefined",
				"gender": "male",
				"interested_in": []
				"status": "active",
				"photo_url": "https://graph.facebook.com/100007978092636/picture?width=340&height=340",
				"black_list": []
		    }
		}
6. After Action :
	-	Update the user's info in the app memory.
7. Additional Info:
	-	Provide the property you want to update in the request body (if a property is missing then it keeps its original value).
	-	Trying to update __v, _id, social_id, or, black_list will generate an internal server error.
	-	Any property that is not part of the schema will be ignored.
	-	(Server side) The user id is extracted from the X-ZUMO-AUTH header.

### API `DELETE /api/user`
1. Desc: deactivite a user
1. Trigger:
	-	user clicks the deactivate account button.

2. Request param:

		{
		}

3. Request body:

		{
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
		    "api_access": true,
		    "result": {
		        "success": true,
		        "_id" : "the id of the user just deactivated" //TODO: not yet implemented
		    }
		}

6. After Action :
	-	Log off the user.

7. Additional Info:
	-	(Server side) The user id is extracted from the X-ZUMO-AUTH header.


### API `GET /api/venue`
1. Desc: get a list of venues
1. Trigger:
	-	User enters the Near By Places page.
	-	User refresh the Near By Places page (by pulling down the listview)
	-	User search for venues.
2. Request param:

		{
			lat : 'user lat',
			lng : 'user lng',
			search : 'search string',
			limit : 'number of results, default enum_defaults.venue_search_results',
			radius : 'radius of the search'
		}

3. Request body:

		{
		}

3. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

4. Response:

		{
		  "api_access": true,
		  "result": [{
		      "social_id": "Facebook:299653616750093",
		      "name": "Robert Moses",
		      "address": "870 Market Street, San Francisco, CA",
		      "distance": 0.07450498373084966,
		      "lat": "the-lat",
		      "lng": "the-long",
		      "category": {
		          "flirt_options": {
		              "simple": "Hey, let's chat!",
		              "forward": "You're Hot!",
		              "risky": "Want to get out of here?"
		          },
		          "image": "the link"
		      }
		  }]
		}

5. Additional Info:
	-	The response array will be sorted by distance.
	-	`lat` and `lng` parameters are required.
	-	if `search` parameter is not provided then search in all.
	-	if `limit` parameter is not provided then use `enum_defaults.venue_search_results`.
	-	if `radius` is not provided then the area where to search is not enforced.
	-	(Server side) Implementation details:
		-	Get the venue list from facebook.
		-	A typical facebook venue object is of the following format:

					{
						"category": "Health/beauty",
						"category_list": [{
							"id": "139225689474222",
							"name": "Spa, Beauty & Personal Care"
						}],
						"location": {
							"street": "225 Bush St, 20th Floor",
							"city": "San Francisco",
							"state": "CA",
							"country": "United States",
							"zip": "94104",
							"latitude": 37.791090500712,
							"longitude": -122.40105336454
						},
						"name": "Benefit Cosmetics",
						"id": "48879913147"
					}

		-	After receiving the venue list, query our database to get the category info.
		-	If the category is not found, return the enum_defaults.venue_categoty
		-	If the category is not found and enum_flags.collect_venue_category is true, then update the venue_categories collection with enum_defaults.venue_categoty for this category and return it.  
		-	Construct the response object from these info.

### `GET /api/event` : get a list of events

1. Trigger:
	-	user goes to the my events page.
	-	user refreshes the my events page.
	-	user clicks on a event and views it

2. Request param:

		{
			social_id : 'optional, the social id of the event, if provided the result array will have at most 1 element',
			search : 'search string for public events only, all my events are always shown, currently not used',
			lat : 'current lat',
			lng: 'current lng'
		}

3. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

4. Response:

		[{
			social_id: { type: String, index: { unique: true}},
			title : String,
			description: String,
			social_venue: {
				social_id: String,
				name : String,
				address : String,
				category: {
					image: String
				}
			},
			owners:[{
				user :{
					_id : String,
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
			rsvp :{ //only if social_id is provided in the request param
				rsvp_status : "attending, declined, maybe, or noreply",
				attending_count : Number,
				declined_count : Number,
				maybe_count : Number,
				noreply_count : Number
			}
		}]

5. Additional Info:
	- (TODO) the search will include nearby public events, (TODO) add lat, lng to the venues


### `GET /api/event/friend` : get user's frined list who are not invited to an event of a event.

1. Trigger:
	-	user clicks on invite friends to events

2. Request param:

		{
			social_id : 'required, the social id of the event, if no provided generate a error',
			search : 'search the name of friends, currently not used'
		}

3. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

4. Response:

		[{
			social_id: { type: String, index: { unique: true}},
			name : String,
			image : String
		}]

5. Additional Info:


- `POST /api/event` : add a new event

1. Trigger:
	-	user creates a new event

2. Request param:

		{
		}

3. Request body:

		{
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
			start : Number,
			expiry : Number,
			flirt_options : {
				simple : String,
				forward : String,
				risky : String
			},
			privacy : String
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
				"api_access": true,
				"result": {
						"success": true
				}
		}

6. Additional Info:

### `PATCH /api/event` : user updates an event

1. Trigger:
	-	user updates an event

2. Request param:

		{
			id: 'MongoDB ObjectId'
		}

3. Request body:

		{
			title : String,
			social_venue: {
				social_id: String,
				name : String,
				address : String,
				category: {
					image: String
				}
			},
			owners:[{
				user :{
					_id : String,
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

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
				"api_access": true,
				"result": {
						"success": true
				}
		}

6. Additional Info:

### API `POST /api/checkin`
1. Desc: checkin to a venue
1. Trigger:
	-	user clicks the checkin button

2. Request param:

		{
		}

3. Request body:

		{
			user : {
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
			event : {
			    social_id: String,
			    title : String,
			    social_venue: {
			        social_id: String,
			        name : String,
			        address : String,
							category: {
						        	image : String //not yet changed
							}
			    },
			    start : Date,
			    expiry : Date,
			    flirt_options : {
			        simple : String,
			        forward : String,
			        risky : String
			    }
			},
			social_venue : {
			   social_id : 'Facebook:fb_id',
			   name : 'name of the place',
			   address : 'address of the place',
			   category: {
			       flirt_options : {
			           simple : 'simple flirt',
			           forward : 'forward flirt',
			           risky : 'risky flirt'
			       }
			       image : 'image link'
			   }
			}
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
				"api_access": true,
				"result": {
						"success": true
				}
		}

6. Additional Info:
	- user.social_id is filled up by the server, all the other info will be available in the client.
	- Trying to check into an event before its start time will generate an internal server error.
	- The time field of the collection will be current system time.
	- If one of event.social_venue.social_id and social_venue.social_id is not provided, then an internal server error will be generated.
	- Server Side operations:
		- If the event object is present (social_venue is ignored), then the necessary info for the collection will be taken from the event object. However, the expiry can be no more than enum_expiries.event.
		- If the event object is null, social_venue object will be used for the necessary info for the collection, the missing info will be taken from the enums.
		- received_flirts and received_hints will be empty arrays.



### API `GET /api/checkin`
1. Desc: get a list of checkins for a venue
1. Trigger:
	-	user comes to the "Who is Here?" landing page.
	-	refresh of the "Who is Here?" landing page.
	-	(TODO) user search for checkins.

2. Request param:

		{
			social_venue_id: 'Facebook:id',
			event_social_id: 'facebook:id',
			hair_color : 'optional: if not provided ignore',
			interested_in : [String],
			search : 'search string in identifier',
			limit : 'number of results, default enum_defaults.checkin_search_results',
		}

3. Request body:

		{

		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
			"api_access": true,
			"result": [{
				user : {
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
				event : {
				    social_id : String,
				    title : String
				},
				social_venue : {
				    social_id : String,
				    name : String,
				    address : String,
				    image : String
				},
				flirt_options : {
				    simple : String,
				    forward : String,
				    risky : String
				},
				time : 'checkin time',
				expiry : 'expiry time',
				flirts : [{
					user:{
						social_id : String
					}
				}],
				hints : [{
					user:{
						social_id : String
					}
				}]
			}]
		}

5. Additional Info:
	-	If event_social_id is provided, search with it, otherwise search checkins with social_venue_id, if none provided a 500 error is generated.
	-	(TODO) If limit parameter is not provided, then enum_defaults.checkin_search_results is used to determine how many checkins will be returned.
	-	(TODO) If interested_in,hair_color,search are not provided then search all.
	-	(TODO) Optimize the search.

### `POST /api/flirt` : sends a flirt

1. Trigger:
	-	user sends a flirt to another user

2. Request param:

		{
		}

3. Request body:

		{
			checkin : {
				id: String
			},
			user_from : {
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
				address : String
			},
			flirt_options : {
				type: String,
				text: String
			}
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
				"api_access": true,
				"result": {
						"success": true
				}
		}

6. Additional Info:
	- user_from.social_id will be filled out by the server (current login)
	- flirt_options.type is either simple, forward, or risky
	- status will be enum_flirt_statuses.sent
	- time will be current system time
	- expiry will br set according to enum_expiries.flirt
	- sends a push notification to the recipient.
	- patch the checkin collection to add to sent_flirts

### API `GET /api/flirt`
1. Desc: get a list of flirts for a user
1. Trigger:
	-	user comes to the right menu.
	-	user refresh the right menu.

2. Request param:

		{

		}

3. Request body:

		{

		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
			"api_access": true,
			"result": [{
				_id : ObjectId,
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
			}]
		}

5. Additional Info:
	-	If event_social_id is provided, search with it, otherwise search checkins with social_venue_id, if none provided a 500 error is generated.
	-	(TODO) If limit parameter is not provided, then enum_defaults.checkin_search_results is used to determine how many checkins will be returned.
	-	(TODO) If interested_in,hair_color,search are not provided then search all.
	-	(TODO) Optimize the search.

### `PATCH /api/flirt` : user accepts or rejects a flirt

1. Trigger:
	-	user accepts a flirt
	-	user rejects a flirt

2. Request param:

		{
			id: 'MongoDB ObjectId'
		}

3. Request body:

		{
			action: 'accept or reject'
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
			success : Boolean
		}
6. Additional Info:
	- if  action == 'accept', change status=enum_flirt_statuses.accepted, create a connection, send a push notification to the other person.
	- if  action == 'reject', change status=enum_flirt_statuses.rejected, send a push notification to the other person.

- `POST /api/hint` : sends a hint

1. Trigger:
	-	user sends a hint to another user

2. Request param:

		{
		}

3. Request body:

		{
			checkin : {
				id: String
			},
			user_from : {
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
				address : String
			}
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
				"api_access": true,
				"result": {
						"success": true
				}
		}

6. Additional Info:
	- user_from.social_id will be filled out by the server (current login)
	- status will be enum_hint_statuses.sent
	- time will be current system time
	- expiry will br set according to enum_expiries.hint
	- patch the checkin collection to add to sent_hint.
	- run the connection algorithm (check if there is an un-expired hint from the other person in the same venue)
	- if a connection is created, sends a push notification to both, otherwise send it to the recipient.

### `GET /api/connection` : get a list of connections

1. Trigger:
	-	user open up the right menu.
	-	user click on a connection.

2. Request param:

		{
			id : 'optional, id of the connection, if provided the result array will have at most 1 element'
		}

3. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

4. Response:

		[{
			users: [{
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
				address : String
			},
			messages : [{
				user :{
					social_id : String
				},
				text: String,
				time: Date
			}],
			keep_alive : {
				flag : Boolean,
				user :{
					social_id : String
				}
			},
			time : Date,
			expiry : Date
		}]

5. Additional Info:
	-	filter unexpired connection by current logged in user_id and connection_id (if provided)

### `PATCH /api/connection` : user sends a message(TODO: update expiry, and ask to keep connection alive)

1. Trigger:
	-	user sends a message

2. Request param:

		{
			id: 'MongoDB ObjectId'
		}

3. Request body:

		{
			message : {
				text: String
			}
		}

4. Request headers:

		{
			Content-Type : "application/json",
			Accept : "application/json",
			X-ZUMO-AUTH : "auth_token"
		}

5. Response:

		{
				"api_access": true,
				"result": {
						"success": true
				}
		}

6. Additional Info:
	- message.user.social_id will be filled up by the server
	- time will be current expiry time
