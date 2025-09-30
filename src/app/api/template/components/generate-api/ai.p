act as a seniour webapp developer in NextJs with Typescript.

here is an example of I want to modify this code.

generate-model.ts
```

```


I want input the updated json file which look like 
```{
  "uid": "000",
  "templateName": "Basic Template",
  "schema": {
    "title": "STRING",
    "email": "EMAIL", 
    "password": "PASSWORD",
    "passcode": "PASSCODE",
    "area": "SELECT#Bangladesh,India,Pakistan,Canada",
    "sub-area": "DYNAMICSELECT",
    "products-images": "IMAGES",
    "personal-image": "IMAGE",
    "description": "DESCRIPTION",
    "age": "INTNUMBER",
    "amount": "FLOATNUMBER",
    "isActive": "BOOLEAN",
    "start-date": "DATE",
    "start-time": "TIME",
    "schedule-date": "DATERANGE",
    "schedule-time": "TIMERANGE",
    "favorite-color": "COLORPICKER",
    "number": "PHONE",
    "profile": "URL",
    "test": "RICHTEXT",
    "info": "AUTOCOMPLETE",
    "shift": "RADIOBUTTON#OP 1, OP 2, OP 3, OP 4",
    "policy": "CHECKBOX",
    "hobbys": "MULTICHECKBOX",
    "ideas": "MULTIOPTIONS"
  },
  "namingConvention": {
    "Users_1_000___": "Posts",
    "users_2_000___": "posts",
    "User_3_000___": "Post",
    "user_4_000___": "post",
    "ISelect_6_000___": "ISelect",
    "select_5_000___": "select"
  }
}
```

look at the the "SELECT" and "RADIOBUTTON" case,
SELECT#Bangladesh,India,Pakistan,Canada
RADIOBUTTON#OP 1, OP 2, OP 3, OP 4
-- for SELECT
 - there is two case I define in json 
    1. "SELECT" 
    2. "SELECT#Bangladesh,India,Pakistan,Canada"

    - first is without value, it generate with default option. 
    - second is with value, it generate with value like " Bangladesh, India, Pakistan, Canada"


-- for RADIOBUTTON
 - there is two case I define in json 
    1. "RADIOBUTTON" 
    2. "RADIOBUTTON#OP 1, OP 2, OP 3, OP 4"

    - first is without value, it generate with default option. 
    - second is with value, it generate with value like " OP 1, OP 2, OP 3, OP 4"

Now update the generate-model.ts file so that it can generate the latest code from the json file.