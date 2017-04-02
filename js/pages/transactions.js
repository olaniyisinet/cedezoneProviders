Transactions = {

    CONSTANTS: {
        get_all_trans: '/provider/paid/services'
    },

    init: function () {
        Transactions.getIndex();
    },

    getIndex: function () {
        $('#transactions').DataTable({
            "bDestroy": true,
            processing: true,
            serverSide: true,
            responsive: true,
            ajax: {
                url: Cedezone.CONSTANTS.BASE_URL + Transactions.CONSTANTS.get_all_trans,
                type: "GET",
                headers: {
                    "Authorization": "Bearer " + Cedezone.getToken()
                },
            },
        });
    },
}
