const list = [{
    id: 1, title: 'Business Lunch', start: '2023-02-03T13:00:00', end: '2023-02-03T14:00:00', isPrivate: false,

    description: 'businessHours',


    userList: [1, 2], ownerId: 1,

}, {
    id: 2, title: 'Meeting', start: '2023-02-13T11:00:00', constraint: 'availableForMeeting', // defined below
    groupId: [1, 3], isPrivate: true, ownerId: 2,

}, // areas where "Meeting" must be dropped
    {
        id: 3,
        title: 'hello',
        start: '2023-02-11T10:00:00',
        end: '2023-02-11T16:00:00',
        display: 'background',
        isPrivate: true,
        userList: [3],
        maxEvents: 45,
    }, {
        id: 4,
        title: 'projekt 2',
        start: '2023-02-04T13:00:00',
        end: '2023-02-05T14:00:00',
        isPrivate: true,
        description: 'businessHours',
        userList: [3, 1],
        ownerId: 3

    }]

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        customButtons: {
            myCustomButton: {
                text: 'New Meeting', click: function () {
                    var modal = document.getElementById('eventModal');
                    modal.style.display = "block";
                    document.getElementById('cancelButton').onclick = function () {
                        var close = document.getElementById('eventModal').style.display = "none";
                    }
                    window.onclick = function (event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }
                    document.getElementById("private").addEventListener("click", function (info) {
                        if (this.checked) {
                            document.getElementById("attend").disabled = true;
                            document.getElementById('limit').checked = true;
                        }
                    });
                    //speichern eines neuen Meetings
                    document.getElementById('submitButton').onclick = function (info) {

                        var color;
                        if (document.getElementById('private').checked === true && info.event.id === info.event.id) {
                            info.event.remove();
                            color = 'red';

                        } else if (document.getElementById('private').checked === false) {
                            color = 'green';
                        } else {
                            color = 'black';
                        }
                        calendar.addEvent({
                            id: document.getElementById('ID').value,
                            start: document.getElementById('date').value + 'T' + document.getElementById('eventStart').value,
                            title: document.getElementById('title').value,
                            ownerId: document.getElementById('OwnerId').value, //id: document.getElementById('room').value,
                            userList: document.getElementById('user').value,
                            description: document.getElementById('description').value,
                            end: document.getElementById('date').value + 'T' + document.getElementById('eventEnd').value,
                            maxEvents: document.getElementById('limited').value,
                            isPrivate: document.getElementById('private').checked,
                            color: color,
                            minEvents: document.getElementById('attend').checked,
                            unlimited: document.getElementById('unlimited').value
                        })
                    }
                }
            }

        }, headerToolbar: {
            left: 'prev, next today, myCustomButton',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',

        }, titleFormat: { // will produce something like "Tuesday, September 18, 2018"
            month: 'short', year: 'numeric', day: '2-digit', weekday: 'short'

        }, timeZone: 'local', initialDate: '2023-02-01', navLinks: true, // can click day/week names to navigate views
        businessHours: true, // display business ho// urs
        editable: true, selectable: true, locale: ['de', 'en', 'fr'],

        eventClick: function (calEvent) {

            var obj = calEvent.event;
            var titel = document.getElementById('modal');
            titel.style.display = 'block';

            //document.getElementById('id-form').innerHTML='ID:'+obj.id;


            var text = document.getElementById('vorlesung').innerHTML = obj.title;
            var start = document.getElementById('startzeit').innerHTML = 'Start:' + obj.start;
            var end = document.getElementById('endzeit').innerHTML = 'Ende:' + obj.end;
            var owner = document.getElementById('owner').innerText = 'OwnerId:' + obj.extendedProps.ownerId;
            var group = document.getElementById('Group').innerText = obj.extendedProps.userList;
            var user = document.getElementById('user').innerText = obj.groupId;

            //var kind = document.getElementById('kind').innerText = 'Art des Meetings:' +obj.extendedProps.isPrivate;
            if (obj.extendedProps.isPrivate === true) {
                document.getElementById('kind').innerText = 'Private';
                document.getElementById('sign').style.display = 'none';
                document.getElementById('deleteButton').style.display = 'none';
                //obj.event.color='red';

            } else {
                var kind = document.getElementById('kind').innerText = 'Public';
                document.getElementById('sign').style.display = 'block';
                document.getElementById('deleteButton').style.display = 'none';

            }
            var descriptor = document.getElementById('customValue').innerHTML = 'Beschreibung:' + obj.extendedProps.description;
            /* document.getElementById('roomButton').onclick(function () {
                 window.location.href = 'ownRoom.html';

             })*/

            document.getElementById('close').onclick = function () {
                var cancel = document.getElementById('modal').style.display = 'none';
            }
            window.onclick = function (event) {
                if (event.target == titel) {
                    titel.style.display = "none";
                }
            }
            document.getElementById('editButton').onclick = function () {
                // var text= document.getElementById('vorlesung').innerHTML =  obj.title;
                var newValue = document.getElementById('tt').value = text;
                var edit = document.getElementById('eventModal');
                edit.style.display = 'block';

                var newValue = document.getElementById('title').value = text;
                document.getElementById('eventStart').value = start;
                document.getElementById('eventEnd').value = end;

            }


            document.getElementById('sign').onclick = function () {
                var users = document.getElementById('Group').innerHTML.split(",");
                console.log(users.length)
                console.log(obj.extendedProps.maxEvents);
                console.log(obj.extendedProps.unlimited);

                if (Number(users.length) >= obj.extendedProps.maxEvents || Number(users.length) >= obj.extendedProps.unlimited) {
                    alert("Sorry we cannot log you in due to the maximum of users!");
                }else{
                    var userInput = prompt("Enter your Nickname:");
                    var isDuplicate = false;

                    users.forEach(function(user) {
                        if (userInput === user) {
                            isDuplicate = true;
                        }
                    });
                    if (isDuplicate){
                        alert('Nickname already in Use');
                    }else if(document.getElementById('Group').innerHTML===userInput){
                        alert('Nickname already in Use')
                    }
                    else {
                        document.getElementById('Group').innerHTML += "," + userInput;
                        obj.extendedProps.userList+= "," + userInput;
                    }
                }
            }

            localStorage.setItem('id', 'Leona');
            var containsUser = false;
            for (var i = 0; i < obj.extendedProps.userList.length; i++) {
                if (obj.extendedProps.userList[i] === String(localStorage.getItem('id'))) {
                    containsUser = true;
                }
            }
            if (obj.extendedProps.ownerId === String(localStorage.getItem('id'))) {
                document.getElementById('sign').style.display = 'none';
                document.getElementById('deleteButton').style.display = 'block';

            } else {
                document.getElementById('deleteButton').style.display = 'none';
            }
            document.getElementById('deleteButton').onclick = function () {
                obj.remove();
                document.getElementById('modal').style.display = 'none';
            }

        },

        //Dummy Events
        events: function (info, successCallback) {
            var events = [];

            list.forEach(event => {
                if (!event.isPrivate || event.ownerId === Number(localStorage.getItem('id') || event.groupId.filter(id => id === Number(localStorage.getItem('id'))))) {

                    document.getElementById(event.title);
                    document.getElementById(event.start);
                    document.getElementById(event.user);
                    document.getElementById(event.Room);
                    document.getElementById(event.end);

                    document.getElementById('close').onclick = function () {
                        var cancel = document.getElementById('modal').style.display = 'none';

                    }
                    document.getElementById('cancelButton').onclick = function () {
                        var close = document.getElementById('eventModal').style.display = "none";
                    }
                    events.push({
                        id: event.id,
                        title: event.title,
                        start: event.start,
                        description: event.description,
                        isPrivate: true,
                        ownerId: event.ownerId,
                        userList: [3],
                        maxEvents: 45,
                    })
                } else {
                    events.push({
                        title: event.title, start: event.start, color: 'red', groupId: event.groupId,

                    })

                    // document.getElementById('sign').disabled = "true";
                }
            });
            successCallback(events);
            // console.log(events);

        },

    });

    calendar.render();
});