export default class MockAppAuth{
    authorize = jest.fn(() => {
        return new Promise((resolve, reject) => {
            resolve({"accessToken": "d17236da1c6e02aa93ceee2a7103d5f78596d02f", "accessTokenExpirationDate": "2022-06-17T23:57:20Z", 
            "authorizeAdditionalParameters": {}, "idToken": null, "refreshToken": "f0addde72af00b6a9c6aeb1671ce4bb4104ac852", 
            "scopes": ["read,activity:read_all"], "tokenAdditionalParameters": 
            {"athlete": {"badge_type_id": 0, "bio": "null", "city": "null", "country": "null", "created_at": "2021-08-25T20:20:16Z", 
            "firstname": "Sergio", "follower": "null", "friend": "null", "id": 91213168, "lastname": "Pacheco", 
            "premium": false, "profile": "https://lh3.googleusercontent.com/a-/AOh14GjgMVZJC2mBeHilYmsODi24fUFF0OrLah0LfhxxZA=s96-c", 
            "profile_medium": "https://lh3.googleusercontent.com/a-/AOh14GjgMVZJC2mBeHilYmsODi24fUFF0OrLah0LfhxxZA=s96-c", 
            "resource_state": 2, "sex": "M", "state": "null", "summit": false, "updated_at": "2022-04-25T02:18:08Z", "username": "null", "weight": 0}, 
            "expires_at": "1655510240"}, "tokenType": "Bearer"})
            reject({'status': 404})
        })
    })
}