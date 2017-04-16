Home = {

    CONSTANTS: {
        route: '/get/provider/statistics',
      },

    init: function () {
        //  Cedezone.init();
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
        $('#counter1').text(data.data.fulfilled_orders);
        $('#counter2').text(data.data.orders_in_progress);
        $('#counter3').text(data.data.rejected_orders);
        $('#counter4').text(data.data.payment_received);
        $('#counter5').text(data.data.rating);
    },

}
