let signup = () => {
    let email = document.getElementById('Email')
    let password = document.getElementById('password')
    var Name1 = document.getElementById('name')

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((result) => {
            // Signed in 
            var user = result.user;
            firebase.database().ref('users/' + user.uid).set({
                email: user.email,
                uid: user.uid
            })
            alert('Account Created Successfully')
            console.log(result)
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // document.getElementById('error').innerHTML = errorMessage.toUpperCase()
            alert(errorMessage)
            // ..
        });

    var mail = email.value = ""
    var pass = password.value = ""
    Name1.value = ""
}

let login = () => {
    let email = document.getElementById('Email')
    let password = document.getElementById('password')
    
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then((result) => {
        // Signed in
        var user = ('user===>' + result.user);
        window.location = "chat.html"
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // document.getElementById('error').innerHTML = errorMessage.toUpperCase()
        alert(errorMessage)
    });
    getname()
    
    var mail = email.value = ""
    var pass = password.value = ""
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('Cemail').innerHTML = "Hello! " + user.email
        // User is signed in.
        console.log(user)
        // firebase.database().ref('users').on("value", (Data) => {
        //     Data.forEach((element) => {
        //         let value = element.val()
        //         if (value.uid != user.uid) {
        //             if (document.getElementById('root') != null) {
        //                 console.log('Current_user =>', user)
        //                 document.getElementById('root').innerHTML += `<li><b>Chat User:</b> ${value.email} </li>`
        //             }
        //         }
        //     })
        // })

    } else {
        // No user is signed in.
    }
});

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

// chatApp

function getname() {
    var Name = document.getElementById('name').value
    sessionStorage.setItem("name", Name)

    var Name1 = document.getElementById('name')
    Name1.value = ""
}

function sendMessage() {
    // get message
    var message = document.getElementById("message").value;
    const user = firebase.auth().currentUser;
    // save in database
    firebase.database().ref("users").child("messages").push().set({
        "sender": myName,
        "message": message,
        "uid" : user.uid
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
    if (snapshot.val().sender == myName) {
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
    console.log(data.val())
    
    if(user.uid == data.val().uid){
        firebase.database().ref("users/messages").child(data.key).remove();
    }})
    alert('Chat Deleted')
    location.reload();
    document.getElementById('messageli' + snapshot.key).innerHTML += "This message has been removed";
    messages.innerHTML = ""
}
