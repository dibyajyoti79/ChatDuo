import { IoSearchSharp } from "react-icons/io5";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import useSearchUser from "../../hooks/useSearchUser";
import UserCard from "./UserCard";

const Sidebar = () => {
  const { loading, searchUsers, users, setUsers } = useSearchUser();
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <button
        className="btn rounded-full justify-start items-center"
        onClick={() => {
          setUsers([]);
          document.getElementById("my_modal_2").showModal();
        }}
      >
        <IoSearchSharp className="w-6 h-6 outline-none" />
        Search...
      </button>
      <div className="divider px-3"></div>
      <Conversations />
      <LogoutButton />
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <div className="flex flex-col justify-center items-center gap-4">
            <SearchInput searchUsers={searchUsers} />
            {loading ? (
              <span className="loading loading-spinner mx-auto"></span>
            ) : null}
            {users.length > 0 ? (
              <form method="dialog">
                {users.map((item, idx) => {
                  return (
                    <button className="flex flex-col justify-center items-start gap-4 w-80">
                      <UserCard
                        key={item._id}
                        conversation={item}
                        lastIdx={idx === item.length - 1}
                      />
                    </button>
                  );
                })}
              </form>
            ) : (
              <></>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
export default Sidebar;
