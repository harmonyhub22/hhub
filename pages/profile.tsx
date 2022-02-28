import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Profile = () => {
  const Router = useRouter();
  return (
    <div>
      <Navbar />
      <h1>Profile Settings</h1>
    </div>
  );
};

export default Profile;
