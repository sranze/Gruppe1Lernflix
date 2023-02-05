const list = [{
    id: 1, title: 'Business Lunch', start: '2023-01-03T13:00:00', end: '2023-01-03T14:00:00', isPrivate: false,

    description: 'businessHours',


    groupId: [1, 2], ownerId: 1,

}, {
    id: 2, title: 'Meeting', start: '2023-01-13T11:00:00', constraint: 'availableForMeeting', // defined below
    groupId: [1, 3], isPrivate: true, ownerId: 2,

}, // areas where "Meeting" must be dropped
    {
        id: 3,
        title: 'hello',
        groupId: 'availableForMeeting',
        start: '2023-01-11T10:00:00',
        end: '2023-01-11T16:00:00',
        display: 'background',
        isPrivate: true,
        userList: [3],
        maxEvents: 45,
    }, {
        id: 4,
        title: 'projekt 2',
        start: '2023-01-04T13:00:00',
        end: '2023-01-05T14:00:00',
        isPrivate: true,
        description: 'businessHours',
        groupId: [3, 1],
        ownerId: 3
    }, {
        id: 5,
        title: 'titel 1',
        start: '2023-01-07T13:00:00',
        end: '2023-01-07T14:00:00',
        isPrivate: true,
        description: 'businessHours',
        groupId: [1, 2],
        ownerId: 2
    }, {
        id: 6,
        title: 'titel 2',
        start: '2023-01-23T13:00:00',
        end: '2023-01-23T14:00:00',
        isPrivate: false,
        description: 'businessHours',
        groupId: [2, 3],
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
                    document.getElementById("private").addEventListener("click", function () {
                        if (this.checked) {
                            document.getElementById("attend").disabled = true;
                            document.getElementById('limit').checked = true;
                            document.getElementById('green').disable= true;
                        } else {
                            document.getElementById("attend").disabled = false;
                        }
                    });
                    //clear modal
                    document.getElementById('eventTitle').value = '';
                    document.getElementById('eventStart').value = '';
                    document.getElementById('eventEnd').value = '';


                    var save = document.getElementById('submitButton').onclick = function (event) {
                        calendar.addEvent({
                            start: document.getElementById('date').value + 'T' + document.getElementById('eventStart').value,
                            title: document.getElementById('title').value,
                            id: document.getElementById('Id').value, //id: document.getElementById('room').value,
                            groupId: document.getElementById('user').value,
                            description: document.getElementById('description').value,
                            end: document.getElementById('date').value + 'T' + document.getElementById('eventEnd').value,
                            maxEvents: document.getElementById('limit').value,
                            isPrivate: document.getElementById('private').checked,
                            color: document.getElementById('colors').checked
                        })



                        // add your code to add a new event here
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
            document.getElementById('close').onclick = function () {
                var cancel = document.getElementById('modal').style.display = 'none';
            }
            window.onclick = function (event) {
                if (event.target == titel) {
                    titel.style.display = "none";
                }
            }
            document.getElementById('vorlesung').innerHTML = 'Titel:'+ obj.title;
            document.getElementById('startzeit').innerHTML = 'Start:'+ obj.start;
            document.getElementById('endzeit').innerHTML = 'Ende:'+ obj.end;
            document.getElementById('id').innerText = 'OwnerId:'+obj.id;
            document.getElementById('Group').innerText=obj.groupId;
            var user= document.getElementById('user').innerText=obj.groupId;

            //var kind = document.getElementById('kind').innerText = 'Art des Meetings:' +obj.extendedProps.isPrivate;
            if(obj.extendedProps.isPrivate===true){
                document.getElementById('kind').innerText='Private';
                // document.getElementById('deleteButton').disabled='true';
                //document.getElementById('sign').disabled='true';

            } else{
                var kind= document.getElementById('kind').innerText='Public';
                // var visible=document.getElementById('deleteButton').disabled='false';
                //var sign=document.getElementById('sign').disabled='false';
                //console.log(kind,visible,sign);

            }

            var descriptor = document.getElementById('customValue').innerHTML = 'Beschreibung:'+ obj.extendedProps.description;
            console.log(descriptor);


            document.getElementById('deleteButton').onclick = function () {
                obj.remove();
                document.getElementById('modal').style.display = 'none';
            }
            document.getElementById('roomButton').addEventListener('click', function () {
                window.location.href = 'ownRoom.html';

            })
        },
        //Dummy Events
        events: function (info, successCallback) {
            var events = [];

            localStorage.setItem('id', 1);
            list.forEach(event => {
                // console.log(event.userList.filter(id =>id===Number(localStorage.getItem('id'))));
                if (!event.isPrivate || event.ownerId === Number(localStorage.getItem('id') || event.groupId.filter(id => id === Number(localStorage.getItem('id'))))) {
                    console.log(event.ownerId === Number(localStorage.getItem('id')));

                    document.getElementById('sign').onclick = function () {
                        var sign = document.getElementById('eventModal');
                        sign.style.display = 'block';
                        var group= document.getElementById('user').value;
                        var max= document.getElementById('limited').value;
                        if (group.length >= max) {
                            alert("Sorry we cannot log you in due to the maximum of users!");
                        }

                        document.getElementById(event.title);
                        document.getElementById(event.start);
                        document.getElementById(event.user);
                        document.getElementById(event.Room);
                        document.getElementById(event.end);
                    }
                    document.getElementById('close').onclick = function () {
                        var cancel = document.getElementById('modal').style.display = 'none';

                    }
                    document.getElementById('cancelButton').onclick = function () {
                        var close = document.getElementById('eventModal').style.display = "none";
                    }
                    events.push({
                        title: event.title,
                        start: event.start,
                        color: 'green',
                        groupId: event.groupId,
                        description: event.description,
                        ownerId: event.ownerId
                    })
                } else {
                    events.push({
                        title: event.title, start: event.start, color: 'red', groupId: event.groupId,

                    })

                    // document.getElementById('sign').disabled = "true";
                }
            });
            successCallback(events);
            console.log(events);
        },

    });

    calendar.render();
});