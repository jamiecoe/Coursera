module.exports = function (app) {
    // Declare MongoDB as datasource 
    var MongoDB = app.dataSources.MongoDB;
    // automigrate is something which is supported in loopback
    // it allows you to perform certain automatic operations before server is booted up
    // We'll use it to add automatically add some new customers when server starts
    MongoDB.automigrate('Customer', function (err) {
        if (err) throw (err);
        // Get reference to customer model
        var Customer = app.models.Customer;
        // 1st parameter is an array of customers you want to create
        // 2nd is a callback function, 'users' is the array of new customers you have created
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
        ], function (err, users) {
                if (err) throw (err);
                // Access Role & RoleMapping models
                var Role = app.models.Role;
                var RoleMapping = app.models.RoleMapping;
                // 1st parameter creates the admin role
                // 2nd parameter is callback to assign it to first customer you have created
                // 'role' is the new role you have just created
                Role.create({
                    name: 'admin'
                }, function (err, role) {
                    if (err) throw (err);
                    // make admin
                    // Create mapping between this new role and the first of the new users you have added (ie: users[0])
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