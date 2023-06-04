let signup = () => {
    let email = document.getElementById('Email').value
    let password = document.getElementById('password').value
    let name = document.getElementById('name').value

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in 
            var user = result.user;
            alert('Account Created Successfully')
            // console.log(user)
            // ...
            localStorage.setItem('userDisplayName', name);

            firebase.database().ref('users/' + user.uid).set({
                email: user.email,
                uid: user.uid,
                name: name
            })
            window.location = "Index.html"
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // document.getElementById('error').innerHTML = errorMessage.toUpperCase()
            alert(errorMessage)
            // ..
        });

    document.getElementById('Email').value = "";
    document.getElementById('password').value = "";
    document.getElementById('name').value = "";
}

let IAccount = () => {
    window.location = "Signup.html"
}

let login = () => {
    let email = document.getElementById('Email1').value
    let password = document.getElementById('password1').value

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in
            var user = result.user;
            // console.log('user===>', user)
            // ...
            window.location = "Chat.html"
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // document.getElementById('error').innerHTML = errorMessage.toUpperCase()
            alert(errorMessage)
        });

    document.getElementById('Email1').value = "";
    document.getElementById('password1').value = "";
}
// chatApp

let gethead = () => {
    document.getElementById('Cemail').innerHTML = "Hello " + displayName.toUpperCase()
}
function sendMessage() {
    // get message
    var message = document.getElementById("message").value;
    const user = firebase.auth().currentUser;
    // save in database
    firebase.database().ref("users").child("messages").push().set({
        "sender": displayName,
        "message": message,
        "uid": user.uid
    });

    var message1 = document.getElementById("message");
    message1.value = ""

    // prevent form from submitting
    return false;
}
// listen for incoming messages
firebase.database().ref("users/messages").on("child_added", function (snapshot) {

    var li = document.createElement('li')

    li.setAttribute('id', 'messageli' + snapshot.key)
    if (snapshot.val().sender == displayName) {
        var delbtn = document.createElement('button')
        var delbtntext = document.createTextNode('Delete')
        delbtn.appendChild(delbtntext)
        delbtn.setAttribute('id', snapshot.key)
        delbtn.setAttribute('class', 'libtn')
        delbtn.setAttribute("onclick", "deleteMessage(this)")
        li.appendChild(delbtn)
    }
    var litext = document.createTextNode(" " + snapshot.val().sender + ": " + snapshot.val().message)
    li.appendChild(litext)
    var messages = document.getElementById("messages")
    messages.appendChild(li)

});

function deleteMessage(self) {
    // get message ID
    var messageId = self.getAttribute("id");

    // delete message
    firebase.database().ref("users/messages").child(messageId).remove();
}

// attach listener for delete message
firebase.database().ref("users/messages").on("child_removed", function (snapshot) {
    // remove message node
    document.getElementById('messageli' + snapshot.key).innerHTML = "This message has been removed";
});

function deleteall() {
    const user = firebase.auth().currentUser;
    // console.log(user.uid)
    firebase.database().ref('users/messages').on("child_added", function (data) {
        // console.log(data.val())

        if (user.uid == data.val().uid) {
            firebase.database().ref("users/messages").child(data.key).remove();
        }
    })
    alert('Chat Deleted')
    location.reload();
    document.getElementById('messageli' + snapshot.key).innerHTML += "This message has been removed";
    messages.innerHTML = ""
}

let removeuser = () => {
    firebase.database().ref('users').remove()
    const user = firebase.auth().currentUser;

    user.delete().then(() => {
        // User deleted.
        alert("User is Deleted")
        window.location = "index.html"
    })
        .catch((error) => {
            // An error ocurred
            // ...
        });
}

let signout = () => {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        window.location = "index.html"
    }).catch((error) => {
        // An error happened.
    });
}