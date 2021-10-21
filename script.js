$(document).ready(function() {
    // PROFILE EDITING //

    let u_name;
    let u_bday;
    let u_email;

    // Create default info
    let user_info = {
        username: "New User",
        birthday: "April 1, 1969",
        email: "newuser@example.com"
    };

    let user_info_string = JSON.stringify(user_info);
    localStorage.setItem("user_info_string", user_info_string);

    let user_info_json = JSON.parse(localStorage.getItem("user_info_string"));
    set_user_info(user_info_json.username, user_info_json.birthday, user_info_json.email);

    $("#save-button").click(function() {
        u_name = $("#new-name").val();
        u_bday = $("#new-birthday").val();
        u_email = $("#new-email").val();

        let new_user_info = {
            username: u_name,
            birthday: u_bday,
            email: u_email
        };
        let new_user_info_string = JSON.stringify(new_user_info);
        localStorage.setItem("new_user_info_string", new_user_info_string);
        window.location.replace("profile.html");
    });

    if ( localStorage.getItem("new_user_info_string") ) { // Have to store the object before you can retrieve it :D
        let new_user_info_json = JSON.parse(localStorage.getItem("new_user_info_string"));
        set_user_info(new_user_info_json.username, new_user_info_json.birthday, new_user_info_json.email);
    }

    // EVENT CREATION //

    let event_counter;
    if ( !(localStorage.getItem("event_counter")) ) {
        event_counter = 0;
        localStorage.setItem("event_counter", event_counter);
    }
    let e_name;
    let e_date;
    let e_time;
    let e_desc;
    let e_mode;

    let e_obj;
    let e_obj_string;
    let e_obj_json;

    //localStorage.clear();
    for (let i in localStorage) {
        console.log(localStorage[i]);
    }

    $("#finish-create-event").click(function() {
        e_name = $("#event-name").val();
        e_date = $("#event-date").val();
        e_time = $("#event-time").val();
        e_desc = $("#event-desc").val();
        e_mode = "showable";
        event_counter = localStorage.getItem("event_counter");

        e_obj = {
            eventid: "event-" + event_counter, // For tracking which events to render unshowable.
            name: e_name,
            date: e_date,
            time: e_time,
            desc: e_desc,
            mode: e_mode
        };
        e_obj_string = JSON.stringify(e_obj);
        localStorage.setItem("e_obj_string" + event_counter, e_obj_string); // Create event objects with unique names

        ++event_counter;
        //alert(localStorage.getItem("event_counter"));
        localStorage.setItem("event_counter", event_counter);
        window.location.replace("index.html");
    });

    let my_index = document.getElementById("index-main");
    event_counter = localStorage.getItem("event_counter");
    for (let i = 0; i < event_counter; ++i) {
        e_obj_json = JSON.parse(localStorage.getItem("e_obj_string" + i));

        if ( e_obj_json.mode === "showable" ) {
            let outer_div = document.createElement("div");
            outer_div.className = "event-banner-container";

            let event_header = document.createElement("h2");
            event_header.className = "event-banner-header";
            let event_header_text = document.createTextNode(e_obj_json.date + ", " + e_obj_json.time);
            event_header.appendChild(event_header_text);
            outer_div.appendChild(event_header);

            let event_par_name = document.createElement("p");
            event_par_name.className = "event-banner-name";
            let event_par_name_text = document.createTextNode(e_obj_json.name);
            event_par_name.appendChild(event_par_name_text);
            outer_div.appendChild(event_par_name);

            let event_par_desc = document.createElement("p");
            event_par_desc.className = "event-banner-desc";
            let event_par_desc_text = document.createTextNode(e_obj_json.desc);
            event_par_desc.appendChild(event_par_desc_text);
            outer_div.appendChild(event_par_desc);

            let event_remove_butt = document.createElement("p");
            event_remove_butt.id = "event-" + i;
            event_remove_butt.className = "event-remove";
            let event_remove_butt_text = document.createTextNode("Remove Event");
            event_remove_butt.appendChild(event_remove_butt_text);
            outer_div.appendChild(event_remove_butt);

            if ( my_index !== null ) { // Erroring when on a page my_index doesn't exist on
                my_index.appendChild(outer_div);
            }
        } /*else { // DEBUG -----------------------------------------------------------------
            let unavailable_p = document.createElement("p");
            let unavailable_p_text = document.createTextNode("Event has been deleted.");
            unavailable_p.appendChild(unavailable_p_text);
            unavailable_p.className = "unavailable-event-par";
            if ( my_index !== null ) {
                my_index.appendChild(unavailable_p);
            }
            let unavaliable_p_group = document.getElementsByClassName("unavailable-event-par");
            if ( unavaliable_p_group.length > 0 ) {
                for ( let i = 0; i < unavaliable_p_group.length; ++i ) {
                    unavaliable_p_group[i].style.textAlign = "center";
                }
            }
        }*/ // END DEBUG -----------------------------------------------------------------
    }

    if ( my_index !== null && my_index.lastChild.style !== undefined ) { // Same here
        my_index.lastChild.style.marginBottom = "20px";
    }

    // EVENT DELETION //

    let rl_counter = 0;

    $(".event-remove").click(function() { // jQuery is awesome.
        this.parentElement.style.position = "relative"; // Set position to allow animations to take place.
        if ( (rl_counter % 2) === 0) { // Move right on even numbers.
            $(this).parent().animate({"right":"-500px", "opacity":"0", "-moz-transition":"-moz-transform 2.0s, color 5.0s, font-size 1.0s"}, 500, function() { // Wait until animation is done, then call the callback function.
                this.remove(); // "this" now refers to the parent.
                if ( my_index !== null && my_index.lastChild.style !== undefined ) {
                    my_index.lastChild.style.marginBottom = "20px"; // For neatness :D
                }
                for ( let i = 0; i < event_counter; ++i ) {
                    e_obj_json = JSON.parse(localStorage.getItem("e_obj_string" + i));
                    if ( e_obj_json.eventid === this.getElementsByClassName("event-remove")[0].id ) {
                        localStorage.removeItem("e_obj_string" + i);
                        let unshowable_event = {mode: "unshowable"};
                        e_obj_string = JSON.stringify(unshowable_event);
                        localStorage.setItem("e_obj_string" + i, e_obj_string);
                    }
                }
            });
        } else { // Move left on odd numbers.
            $(this).parent().animate({"right":"500px", "opacity":"0"}, 500, function() {
                this.remove();
                if ( my_index !== null && my_index.lastChild.style !== undefined ) {
                    my_index.lastChild.style.marginBottom = "20px";
                }
                for ( let i = 0; i < event_counter; ++i ) {
                    e_obj_json = JSON.parse(localStorage.getItem("e_obj_string" + i));
                    if ( e_obj_json.eventid === this.getElementsByClassName("event-remove")[0].id ) {
                        localStorage.removeItem("e_obj_string" + i);
                        let unshowable_event = {mode: "unshowable"};
                        e_obj_string = JSON.stringify(unshowable_event);
                        localStorage.setItem("e_obj_string" + i, e_obj_string);
                    }
                }
            });
        }
        ++rl_counter; // Alternate moveoff directions.
    });
});

function set_user_info(username_input, birthday_input, email_input) {
    $("#profile-name").html(username_input);
    $("#profile-birthday").html(birthday_input);
    $("#profile-email").html(email_input);
}