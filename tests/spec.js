describe('RingCentral.WebPhone', function() {

    var accounts = testCredentials.accounts;

    it('initiates and receives a call', function() {

        var timeout = 60000;
        var receiver = accounts[0];
        var caller = accounts[1];
        var callerPhone;

        this.timeout(timeout);

        return createWebPhone(caller, 'caller')
            .then(function(phone) {
                callerPhone = phone;
                return createWebPhone(receiver, 'receiver');
            })
            .then(function(receiverPhone) {

                //TODO Error handling

                return new Promise(function(resolve, reject) {

                    // Second phone should just accept the call
                    receiverPhone.webPhone.userAgent.on('invite', function(session) {
                        resolve(session.accept(getAcceptOptions()).then(function() {
                            setTimeout(function() {
                                session.bye();
                            }, 1000);
                        }));
                    });

                    // Call first phone
                    var session = callerPhone.webPhone.userAgent.invite(
                        receiver.username,
                        getAcceptOptions(caller.username, callerPhone.extension.regionalSettings.homeCountry.id)
                    );

                    setTimeout(function() {
                        session.bye();
                    }, timeout);

                });

            });

    });

});
