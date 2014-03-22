#API Specification
This document specifies the backend REST API and backend designs for Hint. The frontend developers can refer to this.

## Enums

- `enum_user_statuses` :

		{
			admin : 'admin',
			active : 'active',
			inactive : 'inactive',
			banned : 'inactive',
			debug : 'debug'
		}

- `enum_hint_statuses` :

		{
			sent : 'sent',
			accepted : 'accepted'
		}

- `enum_flirt_statuses` :

		{
			sent : 'sent',
			accepted : 'accepted',
			rejected : 'rejected'
		}

- enum_user_genders :

		{
			male : 'male',
			female : 'female',
			other : 'other',
			undefined : 'undefined'
		}

- `enum_user_hair_colors` :

		{
			light : 'light',
			dark : 'dark',
			undefined: 'undefined'
		}

- `enum_expiries` :

		{
			current_look : 24,
			event: 24,
			connection: 24,
			checkin: 4,
			flirt: 24,
			hint: 24
		}

- `enum_flags` :

		{
			collect_venue_category : true
		}

- `enum_defaults` :

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


## Models

- api_access :
	- Collection name : api_accesses
	- Schema :

			{
				user: {
					social_id: String
				},
				api_name: String,
				'method': {type: String, "default": 'GET'},
				access_time: {type: Date, "default": Date.now}
			}

	- Additional Info:
		- Add a entry to this collection every time a api end point is accessed.
		- Write heavy, read only needs for analytics purpose.

- venue_category :
	- Collection name : venue_categories
	- Schema :

			{
				social_id : String,
				name : String,
				flirt_options : {
					simple : String,
					forward : String,
					risky : String
				},
				image: String
			}

	- Additional Info:
		- Search the collection with a list of social_category.id for each GET /api/venue call.
		- Read heavy (normal situations).
		- Read and Write heavy (when enum_flags.collect_venue_category is true)

- user :
	- Collection name : users
	- Schema :

			{
				social_id : String,
				name : String,
				contact: {
					email : String,
					phone : String
				},
				hair_color : String,
				gender : String,
				interested_in : [String],
				status : String,
				black_list : [String],
				photo_url: String
			}

	- Additional Info:
		-

- event :
	- Collection name : events
	- Schema :

			{
				social_id: String,
				title : String,
				social_venue: {
					social_id: String,
					name : String,
					address : String,
					image : String
				},
				owners:[{
					user :{
						social_id : String
					}
				}],
				start : Date,
				expiry : Date,
				flirt_options : {
					simple : String,
					forward : String,
					risky : String
				}
			}

	- Additional Info:
		-

- checkin :
	- Collection name : checkins
	- Schema :

			{
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
			    time : {type: Date, "default": Date.now},
			    expiry : Date,
			    received_flirts : {
			    	type: [{
				        user:{
				            social_id : String
				        }
				    }],
				    "default": []
				},
			    received_hints : {
			    	type: [{
				        user:{
				            social_id : String
				        }
				    }],
				    "default": []
				}
			}

	- Additional Info:
		-

- hint :
	- Collection name : hints
	- Schema :

			{
				user_from : {
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
				status : String,
				time : Date,
				expiry : Date
			}

	- Additional Info:
		-

- flirt :
	- Collection name : flirts
	- Schema :

			{
				user_from : {
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
				},
				status : String,
				time : Date,
				expiry : Date
			}

	- Additional Info:
		-


- connection :
	- Collection name : connections
	- Schema :

			{
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
			}

	- Additional Info:
		-



## API Endpoints

- `POST /login/facebook` : login the user to our system

	1. Trigger:
		-	click login button
		-	fire up facebook sdk
		-	after successful login with basic permissions
		-	receives the access_token from facebook
		-	call this endpoint with the access_token.
	2. Request param:

			{
				access_token : "facebook_access_token"
			}

	3. Request headers:

			{
				Content-Type : "application/json",
				Accept : "application/json"
			}

	4. Response:

			{
				user: {
					userId : "Facebook:fb_id"
				},
				authenticationToken: 'auth_token'
			}

	5. After Action :
		-	Call GET /api/user upon successful login and update the current user info in the client.

	5. Additional Info:
		-	auth_token is valid for 30 days, so cache it in the application.
		-	auth_token is necessary to make any api calls.
		-	If auth_token is invalid log off the user.

- `GET /api/user` : get the current user info, if user doesn't exists call facebook and update user info

	1. Trigger:
		-	after user logged in to the system.
		- 	after user comes to the user settings page.
		-	after user refresh his information.

	2. Request param:

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
				id : String,
				social_id : String,
				name : String,
				contact: {
					email : String,
					phone : String
				},
				hair_color : String,
				gender : String,
				interested_in : [String],
				status : String,
				black_list : [String],
				photo_url: String
			}

	5. After Action :
		-	If the user status is banned, show a message saying that he is banned from the app and log him out.
		-	Update the user's info in the app.

	6. Additional Info:
		-	Get the user from databse from the userid embedded in the header.
		-	If the user doesn't exists, call facebook with the access_token embedded in the header to get user's basic info and update the database with info facebook
		-	If the user exists but his status is inactive then update the database and make the status active.
		- 	Return user's info.

- `PATCH /api/user` : update the user's info

	1. Trigger:
		-	user updates his info in the user settings page.
		- 	user uploads a photo (only if the url is different, trigger this call).

	2. Request param:

			{
			}

	3. Request body:
		All of these properties are optional.

			{
				name : 'users name',
				contact: {
					email : 'users email',
					phone : 'users phone'
				},
				hair_color : 'dark or light',
				gender : 'male female or other',
				interested_in : ['male'],
				photo_url: String
			}

	4. Request headers:

			{
				Content-Type : "application/json",
				Accept : "application/json",
				X-ZUMO-AUTH : "auth_token"
			}

	5. Response: (Updated user)

			{
				id : String,
				social_id : String,
				name : String,
				contact: {
					email : String,
					phone : String
				},
				hair_color : String,
				gender : String,
				interested_in : [String],
				status : String,
				black_list : [String],
				photo_url: String
			}

- `DELETE /api/user` : deactivite a user

	1. Trigger:
		-	user clicks the deactivate account button.

	2. Request param:

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
				success : Boolean
			}

- `POST /api/checkin` : checkin to a venue

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
				        image : String
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
				success : Boolean
			}

	6. Additional Info:
		- user.social_id is filled up by the server, all the other info will be available in the client.
		- If the event object is present (social_venue is ignored), then the necessary info for the collection will be taken from the event object. However, the expiry can be no more than enum_expiries.event.
		- If the event object is null, social_venue object will be used for the necessary info for the collection, the missing info will be taken from the enums.
		- Trying to check into an event before its start time will generate an internal server error.
		- The time field of the collection will be current system time.
		- If one of event.social_venue.social_id and social_venue.social_id is not provided, then an internal server error will be generated.
		- received_flirts and received_hints will be empty arrays.

- `PATCH /api/checkin` : add to received_flirts and received_hints array

	1. Trigger:
		-	user sends a hint
		-	user sends a flirt

	2. Request param:

			{
				id: 'MongoDB ObjectId'
			}

	3. Request body:

			{
				flirt:{
					user:{
					  social_id : String
					}
				},
				hint:{
					user:{
					  social_id : String
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
				success : Boolean
			}

- `GET /api/checkin` : get a list of checkins for a venue

	1. Trigger:
		-	user comes to the "Who is Here?" landing page.
		-	refresh of the "Who is Here?" landing page.

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

			[{
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
		      time : Date,
		      expiry : Date,
		      received_flirts : [{
		          user:{
		              social_id : String
		          }
		      }],
		      received_hints : [{
		          user:{
		              social_id : String
		          }
		      }]
			}]

	5. Additional Info:
		-	if event_social_id is provided, search with it, otherwise search checkins with social_venue_id, if none provided a 500 error is generated.
		-	if limit parameter is not provided, then enum_defaults.checkin_search_results is used to determine how many checkins will be returned.
        -   if interested_in,hair_color,search are not provided then search all.
        -   TODO: optimize the search

- `GET /api/venue` : get a list of venues

	1. Trigger:
		-	user comes to the venue list page.
		-	user refresh the venue list page.
		-	user search for venues (either by name or category)
	2. Request param:

			{
				lat : 'user lat',
				lng : 'user lng',
				search : 'search string',
				limit : 'number of results, default enum_defaults.venue_search_results',
				radius : 'radius of the search'
			}

	3. Request headers:

			{
				Content-Type : "application/json",
				Accept : "application/json",
				X-ZUMO-AUTH : "auth_token"
			}

	4. Response:

			[{
				social_id : 'Facebook:fb_id',
				name : 'name of the place',
				address : 'address of the place',
				distance: 'calculated distance in miles',
				category: {
					flirt_options : {
						simple : 'simple flirt',
						forward : 'forward flirt',
						risky : 'risky flirt'
					}
					image : 'image link'
				}
			}]

	5. Additional Info:
		-	Get the venue list from facebook.
		- 	A typical facebook venue object is of the following format:

				{
					 "category": "Health/beauty",
					 "category_list": [
						{
						   "id": "139225689474222",
						   "name": "Spa, Beauty & Personal Care"
						}
					 ],
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
		-	The response array will be sorted by distance.

- `POST /api/flirt` : sends a flirt

	1. Trigger:
		-	user sends a flirt to another user

	2. Request param:

			{
			}

	3. Request body:

			{
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
				success : Boolean
			}

	6. Additional Info:
		- user_from.social_id will be filled out by the server (current login)
		- flirt_options.type is either simple, forward, or risky
		- status will be enum_flirt_statuses.sent
		- time will be current system time
		- expiry will br set according to enum_expiries.flirt
		- sends a push notification to the recipient.
		- patch the checkin collection to add to sent_flirts

- `PATCH /api/flirt` : user accepts or rejects a flirt

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
				success : Boolean
			}

	6. Additional Info:
		- user_from.social_id will be filled out by the server (current login)
		- status will be enum_hint_statuses.sent
		- time will be current system time
		- expiry will br set according to enum_expiries.hint
		- patch the checkin collection to add to sent_hint.
		- run the connection algorithm (check if there is an un-expired hint from the other persion in the same venue)
		- if a connection is created, sends a push notification to both, otherwise send it to the recipient.

- `GET /api/connection` : get a list of connections

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

- `PATCH /api/connection` : user sends a message(TODO: update expiry, and ask to keep connection alive)

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
				success : Boolean
			}

	6. Additional Info:
		- message.user.social_id will be filled up by the server
		- time will be current expiry time
