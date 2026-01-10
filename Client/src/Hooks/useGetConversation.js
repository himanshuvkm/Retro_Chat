import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getUserFriendlyError } from "../utils/errorUtils";
const API_BASE = import.meta.env.VITE_API_URL;
const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const [usersRes, groupsRes] = await Promise.all([
          fetch(`${API_BASE}/api/users`, { credentials: "include" }),
          fetch(`${API_BASE}/api/message/group/list/all`, { credentials: "include" })
        ]);

        const usersData = await usersRes.json();
        const groupsData = await groupsRes.json();

        if (usersData.error || groupsData.error) {
          console.error("Error fetching conversations:", usersData.error || groupsData.error);
        } else {
          // Normalize Group Data to match User Data structure for UI
          const normalizedGroups = groupsData.data.map(group => ({
            ...group,
            fullName: group.groupName, // Map groupName to fullName
            profilePic: group.groupImage || "https://avatar.iran.liara.run/public/job/teacher", // Default group icon
            isGroup: true
          }));

          // Combine Groups and Users (Groups first)
          setConversations([...normalizedGroups, ...usersData.data]);
        }
      } catch (error) {
        toast.error(getUserFriendlyError(error));
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
