completed = {

    CONSTANTS: {
        route: '/provider/orders/completed',

        order_id: '',
    },

    init: function () {
        completed.getOrders(1)
        $('#pagination').on('click', '.pagination a', function (e) { //controls pagination link
            // alert('am clicked');
            e.preventDefault();
            completed.getOrders($(this).attr('href').split('page=')[1]);
        });
    },

    getOrders: function (p) {
        $.ajax({
            url: Cedezone.CONSTANTS.BASE_URL + completed.CONSTANTS.route + '?page=' + p,
            data: {
                format: 'json',
                token: Cedezone.getToken(),
            },
            error: function () {
                Cedezone.hideLoadingGif();
                 showDialog({
                title: 'Oops!',
                text: 'Error Fetching Coompleted Orders',
            })
            },
            dataType: 'json',
            success: function (data) {
                Cedezone.hideLoadingGif();
                completed.populateTable(data);
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
                    $('<td>').text(item.address),
                    $('<td>').text(item.service_date + ', ' + item.service_time),
                    $('<td>').html(completed.processAttribute(item.order_attributes)),
                    // $('<td>').html(item.status.name)

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
        if(data == null){
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
}