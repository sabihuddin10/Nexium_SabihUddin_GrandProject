import { useState } from "react";
import { createPortal } from "react-dom";
import { LoginSignMagic } from "../../lib/SupaBase/api/cars/loginSignMagic";
interface LoginFormProps {
  onClose: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { success, message } = await LoginSignMagic(email);
    alert(message);

    setLoading(false);
    if (success) onClose(); // Close modal only if email was accepted
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 text-2xl hover:text-gray-700"
          aria-label="Close login modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Sign in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}
