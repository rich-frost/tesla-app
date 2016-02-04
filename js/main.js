/**
 * Created by Rich on 02-Feb-16.
 */

var baseUrls = [
        {
            'id': 'Local Tesla Simulator',
            'url': 'http://127.0.0.1:8000/'
        },
        {
            'id': 'Apiary',
            'url': 'https://private-anon-b69a89784-timdorr.apiary-mock.com/'
        }],
    currentBaseUrl = null,
    accessTokenUrl = 'oauth/token',
    baseApiUrl = 'api/1/vehicles',
    urlCommand = '/command/',
    access_token = null,
    token_type = null,
    vehicles,
    currentVehicle;

function getAccessToken() {
    var url = currentBaseUrl + accessTokenUrl;

    $.ajaxSetup({
        beforeSend: function (request)
        {
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
        }
    });

    $.post(url, {'email':'test@123.com', 'password':'1234'})
        .done(function( data ) {
            access_token = data.access_token;
            token_type = data.token_type;

            getVehicles();
        });

    return false;
}

function getVehicles() {
    $.ajaxSetup({
        beforeSend: function (request)
        {
            request.setRequestHeader('Authorization', 'Bearer {' + access_token + '}');
            request.setRequestHeader('Access-Control-Allow-Origin', '*');
        }
    });
    $.get(currentBaseUrl + baseApiUrl, function( data ) {
        vehicles = data.response;
        currentVehicle = data.response[0];

        createCarList();
    });
}

function setServerEnv() {
    var serverEnv = document.querySelector('#serverEnv');

    baseUrls.forEach(function(baseUrl) {
        var option = document.createElement('option');

        option.value = baseUrl.url;
        option.appendChild(document.createTextNode(baseUrl.id));

        serverEnv.appendChild(option);
    });

    currentBaseUrl = baseUrls[0].url;
}

function updateEnvironment(item) {
    currentBaseUrl = item.value;
    getVehicles();
}

function createCarList() {
    var yourCars = document.querySelector('#yourCars');

    // Remove any existing vehicles
    for (i = 0; i < yourCars.options.length; i++) {
      yourCars.options[i] = null;
    }

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
    return currentBaseUrl + baseApiUrl + '/' +
        currentVehicle.vehicle_id + urlCommand + command;
}

$( document ).ready(function() {
    setServerEnv();
    getAccessToken();
});
