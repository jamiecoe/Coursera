module.exports = function (app) {
    // Declare MongoDB as datasource    
    var MongoDB = app.dataSources.MongoDB;
    // Automigrate allows you to perform certain automatic operations before the server is booted up
    // We will add in a few customer classes    
    MongoDB.automigrate('Customer', function (err) {
        if (err) throw (err);
        // Get reference to customer model
        var Customer = app.models.Customer;
        // Create two customers you want on startup
        Customer.create([
            {
                username: 'Admin'
                , email: 'admin@admin.com'
                , password: 'abcdef'
            }
            , {
                username: 'muppala'
                , email: 'muppala@ust.hk'
                , password: 'abcdef'
            }
  ], function (err, users) { // Callback function, 'users' is array of users you have created
            if (err) throw (err);
            // Get references to Role model and RoleMapping model
            var Role = app.models.Role;
            var RoleMapping = app.models.RoleMapping;
            //create the admin role
            Role.create({
                name: 'admin'
            }, function (err, role) {
                if (err) throw (err);
                // Assign admin role to the first user in the 'users' array
                // Suggested technique for assigning a static role
                role.principals.create({
                    principalType: RoleMapping.USER
                    , principalId: users[0].id
                }, function (err, principal) {
                    if (err) throw (err);
                });
            });
        });
    });
};