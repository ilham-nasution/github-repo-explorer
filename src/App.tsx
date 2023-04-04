import { Octokit } from "octokit";
import { useState } from "react";
import UserInterface from "./types/UserInterface";
import RepoInterface from "./types/RepoInterface";

function App() {
  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
  });

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [repos, setRepos] = useState<RepoInterface[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setUsers([]);
    setQuery(e.currentTarget.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoadingUsers(true);
    setUsers([]);

    const result = await octokit.request("GET /search/users", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      q: query,
      per_page: 5,
    });

    setUsers(result.data.items);
    setLoadingUsers(false);
  };

  const getRepo = async (username: string) => {
    setLoadingRepos(true);
    setRepos([]);

    const result = await octokit.request("GET /users/{username}/repos", {
      username: username,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    setRepos(result.data);
    setLoadingRepos(false);
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
        tabIndex={0}
        className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-3"
        key={user.id}
        onClick={() => getRepo(user.login)}
      >
        <div className="collapse-title text-xl font-medium">{user.login}</div>
        <div className="collapse-content">
          <div>
            {loadingRepos ? (
              <div className="text-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              repoList
            )}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="container mx-auto p-4">
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
        <button className={`btn btn-block mt-5 ${loadingUsers && "loading"}`}>
          {loadingUsers ? "Loading" : "Search"}
        </button>
      </form>

      <div className="mt-3">
        <p className="text-slate-400">
          {userList.length > 0 && `Showing users for "${query}"`}
        </p>
        {userList}
      </div>
    </div>
  );
}

export default App;
