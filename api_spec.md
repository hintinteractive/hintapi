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

- POST /login/facebook : 

	Trigger: the login button clicked, fire up facebook sdk, after successful login with basic permissions, receives the access_token from facebook and then call this endpoint.
	request param: { "access_token" : facebook_access_token}
	request headers: {"Content-Type": "application/json", "Accept": "application/json"}
	response: {"user":{"userId":"Facebook:fb_id"},"authenticationToken":auth_token}
	Details: auth_token is valid for 30 days, so cache it in the application. It is necessary to make any api calls. If it is invalid log off the user.