import { useState } from "react";

const RedisCrud: React.FC = () => {
  const [action, setAction] = useState<
    "create" | "read" | "update" | "delete" | null
  >(null);
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [response, setResponse] = useState<any>(null);

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value as "create" | "read" | "update" | "delete");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!key || ((action === "create" || action === "update") && !value)) {
      alert("lost key");
      return;
    }
    let res;
    if (action === "read") {
      res = await fetch(`/api/redis-crud?action=${action}&queryName=${key}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      res = await fetch(`/api/redis-crud?action=${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value }),
      });
    }
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div>
      <h1>Redis CRUD Operations</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="action">Action:</label>
          <select
            id="action"
            onChange={handleActionChange}
            value={action ?? ""}
          >
            <option value="" disabled>
              Select action
            </option>
            <option value="create">Create</option>
            <option value="read">Read</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
        <div>
          <label htmlFor="key">Key:</label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        {(action === "create" || action === "update") && (
          <div>
            <label htmlFor="value">Value:</label>
            <input
              type="text"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RedisCrud;
