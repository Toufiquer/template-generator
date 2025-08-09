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
        "Users_1_000___": "Posts",
        "users_2_000___": "posts",
        "User_3_000___": "Post",
        "user_4_000___": "post",
        "ISelect_6_000___": "ISelect",
        "select_5_000___": "select"
        }
    }"""

2.

