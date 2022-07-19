pupList = [];
filter = false;

function addPups(pus) {
    let dogBar = document.querySelector("#dog-bar");
    pupList.forEach(pup => {
        let span = document.createElement("span");
        span.id = `pup-${pup.id}`;
        span.textContent = pup.name;
        span.addEventListener('click', event => populateDogInfo(event.target.id.substr(4)));
        dogBar.appendChild(span);
    });
}

function toggleDogState(clickEvent) {
    const id = clickEvent.target.id.substr(11);
    const pupIndex = pupList.findIndex(dog => dog.id == id);
    // patch request
    fetch(`http://localhost:3000/pups/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({isGoodDog: !pupList[pupIndex].isGoodDog})
    }).then(res => {
        // change pupList
        pupList[pupIndex].isGoodDog = !pupList[pupIndex].isGoodDog;
        // change button
        clickEvent.target.textContent = pupList[pupIndex].isGoodDog ? "Bad Dog!" : "Good Dog!";
    });
}

function populateDogInfo(pupId) {
    const pup = pupList.find(dog => dog.id == pupId);
    const dogInfo = document.querySelector("#dog-info");
    dogInfo.innerHTML = `<img src=${pup.image}>
    <h2>${pup.name}</h2>`;

    let goodDogBtn = document.createElement("button");
    goodDogBtn.id = `toggle-pup-${pupId}`;
    goodDogBtn.textContent = pup.isGoodDog ? "Bad Dog!" : "Good Dog!";
    goodDogBtn.addEventListener("click", toggleDogState);
    dogInfo.appendChild(goodDogBtn);
}

function toggleFilter(clickEvent) {
    filter = !filter;
    clickEvent.target.textContent = "Filter good dogs: " + (filter ? "ON" : "OFF");
    document.querySelector("#dog-bar").querySelectorAll("span").forEach(function (dogSpan) {
        if (filter) {
            const pupId = dogSpan.id.substring(4);
            const pup = pupList.find(dog => dog.id == pupId);
            dogSpan.style.display = pup.isGoodDog ? "flex" : "none";
        } else {
            dogSpan.style.display = "flex";
        }
    });
}

fetch("http://localhost:3000/pups").then(response => response.json()).then(pups => {
    pupList = pups;
    addPups();

    document.querySelector("#good-dog-filter").addEventListener("click", toggleFilter);
});