let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    // create object "pending"...set autoIncrement = true
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true});
};


request.onsuccess = function(event) {
    db = event.target.result;

    // check if app is online
    if(navigator.onLine){
        checkDatabase();
    }
}

// in the event an error occurs, throw an error
request.onerror = function(event) {
    console.log('Oops!' + event.target.errorCode);
}

