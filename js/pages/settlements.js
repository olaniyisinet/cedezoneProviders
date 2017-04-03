Settlements = {

    CONSTANTS: {
        get_all_trans: '/provider/payments',
    },

    init: function () {
        Settlements.getIndex();
    },

    getIndex: function () {
        $('#settlements').DataTable({
            "bDestroy": true,
            processing: true,
            serverSide: true,
            responsive: true,
            //            columns: [
            //        { name: 'first-name' },
            //        { name: 'last-name' },
            //        { name: 'position' },
            //        { name: 'location' },
            //        { name: 'salary' },
            //        { name: 'position' },
            //        { name: 'location' },
            //        { name: 'salary' }
            //    ],
            ajax: {
                url: Cedezone.CONSTANTS.BASE_URL + Settlements.CONSTANTS.get_all_trans,
                type: "GET",
                headers: {
                    "Authorization": "Bearer " + Cedezone.getToken()
                },
            },
        });
    },

}
