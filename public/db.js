let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    // create object "pending"...set autoIncrement = true
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true})
}