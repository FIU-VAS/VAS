db.createUser(
    {
        user: "amera009",
        pwd: "senproj123",  // or cleartext password
        roles: [
            { role: "readWrite", db: "vas" }
        ]
    }
);