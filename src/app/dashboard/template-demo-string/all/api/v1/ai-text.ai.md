Could you help me to build a application named template generator.
This application will do the following things

1.  It will recive a josn file which looks like
    """{
    "uid": "000",
    "templateName": "Basic Template",
    "schema": {
    "name": "STRING&REQUIRED",
    "dataArr": ["STRING"],
    "email": "EMAIL",
    "passCode":"STRING&REQUIRED",
    "alias":"STRING&REQUIRED",
    "role": " STRING&ENUM=E1,E2,E3",
    "images": ["STRING"],
    "descriptions": "STRING"
    },
    "namingConvention":{
    "Users_1_000**_": "Posts",
    "users_2_000_**": "posts",
    "User_3_000**_": "Post",
    "user_4_000_**": "post",
    "ISelect_6_000**_": "ISelect",
    "select_5_000_**": "select"
    }
    }"""

2.
