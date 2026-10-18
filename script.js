    const searchInput = document.querySelector("#search");
    const suggestionsList = document.querySelector("#suggestions");
    const repositoriesList = document.querySelector("#repositories");

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      if (!query) {
        suggestionsList.innerHTML = "";
        return;
      }
      debounceSearch(query);
    });
    async function searchRepositories(query) {
        if (query !== searchInput.value.trim()) {
            return;
        }
        try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`,
      );
      if (!response.ok) {
        console.error("Ошибка поиска", response.status);
        return;
      }
      const data = await response.json();
        if (query !== searchInput.value.trim()) {
            return;
        }
      suggestionsList.innerHTML = "";
      for (const repository of data.items) {
        const suggestion = document.createElement("li");
        suggestion.textContent = repository.name;
        suggestion.addEventListener("click", () => {
          addRepository(repository);
        });
        suggestionsList.append(suggestion);
      }
    }catch(error){
        console.error(error);
    }
    }
    function addRepository(repository) {
        const repositoryItem = document.createElement("li");
        repositoryItem.classList.add("repository-item");
        repositoryItem.textContent = `
        Название: ${repository.name},
        Владелец: ${repository.owner.login},
        Звезды: ${repository.stargazers_count}`;
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.textContent = "×";
        removeButton.addEventListener ("click", () => {
            repositoryItem.remove();
        });
        repositoryItem.append(removeButton);
        repositoriesList.append(repositoryItem);
        searchInput.value = "";
        suggestionsList.innerHTML = "";
    }
    function debounce(fn, delay) {
      let timerId = null;

      return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          fn.apply(this, args);
        }, delay);
      };
    }
    const debounceSearch = debounce(searchRepositories, 400);