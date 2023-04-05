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
