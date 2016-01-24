module.exports = {
    api: {
        phoneParser: function(){}
    },
    sip: {
        register: function(transport) {
            transport = transport && typeof(transport) === 'string' ? transport : 'WSS';

            /*
                Refresh may happen while getting the provision info and the error may be returned
                We should logout in such case
             */
            function onRefreshError() {
                platform.off(platform.events.refreshError, onRefreshError);
                loginService.logout();
            }

            platform.on(platform.events.refreshError, onRefreshError);

            return f.api.post('/client-info/sip-provision', {
                sipInfo: [{
                    transport: transport
                }]
            }).then(function(data) {
                platform.off(platform.events.refreshError, onRefreshError);
                return data;
            });
        }
    }

}