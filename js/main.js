/**
 * Created by Rich on 02-Feb-16.
 */

var baseUrl = 'https://private-anon-b69a89784-timdorr.apiary-mock.com/',
    accessTokenUrl = 'oauth/token',
    baseApiUrl = baseUrl + 'api/1/vehicles',
    urlCommand = '/command/',
    access_token = null,
    token_type = null,
    vehicles,
    currentVehicle;

function getAccessToken() {
    var url = $('#txtAccessTokenUrl').val() || baseUrl;
    url += accessTokenUrl;

    $.post(url)
        .done(function( data ) {
            access_token = data.access_token;
            token_type = data.token_type;

            getVehicles();
        });

    return false;
}

function getVehicles() {
    $.get(baseApiUrl, function( data ) {
        vehicles = data.response;
        currentVehicle = data.response[0];

        createCarList();
    });
}

function createCarList() {
    var yourCars = document.querySelector('#yourCars');

    vehicles.forEach(function(vehicle) {
        var option = document.createElement('option'),
            vehicle_id = vehicle.vehicle_id;

        option.value = vehicle_id;
        option.appendChild(document.createTextNode('Vehicle Id: ' + vehicle_id));

        yourCars.appendChild(option);
    });
}

function handleCommand(command) {
    var url = createCommandUrl(command);
    //Authorization: Bearer {access_token}
    $.ajaxSetup({
        beforeSend: function (request)
        {
            request.setRequestHeader('Authorization', 'Bearer ' + access_token);
        }
    });
    $.post(url)
        .done(function( data ) {
            var result = data.response.result;

            if (result) {
                $('#resultOutput').text('Success: ' + command + ' worked!');
            } else {
                $('#resultOutput').text('An error occurred: ' + data.response.reason);
            }
        }
    );
}

function createCommandUrl(command) {
    return baseApiUrl + '/' + currentVehicle.vehicle_id + urlCommand + command;
}

$( document ).ready(function() {
    getAccessToken();
});