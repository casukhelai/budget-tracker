// let db;
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

function saveRecord(record){
    // creates the transaction on PENDING db and has readwrite access
    const transaction = db.transaction(['pending'], 'readwrite');

    // access pending object store
    const store = transaction.objectStore('pending');

    // add record to the store
    store.add(record);

}

function checkDatabase() {
    // open transaction of pending db
    const transaction = db.transaction(['pending'], 'readwrite');

    // access pending object store
    const store = transaction.objectStore('pending');

    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                header: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                // success? open transaction on the PENDING db
                const transaction = db.transaction(['pending'], 'readwrite');

                // access pending object store
                const store = transaction.objectStore('pending');

                // clear items in store
                store.clear();
            })
        }
    };
}

// listen for when app comes online
window.addEventListener("online", checkDatabase);