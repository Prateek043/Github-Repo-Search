
const profilePicture = document.getElementById("profile")
const name = document.getElementById("Profilename")
const desc = document.getElementById("Profiledesc")
const locationId = document.getElementById("location-id")
const Githuburl = document.getElementById("url")
const twiterurl = document.getElementById("twiter")
const Reponame = document.getElementById("Reponame")
const Repo_detail = document.getElementById("Repodetail")

let url = "https://api.github.com/users/johnpapa";
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    //console.log(data);
    profilePicture.src = data.avatar_url;
    name.innerText = data.name;
    desc.innerText = data.bio;
    locationId.innerHTML = `<i class="fas fa-map-marker-alt"></i>${data.location}`;
    Githuburl.innerHTML = data.url;
    twiterurl.innerHTML =  `Twitter: ${data.twitter_username}`;
}

fetchData(url)

const apiUrl = `https://api.github.com/users/johnpapa/repos?sort=created&per_page=100`;
const repositoriesContainer = document.getElementById('repositories');
const paginationContainer = document.getElementById('pagination');
const reposPerPage = 10;
let currentPage = 1;

fetch(apiUrl)
    .then(response => response.json())
    .then(repositories => {
        renderRepositories(repositories);
        renderPagination(repositories);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    const searchInput = document.getElementById("githubUsername");

    function searchRepositories() {
      const username = searchInput.value.trim();
    
      if (username === "") {
        alert("Please enter a valid GitHub username.");
        return;
      }
    
      const userUrl = `https://api.github.com/users/${username}`;
      const reposUrl = `https://api.github.com/users/${username}/repos?sort=created&per_page=100`;
    
      fetchData(userUrl);
      fetch(reposUrl)
        .then(response => response.json())
        .then(repositories => {
            renderRepositories(repositories);
            renderPagination(repositories);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    
function renderRepositories(repositories) {
    repositoriesContainer.innerHTML = '';
    const startIndex = (currentPage - 1) * reposPerPage;
    const endIndex = startIndex + reposPerPage;
    const slicedRepos = repositories.slice(startIndex, endIndex);

    slicedRepos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        const heading = document.createElement('h2');
        heading.textContent = repo.name;

        const description = document.createElement('p');
        description.textContent = repo.description || 'No description available.';

        const htmlUrl = document.createElement('p');
        htmlUrl.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.html_url}</a>`;

        const Topic = document.createElement('p');
        Topic.textContent = repo.topic;

        repoCard.appendChild(heading);
        repoCard.appendChild(description);
        repoCard.appendChild(htmlUrl);

        repositoriesContainer.appendChild(repoCard);
    });
}

function renderPagination(repositories) {
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(repositories.length / reposPerPage);

    // Previous Button
    const prevButton = document.createElement('a');
    prevButton.classList.add('page-link');
    prevButton.innerHTML = '<i class="fa fa-angle-double-left"></i>';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderRepositories(repositories);
        }
    });

    paginationContainer.appendChild(prevButton);

    // Page Links
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.classList.add('page-link');
        pageLink.textContent = i;
        pageLink.addEventListener('click', () => {
            currentPage = i;
            renderRepositories(repositories);
        });

        paginationContainer.appendChild(pageLink);
    }

    // Next Button
    const nextButton = document.createElement('a');
    nextButton.classList.add('page-link');
    nextButton.innerHTML = '<i class="fa fa-angle-double-right"></i>';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderRepositories(repositories);
        }
    });

    paginationContainer.appendChild(nextButton);
}