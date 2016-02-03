/**
 * Created by Rich on 02-Feb-16.
 */

var baseUrl = 'https://owner-api.teslamotors.com/api/1/vehicles/';
var urlCommand = '/command/';
var vehicle_id = '123';

function handleCommand(command) {
    var url = createCommandUrl(command);
    $.post( url)
        .done(function( data ) {
            alert( "Data Loaded: " + data );
        }
    );
}

function createCommandUrl(command) {
    return baseUrl + vehicle_id + urlCommand + command;
}
