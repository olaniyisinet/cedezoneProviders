nearby = {

    CONSTANTS: {
        route: '/provider/orders/nearby',
        accept: '/accept/order',
        order_id: '',
        map_location: ''
    },

    init: function () {
        nearby.getOrders(1)
        $('#pagination').on('click', '.pagination a', function (e) { //controls pagination link
            // alert('am clicked');
            e.preventDefault();
            nearby.getOrders($(this).attr('href').split('page=')[1]);
        });

        $('#orders').on('click', '.accept', function (e) { // raise modal for creating new state
            e.preventDefault();
            var orderid = $(this).attr('data-id');
            nearby.CONSTANTS.order_id = orderid;
            // alert(orderid);
            nearby.acceptOrder(orderid);
        });
        $('#orders').on('click', '.map', function (e) { // raise modal for creating new state
            e.preventDefault();
            var location = $(this).attr('data-id');

            nearby.CONSTANTS.map_location = location;
            // alert(orderid);
            nearby.locateMap(location);
        });
    },

    getOrders: function (p) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + nearby.CONSTANTS.route + '?page=' + p,
            data: {
                format: 'json',
                token: Cedezone.getToken(),
            },
            error: function () {
                Cedezone.hideLoadingGif();
                showDialog({
                    title: 'Oops!',
                    text: 'Error fetching unassigned orders',
                })
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                nearby.populateTable(data);
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'GET'
        });
    },

    populateTable: function (data) {
        if (data.status == true) {
            var $tr = '';
            var responses = data.data;
            if ($.isEmptyObject(data.data)) {
                $('.order-container').empty();
                $('.order-container').append($('#empty-activity').html())
                return false;
            }
            $('#orders tbody').html(""); ///empty table for new records
            var no = (data.pagination.current_page - 1) * data.pagination.per_page;
            $.each(responses, function (i, item) {
                //  alert(JSON.stringify(item.nearest_providers))
                no++
                $tr = $('<tr>').append(
                    $('<td>').text(no),
                    $('<td>').text(item.order_ref_id),
                    $('<td>').text(item.customer.name),
                    $('<td>').text(item.service.category + ' ' + item.service.name + '(' + item.service.attribute + ')'),
                    // $('<td>').text(item.service.attribute),
                    // $('<td>').text(item.country),
                    //  $('<td>').text(item.state),
                    $('<td>').text(item.location),
                    $('<td>').html(item.address + "<br><a class='map' data-id='" + item.location + ', ' + item.state + ', ' + item.country + "'>Locate Address on Map </a>"),
                    $('<td>').text(item.service_date + ', ' + item.service_time),
                    $('<td>').html(nearby.processAttribute(item.order_attributes)),
                    // $('<td>').html(item.status.name),
                    $('<td>').html('<a class="label label-success accept" data-id="' + item.id + '"><i class="fa fa-plus"></i> Accept </a>')
                );
                $('#orders tbody').append($tr);
            });
            //console.log(data.pagination);
            // var paging = $.parseJSON(data.pagination);
            $('#pagination').html(data.pagination.link);
        } else {
            showDialog({
                title: 'Oops!',
                text: data.msg,
            })
        }
    },
    processAttribute: function (data) {
        if (data == null) {
            return 'None';
        }
        $html = '<ol>'
        $.each(data, function (key, value) {
            $html += "<li>" + value + "</li>"
        });
        $html += '</ol>';
        return $html;
    },

    raiseproviderModal: function (data) {
        //   alert(JSON.parse(data));
        var $providers = $("#providersModal #providers");
        $providers.empty();
        // $providers.append('<option value="">Select</option>');
        $.each(data, function (index, value) {
            //alert(value.id);
            $providers.append("<option value=" + value.id + ">" + value.account_name + "</option>");
        });

        $('#providersModal').modal();
    },

    acceptOrder: function (orderid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + nearby.CONSTANTS.accept,

            data: {
                order_id: orderid,
            },
            error: function (data) {
                Cedezone.hideLoadingGif();
                alert('Unable to Accept. Try again later');
                // showDialog({
                //     title: 'Oops!',
                //     text: 'Unable to Accept. Try again later',
                // })
            },
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                if (data.status == true) {
                    alert(data.msg);
                    // showDialog({
                    //     title: 'Success!',
                    //     text: data.msg,
                    // })
                    //   Provider.getNewProviders()//reload the page
                    nearby.getOrders(1);
                } else if (data.status == false) {
                    // showDialog({
                    //     title: 'Oops!',
                    //     text: data.msg,
                    // })
                    alert(data.msg);
                }
                //hide modal
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'POST'
        })
    },
    locateMap: function (map_location) {
        localStorage.setItem('map', map_location);
        window.location= 'testmap.html';
      },
}