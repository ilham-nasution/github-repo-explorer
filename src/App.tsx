import { Octokit } from "octokit";
import { useState } from "react";

function App() {
  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
  });

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [repos, setRepos] = useState([]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await octokit.request("GET /search/users", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      q: query,
    });

    setUsers(result.data.items);
  };

  const getRepo = async (username) => {
    setRepos([]);

    const result = await octokit.request("GET /users/{username}/repos", {
      username: username,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    setRepos(result.data);
  };

  const repoList = repos.map((repo) => {
    return (
      <div key={repo.id} className="card bg-base-100 shadow-xl my-3">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="card-title">{repo.name}</h2>
              <p>{repo.description}</p>
            </div>
            <div className="flex items-center">
              <span>{repo.stargazers_count}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 ml-1"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const userList = users.map((user) => {
    return (
      <div
        className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-3"
        key={user.id}
        onClick={() => getRepo(user.login)}
      >
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">{user.login}</div>
        <div className="collapse-content">
          <div>{repoList}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="Enter username"
            className="input input-bordered w-full"
            value={query}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-block mt-5">Search</button>
      </form>

      <div className="mt-3">{userList}</div>
    </div>
  );
}

export default App;
