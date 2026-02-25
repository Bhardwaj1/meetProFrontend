import { useState } from "react";

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteUsersInput({
  emails,
  setEmails,
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const addEmail = (email) => {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) return;

    if (!emailRegex.test(trimmed)) {
      setError("Invalid email address");
      return;
    }

    if (emails.includes(trimmed)) {
      setError("Email already added");
      return;
    }

    setEmails([...emails, trimmed]);
    setInput("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail(input);
    }
  };

  const removeEmail = (email) => {
    setEmails(emails.filter((e) => e !== email));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-500">
        
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm"
          >
            {email}
            <button
              type="button"
              onClick={() => removeEmail(email)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        ))}

        <input
          type="text"
          placeholder="Add participant email"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 min-w-[150px]"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-2">
          {error}
        </p>
      )}
    </div>
  );
}