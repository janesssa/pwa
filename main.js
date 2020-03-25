// Register Service Worker
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./serviceworker.js")
      .then(reg => console.log("Service Worker: Registerd"))
      .catch(err => console.log(`Service Worker: Error: ${err}`));
  }
  checkNetwork();
  loadMenuBar();
});

// Show tags or error
const loadMenuBar = async () => {
  const menubar = document.querySelector(".menubar");
  // Check if site is online or offline --- NetworkOnly
  if (navigator.onLine) {
    // Show tag buttons
    console.log("Site is online, fetching tags...");
    const { tags } = await (await fetch("https://cmgt.hr.nl:8000/api/projects/tags")).json();
    menubar.innerHTML = tags.map(tag => `<button>${tag}</button>`).join("");
    loadShowcaseFromAPI();
  } else {
    // Show offline error
    console.log("Site is offline, pleas check you're network");
    menubar.innerHTML = `<p class="alert">The site is offline, please check you're network!</p>`;
  }
};

// Fetch showcase items
const loadShowcaseFromAPI = async () => {
  console.log("Fetching data...");
  const {projects} = await (await fetch("https://cmgt.hr.nl:8000/api/projects/")).json();
  const main = document.querySelector("main");
  main.innerHTML = projects
    .map(
      project =>
        `<div>
            <h2>${project.title}</h2>
            <img src="https://cmgt.hr.nl:8000/${project.headerImage}">
            <p>${project.description}</p>
        </div>`
    )
    .join("\n");
};

// Check if networkstatus changes
const checkNetwork = () => {
  window.addEventListener('offline', function () {
    loadMenuBar()
  });
  window.addEventListener('online', function () {
    loadMenuBar()
  });
}



// TODO: OnClick on buttons to filter
