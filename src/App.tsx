import { Octokit } from "octokit";
import { useState } from "react";
import UserInterface from "./types/UserInterface";
import RepoInterface from "./types/RepoInterface";
import RepoCard from "./components/RepoCard";
import UserCard from "./components/UserCard";

function App() {
  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
  });

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [repos, setRepos] = useState<RepoInterface[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setUsers([]);
    setErrorMsg("");
    setQuery(e.currentTarget.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoadingUsers(true);
    setUsers([]);

    try {
      const result = await octokit.request("GET /search/users", {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
        q: query,
        per_page: 5,
      });

      setUsers(result.data.items);
      setLoadingUsers(false);
    } catch (err) {
      setErrorMsg("Please specify search criteria or enter a valid keyword");
      setLoadingUsers(false);
    }
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

  const repoList = repos.map((repo) => <RepoCard key={repo.id} repo={repo} />);

  const userList = users.map((user) => (
    <UserCard
      user={user}
      loadingRepos={loadingRepos}
      repoList={repoList}
      getRepo={getRepo}
      key={user.id}
    />
  ));

  return (
    <div className="container mx-auto p-4">
      {errorMsg && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}
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
