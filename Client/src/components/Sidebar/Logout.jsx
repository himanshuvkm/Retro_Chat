import React from "react";
import { BiLogOut } from "react-icons/bi";
import { User } from "lucide-react";
import useLogout from "../../Hooks/uselogout";
import { Link } from "react-router-dom";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className='mt-auto p-4 border-t-2 border-[var(--window-border)] flex justify-between items-center bg-[var(--window-bg)]'>
      <Link to="/profile" className="text-[var(--text-main)] hover:text-[var(--accent-coral)] transition-colors p-2 hover:bg-white rounded-full">
        <User size={24} />
      </Link>
      {!loading ? (
        <BiLogOut
          className='w-6 h-6 text-[var(--text-main)] hover:text-red-500 cursor-pointer transition-colors'
          onClick={logout}
        />
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </div>
  );
};
export default LogoutButton;
