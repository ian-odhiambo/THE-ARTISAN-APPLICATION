import SearchInput from "./SearchInput";
import LogoutButton from "./LogoutButton"
import Conversations from "./Conversations";

const Sidebar = () => {
  return (
    <div className="border-r border-slate-500 p-4 flex flex-col">
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversations />
      <LogoutButton/>
    </div>
  );
};

export default Sidebar;

//This is the starter code as a referrence point when i come back to study
// import SearchInput from "./SearchInput";
// import LogoutButton from "./LogoutButton"
// import Conversations from "./Conversations";

// const Sidebar = () => {
//   return (
//     <div className="border-r border-slate-500 p-4 flex flex-col">
//       <SearchInput />
//       <div className="divider px-3"></div>
//       <Conversations />
//       <LogoutButton/>
//     </div>
//   );
// };

// export default Sidebar;