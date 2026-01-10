import Conversations from "./all-conversations";
import LogoutButton from "./Logout";
import SearchInput from "./searchinput";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
	const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

	return (
		<div className='border-r-2 border-[var(--window-border)] flex flex-col bg-[var(--window-bg)] w-80 relative'>
			<SearchInput />
			<div className="px-4 pb-2 flex justify-between items-center">
				<span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">My Contacts</span>
				<button
					onClick={() => setIsGroupModalOpen(true)}
					className="text-[var(--text-dim)] hover:text-[var(--accent-coral)] transition-colors transform hover:scale-110"
					title="Create Group"
				>
					<PlusCircle size={20} />
				</button>
			</div>
			<div className='h-0.5 bg-[var(--window-border)] mx-4 opacity-30'></div>
			<Conversations />
			<LogoutButton />

			{isGroupModalOpen && <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} />}
		</div>
	);
};

export default Sidebar;