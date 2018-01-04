// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function () {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // btnAddUser click
    $('#btnAddUser').on('click', addUser);

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function (data) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function () {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

function showUserInfo(event) {

    event.preventDefault();

    var thisUserName = $(this).attr('rel');

    var arrayPosition = userListData.map(function (arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    var thisUserObject = userListData[arrayPosition];

    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function (index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    if (errorCount === 0) {

        var user = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        };

        $.ajax({
            type: 'post',
            data: user,
            url: '/users/',
            dataType: 'JSON'
        }).done(function (response) {

            if (response.msg === '') {

                $('#addUser fieldset input').val('');

                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    } else {
        alert('Please fill all fields');
        return false;
    }
};

function deleteUser(event) {
    event.preventDefault();

    var confirm = confirm('Are you sure you want to delete this user?');

    if (confirm === true) {

        $.ajax({
            type: 'delete',
            url: '/users/' + $(this).attr('rel')
        }).done(function (response) {
            if (response.msg.length > 0) {
                alert('Error:' + response.msg);
            }
            populateTable();
        });
    } else {
        return false;
    }
};

