pending = {

    CONSTANTS: {
        route: '/provider/orders/pending',
        status: '/change/order/status',
        order_id: '',
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
                    text: 'Error fetching Unassigned Orders',
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
                    // $('<td>').text(item.service.attribute),
                    // $('<td>').text(item.country),
                    //  $('<td>').text(item.state),
                    $('<td>').text(item.location),
                    $('<td>').text(item.address),
                    $('<td>').text(item.service_date + ', ' + item.service_time),
                    $('<td>').html(pending.processAttribute(item.order_attributes)),
                    $('<td>').html(item.status.current_status.name),
                    // $('<td>').html("<a class='btn btn-danger reject' data-id='" + item.id +"'><i class='fa fa-plus'></i> Cancel </a>")
                    $('<td>').html(pending.nextAction(item.id, item.status.next_status))

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
                showDialog({
                    title: 'Oops!',
                    text: 'Unable to update Status, Try again later.',
                })
            },
            headers: {
                "Authorization": "Bearer " + Cedezone.getToken()
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                if (data.status == true) {
                    showDialog({
                    title: 'Success',
                    text: data.msg,
                })
                    pending.getOrders(1);
                } else if (data.status == false) {
                    showDialog({
                    title: 'Success',
                    text: data.msg,
                    })
                }
                //hide modal
            },
            beforeSend: function () {
                Cedezone.showLoadingGif();
            },
            type: 'POST'
        })
    },
}
