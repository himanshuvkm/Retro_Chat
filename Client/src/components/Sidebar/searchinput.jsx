import { Search } from 'lucide-react';
import useConverstation from '../../zustand/useconversation';
import { useState } from 'react';
import useGetConversations from '../../Hooks/useGetConversation';
import { toast } from 'react-hot-toast';

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConverstation();
	const { conversations } = useGetConversations();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search.trim()) return;

		const conversation = conversations.find((conv) =>
			conv.fullName.toLowerCase().includes(search.toLowerCase())
		);

		if (conversation) {
			setSelectedConversation(conversation);
			setSearch("");
		} else {
			toast.error("Conversation not found");
		}
	};

	return (
		<div className='px-4 pt-4 pb-3'>
			<div className='relative'>
				<input
					type='text'
					placeholder='Find a friend...'
					className='w-full pl-10 pr-4 py-2 text-sm bg-white border-2 border-[var(--window-border)] text-[var(--text-main)] rounded-full focus:outline-none focus:border-[var(--accent-peach)] focus:ring-1 focus:ring-[var(--accent-peach)] transition-all placeholder-gray-400 font-sans shadow-inner'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSubmit(e);
						}
					}}
				/>
				<button
					type='button'
					onClick={handleSubmit}
					className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--accent-coral)] transition-colors'
				>
					<Search size={18} />
				</button>
			</div>
		</div>
	);
};
export default SearchInput;