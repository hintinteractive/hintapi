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
