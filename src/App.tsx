function App() {
  return (
    <div className="container mx-auto flex justify-center items-center flex-col">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          placeholder="Enter username"
          className="input input-bordered w-full"
        />
      </div>
      <button className="btn btn-block mt-5">Search</button>
    </div>
  );
}

export default App;
