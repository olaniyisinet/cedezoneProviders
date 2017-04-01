Home = {

    CONSTANTS: {
        route: '/provider/statistics',
      },

    init: function () {
        Cedezone.init();
        Cedezone.checkToken();
        Home.getStatus();
    },

      getStatus: function () {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + Home.CONSTANTS.route,
            data: {
                token: Cedezone.getToken()
            },
            error: function () {
                Cedezone.hideLoadingGif();
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                Home.setDashboardData(data);
            },
            type: 'GET',
            beforeSend: function () {
               Cedezone.showLoadingGif();
            },
        });
    },

    setDashboardData: function(data){
        $('.row').find('#counter1').text(data.data.total_users);
        $('.row').find('#counter2').text(data.data.total_providers);
        $('.row').find('#counter3').text(data.data.pending_orders);
        $('.row').find('#counter4').text(data.data.confirmed_orders);
    },

}
