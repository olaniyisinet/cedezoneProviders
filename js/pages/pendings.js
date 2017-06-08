pending = {

    CONSTANTS: {
        route: '/provider/orders/pending',
        status: '/change/order/status',
        order_id: '',
        map_location: ''
    },

    init: function () {
        pending.getOrders(1)
        $('#pagination').on('click', '.pagination a', function (e) { //controls pagination link
            // alert('am clicked');
            e.preventDefault();
            pending.getOrders($(this).attr('href').split('page=')[1]);
        });

        $('#orders').on('change', '#next_stat', function (e) {
            e.preventDefault();
            if(this.value == ''){
                return false;
            }
            var orderid = $(this).attr('data-id');
            var statusid = this.value;
     pending.changeorderStatus(orderid, statusid);
        });

         $('#orders').on('click', '.map', function (e) { // raise modal for creating new state
            e.preventDefault();
            var location = $(this).attr('data-id');

          pending.CONSTANTS.map_location = location;
           // alert(orderid);
            pending.locateMap(location);

        });
    },

    getOrders: function (p) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + pending.CONSTANTS.route + '?page=' + p,
            data: {
                format: 'json',
                token: Cedezone.getToken(),
            },
            error: function () {
                Cedezone.hideLoadingGif();
                showDialog({
                    title: 'Oops!',
                    text: 'Error fetching Pending Orders',
                })
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                pending.populateTable(data);
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
                // alert(JSON.stringify(item.status.next_status))
                no++
                $tr = $('<tr>').append(
                    $('<td>').text(no),
                    $('<td>').text(item.order_ref_id),
                    $('<td>').text(item.customer.name),
                    $('<td>').text(item.service.category + ' ' + item.service.name + '(' + item.service.attribute + ')'),
                    $('<td>').text(item.location),
                    $('<td>').html(item.address + "<br><a class='map' data-id='" + item.location +', '+item.state+', '+item.country +"'>Locate Address on Map </a>"),
                    $('<td>').text(item.service_date + ', ' + item.service_time),
                    $('<td>').html(pending.processAttribute(item.order_attributes)),
                     $('<td>').html(item.status.current_status.name),
                    // $('<td>').html("<a class='btn btn-danger reject' data-id='" + item.id +"'><i class='fa fa-plus'></i> Cancel </a>")
                    $('<td>').html(pending.nextAction(item.id, item.status.next_status))
                    // $('<td>').html("<a class='map' data-id='" + item.location +', '+item.state+', '+item.country +"'>Locate Address on Map </a>")

                );
                $('#orders tbody').append($tr);
            });
          
            $('#pagination').html(data.pagination.link);
        } else {
            showDialog({
                    title: 'Oops!',
                    text: data.msg,
                })
        }
    },

    nextAction: function (id, data) {
        $html = "<select id='next_stat' data-id='" + id + "'><option value=''>Select</option>"
         $.each(data, function (index, value) {
                       $html +=("<option value=" + value.id + ">" + value.name + "</option>")
                      // $html =('<input type="checkbox" name="'+value.id+'" value="'+value.name+'"> ' + value.name)
                    });
        $html +="</select>"
        return $html;
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

    changeorderStatus: function (orderid, statusid) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + pending.CONSTANTS.status,

            data: {
                order_id: orderid,
                status: statusid
            },
            error: function (data) {
                Cedezone.hideLoadingGif();
                // showDialog({
                //     title: 'Oops!',
                //     text: 'Unable to update Status, Try again later.',
                // })
                alert('Unable to change order status, Try again later');
            },
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                if (data.status == true) {
                //     showDialog({
                //     title: 'Success',
                //     text: data.msg,
                // })
                alert(data.msg);
                    pending.getOrders(1);
                } else if (data.status == false) {
                //     showDialog({
                //     title: 'Error',
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
