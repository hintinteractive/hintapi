#API Specification
This document specifies the backend REST API and backend designs for Hint. The frontend developers can refer to this.

## Enums

- enum_user_statuses :

		{
			admin : 'admin',
			active : 'active', 
			inactive : 'inactive', 
			banned : 'inactive', 
			debug : 'debug'
		}

- enum_user_genders :

		{
			male : 'male', 
			female : 'female', 
			other : 'other', 
			undefined : 'undefined'
		}

- enum_user_hair_colors :
	
		{
			light : 'light', 
			dark : 'dark'
		}
		
- enum_expiries :
	
		{
			current_look : 24, 
			event: 24, 
			connection: 24
		}
		
- enum_flags :
	
		{
			collect_venue_category : true
		}
		
- enum_defaults :
	
		{
			venue_categoty: {
				flirt_options : {
					simple:'', 
					forward:'', 
					risky:''
				}, 
				image:''
			}
		}


## API Endpoints

- POST /login/facebook : login the user to our system

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
	
	5. Additional Info: 
		-	auth_token is valid for 30 days, so cache it in the application. 
		-	auth_token is necessary to make any api calls. 
		-	If auth_token is invalid log off the user.
	
- GET /api/venue : get a list of venues 

	1. Trigger: 
		-	user comes to the venue list page.
		-	user refresh the venue list page.
		-	user search for venues (either by name or category)
	2. Request param: 
	
			{ 
				lat : 'user lat',
				lng : 'user lng',
				name : 'name search string',
				cat : 'cat search string',
				limit : 'number of results, default 25',
				radius : 'radius of the search'
			}
			
	3. Request headers: 
	
			{
				Content-Type : "application/json", 
				Accept : "application/json",
				X-ZUMO-AUTH : "auth_token"
			}
			
				
	4. Response: 
	
			{
				id : 'Facebook:fb_id', 
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
			}
	
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
		
		-	After receving the venue list, query our database to get the category info.
		-	If the category is not found, return the enum_defaults.venue_categoty
		-	If the category is not found and enum_flags.collect_venue_category is true, then update the venue_categories collection with enum_defaults.venue_categoty for this category and return it.  
		-	Contruct the response object from these info.
		-	The response array will be sorted by distance.